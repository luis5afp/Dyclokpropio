#!/usr/bin/env python3
"""Offline checks for a side-by-side installer with DICloak.exe as the sole launcher."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NATIVE = ROOT / "release-build" / "native-only-307"
CONFIG = json.loads((NATIVE / "electron-builder.json").read_text(encoding="utf-8"))
PKG = json.loads((NATIVE / "package.json").read_text(encoding="utf-8"))
NSIS = (NATIVE / "installer.nsh").read_text(encoding="utf-8")
EXTRACTOR = (ROOT / "tools" / "prepare-dicloak-native-307.py").read_text(encoding="utf-8")
WORKFLOW = (ROOT / ".github" / "workflows" / "build-dicloak-native-only-307.yml").read_text(encoding="utf-8")

assert CONFIG["win"]["executableName"] == "DICloak"
assert CONFIG["win"]["signAndEditExecutable"] is False
assert CONFIG["appId"] not in ("com.dyclokpro.desktop", "com.dyclokpropio.desktop")
assert CONFIG["nsis"]["runAfterFinish"] is False
assert "DICloak.exe" in NSIS and "DyclokPRO.exe" not in NSIS
assert "DICloak-Nativo-Lab" in NSIS
assert "DyclokPRO.exe" in EXTRACTOR
assert "original official app.asar hash differs" in EXTRACTOR
assert "SourceData" in EXTRACTOR and "Chromium/User Data" in EXTRACTOR
assert "gh release create" not in WORKFLOW
assert "actions/upload-artifact" in WORKFLOW
assert "DyclokPRO.exe" in WORKFLOW
assert "Get-FileHash" in WORKFLOW
assert PKG["name"] == "dicloak-native-307-standalone"
print("PASS: one launchable DICloak.exe, original runtime verified and isolated installer")
