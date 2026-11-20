#!/usr/bin/env python3
"""Inspection-only of upstream DICloak 3.0.9. Never publishes vendor binaries."""
import argparse
import hashlib
import json
import shutil
import struct
import subprocess
from pathlib import Path

MAGIC = bytes.fromhex("377abcaf271c")
EXPECTED_VERSION = "3.0.9"


def sha256(file):
    digest = hashlib.sha256()
    with file.open("rb") as stream:
        for chunk in iter(lambda: stream.read(8 * 1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def original_package(asar):
    with asar.open("rb") as stream:
        prefix = stream.read(16)
        if len(prefix) != 16:
            raise RuntimeError("Bad ASAR header")
        _, header_size, _, header_json_size = struct.unpack("<4I", prefix)
        if not 0 < header_json_size < 16_000_000 or header_size < header_json_size:
            raise RuntimeError("Bad ASAR index")
        root = json.loads(stream.read(header_json_size))
        entry = root.get("files", {}).get("package.json")
        if not entry or "offset" not in entry or "size" not in entry:
            raise RuntimeError("Original ASAR package.json missing")
        offset = int(entry["offset"])
        size = int(entry["size"])
        if offset < 0 or not 0 < size < 250_000:
            raise RuntimeError("Invalid ASAR package size")
        stream.seek(8 + header_size + offset)
        raw = stream.read(size)
        if len(raw) != size:
            raise RuntimeError("ASAR package truncated")
        return json.loads(raw)


def extract(installer, destination):
    if destination.exists():
        raise RuntimeError("Refuse to overwrite an existing destination")
    if installer.name != "DICloak_3.0.9_win_x64.exe":
        raise RuntimeError("Unexpected installer file name")
    with installer.open("rb") as stream:
        data = stream.read()
    if len(data) < 160_000_000:
        raise RuntimeError("Installer unexpectedly small")
    if data.count(MAGIC) != 1:
        raise RuntimeError("Unrecognized NSIS structure")
    start = data.index(MAGIC)
    archive_offset, archive_size = struct.unpack_from("<QQ", data, start + 12)
    end = start + 32 + archive_offset + archive_size
    if end > len(data) or end-start < 140_000_000:
        raise RuntimeError("NSIS archive bounds invalid")
    temp = installer.parent / "dicloak-309-inspection-payload.7z"
    if temp.exists():
        raise RuntimeError("Temporary extraction path exists")
    destination.mkdir(parents=True)
    try:
        temp.write_bytes(data[start:end])
        del data
        subprocess.run(
            ["7z", "x", "-y", "-bb0", "-o" + str(destination), str(temp)],
            check=True, stdout=subprocess.DEVNULL,
        )
    finally:
        temp.unlink(missing_ok=True)
    exe = destination / "DICloak.exe"
    asar = destination / "resources" / "app.asar"
    if not exe.is_file() or not asar.is_file():
        raise RuntimeError("Extracted official runtime incomplete")
    if (destination / "DyclokPRO.exe").exists():
        raise RuntimeError("Unexpected third-party launcher")
    package = original_package(asar)
    version = package.get("version")
    if version != EXPECTED_VERSION:
        raise RuntimeError("Unexpected internal version: " + repr(version))
    report = {
        "purpose": "Official runtime inspection only; not a modified diloakPRO build",
        "upstreamInstaller": installer.name,
        "versionInOriginalAsar": version,
        "patchVersionInOriginalAsar": package.get("patchVersion"),
        "installerSHA256": sha256(installer),
        "originalExeSHA256": sha256(exe),
        "originalAsarSHA256": sha256(asar),
        "originalExeBytes": exe.stat().st_size,
        "originalAsarBytes": asar.stat().st_size,
        "loginValidated": False,
        "chromiumProfileLaunchValidated": False,
        "r4Integrated": False,
        "redistribution": False,
    }
    return report


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--installer", type=Path, required=True)
    parser.add_argument("--destination", type=Path, required=True)
    parser.add_argument("--report", type=Path, required=True)
    args = parser.parse_args()
    result = extract(args.installer, args.destination)
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf8")
    print("OFFICIAL_DICLOAK_309_ASAR_VERSION=PASS")
    print("OFFICIAL_DICLOAK_309_INSTALLER_SHA256=" + result["installerSHA256"])
    print("OFFICIAL_DICLOAK_309_ASAR_SHA256=" + result["originalAsarSHA256"])
    print("R4_INTEGRATION=NOT_DONE")
