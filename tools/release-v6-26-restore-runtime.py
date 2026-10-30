#!/usr/bin/env python3
"""DyclokPRO v6.26: verified v6.16 runtime, with UI-version branding only.
No auth, cookie, server, X-Version, IPC or session logic is changed.
"""
import argparse, hashlib, json, shutil, struct, subprocess
from pathlib import Path

SOURCE_SHA="03621252bb532766d984838213e25411b69220ff491ea86d0f81a928c104ff81"
MAIN_SHA="0b2d43aa827f36c704f663253a859d3398125cdd184baaed2e0c648abfaf8a41"
API_BUNDLE_SHA="734000957d8abc026e11b1a586cbad8aaf68dcdc998bc959ce67103b0269725d"
SIG=bytes.fromhex("377abcaf271c")
REQUIRED=(
 "DICloak.exe","DyclokPRO.ico","Dyclokpro_Perfiles_Locales.exe",
 "Chromium/Application/ginsbrowser.exe","Chromium/Application/142.0.7444.273/chrome.dll",
 "resources/app.asar","resources/app.asar.unpacked/dist/index.html",
 "resources/app.asar.unpacked/dist/dyclokpro-v65-brand.js",
 "resources/app.asar.unpacked/dist/dyclokpro-users-v66.js",
 "resources/app.asar.unpacked/dist/dyclokpro-archive.js",
 "resources/app.asar.unpacked/dist/dyclokpro-local-access.js",
 "resources/app.asar.unpacked/dist/assets/index-C7Bw2kjt.js",
 "resources/app.asar.unpacked/dist/assets/index-BFRPcHQY.js")

def sha(data):
 return hashlib.sha256(data).hexdigest()
def filehash(path):
 h=hashlib.sha256()
 with path.open("rb") as stream:
  for b in iter(lambda:stream.read(8*1024*1024),b""):h.update(b)
 return h.hexdigest()
def integrity(b,n):
 return {"algorithm":"SHA256","hash":sha(b),"blockSize":n,
         "blocks":[sha(b[i:i+n]) for i in range(0,len(b),n)]}
def unpack(source,dest):
 if not source.is_file() or filehash(source)!=SOURCE_SHA:
  raise RuntimeError("BLOCKED: unexpected v6.16 installer SHA256")
 data=source.read_bytes()
 if data.count(SIG)!=1:raise RuntimeError("BLOCKED: NSIS signature mismatch")
 start=data.index(SIG)
 offset,length=struct.unpack_from("<QQ",data,start+12)
 end=start+32+offset+length
 if end>len(data) or end-start<180000000:raise RuntimeError("Invalid NSIS archive")
 tmp=source.parent/"verified-v616.7z"
 tmp.write_bytes(data[start:end])
 del data
 dest.mkdir(parents=True,exist_ok=False)
 try:subprocess.run(["7z","x","-y","-bb0","-o"+str(dest),str(tmp)],check=True)
 finally:tmp.unlink(missing_ok=True)
 for rel in ("SourceData","Chromium/User Data","Chromium/Application/SetupMetrics"):
  shutil.rmtree(dest/rel,ignore_errors=True)
 for rel in REQUIRED:
  if not (dest/rel).is_file():raise RuntimeError("Required asset missing: "+rel)
 if filehash(dest/"resources/app.asar.unpacked/dist/assets/index-C7Bw2kjt.js")!=API_BUNDLE_SHA:
  raise RuntimeError("BLOCKED: authenticated API bundle differs from trusted v6.16")

def header(asar):
 with asar.open("rb") as stream:
  a,b,c,d=struct.unpack("<IIII",stream.read(16))
  pad=(-d)%4
  if (a,b,c)!=(4,d+8+pad,d+4+pad):raise RuntimeError("Unexpected ASAR format")
  obj=json.loads(stream.read(d))
 return obj,b+8
def meta(root,rel):
 item=root
 for segment in rel.split("/"):item=item["files"][segment]
 return item
def packed(asar,base,item):
 with asar.open("rb") as stream:
  stream.seek(base+int(item["offset"]))
  return stream.read(int(item["size"]))
def validate_native(rootdir):
 asar=rootdir/"resources/app.asar"
 root,base=header(asar)
 main=meta(root,"dist-electron/main.js")
 if main.get("unpacked") or main.get("integrity",{}).get("hash")!=MAIN_SHA:
  raise RuntimeError("BLOCKED: original v6.16 Electron main differs")
 if sha(packed(asar,base,main))!=MAIN_SHA:
  raise RuntimeError("BLOCKED: login/IPC main.js has changed")
 pkg=meta(root,"package.json")
 if pkg.get("unpacked"):
  raw=(rootdir/"resources/app.asar.unpacked/package.json").read_bytes()
 else:raw=packed(asar,base,pkg)
 if pkg.get("integrity",{}).get("hash")!=sha(raw):
  raise RuntimeError("BLOCKED: runtime package integrity differs")
 if json.loads(raw).get("version")!="2.8.17":
  raise RuntimeError("BLOCKED: original 2.8.17 native client changed")
 return root,base

def patch_display_only(rootdir):
 asar=rootdir/"resources/app.asar"
 unpacked=rootdir/"resources/app.asar.unpacked"
 root,base=validate_native(rootdir)
 labels={
  "dist/index.html":(b"<title>DyclokPRO v6.16</title>",b"<title>DyclokPRO v6.26</title>"),
  "dist/dyclokpro-v65-brand.js":(b"v6.16",b"v6.26")}
 for rel,(old,new) in labels.items():
  item=meta(root,rel)
  dst=unpacked/rel
  if not item.get("unpacked") or item.get("integrity",{}).get("hash")!=filehash(dst):
   raise RuntimeError("BLOCKED: original UI asset differs: "+rel)
  data=dst.read_bytes()
  if old not in data:raise RuntimeError("Original v6.16 label missing")
  new_data=data.replace(old,new)
  dst.write_bytes(new_data)
  item["size"]=len(new_data)
  item["integrity"]=integrity(new_data,item["integrity"]["blockSize"])
 txt=json.dumps(root,ensure_ascii=True,separators=(",",":")).encode("utf8")
 pad=(-len(txt))%4
 temporary=asar.with_suffix(".new.asar")
 with asar.open("rb") as old,temporary.open("wb") as out:
  out.write(struct.pack("<IIII",4,len(txt)+8+pad,len(txt)+4+pad,len(txt)))
  out.write(txt);out.write(b"\0"*pad)
  old.seek(base);shutil.copyfileobj(old,out,8*1024*1024)
 temporary.replace(asar)
 validate_native(rootdir)
 final,_=header(asar)
 for rel in (
  "dist/index.html","dist/dyclokpro-v65-brand.js",
  "dist/dyclokpro-users-v66.js","dist/dyclokpro-archive.js",
  "dist/dyclokpro-local-access.js","dist/assets/index-C7Bw2kjt.js",
  "dist/assets/index-BFRPcHQY.js"):
  if meta(final,rel)["integrity"]["hash"]!=filehash(unpacked/rel):
   raise RuntimeError("BLOCKED: altered resource outside allowlist: "+rel)
 if filehash(unpacked/"dist/assets/index-C7Bw2kjt.js")!=API_BUNDLE_SHA:
  raise RuntimeError("BLOCKED: login/profile API altered")
 if (rootdir/"SourceData").exists() or (rootdir/"Chromium/User Data").exists():
  raise RuntimeError("Private profile data included")
 print("ORIGINAL_V616_MAIN_AND_API_SHA256=PASS")
 print("INTERNAL_CLIENT_VERSION=2.8.17")
 print("INSTALLER_MARKETING_VERSION=6.26.0")
 print("AUTH_COOKIE_SESSION_SERVER_PATCHES=NONE")
 print("REMOTE_AUTHENTICATED_PROFILE_LIST=NOT_TESTED")
 print("ASAR_SHA256="+filehash(asar))

def main():
 ap=argparse.ArgumentParser()
 ap.add_argument("--installer",type=Path,required=True)
 ap.add_argument("--destination",type=Path,required=True)
 opts=ap.parse_args()
 unpack(opts.installer,opts.destination)
 patch_display_only(opts.destination)
if __name__=="__main__":main()
