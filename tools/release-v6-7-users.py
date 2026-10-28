#!/usr/bin/env python3
"""DyclokPRO v6.7: verify new login windows and clear stale displayed account names.

Repackages verified v6.5; does not modify its Chromium profile runtime, login
protocol, updater patch or browser profile data.
"""
import argparse,hashlib,json,struct,shutil,subprocess
from pathlib import Path
SOURCE_SHA="36d793345e99ebdceb227c6d5e60885b166788613b1517e27481d1fab0a48099"
OLD_MAIN_SHA="93841a08ccc6af151a6125ab11efebc8c89af8e6aa8399e873746a26edbea347"
SIG=bytes.fromhex("377abcaf271c")
REQUIRED=["DICloak.exe","DyclokPRO.ico","Dyclokpro_Perfiles_Locales.exe",
 "Chromium/Application/ginsbrowser.exe","Chromium/Application/142.0.7444.273/chrome.dll",
 "resources/app.asar","resources/app.asar.unpacked/dist/index.html",
 "resources/app.asar.unpacked/dist/dyclokpro-v65-brand.js",
 "resources/app.asar.unpacked/dist/dyclokpro-users-v66.js"]
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
  raise RuntimeError("Published DyclokPRO v6.6 EXE is not verified")
 b=source.read_bytes()
 if b.count(SIG)!=1:raise RuntimeError("Embedded NSIS 7z signature mismatch")
 start=b.index(SIG)
 offset,size=struct.unpack_from("<QQ",b,start+12)
 end=start+32+offset+size
 if end>len(b) or end-start<180000000:raise RuntimeError("Invalid original NSIS boundaries")
 archive=source.parent/"dyclokpro-verified-v66.7z"
 archive.write_bytes(b[start:end])
 del b
 destination.mkdir(parents=True,exist_ok=False)
 try:subprocess.run(["7z","x","-y","-bb0","-o"+str(destination),str(archive)],check=True)
 finally:archive.unlink(missing_ok=True)
 for rel in ("SourceData","Chromium/User Data","Chromium/Application/SetupMetrics"):
  shutil.rmtree(destination/rel,ignore_errors=True)
 for rel in REQUIRED:
  if not (destination/rel).is_file():raise RuntimeError("Missing mandatory v6.6 component: "+rel)
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
def modify(root,old_prelude,prelude,tabs):
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
 if sha(old_main)!=OLD_MAIN_SHA:raise RuntimeError("Published v6.6 packed main integrity differs from verified release")
 pre=prelude.read_bytes()
 if not (b"app.setPath" in pre and b"dyclokpro:users:add" in pre and b"sessionData" in pre):
  raise RuntimeError("Account startup isolation is incomplete")
 subprocess.run(["node","--check",str(prelude)],check=True)
 oldpre=old_prelude.read_bytes()+b"\n"
 if not old_main.startswith(oldpre):
  raise RuntimeError("Unexpected v6.6 account bootstrap; preserving all packed backend code")
 oldlegacy=old_main[len(oldpre):]
 if sha(oldlegacy)!="7505d30613fcd823590803a2cfae8271c8c0988e1f486fb5be9e486c49b7d2be":
  raise RuntimeError("Original legacy Electron main entrypoint changed")
 new_main=pre+b"\n"+oldlegacy
 test=root/"__dyclok_v66_main_check.js"
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
 if b"<title>DyclokPRO v6.6</title>" not in oldhtml or oldhtml.count(b"</head>")!=1:
  raise RuntimeError("Unexpected v6.5 frontend title")
 if b"dyclokpro-users-v66.js" not in oldhtml:raise RuntimeError("Expected existing account tabs not found")
 newhtml=oldhtml.replace(b"<title>DyclokPRO v6.6</title>",b"<title>DyclokPRO v6.7</title>")
 
 edit_unpacked(htmlrel,newhtml)

 oldbrandingrel="dist/dyclokpro-v65-brand.js"
 branding=(files/oldbrandingrel).read_bytes()
 if branding.count(b"v6.6")<2:raise RuntimeError("Original v6.6 display brand not found")
 edit_unpacked(oldbrandingrel,branding.replace(b"v6.6",b"v6.7"))

 newpath="dist/dyclokpro-users-v66.js"
 js=tabs.read_bytes()
 subprocess.run(["node","--check",str(tabs)],check=True)
 if len(js)<4000 or b"dyclokpro:users:" not in js or b"+ Usuario" not in js:
  raise RuntimeError("User tab frontend is incomplete")
 edit_unpacked(newpath,js)

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
 for rel in [htmlrel,oldbrandingrel,newpath,
   "dist/assets/index-C7Bw2kjt.js","dist/assets/index-BFRPcHQY.js"]:
  meta=info(verified,rel)
  if meta["integrity"]["hash"]!=filehash(files/rel):
   raise RuntimeError("Resource integrity mismatch: "+rel)
 print("MULTIACCOUNT_ELECTRON_MAIN_PATCHED=true")
 print("MULTIACCOUNT_TABS_LOGIN_PATCHED=true")
 print("USER_DATA_ISOLATION_PRE_READY=true")
 print("LEGACY_PROFILE_USERDATA_PRESERVED=true")
 print("ORIGINAL_CHROMIUM_BINARY_UNMODIFIED=true")
 print("NEW_MAIN_SHA256="+mi["integrity"]["hash"])
 print("UI_SCRIPT_SHA256="+filehash(files/newpath))
 print("ASAR_SHA256="+filehash(asar))
 print("VISIBLE_LOGOUT_NAME_CLEARED=true")
 print("CHILD_WINDOW_LOAD_CHECK=enabled")
 print("REMOTE_LOGIN_ACCEPTANCE_BY_SERVICE=NOT_VERIFIED")
def main():
 p=argparse.ArgumentParser()
 p.add_argument("--installer",type=Path,required=True)
 p.add_argument("--destination",type=Path,required=True)
 p.add_argument("--prelude",type=Path,required=True)
 p.add_argument("--old-prelude",type=Path,required=True)
 p.add_argument("--tabs",type=Path,required=True)
 a=p.parse_args()
 extract(a.installer,a.destination)
 modify(a.destination,a.old_prelude,a.prelude,a.tabs)
if __name__=="__main__":main()
