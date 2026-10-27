#!/usr/bin/env python3
"""Produce a verified, patched Windows app payload from the published v5.8 installer."""
import argparse
import hashlib
from pathlib import Path
import shutil
import struct
import subprocess
import sys

SOURCE_EXE_SHA = "61e53a27a492834abe9377b75714293bdb4b9a39c603bba924cf9b5ac171e265"
ORIGINAL_JS = "a42760e5862babed253ac6cc652b087f61973bc9023ee548d381112d563a4d75"
PATCHED_JS = "d9095f040f99cd8104d624a7385716cc84a4b77bc4b475139c6d3e8765da3a3e"
ORIGINAL_ASAR = "b44f85af91210ed348327932b919bf06ed9d7ae39d303fffe73a633c1477e379"
PATCHED_ASAR = "0e2b3cb2375b20e40ddc4a56d36841c1be64024f6dfa1e7e553fbd411de49c5d"
JS_PATH = "resources/app.asar.unpacked/dist/assets/index-BFRPcHQY.js"
ASAR_PATH = "resources/app.asar"
SIGNATURE = bytes.fromhex("377abcaf271c")

def hash_bytes(data):
    return hashlib.sha256(data).hexdigest()

def hash_file(path):
    h = hashlib.sha256()
    with path.open("rb") as stream:
        while chunk := stream.read(8 * 1024 * 1024):
            h.update(chunk)
    return h.hexdigest()

def require_hash(path, expected):
    if not path.is_file() or hash_file(path) != expected:
        raise RuntimeError("SHA256 mismatch: " + str(path))

def patch(root):
    js = root / JS_PATH
    asar = root / ASAR_PATH
    require_hash(js, ORIGINAL_JS)
    require_hash(asar, ORIGINAL_ASAR)
    original = js.read_bytes()
    if len(original) != 106678:
        raise RuntimeError("Unexpected JavaScript length")
    fixed = bytearray(original)

    def disable(label, prefix, terminator, offset, length, expected_sha):
        if original.count(prefix) != 1:
            raise RuntimeError("Non-unique update anchor: " + label)
        begin = original.index(prefix) + len(prefix)
        end = original.index(terminator, begin)
        if (begin, end - begin, hash_bytes(original[begin:end])) != (offset, length, expected_sha):
            raise RuntimeError("Unexpected update function: " + label)
        fixed[begin:end] = b"return;" + b" " * (end - begin - 7)

    disable(
        "update-check", b"const Ce=async e=>{", b"},Ie=async()=>",
        67924, 1486, "46b1a45fb05269f70581d6e86fbb8b069ec95163f3dd42a5be04942c5328ef67"
    )
    disable(
        "download-trigger", b"Re=()=>{", b"},Ve=()=>",
        70283, 314, "a48c38745f9817a57e7837428fd5c9af787e879cabc7497fc5b83e6734392e48"
    )
    scheduler = (
        b',Ce().then(()=>{vt()}),X.value&&clearInterval(X.value),'
        b'X.value=setInterval(()=>Ce().then(()=>{vt()}),6e5),'
        b'p.on("check-install-pack",mt),p.on("start-download",ft)'
    )
    if original.count(scheduler) != 1 or original.index(scheduler) != 73331:
        raise RuntimeError("Unexpected update scheduler")
    if len(scheduler) != 161 or hash_bytes(scheduler) != "103a0d8e3beb00fa1bd6cc3f51f4cfb584a7e28b7c70e2ca9cd1c76b6edc2308":
        raise RuntimeError("Update scheduler checksum mismatch")
    at = original.index(scheduler)
    fixed[at:at+len(scheduler)] = b" " * len(scheduler)
    if hash_bytes(bytes(fixed)) != PATCHED_JS or len(fixed) != len(original):
        raise RuntimeError("Patched JS does not match reviewed version")

    old = ORIGINAL_JS.encode("ascii")
    new = PATCHED_JS.encode("ascii")
    with asar.open("r+b") as stream:
        for at in (100147, 100244):
            stream.seek(at)
            if stream.read(64) != old:
                raise RuntimeError("ASAR integrity header mismatch")
            stream.seek(at)
            stream.write(new)
    require_hash(asar, PATCHED_ASAR)
    js.write_bytes(fixed)
    require_hash(js, PATCHED_JS)
    with js.open("rb") as module_source:
        subprocess.run(["node", "--check", "--input-type=module"], stdin=module_source, check=True)
    print("UPDATE_CHECK_AND_DOWNLOAD_DISABLED=true")
    print("JS_SHA256=" + PATCHED_JS)
    print("ASAR_SHA256=" + PATCHED_ASAR)

def extract(installer, destination):
    require_hash(installer, SOURCE_EXE_SHA)
    data = installer.read_bytes()
    if data.count(SIGNATURE) != 1:
        raise RuntimeError("Embedded 7z signature ambiguous")
    index = data.index(SIGNATURE)
    header = data[index:index+32]
    if len(header) != 32:
        raise RuntimeError("Invalid embedded 7z header")
    offset, size = struct.unpack_from("<QQ", header, 12)
    length = 32 + offset + size
    if length != 302021879:
        raise RuntimeError("Unexpected embedded 7z package size")
    archive = installer.parent / "dyclok-v5.8-original-verified.7z"
    archive.write_bytes(data[index:index+length])
    del data
    destination.mkdir(parents=True, exist_ok=False)
    try:
        subprocess.run(["7z", "x", "-y", "-bb0", "-o" + str(destination), str(archive)], check=True)
    finally:
        archive.unlink(missing_ok=True)

    # Never redistribute embedded browser profiles / cache from the old installer.
    for rel in ("SourceData", "Chromium/User Data", "Chromium/Application/SetupMetrics"):
        shutil.rmtree(destination / rel, ignore_errors=True)
    for rel in (
        "DICloak.exe", "resources/app.asar",
        "resources/app.asar.unpacked/dist/assets/index-BFRPcHQY.js",
        "Chromium/Application/ginsbrowser.exe",
        "Chromium/Application/142.0.7444.273/chrome.dll"
    ):
        if not (destination / rel).is_file():
            raise RuntimeError("Missing application component: " + rel)
    if (destination / "SourceData").exists() or (destination / "Chromium/User Data").exists():
        raise RuntimeError("Private browser profile data still in payload")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--installer", required=True, type=Path)
    parser.add_argument("--out", required=True, type=Path)
    args = parser.parse_args()
    extract(args.installer, args.out)
    patch(args.out)
    print("V5_9_PAYLOAD_STATIC_VALIDATION=PASS")
    print("PROFILE_OPENING_ON_REAL_WINDOWS_PC=NOT_VALIDATED")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print("RELEASE_BLOCKED: " + str(e), file=sys.stderr)
        sys.exit(1)
