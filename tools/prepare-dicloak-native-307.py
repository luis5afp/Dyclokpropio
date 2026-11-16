#!/usr/bin/env python3
"""Unpack the exact official DICloak 3.0.7, excluding private data and DyclokPRO."""
import argparse
import hashlib
import shutil
import struct
import subprocess
from pathlib import Path

INSTALLER_SHA = "01b412f603b1aeb0a9f479476d4dca2f1fe653c7d35b344a6fb59b45d1cc93ae"
ASAR_SHA = "b8ca8e2f36753149b23a6d339042bcf91c650e242d84c0d3af98e8141c0d1dcf"
SIGNATURE = bytes.fromhex("377abcaf271c")

def sha(path):
    h = hashlib.sha256()
    with path.open("rb") as f:
        for piece in iter(lambda: f.read(8 * 1024 * 1024), b""):
            h.update(piece)
    return h.hexdigest()

def verify(folder):
    exe = folder / "DICloak.exe"
    asar = folder / "resources" / "app.asar"
    if not exe.is_file() or not asar.is_file():
        raise RuntimeError("BLOCKED: original executable or ASAR is missing")
    if sha(asar) != ASAR_SHA:
        raise RuntimeError("BLOCKED: original official app.asar hash differs")
    if (folder / "DyclokPRO.exe").exists():
        raise RuntimeError("BLOCKED: external launcher must not be present")
    for path in ("SourceData", "Chromium/User Data"):
        if (folder / path).exists():
            raise RuntimeError("BLOCKED: private browser data must not be packaged")
    return sha(exe)

def extract(installer, dest):
    if not installer.is_file() or sha(installer) != INSTALLER_SHA:
        raise RuntimeError("BLOCKED: official installer hash differs")
    if dest.exists():
        raise RuntimeError("BLOCKED: destination exists")
    data = installer.read_bytes()
    if data.count(SIGNATURE) != 1:
        raise RuntimeError("BLOCKED: original installer structure is unexpected")
    start = data.index(SIGNATURE)
    offset, length = struct.unpack_from("<QQ", data, start + 12)
    end = start + 32 + offset + length
    if end > len(data) or end - start < 170_000_000:
        raise RuntimeError("BLOCKED: NSIS archive bounds invalid")
    temp = installer.parent / "dicloak-native-payload.7z"
    if temp.exists():
        raise RuntimeError("BLOCKED: extraction temporary file exists")
    dest.mkdir(parents=True)
    try:
        temp.write_bytes(data[start:end])
        del data
        subprocess.run(["7z", "x", "-y", "-bb0", "-o" + str(dest), str(temp)], check=True)
    finally:
        temp.unlink(missing_ok=True)
    for rel in ("SourceData", "Chromium/User Data", "Chromium/Application/SetupMetrics"):
        shutil.rmtree(dest / rel, ignore_errors=True)
    return verify(dest)

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--installer", type=Path, required=True)
    p.add_argument("--destination", type=Path, required=True)
    args = p.parse_args()
    print("ORIGINAL_DICLOAK_EXE_SHA256=" + extract(args.installer, args.destination))
    print("LAUNCHER_DYCLOKPRO=ABSENT")
    print("OFFICIAL_RUNTIME_MODIFICATIONS=NONE")
