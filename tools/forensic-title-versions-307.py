#!/usr/bin/env python3
"""Read-only forensic version/title scanner for verified DICloak installers.
Scans public distribution files only. Never reads personal accounts/tokens/cookies.
Does not execute DICloak, patch code, inject into processes, or contact auth servers.
"""
from pathlib import Path
import hashlib, json, re, struct, sys

PATTERNS = ["1.2.4.1", "1.2.4", "DICloak - V", "DICloak -", "V3.0.7", "3.0.7"]
MAX_HITS_PER_PATTERN = 24
def sha(path):
    h=hashlib.sha256()
    with path.open("rb") as f:
        for part in iter(lambda:f.read(1048576),b""):h.update(part)
    return h.hexdigest()

def find_patterns(content):
    found={}
    for pat in PATTERNS:
        hits=[]
        for codec,needle in (("utf8",pat.encode()),("utf16le",pat.encode("utf-16le"))):
            start=0
            while len(hits)<MAX_HITS_PER_PATTERN:
                j=content.find(needle,start)
                if j<0:break
                hits.append([codec,j])
                start=j+len(needle)
        if hits:found[pat]=hits
    return found

def asar_meta(path):
    with path.open("rb") as stream:
        a,b,c,d=struct.unpack("<IIII",stream.read(16))
        pad=(-d)%4
        if (a,b,c)!=(4,d+8+pad,d+4+pad):
            raise RuntimeError("Unknown ASAR header layout")
        header=json.loads(stream.read(d))
        base=16+d+pad
    return header,base

def entries(root):
    result=[]
    def walk(parent,node):
        for name,obj in node.get("files",{}).items():
            full=(parent+"/"+name).lstrip("/")
            if obj.get("files"):
                walk(full,obj)
            elif "size" in obj:
                result.append((full,obj))
    walk("",root)
    return result

def asar_origin(file_offset,base,entry):
    for path,obj in entry:
        if "offset" not in obj or obj.get("unpacked"): continue
        pos=base+int(obj["offset"])
        if pos<=file_offset<pos+int(obj["size"]):
            return path, file_offset-pos
    return "<header/unmapped>",file_offset

def scan(label,root):
    print("=== SCAN",label,"===")
    print("ROOT_EXISTS",root.exists())
    if not root.exists():return
    count=0; matches=0
    for p in sorted(root.rglob("*")):
        if not p.is_file():continue
        rel=p.relative_to(root).as_posix()
        if "SourceData" in p.parts or "User Data" in rel:continue
        # Only scan app/runtime files; avoid huge browser assets/cache.
        if p.stat().st_size>180*1024*1024 and p.name not in ("app.asar","DICloak.exe"):continue
        if p.suffix.lower() not in (".asar",".exe",".dll",".js",".json",".pak",".dat",".node",".bin",".html",".txt",".xml",".yml",".ico",".config",".asar.unpacked"):continue
        count+=1
        if p.name=="app.asar":
            try:
                header,base=asar_meta(p)
                index=entries(header)
                pkg=next((o for name,o in index if name=="package.json"),None)
                if pkg:
                    with p.open("rb") as src:
                        src.seek(base+int(pkg["offset"]))
                        doc=json.loads(src.read(int(pkg["size"])))
                    print("ASAR_PACKAGE",label,json.dumps({k:doc.get(k) for k in ("name","productName","version","buildVersion")},ensure_ascii=False))
                    print("ASAR_ENTRIES",label,len(index))
                    for key,val in doc.items():
                        if isinstance(val,(str,int,float)) and "1.2.4.1" in str(val):
                            print("FOUND_OFFICIAL_PACKAGE_VERSION_FIELD",label,json.dumps({key:val},ensure_ascii=False))
                else:
                    print("ASAR_PACKAGE_MISSING",label)
            except Exception as ex:
                print("ASAR_META_ERROR",label,type(ex).__name__,str(ex)[:150])
                index=[];base=0
        else:
            index=[];base=0
        try:
            b=p.read_bytes()
            found=find_patterns(b)
        except Exception as ex:
            print("READ_ERROR",rel,type(ex).__name__)
            continue
        if rel=="resources/app.asar.unpacked/package.json":
            try:
                legacy=json.loads(b)
                print("UNPACKED_PACKAGE",label,json.dumps({k:legacy.get(k) for k in ("name","version","productName","buildVersion")},ensure_ascii=False))
                for key,val in legacy.items():
                    if isinstance(val,(str,int,float)) and "1.2.4.1" in str(val):
                        print("FOUND_UNPACKED_PACKAGE_VERSION_FIELD",label,json.dumps({key:val},ensure_ascii=False))
            except Exception as ex:print("UNPACKED_PACKAGE_PARSE_ERROR",type(ex).__name__)
        if found:
            matches+=1
            for pat,hits in found.items():
                summarized=[]
                for coding,pos in hits[:10]:
                    if index:
                        member,relative=asar_origin(pos,base,index)
                        summarized.append([coding,member,relative])
                    else:summarized.append([coding,pos])
                print("PATTERN",label,rel,repr(pat),"count_sample",len(hits),"hits",json.dumps(summarized))
                if pat=="DICloak - V":
                    for encoding,pos in hits[:2]:
                        if encoding!="utf8":continue
                        snippet=b[max(0,pos-155):min(len(b),pos+240)].decode("utf-8","replace")
                        snippet=re.sub(r"[\x00-\x1f\x7f]"," ",snippet)
                        print("WINDOW_TITLE_CONSTRUCTION",label,rel,repr(snippet[:395]))
        if p.name in ("DICloak.exe","app.asar"):
            print("HASH",label,rel,sha(p))
    print("FILE_SCAN_COMPLETE",label,"files_scanned",count,"files_with_patterns",matches)

if __name__=="__main__":
    for item in sys.argv[1:]:
        label,location=item.split("=",1)
        scan(label,Path(location))
