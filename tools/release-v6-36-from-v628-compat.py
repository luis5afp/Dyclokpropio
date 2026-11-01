#!/usr/bin/env python3
"""DyclokPRO v6.36 — preserve the EXACT v6.28 installer as the baseline.
Adds ONLY the optional 3.0.7 local-API bridge to the existing v6.28 UI/main.
Does NOT change the version field, original HTTP client, auth, Chromium files,
profile/session data, or vendor signature headers. NOT an official 3.0.7 engine.
"""
import argparse,hashlib,json,shutil,struct,subprocess
from pathlib import Path

SOURCE_SHA="954016364fe3e4c1a41b54d810388f8ca79d67a184d3ad25993b74c2d2b1c606"
ORIGINAL_NATIVE_MAIN_SHA="0b2d43aa827f36c704f663253a859d3398125cdd184baaed2e0c648abfaf8a41"
ORIGINAL_AUTH_BUNDLE_SHA="734000957d8abc026e11b1a586cbad8aaf68dcdc998bc959ce67103b0269725d"
SIG=bytes.fromhex("377abcaf271c")
REQUIRED=(
 "DICloak.exe","resources/app.asar",
 "resources/app.asar.unpacked/dist/index.html",
 "resources/app.asar.unpacked/dist/dyclokpro-archive.js",
 "resources/app.asar.unpacked/dist/dyclokpro-users-v66.js",
 "resources/app.asar.unpacked/dist/assets/index-C7Bw2kjt.js"
)
def sha(data):return hashlib.sha256(data).hexdigest()
def filehash(p):
 h=hashlib.sha256()
 with p.open("rb") as f:
  for block in iter(lambda:f.read(8*1024*1024),b""):h.update(block)
 return h.hexdigest()
def integrity(data,block):
 return {"algorithm":"SHA256","hash":sha(data),"blockSize":block,
  "blocks":[sha(data[i:i+block]) for i in range(0,len(data),block)]}
def unpack(original,dest):
 if not original.is_file() or filehash(original)!=SOURCE_SHA:
  raise RuntimeError("BLOCKED: installer is not exactly DyclokPRO v6.28")
 data=original.read_bytes()
 if data.count(SIG)!=1:raise RuntimeError("BLOCKED: unexpected 7z/NSIS archive")
 start=data.index(SIG)
 offset,length=struct.unpack_from("<QQ",data,start+12)
 end=start+32+offset+length
 if end>len(data) or end-start<175000000:raise RuntimeError("BLOCKED: archive offsets incorrect")
 if dest.exists():raise RuntimeError("BLOCKED: destination exists; will not overwrite")
 tmp=original.parent/"dyclokpro-v628-verified-payload.7z"
 tmp.write_bytes(data[start:end]);del data
 dest.mkdir(parents=True)
 try:subprocess.run(["7z","x","-y","-bb0","-o"+str(dest),str(tmp)],check=True)
 finally:tmp.unlink(missing_ok=True)
 for rel in REQUIRED:
  if not (dest/rel).is_file():raise RuntimeError("BLOCKED: v6.28 missing file "+rel)
 # Never redistribute personal data accidentally included in a vendor archive.
 for rel in ("SourceData","Chromium/User Data","Chromium/Application/SetupMetrics"):
  shutil.rmtree(dest/rel,ignore_errors=True)
 if (dest/"SourceData").exists() or (dest/"Chromium/User Data").exists():
  raise RuntimeError("BLOCKED: private files bundled")
def asar_header(path):
 with path.open("rb") as f:
  a,b,c,d=struct.unpack("<IIII",f.read(16))
  if (a,b,c)!=(4,d+8+(-d)%4,d+4+(-d)%4):
   raise RuntimeError("BLOCKED: unexpected ASAR header")
  head=json.loads(f.read(d))
 return head,b+8
def meta(tree,rel):
 current=tree
 for piece in rel.split("/"):current=current["files"][piece]
 return current
def packed(path,base,entry):
 if entry.get("unpacked"):raise RuntimeError("Expected a packed ASAR file")
 with path.open("rb") as f:
  f.seek(base+int(entry["offset"]))
  return f.read(int(entry["size"]))
def patch(dest):
 asar=dest/"resources/app.asar"
 unpacked=dest/"resources/app.asar.unpacked"
 hdr,base=asar_header(asar)
 main_entry=meta(hdr,"dist-electron/main.js")
 previous_main=packed(asar,base,main_entry)
 original_backend=Path("release-build/v6.28/raw-archive-backend.js").read_bytes()
 prefix=original_backend+b"\n"
 if not previous_main.startswith(prefix):
  raise RuntimeError("BLOCKED: unexpected main prelude in v6.28")
 main_tail=previous_main[len(prefix):]
 if sha(main_tail)!=ORIGINAL_NATIVE_MAIN_SHA:
  raise RuntimeError("BLOCKED: v6.28 original provider main is not intact")
 bundle=unpacked/"dist/assets/index-C7Bw2kjt.js"
 if filehash(bundle)!=ORIGINAL_AUTH_BUNDLE_SHA:
  raise RuntimeError("BLOCKED: v6.28 provider signed API bundle changed")
 pkg=meta(hdr,"package.json")
 package=unpacked/"package.json"
 oldpkg=package.read_bytes() if pkg.get("unpacked") else packed(asar,base,pkg)
 if json.loads(oldpkg).get("version")!="3.0.7":
  raise RuntimeError("BLOCKED: unexpected v6.28 experimental technical version")

 ui=Path("release-build/v6.36/compat307-ui.js").read_bytes()
 backend=Path("release-build/v6.36/compat307-backend.js").read_bytes()
 archive_target=unpacked/"dist/dyclokpro-archive.js"
 archive_entry=meta(hdr,"dist/dyclokpro-archive.js")
 legacy_archive=Path("release-build/v6.28/raw-archive-ui.js").read_bytes()
 if archive_target.read_bytes()!=legacy_archive or not archive_entry.get("unpacked"):
  raise RuntimeError("BLOCKED: original v6.28 archive UI differs")
 fixed_archive=Path("release-build/v6.36/raw-archive-ui.js").read_bytes()
 if b"obj.code!==0" not in fixed_archive:
  raise RuntimeError("BLOCKED: code=300003 filter missing")
 archive_target.write_bytes(fixed_archive)
 archive_entry["size"]=len(fixed_archive)
 archive_entry["integrity"]=integrity(fixed_archive,archive_entry["integrity"]["blockSize"])
 for script in ("release-build/v6.36/compat307-ui.js","release-build/v6.36/compat307-backend.js","release-build/v6.36/raw-archive-ui.js"):
  subprocess.run(["node","--check",script],check=True)

 # Do not replace any existing UI. Add one small module script, OFF by default.
 html_entry=meta(hdr,"dist/index.html")
 if not html_entry.get("unpacked"):raise RuntimeError("BLOCKED: HTML expected unpacked")
 html=unpacked/"dist/index.html"
 original_html=html.read_bytes()
 if sha(original_html)!=html_entry.get("integrity",{}).get("hash"):
  raise RuntimeError("BLOCKED: original v6.28 UI integrity mismatch")
 injection=b'<script defer src="./dyclokpro-compat307.js"></script>\n'
 if original_html.count(b"</head>")!=1 or b"dyclokpro-compat307.js" in original_html:
  raise RuntimeError("BLOCKED: could not safely extend original HTML")
 new_html=original_html.replace(b"</head>",injection+b"</head>")
 ui_entry_dir=meta(hdr,"dist")["files"]
 if "dyclokpro-compat307.js" in ui_entry_dir or (unpacked/"dist/dyclokpro-compat307.js").exists():
  raise RuntimeError("BLOCKED: compatibility UI already exists")
 ui_entry_dir["dyclokpro-compat307.js"]={
  "size":len(ui),"unpacked":True,"integrity":integrity(ui,4194304)
 }
 html_entry["size"]=len(new_html)
 html_entry["integrity"]=integrity(new_html,html_entry["integrity"]["blockSize"])
 (unpacked/"dist/dyclokpro-compat307.js").write_bytes(ui)
 html.write_bytes(new_html)

 new_main=backend+b"\n"+previous_main
 original_main_sha=sha(previous_main)
 main_entry["offset"]=str(asar.stat().st_size-base)
 main_entry["size"]=len(new_main)
 main_entry["integrity"]=integrity(new_main,main_entry["integrity"]["blockSize"])
 raw=json.dumps(hdr,ensure_ascii=True,separators=(",",":")).encode("utf8")
 pad=(-len(raw))%4
 nextasar=asar.with_suffix(".compat.tmp")
 with asar.open("rb") as old,nextasar.open("wb") as output:
  output.write(struct.pack("<IIII",4,len(raw)+8+pad,len(raw)+4+pad,len(raw)))
  output.write(raw);output.write(b"\0"*pad)
  old.seek(base);shutil.copyfileobj(old,output,8*1024*1024)
  output.write(new_main)
 nextasar.replace(asar)

 final,finalbase=asar_header(asar)
 newpacked=packed(asar,finalbase,meta(final,"dist-electron/main.js"))
 if newpacked!=new_main or sha(newpacked[len(backend)+1:])!=original_main_sha:
  raise RuntimeError("BLOCKED: provider main changed")
 if sha(newpacked[len(backend)+1+len(prefix):])!=ORIGINAL_NATIVE_MAIN_SHA:
  raise RuntimeError("BLOCKED: authenticated original native main changed")
 if filehash(bundle)!=ORIGINAL_AUTH_BUNDLE_SHA:
  raise RuntimeError("BLOCKED: signed frontend HTTP bundle changed")
 newpkg=meta(final,"package.json")
 actual=package.read_bytes() if newpkg.get("unpacked") else packed(asar,finalbase,newpkg)
 if actual!=oldpkg:
  raise RuntimeError("BLOCKED: v6.28 technical version/package modified")
 for rel in ("dist/dyclokpro-v65-brand.js","dist/dyclokpro-users-v66.js",
             "dist/dyclokpro-archive.js","dist/dyclokpro-local-access.js"):
  entry=meta(final,rel)
  target=unpacked/rel
  if filehash(target)!=entry.get("integrity",{}).get("hash"):
   raise RuntimeError("BLOCKED: original v6.28 function damaged: "+rel)
 if filehash(unpacked/"dist/dyclokpro-compat307.js")!=meta(final,"dist/dyclokpro-compat307.js")["integrity"]["hash"]:
  raise RuntimeError("BLOCKED: compatibility bridge UI mismatch")
 print("BASE_INSTALLER=verified_v6.28")
 print("V628_ORIGINAL_AUTH_API_CHROMIUM=UNCHANGED")
 print("V628_USER_TABS_AND_ARCHIVE=RETAINED; 300003_ARCHIVE_FILTER=FIXED")
 print("INTERNAL_TECH_VERSION=3.0.7_EXPERIMENTAL_OLD_ENGINE")
 print("GENUINE_307_ENGINE=NOT_BUNDLED")
 print("OPTIONAL_VENDOR_LOCAL_OPEN_API=V1_AND_V2")
 print("REMOTE_LOGIN_PROFILE_OPEN=NOT_TESTED")
 print("EXPERIMENTAL_COMPAT_ASAR_SHA256="+filehash(asar))
def main():
 parser=argparse.ArgumentParser()
 parser.add_argument("--installer",required=True,type=Path)
 parser.add_argument("--destination",required=True,type=Path)
 args=parser.parse_args()
 unpack(args.installer,args.destination)
 patch(args.destination)
if __name__=="__main__":main()
