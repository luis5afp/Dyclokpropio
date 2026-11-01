#!/usr/bin/env python3
"""Static forensic comparison only: authentic v6.28 + genuine 3.0.7.
No executable launches, no user profiles, no auth material or bypasses.
Emits strictly bounded code-derived evidence, not private data.
"""
import argparse,collections,hashlib,json,re,struct,subprocess
from pathlib import Path
SIG=bytes.fromhex("377abcaf271c")
KNOWN={
 "v628":"954016364fe3e4c1a41b54d810388f8ca79d67a184d3ad25993b74c2d2b1c606",
 "official307":"01b412f603b1aeb0a9f479476d4dca2f1fe653c7d35b344a6fb59b45d1cc93ae",
}
PATTERNS={
 "window-title-full":rb"DICloak\s*-\s*V3\.0\.7\s*\|",
 "title-native-build":rb"1\.2\.4\.1",
 "title-renderer":rb"(?:DICloak\s*-\s*V|document\.title|setTitle\()",
 "session-error":rb"(?:GHOST_USER|300003|Tu sesi[oó]n ha expirado)",
 "profile-list":rb"(?:/v1/env/list|/env/list|env/list)",
 "version-header":rb"(?:X-Version|version-local-info|X-DEVICE-ID)",
 "profile-preload":rb"(?:render-process-gone|did-fail-load|preload-error)",
}
MAX_FILE=35_000_000
def digest(p):
 h=hashlib.sha256()
 with open(p,"rb") as f:
  for b in iter(lambda:f.read(2_097_152),b""):h.update(b)
 return h.hexdigest()
def extract(exe,name,to):
 if digest(exe)!=KNOWN[name]:raise RuntimeError("Original installer hash mismatch: "+name)
 if to.exists():raise RuntimeError("Refuse to overwrite extracted directory")
 to.mkdir(parents=True)
 with open(exe,"rb") as f:raw=f.read()
 if raw.count(SIG)!=1:raise RuntimeError("NSIS structure mismatch")
 start=raw.index(SIG)
 offset,length=struct.unpack_from("<QQ",raw,start+12)
 end=start+32+offset+length
 if end>len(raw) or end-start<160000000:raise RuntimeError("Corrupt NSIS layout")
 payload=exe.parent/("forensic-"+name+".7z")
 try:
  payload.write_bytes(raw[start:end])
  subprocess.run(["7z","x","-y","-bb0","-o"+str(to),str(payload)],check=True,
      stdout=subprocess.DEVNULL)
 finally:payload.unlink(missing_ok=True)
def read_asar(archive):
 with open(archive,"rb") as f:
  first=f.read(16);a,b,c,d=struct.unpack("<IIII",first)
  if (a,b,c)!=(4,d+8+(-d)%4,d+4+(-d)%4):
   raise RuntimeError("Invalid ASAR header")
  tree=json.loads(f.read(d))
 return tree,b+8
def get_entry(tree,path):
 cur=tree
 for segment in path.split("/"):cur=cur["files"][segment]
 return cur
def all_entries(tree,prefix=""):
 for k,item in tree.get("files",{}).items():
  rel=prefix+k
  if "files" in item:yield from all_entries(item,rel+"/")
  else:yield rel,item
def relevant(rel):
 suffix=Path(rel).suffix.lower()
 return suffix in (".js",".html",".json",".cjs",".mjs") and (
  rel.startswith("dist/") or rel.startswith("dist-electron/") or rel=="package.json")
def files(root):
 archive=root/"resources/app.asar"
 unpacked=root/"resources/app.asar.unpacked"
 tree,base=read_asar(archive)
 for rel,entry in all_entries(tree):
  if not relevant(rel) or int(entry.get("size",0))>MAX_FILE:continue
  if entry.get("unpacked"):
   p=unpacked/rel
   if not p.is_file():continue
   data=p.read_bytes()
  else:
   with open(archive,"rb") as f:
    f.seek(base+int(entry["offset"]))
    data=f.read(int(entry["size"]))
  yield rel,data
def inspect(root,label):
 items=list(files(root))
 relevant_hashes={}
 for p in ("package.json","dist-electron/main.js","dist-electron/preload/index.js"):
  item=next((v for f,v in items if f==p),None)
  if item:
   relevant_hashes[p]={"size":len(item),"sha256":hashlib.sha256(item).hexdigest()}
   if p=="package.json":
    meta=json.loads(item)
    relevant_hashes[p]["internal_version"]=meta.get("version")
    relevant_hashes[p]["main"]=meta.get("main")
 for rel,data in items:
  if rel.startswith("dist/assets/index-") and rel.endswith(".js"):
   relevant_hashes[rel]={"size":len(data),"sha256":hashlib.sha256(data).hexdigest()}
  if rel=="dist/index.html":
   relevant_hashes[rel]={"size":len(data),"sha256":hashlib.sha256(data).hexdigest()}
 summary={"label":label,"asar_sha256":digest(root/"resources/app.asar"),
  "code_files_scanned":len(items),"modules":relevant_hashes,"search":{}}
 for key,expr in PATTERNS.items():
  match=re.compile(expr,re.IGNORECASE)
  found=[]
  for rel,data in items:
   m=match.search(data)
   if m:
    record={"module":rel,"offset":m.start(),"length":len(data)}
    if key in ("window-title-full","title-native-build","title-renderer","session-error"):
     span=data[max(0,m.start()-80):m.end()+110]
     # Static vendor code ONLY, strip non-printables; never capture HTTP bodies,
     # tokens, bearer headers, or keys. Snippet capped at 200 chars.
     span=re.sub(rb"[\x00-\x1f]+",b" ",span)
     span=re.sub(rb"[a-zA-Z0-9_\-]{36,}",b"[LONG_STRING_REDACTED]",span)
     record["code_context"]=span.decode("utf8","replace")[:200]
    found.append(record)
    if len(found)>=8:break
  summary["search"][key]=found
 return summary
def main():
 ap=argparse.ArgumentParser()
 ap.add_argument("--v628",type=Path,required=True)
 ap.add_argument("--official",type=Path,required=True)
 ap.add_argument("--workdir",type=Path,required=True)
 ap.add_argument("--output",type=Path,required=True)
 a=ap.parse_args()
 if not a.workdir.exists():a.workdir.mkdir()
 original=a.workdir/"original-v628";official=a.workdir/"unmodified-307"
 extract(a.v628,"v628",original);extract(a.official,"official307",official)
 results={"reference":"Static ASAR forensic inventory of vendor-provided installers",
  "original_v628":inspect(original,"v6.28 renamed 3.0.7; native 2.8.17"),
  "genuine_307":inspect(official,"official genuine 3.0.7"),
  "interpretation_limits":[
   "Static occurrence does not prove execution or the cause of a login error.",
   "The screenshot alone does not reveal process ownership or failed network request.",
   "Production auth cannot be tested without the user's authorized session."
  ]}
 a.output.write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding="utf8")
 for key in ("original_v628","genuine_307"):
  record=results[key]
  print("RUNTIME",record["label"],"ASAR",record["asar_sha256"])
  print("PACKAGE",record["modules"].get("package.json"))
  print("MAIN",record["modules"].get("dist-electron/main.js"))
  for pattern in PATTERNS:
   print("CODE_MARKER",key,pattern,json.dumps(record["search"][pattern],ensure_ascii=False)[:2200])
 print("FORENSIC_REPORT_WRITTEN",a.output)
if __name__=="__main__":main()
