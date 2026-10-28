#!/usr/bin/env python3
"""Dyclokpro v6.3 — patch the published, checksum-verified Windows 6.2 payload.

Adds a separate read-only DOM inspector to the main Electron page. Preserves
all original Chromium/profile files and program-update policy.
"""
import argparse
import hashlib
import json
import shutil
import struct
import subprocess
from pathlib import Path

SOURCE_EXE_SHA = "03c815d003cd12b0028f01d02d6fa4fb38bcd9a59cb6ca4d6a435482584154cc"
MAGIC = bytes.fromhex("377abcaf271c")
REQUIRED = [
    "DICloak.exe",
    "Dyclokpro_Perfiles_Locales.exe",
    "Chromium/Application/ginsbrowser.exe",
    "Chromium/Application/142.0.7444.273/chrome.dll",
    "resources/app.asar",
    "resources/app.asar.unpacked/dist/index.html",
    "resources/app.asar.unpacked/dist/assets/index-C7Bw2kjt.js",
    "resources/app.asar.unpacked/dist/assets/index-BFRPcHQY.js",
]

def digest(data):
    return hashlib.sha256(data).hexdigest()

def filehash(path):
    h=hashlib.sha256()
    with path.open("rb") as f:
        while part:=f.read(8*1024*1024): h.update(part)
    return h.hexdigest()

def extract(exe, destination):
    if filehash(exe)!=SOURCE_EXE_SHA:
        raise RuntimeError("Published v6.2 installer SHA256 mismatch")
    payload=exe.read_bytes()
    if payload.count(MAGIC)!=1:
        raise RuntimeError("Embedded NSIS 7z signature ambiguous")
    pos=payload.index(MAGIC)
    offset,length=struct.unpack_from("<QQ",payload,pos+12)
    size=32+offset+length
    if size<180000000 or pos+size>len(payload):
        raise RuntimeError("Invalid NSIS 7z boundaries")
    archive=exe.parent/"dyclokpro_6_2_source_verified.7z"
    archive.write_bytes(payload[pos:pos+size])
    del payload
    destination.mkdir(parents=True,exist_ok=False)
    try:
        subprocess.run(["7z","x","-y","-bb0","-o"+str(destination),str(archive)],check=True)
    finally:
        archive.unlink(missing_ok=True)
    for private in ("SourceData","Chromium/User Data","Chromium/Application/SetupMetrics"):
        shutil.rmtree(destination/private,ignore_errors=True)
    for item in REQUIRED:
        if not (destination/item).is_file():
            raise RuntimeError("Missing original v6.2 application component: "+item)
    for private in ("SourceData","Chromium/User Data"):
        if (destination/private).exists():
            raise RuntimeError("Bundled private profile data detected")

def integrity(data):
    step=4194304
    return {"algorithm":"SHA256","hash":digest(data),"blockSize":step,
            "blocks":[digest(data[i:i+step]) for i in range(0,len(data),step)]}

def metadata(header, path):
    obj=header
    for part in path.split("/"):
        obj=obj["files"][part]
    return obj

def read_header(file):
    with file.open("rb") as f:
        a,b,c,d=struct.unpack("<IIII",f.read(16))
        pad=(-d)%4
        if (a,b,c)!=(4,d+8+pad,d+4+pad):
            raise RuntimeError("Unexpected Electron ASAR header geometry")
        body=f.read(d)
    return json.loads(body),b+8

def patch(root, script_file):
    asar=root/"resources/app.asar"
    external=root/"resources/app.asar.unpacked"
    html_rel="dist/index.html"
    html_path=external/html_rel
    if not script_file.is_file():
        raise RuntimeError("Missing trusted versioned inspector asset")
    script=script_file.read_bytes()
    if len(script)<5000 or b"XMLHttpRequest.prototype.open" not in script or b"MAX_BODY=1024*1024" not in script:
        raise RuntimeError("Unexpected inspector contents; abort")
    subprocess.run(["node","--check",str(script_file)],check=True)
    if any(item in script for item in (b"sendBeacon(",b"localStorage.setItem(",b"document.cookie=",b"console.log(",b"btoa(")):
        raise RuntimeError("Unsafe client-side secret logging/storage marker detected")

    hdr,old_data_offset=read_header(asar)
    htmlmeta=metadata(hdr,html_rel)
    if not htmlmeta.get("unpacked") or htmlmeta.get("integrity",{}).get("hash")!=filehash(html_path):
        raise RuntimeError("HTML metadata/integrity mismatch")
    original=html_path.read_bytes()
    if original.count(b"<title>Dyclokpro</title>")!=1:
        raise RuntimeError("Unexpected main app title: not branded Dyclokpro")
    if original.count(b"</head>")!=1 or b"dyclokpro-inspector.js" in original:
        raise RuntimeError("Unexpected HTML contents or duplicate inspector")
    source=b'    <script src="./dyclokpro-inspector.js"></script>\n'
    updated=original.replace(b"</head>",source+b"  </head>")
    html_path.write_bytes(updated)
    htmlmeta["size"]=len(updated)
    htmlmeta["integrity"]=integrity(updated)
    inspector_rel="dist/dyclokpro-inspector.js"
    inspector_meta=hdr["files"]["dist"]["files"]
    if "dyclokpro-inspector.js" in inspector_meta:
        raise RuntimeError("Inspector entry already exists")
    inspector_meta["dyclokpro-inspector.js"]={
        "size":len(script),"unpacked":True,"integrity":integrity(script)}
    newfile=external/inspector_rel
    newfile.write_bytes(script)

    # Existing original packaged files are copied byte-for-byte;
    # modifying only the JSON ASAR header preserves their offsets.
    fresh=json.dumps(hdr,ensure_ascii=True,separators=(",",":")).encode("utf8")
    pad=(-len(fresh))%4
    if len(fresh)<100000:
        raise RuntimeError("Unexpected ASAR header shrink")
    packed=struct.pack("<IIII",4,len(fresh)+8+pad,len(fresh)+4+pad,len(fresh))
    temp=asar.with_suffix(".patched.asar")
    with asar.open("rb") as old, temp.open("wb") as new:
        new.write(packed);new.write(fresh);new.write(b"\x00"*pad)
        old.seek(old_data_offset)
        shutil.copyfileobj(old,new,8*1024*1024)
    temp.replace(asar)
    verified,offset=read_header(asar)
    for path in (html_rel,inspector_rel):
        meta=metadata(verified,path)
        if not meta.get("unpacked") or meta["integrity"]["hash"]!=filehash(external/path):
            raise RuntimeError("ASAR inspector verification failed: "+path)
    for path in ("dist/assets/index-C7Bw2kjt.js","dist/assets/index-BFRPcHQY.js"):
        oldfile=external/path
        if not oldfile.is_file() or metadata(verified,path)["integrity"]["hash"]!=filehash(oldfile):
            raise RuntimeError("Existing verified application JS mutated: "+path)
    print("INSPECTOR_BOTTOM_LEFT_BUTTON=true")
    print("COOKIE_VALUES_AND_PROXY_PASSWORDS_NOT_CAPTURED=true")
    print("APP_AUTO_UPDATE_PATCH_AND_CHROMIUM_UNCHANGED=true")
    print("PRIVATE_PROFILE_DIRECTORY_NOT_INCLUDED=true")
    print("INSPECTOR_SHA256="+filehash(newfile))
    print("ASAR_SHA256="+filehash(asar))
    print("WINDOWS_APP_UI_RUNTIME_TEST=not_performed")

def main():
    p=argparse.ArgumentParser()
    p.add_argument("--installer",type=Path,required=True)
    p.add_argument("--destination",type=Path,required=True)
    p.add_argument("--inspector",type=Path,required=True)
    a=p.parse_args()
    extract(a.installer,a.destination)
    patch(a.destination,a.inspector)

if __name__=="__main__":
    main()
