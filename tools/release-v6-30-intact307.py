#!/usr/bin/env python3
"""DyclokPRO v6.30: package EXACT official DICloak 3.0.7 without changing ASAR or PE.
The optional external launcher is added by CI after extraction, not injected into
app.asar. The original app's integrity and signed HTTP headers remain untouched.
"""
import argparse, hashlib, shutil, struct, subprocess
from pathlib import Path

INSTALLER_SHA="01b412f603b1aeb0a9f479476d4dca2f1fe653c7d35b344a6fb59b45d1cc93ae"
ASAR_SHA="b8ca8e2f36753149b23a6d339042bcf91c650e242d84c0d3af98e8141c0d1dcf"
SIGNATURE=bytes.fromhex("377abcaf271c")
REQUIRED=(
    "DICloak.exe","resources/app.asar"
)

def sha(path):
    h=hashlib.sha256()
    with path.open("rb") as f:
        for piece in iter(lambda:f.read(8*1024*1024),b""):
            h.update(piece)
    return h.hexdigest()

def extract(exe,dest):
    if not exe.is_file() or sha(exe)!=INSTALLER_SHA:
        raise RuntimeError("BLOCKED: original official 3.0.7 EXE hash does not match")
    data=exe.read_bytes()
    if data.count(SIGNATURE)!=1:
        raise RuntimeError("BLOCKED: official installer structure unexpected")
    start=data.index(SIGNATURE)
    offset,length=struct.unpack_from("<QQ",data,start+12)
    end=start+32+offset+length
    if end>len(data) or end-start<170000000:
        raise RuntimeError("BLOCKED: official NSIS archive boundaries invalid")
    temp=exe.parent/"official-307-preserved.7z"
    if dest.exists():raise RuntimeError("Destination exists; refusing to overwrite")
    dest.mkdir(parents=True)
    temp.write_bytes(data[start:end])
    del data
    try:
        subprocess.run(["7z","x","-y","-bb0","-o"+str(dest),str(temp)],check=True)
    finally:
        temp.unlink(missing_ok=True)
    for rel in REQUIRED:
        if not (dest/rel).is_file():
            raise RuntimeError("BLOCKED: official file missing: "+rel)
    if sha(dest/"resources/app.asar")!=ASAR_SHA:
        raise RuntimeError("BLOCKED: official original app.asar was changed")
    for rel in ("SourceData","Chromium/User Data","Chromium/Application/SetupMetrics"):
        shutil.rmtree(dest/rel,ignore_errors=True)
    for rel in ("SourceData","Chromium/User Data"):
        if (dest/rel).exists():raise RuntimeError("BLOCKED: private user data was bundled")
    print("ORIGINAL_DICLOAK_307_EXE_SHA256="+sha(dest/"DICloak.exe"))
    print("OFFICIAL_UNMODIFIED_ASAR_SHA256="+sha(dest/"resources/app.asar"))
    print("AUTH_API_PROFILE_SIGNED_HEADERS=OFFICIAL_UNMODIFIED")
    print("WINDOWS_USERDATA_BUNDLED=FALSE")
    print("EXTERNAL_LAUNCHER=NOT_YET_ADDED")
    return dest

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--installer",type=Path,required=True)
    parser.add_argument("--destination",type=Path,required=True)
    opts=parser.parse_args()
    extract(opts.installer,opts.destination)
if __name__=="__main__":main()
