#!/usr/bin/env python3
"""DyclokPRO v50.8: accurate per-profile archive diagnostics without reading Chromium cookies or private session data.

Repackages verified v6.16; does not modify its Chromium profile runtime, login
protocol, updater patch or browser profile data.
"""
import argparse,hashlib,json,struct,shutil,subprocess
from pathlib import Path
SOURCE_SHA="03621252bb532766d984838213e25411b69220ff491ea86d0f81a928c104ff81"
OLD_MAIN_SHA="0b2d43aa827f36c704f663253a859d3398125cdd184baaed2e0c648abfaf8a41"
SIG=bytes.fromhex("377abcaf271c")
REQUIRED=["DICloak.exe","DyclokPRO.ico","Dyclokpro_Perfiles_Locales.exe",
 "Chromium/Application/ginsbrowser.exe","Chromium/Application/142.0.7444.273/chrome.dll",
 "resources/app.asar","resources/app.asar.unpacked/dist/index.html",
 "resources/app.asar.unpacked/dist/dyclokpro-v65-brand.js",
 "resources/app.asar.unpacked/dist/dyclokpro-users-v66.js",
 "resources/app.asar.unpacked/dist/dyclokpro-archive.js"]
def sha(data):return hashlib.sha256(data).hexdigest()
def filehash(p):
 h=hashlib.sha256()
 with p.open("rb") as f:
  while b:=f.read(8*1024*1024):h.update(b)
 return h.hexdigest()
def integrity(b,size=4194304):
 return {"algorithm":"SHA256","hash":sha(b),"blockSize":size,
         "blocks":[sha(b[i:i+size]) for i in range(0,len(b),size)]}
def extract(source,destination):
 if not source.is_file() or filehash(source)!=SOURCE_SHA:
  raise RuntimeError("Published DyclokPRO v6.16 EXE is not verified")
 b=source.read_bytes()
 if b.count(SIG)!=1:raise RuntimeError("Embedded NSIS 7z signature mismatch")
 start=b.index(SIG)
 offset,size=struct.unpack_from("<QQ",b,start+12)
 end=start+32+offset+size
 if end>len(b) or end-start<180000000:raise RuntimeError("Invalid original NSIS boundaries")
 archive=source.parent/"dyclokpro-verified-v616.7z"
 archive.write_bytes(b[start:end])
 del b
 destination.mkdir(parents=True,exist_ok=False)
 try:subprocess.run(["7z","x","-y","-bb0","-o"+str(destination),str(archive)],check=True)
 finally:archive.unlink(missing_ok=True)
 for rel in ("SourceData","Chromium/User Data","Chromium/Application/SetupMetrics"):
  shutil.rmtree(destination/rel,ignore_errors=True)
 for rel in REQUIRED:
  if not (destination/rel).is_file():raise RuntimeError("Missing mandatory v6.16 component: "+rel)
 if (destination/"SourceData").exists() or (destination/"Chromium/User Data").exists():
  raise RuntimeError("Private profile data in redistributable payload")
def read_hdr(asar):
 with asar.open("rb") as f:
  a,b,c,d=struct.unpack("<IIII",f.read(16));pad=(-d)%4
  if (a,b,c)!=(4,d+8+pad,d+4+pad):raise RuntimeError("Unexpected ASAR format")
  obj=json.loads(f.read(d))
 return obj,b+8
def info(hdr,rel):
 node=hdr
 for p in rel.split("/"):node=node["files"][p]
 return node
def modify(root,backend):
 asar=root/"resources/app.asar"
 files=root/"resources/app.asar.unpacked"
 hdr,old_payload_start=read_hdr(asar)
 maininfo=info(hdr,"dist-electron/main.js")
 if maininfo.get("unpacked"):
  raise RuntimeError("Unexpected main.js layout: manual review required")
 if maininfo.get("integrity",{}).get("hash")!=OLD_MAIN_SHA:
  raise RuntimeError("Original Electron main.js integrity changed")
 with asar.open("rb") as f:
  f.seek(old_payload_start+int(maininfo["offset"]))
  old_main=f.read(int(maininfo["size"]))
 if sha(old_main)!=OLD_MAIN_SHA:raise RuntimeError("Published v6.16 packed main integrity differs from verified release")
 pre=backend.read_bytes()
 if b"version-local-info" not in pre or b"update-app-check-pack" not in pre or b'const VERSION="50.8.0"' not in pre:
  raise RuntimeError("Internal version update policy module incomplete")
 subprocess.run(["node","--check",str(backend)],check=True)
 # Preserve the entire verified v6.16 backend, including account isolation.
 new_main=pre+b"\n"+old_main
 test=root/"__dyclok_v508_main_check.js"
 test.write_bytes(new_main)
 try:subprocess.run(["node","--check",str(test)],check=True)
 finally:test.unlink(missing_ok=True)

 def edit_unpacked(rel,data):
  meta=info(hdr,rel);path=files/rel
  if not meta.get("unpacked") or meta["integrity"]["hash"]!=filehash(path):
   raise RuntimeError("Unexpected unpacked resource: "+rel)
  original=meta["integrity"]["blockSize"]
  path.write_bytes(data);meta["size"]=len(data);meta["integrity"]=integrity(data,original)

 htmlrel="dist/index.html"
 oldhtml=(files/htmlrel).read_bytes()
 if b"<title>DyclokPRO v6.16</title>" not in oldhtml or oldhtml.count(b"</head>")!=1:
  raise RuntimeError("Expected v6.16 title not found")
 edit_unpacked(htmlrel,oldhtml.replace(b"<title>DyclokPRO v6.16</title>",b"<title>DyclokPRO v50.8</title>"))
 brandingrel="dist/dyclokpro-v65-brand.js"
 branding=(files/brandingrel).read_bytes()
 if branding.count(b"v6.16")<2:raise RuntimeError("Expected v6.16 branding not found")
 edit_unpacked(brandingrel,branding.replace(b"v6.16",b"v50.8"))
 pkginfo=info(hdr,"package.json")
 pkg_unpacked=bool(pkginfo.get("unpacked"))
 if pkg_unpacked:
  pkgfile=files/"package.json"
  if not pkgfile.is_file() or pkginfo.get("integrity",{}).get("hash")!=filehash(pkgfile):
   raise RuntimeError("Unpacked app package metadata does not match original ASAR")
  rawpkg=pkgfile.read_bytes()
 else:
  with asar.open("rb") as f:
   f.seek(old_payload_start+int(pkginfo["offset"]))
   rawpkg=f.read(int(pkginfo["size"]))
 pkg=json.loads(rawpkg)
 old_version=pkg.get("version")
 if not isinstance(old_version,str) or not old_version:
  raise RuntimeError("Original Electron app version absent")
 print("ORIGINAL_INTERNAL_VERSION="+old_version)
 pkg["version"]="50.8.0"
 new_pkg=json.dumps(pkg,ensure_ascii=True,separators=(",",":")).encode("utf8")
 if pkg_unpacked:
  edit_unpacked("package.json",new_pkg)
 # Keep all existing packed content byte-for-byte. Append modified entry,
 # then update ASAR offset/size/integrity for main.js only. Other offsets remain.
 packed_size=asar.stat().st_size-old_payload_start
 maininfo["offset"]=str(packed_size)
 maininfo["size"]=len(new_main)
 maininfo["integrity"]=integrity(new_main,maininfo["integrity"]["blockSize"])
 if not pkg_unpacked:
  pkginfo["offset"]=str(packed_size+len(new_main))
  pkginfo["size"]=len(new_pkg)
  pkginfo["integrity"]=integrity(new_pkg,pkginfo.get("integrity",{}).get("blockSize",4194304))
 header=json.dumps(hdr,ensure_ascii=True,separators=(",",":")).encode("utf8")
 pad=(-len(header))%4
 packedhead=struct.pack("<IIII",4,len(header)+8+pad,len(header)+4+pad,len(header))
 temporary=asar.with_suffix(".new.asar")
 with asar.open("rb") as original,temporary.open("wb") as output:
  output.write(packedhead);output.write(header);output.write(b"\x00"*pad)
  original.seek(old_payload_start)
  shutil.copyfileobj(original,output,8*1024*1024)
  output.write(new_main)
  if not pkg_unpacked:output.write(new_pkg)
 temporary.replace(asar)
 # All header and packed JS bytes must match after full rewrite
 verified,newbase=read_hdr(asar)
 mi=info(verified,"dist-electron/main.js")
 with asar.open("rb") as stream:
  stream.seek(newbase+int(mi["offset"]))
  if sha(stream.read(mi["size"]))!=mi["integrity"]["hash"]:
   raise RuntimeError("Repacked main.js did not verify")
 new_pkg_info=info(verified,"package.json")
 if pkg_unpacked:
  final_pkg=(files/"package.json").read_bytes()
 else:
  with asar.open("rb") as stream:
   stream.seek(newbase+int(new_pkg_info["offset"]))
   final_pkg=stream.read(int(new_pkg_info["size"]))
 if sha(final_pkg)!=new_pkg_info["integrity"]["hash"] or json.loads(final_pkg).get("version")!="50.8.0":
  raise RuntimeError("Internal Electron app version not correctly repacked")
 for rel in [htmlrel,brandingrel,"dist/dyclokpro-archive.js","dist/dyclokpro-local-access.js","dist/dyclokpro-users-v66.js",
   "dist/assets/index-C7Bw2kjt.js","dist/assets/index-BFRPcHQY.js"]:
  meta=info(verified,rel)
  if meta["integrity"]["hash"]!=filehash(files/rel):
   raise RuntimeError("Resource integrity mismatch: "+rel)
 print("INTERNAL_VERSION_AND_MANUAL_APP_UPDATES_VERIFIED=true")
 print("MULTIACCOUNT_TABS_AND_SESSION_DURABILITY_PRESERVED=true")
 print("USER_DATA_ISOLATION_PRE_READY=true")
 print("LEGACY_PROFILE_USERDATA_PRESERVED=true")
 print("ORIGINAL_CHROMIUM_BINARY_UNMODIFIED=true")
 print("NEW_MAIN_SHA256="+mi["integrity"]["hash"])
 print("INTERNAL_APP_PACKAGE_VERSION="+json.loads(final_pkg)["version"])
 print("ASAR_SHA256="+filehash(asar))
 print("SESSION_EXPIRY_AND_REMOTE_AUTH_UNMODIFIED=true")
 print("CHILD_WINDOW_LOAD_CHECK=enabled")
 print("REMOTE_LOGIN_ACCEPTANCE_BY_SERVICE=NOT_VERIFIED")
def main():
 p=argparse.ArgumentParser()
 p.add_argument("--installer",type=Path,required=True)
 p.add_argument("--destination",type=Path,required=True)
 p.add_argument("--backend",type=Path,required=True)
 a=p.parse_args()
 extract(a.installer,a.destination)
 modify(a.destination,a.backend)
if __name__=="__main__":main()
