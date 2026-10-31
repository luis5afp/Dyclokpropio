#!/usr/bin/env python3
"""DyclokPRO v6.29 EXPERIMENT: use the complete official DICloak 3.0.7 engine.
Adds only account/archive overlays; NEVER modifies official HTTP, authentication,
signature headers, profile API, browser code, or package.json version.
"""
import argparse,hashlib,json,struct,shutil,subprocess
from pathlib import Path

OFFICIAL_EXE_SHA="01b412f603b1aeb0a9f479476d4dca2f1fe653c7d35b344a6fb59b45d1cc93ae"
ORIGINAL={
 "dist-electron/main.js":"4ce4de9dcf1b76f92a56d05622eec84c97dfddb582d8c97ebe6fea2c5b595d72",
 "dist-electron/main-gLlCfI66.js":"0e5f43541ca8fd9194dd51baaa0b8685b93697943125feaa488a7e0d6a644f6b",
 "dist-electron/preload/index.js":"ddbb3adb390ac71e8eb5842da0835dd90f110eae12617e3593ec59be6e82ae1d",
 "dist/index.html":"f0b4f385a526ea7bdc49a92ee7e02cbd4f4a1a27b8fa8127e69023aca7b4861f",
 "dist/assets/index-CZSYLU7X.js":"d38fde9bc5cbb8e20a05833ac505660ba374c2788ef8888a5d4093ca1cfd270a",
 "package.json":"fdd24ee943ad1d4bb1e52495de9acde5140d8941c6c5b14d7bcb53526e650582"
}
SIG=bytes.fromhex("377abcaf271c")
def sha(raw):return hashlib.sha256(raw).hexdigest()
def filehash(path):
 h=hashlib.sha256()
 with path.open("rb") as fp:
  for chunk in iter(lambda:fp.read(8*1024*1024),b""):h.update(chunk)
 return h.hexdigest()
def checksum(data,block_size):
 return {"algorithm":"SHA256","hash":sha(data),"blockSize":block_size,
         "blocks":[sha(data[i:i+block_size]) for i in range(0,len(data),block_size)]}
def unpack(installer,destination):
 if not installer.is_file() or filehash(installer)!=OFFICIAL_EXE_SHA:
  raise RuntimeError("BLOCKED: official 3.0.7 installer SHA256 differs from supplied sample")
 data=installer.read_bytes()
 if data.count(SIG)!=1:raise RuntimeError("BLOCKED: unexpected installer archive signature")
 start=data.index(SIG)
 offset,length=struct.unpack_from("<QQ",data,start+12)
 end=start+32+offset+length
 if end>len(data) or end-start<170000000:raise RuntimeError("BLOCKED: invalid archive bounds")
 tmp=installer.parent/"dicloak-307-official-payload.7z"
 tmp.write_bytes(data[start:end]);del data
 if destination.exists():raise RuntimeError("Destination must not exist")
 destination.mkdir(parents=True)
 try:subprocess.run(["7z","x","-y","-bb0","-o"+str(destination),str(tmp)],check=True)
 finally:tmp.unlink(missing_ok=True)
 for rel in ("DICloak.exe","resources/app.asar"):
  if not (destination/rel).is_file():raise RuntimeError("Official 3.0.7 asset missing: "+rel)
 for rel in ("SourceData","Chromium/User Data"):
  shutil.rmtree(destination/rel,ignore_errors=True)
 if (destination/"SourceData").exists() or (destination/"Chromium/User Data").exists():
  raise RuntimeError("Private user data must not be redistributed")
def read_asar(asar):
 with asar.open("rb") as f:
  a,b,c,d=struct.unpack("<IIII",f.read(16))
  pad=(-d)%4
  if (a,b,c)!=(4,d+8+pad,d+4+pad):raise RuntimeError("BLOCKED: ASAR structure mismatch")
  head=json.loads(f.read(d))
 return head,b+8
def meta(hdr,path):
 v=hdr
 for key in path.split("/"):v=v["files"][key]
 return v
def packed(asar,base,entry):
 if entry.get("unpacked"):raise RuntimeError("BLOCKED: unexpected unpacked source")
 with asar.open("rb") as fp:
  fp.seek(base+int(entry["offset"]))
  return fp.read(int(entry["size"]))
def repackage(root):
 asar=root/"resources/app.asar"
 hdr,base=read_asar(asar)
 before={}
 for name,expected in ORIGINAL.items():
  raw=packed(asar,base,meta(hdr,name))
  if sha(raw)!=expected or meta(hdr,name).get("integrity",{}).get("hash")!=expected:
   raise RuntimeError("BLOCKED: official engine differs: "+name)
  before[name]=raw
 if json.loads(before["package.json"]).get("version")!="3.0.7":
  raise RuntimeError("BLOCKED: version must be genuine official 3.0.7")
 assets=Path("release-build/v6.29")
 main_layer=(assets/"overlay-main.js").read_bytes()
 preload_layer=(assets/"overlay-preload.js").read_bytes()
 users=(assets/"overlay-users.js").read_bytes()
 raw_backend=Path("release-build/v6.27/raw-archive-backend.js").read_bytes()
 raw_ui=Path("release-build/v6.27/raw-archive-ui.js").read_bytes()
 if b"const b=window.ipcRenderer;" not in raw_ui:
  raise RuntimeError("BLOCKED: old archive bridge changed")
 raw_ui=raw_ui.replace(b"const b=window.ipcRenderer;",b"const b=window.dyclokPROArchive;")
 for file in ("overlay-main.js","overlay-preload.js","overlay-users.js"):
  subprocess.run(["node","--check",str(assets/file)],check=True)
 for name,data in (("raw_backend",raw_backend),("raw_ui",raw_ui)):
  subprocess.run(["node","--check"],input=data,check=True)
 html=before["dist/index.html"]
 if html.count(b"</head>")!=1:raise RuntimeError("BLOCKED: unexpected official HTML")
 html=html.replace(b"<title>DICloak - Antidetect Browser</title>",
                   b"<title>DyclokPRO v6.29 (official engine 3.0.7)</title>")
 html=html.replace(b"</head>",
    b'  <script defer src="./dyclokpro-users-v629.js"></script>\n'
    b'  <script defer src="./dyclokpro-archive-v629.js"></script>\n</head>')
 updates={
  "dist-electron/main.js":main_layer+b"\n"+raw_backend+b"\n"+before["dist-electron/main.js"],
  "dist-electron/preload/index.js":before["dist-electron/preload/index.js"]+b"\n"+preload_layer,
  "dist/index.html":html,
  "dist/dyclokpro-users-v629.js":users,
  "dist/dyclokpro-archive-v629.js":raw_ui
 }
 # Never edit the signed version headers, client API, or native Chromium components.
 changes=[]
 offset=asar.stat().st_size-base
 for rel,data in updates.items():
  if rel in ORIGINAL:
   info=meta(hdr,rel)
   block=info["integrity"]["blockSize"]
  else:
   parts=rel.split("/")
   parent=hdr
   for sub in parts[:-1]:parent=parent["files"][sub]
   if parts[-1] in parent["files"]:raise RuntimeError("BLOCKED: unexpected existing overlay")
   info=parent["files"][parts[-1]]={}
   block=4194304
  info.update({"size":len(data),"offset":str(offset),"integrity":checksum(data,block)})
  changes.append(data)
  offset+=len(data)
 text=json.dumps(hdr,ensure_ascii=True,separators=(",",":")).encode("utf8")
 pad=(-len(text))%4
 tmp=asar.with_suffix(".new.asar")
 with asar.open("rb") as old,tmp.open("wb") as out:
  out.write(struct.pack("<IIII",4,len(text)+8+pad,len(text)+4+pad,len(text)))
  out.write(text);out.write(b"\0"*pad)
  old.seek(base);shutil.copyfileobj(old,out,8*1024*1024)
  for data in changes:out.write(data)
 tmp.replace(asar)
 final,newbase=read_asar(asar)
 for rel,expected in ORIGINAL.items():
  if rel in updates:continue
  if sha(packed(asar,newbase,meta(final,rel)))!=expected:
   raise RuntimeError("BLOCKED: official original asset changed: "+rel)
 for rel,data in updates.items():
  if packed(asar,newbase,meta(final,rel))!=data:
   raise RuntimeError("BLOCKED: overlay bytes corrupted: "+rel)
 if json.loads(packed(asar,newbase,meta(final,"package.json"))).get("version")!="3.0.7":
  raise RuntimeError("BLOCKED: genuine 3.0.7 package.json altered")
 if sha(packed(asar,newbase,meta(final,"dist/assets/index-CZSYLU7X.js")))!=ORIGINAL["dist/assets/index-CZSYLU7X.js"]:
  raise RuntimeError("BLOCKED: official HTTP and signed-header implementation altered")
 print("OFFICIAL_307_API_AUTH_SIGNED_HEADERS=UNCHANGED")
 print("OFFICIAL_307_MAIN_JS_SHA256="+ORIGINAL["dist-electron/main.js"])
 print("OFFICIAL_307_FRONTEND_JS_SHA256="+ORIGINAL["dist/assets/index-CZSYLU7X.js"])
 print("ORIGINAL_VERSION=3.0.7")
 print("DYCLOKPRO_OVERLAYS=accounts,plain_archive")
 print("REAL_AUTH_PROFILE_BROWSER_TEST=NOT_AVAILABLE_IN_CI")
 print("ASAR_SHA256="+filehash(asar))
def main():
 ap=argparse.ArgumentParser()
 ap.add_argument("--installer",type=Path,required=True)
 ap.add_argument("--destination",type=Path,required=True)
 opts=ap.parse_args()
 unpack(opts.installer,opts.destination)
 repackage(opts.destination)
if __name__=="__main__":main()
