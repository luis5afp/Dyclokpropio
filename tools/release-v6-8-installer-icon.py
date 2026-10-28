#!/usr/bin/env python3
"""DyclokPRO v6.8: Repackage verified v6.7 without changing profile engines.

Only changes visible version metadata and the Windows installer icon configuration.
The original Chromium, account bootstrap, cloud interfaces and userData paths stay intact.
"""
import argparse, hashlib, json, shutil, struct, subprocess
from pathlib import Path

SOURCE_SHA="1579a9e12f8f9e543c4038180f97d62de2cb3e01d63926045edf4bb60e1fa36e"
NSIS_7Z=bytes.fromhex("377abcaf271c")
REQUIRED=[
 "DICloak.exe","DyclokPRO.ico","Dyclokpro_Perfiles_Locales.exe",
 "Chromium/Application/ginsbrowser.exe",
 "Chromium/Application/142.0.7444.273/chrome.dll",
 "resources/app.asar",
 "resources/app.asar.unpacked/dist/index.html",
 "resources/app.asar.unpacked/dist/dyclokpro-v65-brand.js",
 "resources/app.asar.unpacked/dist/dyclokpro-users-v66.js",
 "resources/app.asar.unpacked/dist/dyclokpro-archive.js",
]

def digest(data):return hashlib.sha256(data).hexdigest()

def filehash(path):
 h=hashlib.sha256()
 with path.open("rb") as f:
  while chunk:=f.read(8*1024*1024):h.update(chunk)
 return h.hexdigest()

def extract(exe,root):
 if filehash(exe)!=SOURCE_SHA:raise RuntimeError("Original published v6.7 checksum mismatch")
 whole=exe.read_bytes()
 if whole.count(NSIS_7Z)!=1:raise RuntimeError("Unexpected NSIS 7z data layout")
 start=whole.index(NSIS_7Z)
 off,size=struct.unpack_from("<QQ",whole,start+12)
 end=start+32+off+size
 if end>len(whole) or end-start<180000000:raise RuntimeError("NSIS 7z boundaries invalid")
 archive=exe.parent/"dyclokpro-v67-extracted.7z"
 archive.write_bytes(whole[start:end])
 del whole
 root.mkdir(parents=True,exist_ok=False)
 try:subprocess.run(["7z","x","-y","-bb0","-o"+str(root),str(archive)],check=True)
 finally:archive.unlink(missing_ok=True)
 for folder in ("SourceData","Chromium/User Data","Chromium/Application/SetupMetrics"):
  shutil.rmtree(root/folder,ignore_errors=True)
 for rel in REQUIRED:
  if not (root/rel).is_file():raise RuntimeError("A required v6.7 program component is missing: "+rel)
 if (root/"SourceData").exists() or (root/"Chromium/User Data").exists():
  raise RuntimeError("Private user profiles must never be packed")

def readheader(asar):
 with asar.open("rb") as f:
  a,b,c,d=struct.unpack("<IIII",f.read(16))
  padding=(-d)%4
  if (a,b,c)!=(4,d+8+padding,d+4+padding):
   raise RuntimeError("Unexpected ASAR metadata geometry")
  return json.loads(f.read(d)),b+8

def meta(header,rel):
 node=header
 for p in rel.split("/"):node=node["files"][p]
 return node

def rewrite(root):
 asar=root/"resources/app.asar"
 outside=root/"resources/app.asar.unpacked"
 hdr,payload_offset=readheader(asar)
 changed=[]
 def change(rel,data):
  path=outside/rel
  m=meta(hdr,rel)
  if not m.get("unpacked") or m.get("integrity",{}).get("algorithm")!="SHA256":
   raise RuntimeError("Unexpected ASAR integrity format: "+rel)
  if not path.is_file() or filehash(path)!=m["integrity"]["hash"]:
   raise RuntimeError("Original app content no longer matches the verified v6.7 ASAR")
  step=m["integrity"]["blockSize"]
  path.write_bytes(data)
  m["size"]=len(data)
  m["integrity"]={"algorithm":"SHA256","hash":digest(data),"blockSize":step,
                  "blocks":[digest(data[i:i+step]) for i in range(0,len(data),step)]}
  changed.append(rel)

 html="dist/index.html"
 data=(outside/html).read_bytes()
 if data.count(b"<title>DyclokPRO v6.7</title>")!=1:raise RuntimeError("Unexpected v6.7 title")
 change(html,data.replace(b"<title>DyclokPRO v6.7</title>",b"<title>DyclokPRO v6.8</title>"))
 branding="dist/dyclokpro-v65-brand.js"
 code=(outside/branding).read_bytes()
 if code.count(b"v6.7")<2:raise RuntimeError("Expected v6.7 title in branding file")
 change(branding,code.replace(b"v6.7",b"v6.8"))

 # Packed Electron main is deliberately unchanged; preserve packed bytes.
 header=json.dumps(hdr,ensure_ascii=True,separators=(",",":")).encode("utf8")
 padding=(-len(header))%4
 packed=struct.pack("<IIII",4,len(header)+8+padding,len(header)+4+padding,len(header))
 temp=asar.with_suffix(".new.asar")
 with asar.open("rb") as previous,temp.open("wb") as output:
  output.write(packed);output.write(header);output.write(b"\x00"*padding)
  previous.seek(payload_offset)
  shutil.copyfileobj(previous,output,8*1024*1024)
 temp.replace(asar)
 verify,base=readheader(asar)
 for item in changed+["dist/dyclokpro-users-v66.js","dist/dyclokpro-archive.js"]:
  if meta(verify,item)["integrity"]["hash"]!=filehash(outside/item):
   raise RuntimeError("ASAR verification failed: "+item)

 # Verify packed Electron entrypoint still byte-for-byte the same.
 m=meta(verify,"dist-electron/main.js")
 if m.get("unpacked"):raise RuntimeError("Unexpected unpacked Electron main")
 with asar.open("rb") as f:
  f.seek(base+int(m["offset"]))
  packed_main=f.read(m["size"])
 if digest(packed_main)!=m["integrity"]["hash"]:
  raise RuntimeError("Packed legacy startup code was modified/corrupted")

 print("V6_7_INSTALLER_SOURCE_SHA256_VERIFIED=true")
 print("V6_8_VISIBLE_TITLE_UPDATED=true")
 print("V6_7_ACCOUNT_ENGINE_UNMODIFIED=true")
 print("V6_7_CHROMIUM_UNMODIFIED=true")
 print("USER_PRIVATE_PROFILE_DATA_NOT_PACKED=true")
 print("DYCLOKPRO_ICO_SHA256="+filehash(root/"DyclokPRO.ico"))
 print("ASAR_SHA256="+filehash(asar))

def main():
 ap=argparse.ArgumentParser()
 ap.add_argument("--installer",type=Path,required=True)
 ap.add_argument("--destination",type=Path,required=True)
 a=ap.parse_args()
 extract(a.installer,a.destination)
 rewrite(a.destination)
if __name__=="__main__":main()
