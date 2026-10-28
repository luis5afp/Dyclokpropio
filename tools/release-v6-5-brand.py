#!/usr/bin/env python3
"""DyclokPRO v6.5 - branding-only patch of published v6.4 Windows installer.

Preserve old native process name and package userData identity for profile compatibility.
Change visible application name, SVG/PNG/ICO logos, window title and taskbar icon.
"""
import argparse
import base64
import hashlib
import io
import json
import re
import shutil
import struct
import subprocess
from pathlib import Path

from PIL import Image

SOURCE_SHA="dc92c2ea4f21f32d172a181c8d2c8734803273f238c61724b4f757c1a4830384"
LOGO_SHA="5b2f206b06509f80260155807c13dbeecb428bbbed808b097492168ae0032b8e"
SIG=bytes.fromhex("377abcaf271c")
BRAND="DyclokPRO"
REQUIRED=[
    "DICloak.exe",
    "Dyclokpro_Perfiles_Locales.exe",
    "Chromium/Application/ginsbrowser.exe",
    "Chromium/Application/142.0.7444.273/chrome.dll",
    "resources/app.asar",
    "resources/app.asar.unpacked/package.json",
    "resources/app.asar.unpacked/dist/index.html",
    "resources/app.asar.unpacked/dist/assets/index-BFRPcHQY.js",
    "resources/app.asar.unpacked/dist/assets/index-C7Bw2kjt.js",
    "resources/app.asar.unpacked/dist/dyclokpro-archive.js",
    "resources/app.asar.unpacked/dist/dyclokpro-inspector.js",
]
def sha_bytes(b):
    return hashlib.sha256(b).hexdigest()
def sha_file(p):
    h=hashlib.sha256()
    with p.open("rb") as f:
        while chunk:=f.read(8*1024*1024):h.update(chunk)
    return h.hexdigest()
def extract(exe,root):
    if not exe.is_file() or sha_file(exe)!=SOURCE_SHA:
        raise RuntimeError("Original v6.4 EXE SHA256 mismatch")
    binary=exe.read_bytes()
    if binary.count(SIG)!=1:raise RuntimeError("Ambiguous embedded NSIS 7z package")
    index=binary.index(SIG)
    offset,size=struct.unpack_from("<QQ",binary,index+12)
    length=32+offset+size
    if length<180000000 or index+length>len(binary):
        raise RuntimeError("Unexpected NSIS archive boundaries")
    archive=exe.parent/"dyclokpro_v6_4_verified_payload.7z"
    archive.write_bytes(binary[index:index+length])
    del binary
    root.mkdir(parents=True,exist_ok=False)
    try:subprocess.run(["7z","x","-y","-bb0","-o"+str(root),str(archive)],check=True)
    finally:archive.unlink(missing_ok=True)
    for rel in ("SourceData","Chromium/User Data","Chromium/Application/SetupMetrics"):
        shutil.rmtree(root/rel,ignore_errors=True)
    for rel in REQUIRED:
        if not (root/rel).is_file():raise RuntimeError("Missing v6.4 component: "+rel)
    if (root/"SourceData").exists() or (root/"Chromium/User Data").exists():
        raise RuntimeError("Original private profiles detected")
    print("ORIGINAL_V6_4_INSTALLER_VERIFIED=true")
def header_read(asar):
    with asar.open("rb") as f:
        a,b,c,d=struct.unpack("<IIII",f.read(16))
        pad=(-d)%4
        if (a,b,c)!=(4,d+8+pad,d+4+pad):
            raise RuntimeError("Original ASAR header geometry mismatch")
        return json.loads(f.read(d)),8+b
def meta_for(hdr,rel):
    x=hdr
    for part in rel.split("/"):x=x["files"][part]
    return x
def build_logo(source):
    if sha_file(source)!=LOGO_SHA:
        raise RuntimeError("Custom user logo differs from the reviewed image")
    image=Image.open(source).convert("RGBA")
    if image.size!=(160,160):raise RuntimeError("Unexpected source logo dimensions")
    return image.resize((512,512),Image.Resampling.LANCZOS)
def content_png(canvas,size):
    o=io.BytesIO()
    canvas.resize((size,size),Image.Resampling.LANCZOS).save(o,format="PNG",optimize=True)
    return o.getvalue()
def content_ico(canvas):
    o=io.BytesIO()
    canvas.save(o,format="ICO",sizes=[(16,16),(24,24),(32,32),(48,48),(64,64),(128,128),(256,256)])
    return o.getvalue()
def svg_logo(canvas,kind,color):
    if kind=="text":
        return ('<svg xmlns="http://www.w3.org/2000/svg" width="140" height="19" viewBox="0 0 140 19">'
                '<text x="0" y="16" fill="'+color+'" font-family="Arial, sans-serif" font-size="17" '
                'font-weight="700" letter-spacing="-0.25">DyclokPRO</text></svg>').encode()
    icon=base64.b64encode(content_png(canvas,160)).decode("ascii")
    if kind=="banner":
        return ('<svg xmlns="http://www.w3.org/2000/svg" width="199" height="29" viewBox="0 0 199 29">'
                '<image href="data:image/png;base64,'+icon+'" width="29" height="29"/>'
                '<text x="36" y="23" fill="'+color+'" font-family="Arial, sans-serif" '
                'font-size="23" font-weight="700" letter-spacing="-0.4">DyclokPRO</text></svg>').encode()
    return ('<svg xmlns="http://www.w3.org/2000/svg" width="22" height="23" viewBox="0 0 22 23">'
            '<image href="data:image/png;base64,'+icon+'" width="22" height="23"/></svg>').encode()
def patch(root,canvas,brand_script):
    asar=root/"resources/app.asar"
    hdr,original_payload_offset=header_read(asar)
    unpacked=root/"resources/app.asar.unpacked"
    changed=[]
    def edit(rel,data):
        info=meta_for(hdr,rel)
        if not info.get("unpacked") or info.get("integrity",{}).get("algorithm")!="SHA256":
            raise RuntimeError("Cannot safely rewrite packed/unsigned ASAR resource: "+rel)
        p=unpacked/rel
        if not p.is_file() or sha_file(p)!=info["integrity"]["hash"]:
            raise RuntimeError("Original resource SHA256 mismatch: "+rel)
        if p.read_bytes()==data:return
        p.write_bytes(data)
        step=info["integrity"]["blockSize"]
        info["size"]=len(data)
        info["integrity"]["hash"]=sha_bytes(data)
        info["integrity"]["blocks"]=[sha_bytes(data[i:i+step]) for i in range(0,len(data),step)]
        changed.append(rel)

    # Keep runtime's existing user-data identity and native process filename.
    package=json.loads((unpacked/"package.json").read_text("utf8"))
    if package.get("name")!="DICloak":
        raise RuntimeError("Technical profile storage identity unexpectedly changed")
    if not (root/"DICloak.exe").is_file():
        raise RuntimeError("Legacy profile runtime executable missing")

    htmlrel="dist/index.html"
    html=(unpacked/htmlrel).read_bytes()
    if html.count(b"<title>Dyclokpro</title>")!=1:
        raise RuntimeError("Unexpected old window title; manual review needed")
    html=html.replace(b"<title>Dyclokpro</title>",b"<title>DyclokPRO v6.5</title>")
    html=html.replace(b"Dyclokpro is an anti-detect browser",b"DyclokPRO is an anti-detect browser")
    if b"dyclokpro-v65-brand.js" in html or html.count(b"</head>")!=1:
        raise RuntimeError("Duplicate branding script or unexpected HTML")
    html=html.replace(b"</head>",b'    <script defer src="./dyclokpro-v65-brand.js"></script>\n  </head>')
    edit(htmlrel,html)

    if len(brand_script.read_bytes())<1000:raise RuntimeError("Missing v6.5 branding controller")
    subprocess.run(["node","--check",str(brand_script)],check=True)
    newrel="dist/dyclokpro-v65-brand.js"
    if newrel.split("/")[-1] in hdr["files"]["dist"]["files"]:
        raise RuntimeError("Branding resource already exists")
    newdata=brand_script.read_bytes()
    (unpacked/newrel).write_bytes(newdata)
    step=4194304
    hdr["files"]["dist"]["files"][newrel.split("/")[-1]]={
       "size":len(newdata),"unpacked":True,
       "integrity":{"algorithm":"SHA256","hash":sha_bytes(newdata),"blockSize":step,
                    "blocks":[sha_bytes(newdata[i:i+step]) for i in range(0,len(newdata),step)]}
    }
    changed.append(newrel)

    # Rewrite ALL known Windows branding icon and logo variants in ASAR.
    found={"ico":0,"png":0,"svg":0}
    def walk(folder,prefix=""):
        for name,info in folder.get("files",{}).items():
            rel=prefix+name
            if "files" in info:yield from walk(info,rel+"/")
            else:yield rel,info
    for rel,info in list(walk(hdr)):
        if not info.get("unpacked") or not rel.startswith("dist/"):continue
        name=rel.rsplit("/",1)[-1]
        if rel=="dist/logo.ico" or re.fullmatch(r"logo-\d+-[^/]+\.ico",name):
            edit(rel,content_ico(canvas));found["ico"]+=1
        elif re.fullmatch(r"(?:login-logo|logo-256|logo-bg-primary|logo-bg-white)-[^/]+\.png",name):
            edit(rel,content_png(canvas,256));found["png"]+=1
        elif re.fullmatch(r"(?:logo|logo-light)-[^/]+\.svg",name):
            edit(rel,svg_logo(canvas,"icon","#ffffff"));found["svg"]+=1
        elif re.fullmatch(r"(?:text-logo|text-logo-light)-[^/]+\.svg",name):
            col="#141b23" if "light" in name else "#ffffff"
            edit(rel,svg_logo(canvas,"text",col));found["svg"]+=1
        elif re.fullmatch(r"login-logo(?:-light)?-[^/]+\.svg",name):
            col="#141b23" if "light" in name else "#ffffff"
            edit(rel,svg_logo(canvas,"banner",col));found["svg"]+=1
    if found["ico"]<4 or found["svg"]<4 or found["png"]<2:
        raise RuntimeError("Some original branding resources were not found: "+str(found))

    # Change display strings in the known translated label section only,
    # not API endpoints, proxy credentials, client IDs, or profile paths.
    loc="dist/assets/index-C7Bw2kjt.js"
    old=(unpacked/loc).read_bytes()
    lo,hi=1250000,2300000
    if len(old)<hi:raise RuntimeError("Unexpected translation bundle size")
    segment=old[lo:hi]
    if segment.count(b"Dyclokpro")+segment.count(b"DICloak")<10:
        raise RuntimeError("Translated UI branding anchors missing")
    new=old[:lo]+segment.replace(b"Dyclokpro",b"DyclokPRO").replace(b"DICloak",b"DyclokPRO")+old[hi:]
    edit(loc,new)
    with (unpacked/loc).open("rb") as stream:
        subprocess.run(["node","--check","--input-type=module"],stdin=stream,check=True)

    fresh=json.dumps(hdr,ensure_ascii=True,separators=(",",":")).encode()
    if len(fresh)<100000:raise RuntimeError("Unexpected ASAR metadata shrink")
    padding=(-len(fresh))%4
    start=struct.pack("<IIII",4,len(fresh)+8+padding,len(fresh)+4+padding,len(fresh))
    temporary=asar.with_suffix(".new.asar")
    with asar.open("rb") as original,temporary.open("wb") as output:
        output.write(start);output.write(fresh);output.write(b"\0"*padding)
        original.seek(original_payload_offset)
        shutil.copyfileobj(original,output,8*1024*1024)
    temporary.replace(asar)
    checked,_=header_read(asar)
    for rel in changed:
        if meta_for(checked,rel)["integrity"]["hash"]!=sha_file(unpacked/rel):
            raise RuntimeError("Modified ASAR integrity invalid: "+rel)

    # Native tray image is separate from the renderer's ASAR logo variants.
    tray=root/"resources/electron/tray-icon.png"
    if tray.is_file():tray.write_bytes(content_png(canvas,64))
    # Installer/window/taskbar icons come from freshly rebuilt Windows resources.
    (root/"DyclokPRO.ico").write_bytes(content_ico(canvas))
    (root/"DyclokPRO_Icon_512.png").write_bytes(content_png(canvas,512))
    print("BRAND_RESOURCE_COUNTS="+json.dumps(found))
    print("MODIFIED_RESOURCES="+str(len(changed)))
    print("WINDOW_TITLE_AND_NAV_BRAND=DyclokPRO")
    print("USER_DATA_RUNTIME_ID=DICloak (preserved for legacy profiles)")
    print("NEW_ICON_SHA256="+sha_file(root/"DyclokPRO.ico"))
    print("ASAR_SHA256="+sha_file(asar))
    print("USER_PROFILE_DATA_NOT_PACKAGED=true")
    print("WINDOWS_RUNTIME_PROFILE_OPENING=not_validated")

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--installer",type=Path,required=True)
    ap.add_argument("--destination",type=Path,required=True)
    ap.add_argument("--icon",type=Path,required=True)
    ap.add_argument("--brand-js",type=Path,required=True)
    a=ap.parse_args()
    extract(a.installer,a.destination)
    canvas=build_logo(a.icon)
    patch(a.destination,canvas,a.brand_js)

if __name__=="__main__":
    main()
