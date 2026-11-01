#!/usr/bin/env python3
"""Extract the embedded NSIS/7z archive of a verified GitHub release.
For read-only forensic comparison; never launches bundled executables.
"""
from pathlib import Path
import struct, subprocess, sys
source=Path(sys.argv[1]); destination=Path(sys.argv[2])
if not source.is_file():raise RuntimeError("Missing release installer")
if destination.exists():raise RuntimeError("Refusing to overwrite extraction destination")
data=source.read_bytes()
sig=bytes.fromhex("377abcaf271c")
if data.count(sig)!=1:raise RuntimeError("Unexpected installer signature")
start=data.index(sig)
off,length=struct.unpack_from("<QQ",data,start+12)
end=start+32+off+length
if end>len(data) or end-start<170000000:
    raise RuntimeError("Invalid embedded archive boundaries")
archive=source.parent/"dyclokpro-628-inspection.7z"
archive.write_bytes(data[start:end])
del data
try:
    destination.mkdir(parents=True)
    subprocess.run(["7z","x","-y","-bb0","-bso0","-bse1",f"-o{destination}",str(archive)],check=True)
finally:archive.unlink(missing_ok=True)
for file in ("DICloak.exe","resources/app.asar"):
    if not (destination/file).is_file():
        raise RuntimeError("Missing release payload "+file)
print("UNPACKED_RELEASE_V628=PASS")
