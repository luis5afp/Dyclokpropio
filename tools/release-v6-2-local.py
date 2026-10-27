#!/usr/bin/env python3
"""Assemble Dyclokpro v6.2 from the exact released v6.1 installer.
Never reads/migrates or modifies any existing remote profile data."""
import argparse
import hashlib
from pathlib import Path
import shutil
import struct
import subprocess

EXPECTED_SOURCE_SHA256 = "77c6a450666093fa3abb0ca78dc743eec78f4d98b7c150e73a55c36e74e66f17"
SEVENZIP_MAGIC = bytes.fromhex("377abcaf271c")

def sha256_file(path):
    h = hashlib.sha256()
    with path.open("rb") as source:
        while data := source.read(8 * 1024 * 1024):
            h.update(data)
    return h.hexdigest()

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--installer", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--helper", type=Path, required=True)
    a = parser.parse_args()
    if sha256_file(a.installer) != EXPECTED_SOURCE_SHA256:
        raise RuntimeError("v6.1 source installer integrity mismatch")
    raw = a.installer.read_bytes()
    if raw.count(SEVENZIP_MAGIC) != 1:
        raise RuntimeError("Missing or ambiguous v6.1 NSIS embedded 7z archive")
    start = raw.index(SEVENZIP_MAGIC)
    off,size = struct.unpack_from("<QQ", raw, start + 12)
    length = 32 + off + size
    if length < 180_000_000 or start + length > len(raw):
        raise RuntimeError("Invalid NSIS 7z archive boundaries")
    archive = a.installer.parent / "dyclokpro-v6.1-verified.7z"
    archive.write_bytes(raw[start : start+length])
    del raw
    a.output.mkdir(parents=True, exist_ok=False)
    try:
        subprocess.run(["7z","x","-y","-bb0","-o"+str(a.output),str(archive)],check=True)
    finally:
        archive.unlink(missing_ok=True)
    for private in ("SourceData","Chromium/User Data","Chromium/Application/SetupMetrics"):
        shutil.rmtree(a.output / private, ignore_errors=True)
    required = [
        "DICloak.exe",
        "resources/app.asar",
        "resources/app.asar.unpacked/dist/index.html",
        "Chromium/Application/ginsbrowser.exe",
        "Chromium/Application/142.0.7444.273/chrome.dll",
        "Dyclokpro.ico"
    ]
    for rel in required:
        if not (a.output / rel).is_file():
            raise RuntimeError("Incomplete original v6.1 application: " + rel)
    if a.helper.stat().st_size < 20000 or a.helper.read_bytes()[:2] != b"MZ":
        raise RuntimeError("Local profile Windows manager is not a proper EXE")
    target = a.output / "Dyclokpro_Perfiles_Locales.exe"
    shutil.copy2(a.helper,target)
    if sha256_file(a.helper) != sha256_file(target):
        raise RuntimeError("Local manager binary copy failed integrity check")
    for private in ("SourceData","Chromium/User Data"):
        if (a.output / private).exists():
            raise RuntimeError("Private data in release candidate")
    print("DYCLOKPRO_V6_2_BASE_VERIFIED=true")
    print("CLOUD_PROFILE_STORAGE_UNCHANGED=true")
    print("LOCAL_PROFILE_MANAGER_INSTALLED=true")
    print("LOCAL_PROFILE_MANAGER_SHA256="+sha256_file(target))
    print("OFFLINE_CHROMIUM_RUNTIME_VALIDATION=pending")

if __name__=="__main__":
    main()
