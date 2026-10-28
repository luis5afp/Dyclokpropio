#!/usr/bin/env python3
"""DyclokPRO v6.15: visible account archives inside installation using a junction to persistent originals.

Repackages verified v6.14; does not modify its Chromium profile runtime, login
protocol, updater patch or browser profile data.
"""
import argparse,hashlib,json,struct,shutil,subprocess
from pathlib import Path
SOURCE_SHA="67cfdbc87ebb530acaa10a04fd41fe10a9aa4df634869324d99e92df89c017c0"
OLD_MAIN_SHA="af58c3bd47b387e3abc7d86354abc369a47b1c19422e3ace79dea062a38bf503"
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
  raise RuntimeError("Published DyclokPRO v6.14 EXE is not verified")
 b=source.read_bytes()
 if b.count(SIG)!=1:raise RuntimeError("Embedded NSIS 7z signature mismatch")
 start=b.index(SIG)
 offset,size=struct.unpack_from("<QQ",b,start+12)
 end=start+32+offset+size
 if end>len(b) or end-start<180000000:raise RuntimeError("Invalid original NSIS boundaries")
 archive=source.parent/"dyclokpro-verified-v614.7z"
 archive.write_bytes(b[start:end])
 del b
 destination.mkdir(parents=True,exist_ok=False)
 try:subprocess.run(["7z","x","-y","-bb0","-o"+str(destination),str(archive)],check=True)
 finally:archive.unlink(missing_ok=True)
 for rel in ("SourceData","Chromium/User Data","Chromium/Application/SetupMetrics"):
  shutil.rmtree(destination/rel,ignore_errors=True)
 for rel in REQUIRED:
  if not (destination/rel).is_file():raise RuntimeError("Missing mandatory v6.14 component: "+rel)
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
def modify(root,backend,archive_ui):
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
 if sha(old_main)!=OLD_MAIN_SHA:raise RuntimeError("Published v6.14 packed main integrity differs from verified release")
 pre=backend.read_bytes()
 if b"dyclokpro:archive:installFolderStatus" not in pre or b"fs.symlinkSync" not in pre or b"dyclokpro:archive:openInstallFolder" not in pre:
  raise RuntimeError("Safe NTFS junction backend incomplete")
 subprocess.run(["node","--check",str(backend)],check=True)
 # Preserve the entire verified v6.14 backend, including account isolation.
 new_main=pre+b"\n"+old_main
 test=root/"__dyclok_v615_main_check.js"
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
 if b"<title>DyclokPRO v6.14</title>" not in oldhtml or oldhtml.count(b"</head>")!=1:
  raise RuntimeError("Unexpected v6.14 title")
 if b"dyclokpro-archive.js" not in oldhtml or b"dyclokpro-users-v66.js" not in oldhtml or b"dyclokpro-local-access.js" not in oldhtml:
  raise RuntimeError("Existing archive, local access and multiaccount UI required")
 edit_unpacked(htmlrel,oldhtml.replace(b"<title>DyclokPRO v6.14</title>",b"<title>DyclokPRO v6.15</title>"))
 brandingrel="dist/dyclokpro-v65-brand.js"
 branding=(files/brandingrel).read_bytes()
 if branding.count(b"v6.14")<2:raise RuntimeError("Original v6.14 branding missing")
 edit_unpacked(brandingrel,branding.replace(b"v6.14",b"v6.15"))
 archive_rel="dist/dyclokpro-archive.js"
 archive=archive_ui.read_bytes()
 subprocess.run(["node","--check",str(archive_ui)],check=True)
 if b'api("openInstallFolder")' not in archive or b'api("installFolderStatus")' not in archive:
  raise RuntimeError("Installed Cuentas archive frontend incomplete")
 edit_unpacked(archive_rel,archive)
 # Keep all existing packed content byte-for-byte. Append modified entry,
 # then update ASAR offset/size/integrity for main.js only. Other offsets remain.
 packed_size=asar.stat().st_size-old_payload_start
 maininfo["offset"]=str(packed_size)
 maininfo["size"]=len(new_main)
 maininfo["integrity"]=integrity(new_main,maininfo["integrity"]["blockSize"])
 header=json.dumps(hdr,ensure_ascii=True,separators=(",",":")).encode("utf8")
 pad=(-len(header))%4
 packedhead=struct.pack("<IIII",4,len(header)+8+pad,len(header)+4+pad,len(header))
 temporary=asar.with_suffix(".new.asar")
 with asar.open("rb") as original,temporary.open("wb") as output:
  output.write(packedhead);output.write(header);output.write(b"\x00"*pad)
  original.seek(old_payload_start)
  shutil.copyfileobj(original,output,8*1024*1024)
  output.write(new_main)
 temporary.replace(asar)
 # All header and packed JS bytes must match after full rewrite
 verified,newbase=read_hdr(asar)
 mi=info(verified,"dist-electron/main.js")
 with asar.open("rb") as stream:
  stream.seek(newbase+int(mi["offset"]))
  if sha(stream.read(mi["size"]))!=mi["integrity"]["hash"]:
   raise RuntimeError("Repacked main.js did not verify")
 for rel in [htmlrel,brandingrel,archive_rel,"dist/dyclokpro-local-access.js","dist/dyclokpro-users-v66.js",
   "dist/assets/index-C7Bw2kjt.js","dist/assets/index-BFRPcHQY.js"]:
  meta=info(verified,rel)
  if meta["integrity"]["hash"]!=filehash(files/rel):
   raise RuntimeError("Resource integrity mismatch: "+rel)
 print("INSTALLED_CUENTAS_JUNCTION_AND_PERSISTENCE_PROTECTED=true")
 print("MULTIACCOUNT_TABS_AND_SESSION_DURABILITY_PRESERVED=true")
 print("USER_DATA_ISOLATION_PRE_READY=true")
 print("LEGACY_PROFILE_USERDATA_PRESERVED=true")
 print("ORIGINAL_CHROMIUM_BINARY_UNMODIFIED=true")
 print("NEW_MAIN_SHA256="+mi["integrity"]["hash"])
 print("ARCHIVE_UI_SHA256="+filehash(files/archive_rel))
 print("ASAR_SHA256="+filehash(asar))
 print("SESSION_EXPIRY_AND_REMOTE_AUTH_UNMODIFIED=true")
 print("CHILD_WINDOW_LOAD_CHECK=enabled")
 print("REMOTE_LOGIN_ACCEPTANCE_BY_SERVICE=NOT_VERIFIED")
def main():
 p=argparse.ArgumentParser()
 p.add_argument("--installer",type=Path,required=True)
 p.add_argument("--destination",type=Path,required=True)
 p.add_argument("--backend",type=Path,required=True)
 p.add_argument("--archive-ui",type=Path,required=True)
 a=p.parse_args()
 extract(a.installer,a.destination)
 modify(a.destination,a.backend,a.archive_ui)
if __name__=="__main__":main()
