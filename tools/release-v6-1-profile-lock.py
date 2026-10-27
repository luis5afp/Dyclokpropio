#!/usr/bin/env python3
"""Dyclokpro 6.1: preserve native executable identity and retry transient remote profile locking safely."""
import argparse
import base64
import hashlib
import json
from pathlib import Path
import re
import shutil
import struct
import subprocess
import sys
from PIL import Image

SRC_SHA = "98e36c196372e56e1e79fdfd8705ba46d272b55b0ddcf0d7ad24209207d89ed3"
SRC_ASAR_SHA = "0e2b3cb2375b20e40ddc4a56d36841c1be64024f6dfa1e7e553fbd411de49c5d"
PATCHED_UPDATE_JS_SHA = "d9095f040f99cd8104d624a7385716cc84a4b77bc4b475139c6d3e8765da3a3e"
ICON_INPUT_SHA = "389e9025df97f2743609670d00f13b349854cec167b758ab7c72bd32df8f9d46"
SIG = bytes.fromhex("377abcaf271c")
NAME = "Dyclokpro"

def sha(data):
    return hashlib.sha256(data).hexdigest()

def hash_file(path):
    h = hashlib.sha256()
    with path.open("rb") as f:
        while b := f.read(1024*1024*8):
            h.update(b)
    return h.hexdigest()

def assert_sha(path, expected):
    if not path.is_file() or hash_file(path) != expected:
        raise RuntimeError("Protected file SHA256 mismatch: " + str(path))

def extract(exe, dest):
    assert_sha(exe, SRC_SHA)
    with exe.open("rb") as f:
        data = f.read()
    if data.count(SIG) != 1:
        raise RuntimeError("Installer embedded 7z signature ambiguous")
    at = data.index(SIG)
    off, size = struct.unpack_from("<QQ", data, at+12)
    length = 32+off+size
    if length < 180000000 or at+length > len(data):
        raise RuntimeError("Invalid packed installer boundaries")
    archive = exe.parent / "dyclokpro-v6-extracted-verified.7z"
    archive.write_bytes(data[at:at+length])
    del data
    dest.mkdir(parents=True, exist_ok=False)
    try:
        subprocess.run(["7z","x","-y","-bb0","-o"+str(dest),str(archive)],check=True)
    finally:
        archive.unlink(missing_ok=True)
    for rel in ("SourceData","Chromium/User Data","Chromium/Application/SetupMetrics"):
        shutil.rmtree(dest/rel,ignore_errors=True)
    for rel in ("resources/app.asar", "resources/app.asar.unpacked/package.json",
                "resources/app.asar.unpacked/dist/index.html",
                "resources/app.asar.unpacked/dist/assets/index-BFRPcHQY.js",
                "Chromium/Application/ginsbrowser.exe",
                "Chromium/Application/142.0.7444.273/chrome.dll"):
        if not (dest/rel).is_file():
            raise RuntimeError("Missing verified v5.9 component: "+rel)
    assert_sha(dest/"resources/app.asar",SRC_ASAR_SHA)
    assert_sha(dest/"resources/app.asar.unpacked/dist/assets/index-BFRPcHQY.js",PATCHED_UPDATE_JS_SHA)
    if (dest/"SourceData").exists() or (dest/"Chromium/User Data").exists():
        raise RuntimeError("Private profile data must not be redistributed")

def prepare_icon(asset_file, dest):
    raw=base64.b64decode(asset_file.read_text(encoding="ascii").strip(),validate=True)
    if sha(raw) != ICON_INPUT_SHA or not raw.startswith(bytes.fromhex("89504e470d0a1a0a")):
        raise RuntimeError("User icon resource is not a PNG file")
    import io
    image=Image.open(io.BytesIO(raw))
    image.load()  # Reject truncated or corrupted PNG before packaging.
    image=image.convert("RGBA")
    print("ICON_RESOURCE_SHA256="+sha(raw))
    bb=image.getchannel("A").getbbox()
    if not bb: raise RuntimeError("Empty supplied logo")
    trimmed=image.crop(bb)
    image=trimmed.resize((464,464),Image.Resampling.LANCZOS)
    canvas=Image.new("RGBA",(512,512),(0,0,0,0))
    canvas.alpha_composite(image,(24,24))
    ico=dest/"Dyclokpro.ico"
    canvas.save(ico,sizes=[(16,16),(24,24),(32,32),(48,48),(64,64),(128,128),(256,256)])
    return canvas,ico

def refresh_integrity(meta, payload):
    integ=meta.get("integrity")
    if integ is None or integ.get("algorithm")!="SHA256":
        raise RuntimeError("Protected ASAR integrity metadata missing")
    chunk=integ["blockSize"]
    integ["hash"]=sha(payload)
    integ["blocks"]=[sha(payload[i:i+chunk]) for i in range(0,len(payload),chunk)]
    meta["size"]=len(payload)

def get_meta(header, rel):
    obj=header
    for part in rel.split("/"):
        obj=obj["files"][part]
    return obj

def modify_asar(root, canvas, ico):
    asar=root/"resources/app.asar"
    with asar.open("rb") as f:
        a,b,c,d=struct.unpack("<IIII", f.read(16))
        if a!=4 or c!=d+4+(-d)%4 or b!=d+8+(-d)%4:
            raise RuntimeError("Unexpected ASAR format")
        original=f.read(d)
        hdr=json.loads(original)
    unpacked=root/"resources/app.asar.unpacked"
    def edit_unpacked(rel, content):
        meta=get_meta(hdr,rel)
        if not meta.get("unpacked"):
            raise RuntimeError("Expected externally unpacked resource: "+rel)
        path=unpacked/rel
        if not path.is_file() or hash_file(path)!=meta["integrity"]["hash"]:
            raise RuntimeError("Unpacked source integrity mismatch: "+rel)
        path.write_bytes(content)
        refresh_integrity(meta,content)

    # Keep package.json internal name DICloak unchanged to preserve existing userData.
    package=unpacked/"package.json"
    if json.loads(package.read_text(encoding="utf8"))["name"]!="DICloak":
        raise RuntimeError("Old userData storage identity changed unexpectedly")

    html_rel="dist/index.html"
    html=(unpacked/html_rel).read_text(encoding="utf8")
    if "<title>DICloak - Antidetect Browser</title>" not in html:
        raise RuntimeError("Expected HTML title missing")
    html=html.replace("DICloak - Antidetect Browser","Dyclokpro")
    html=html.replace("DICloak is an anti-detect browser","Dyclokpro is an anti-detect browser")
    edit_unpacked(html_rel,html.encode("utf8"))

    import io
    for rel, meta in sorted(walk_files(hdr).items()):
        if not meta.get("unpacked"):
            continue
        if rel == "dist/logo.ico" or re.fullmatch(r"dist/assets/logo-\d+-[^/]+\.ico",rel):
            width=int(re.search(r"logo-(\d+)-",rel).group(1)) if "logo-" in rel else 256
            width=min(256,width)
            buf=io.BytesIO()
            canvas.resize((width,width),Image.Resampling.LANCZOS).save(buf,format="ICO",sizes=[(width,width)])
            edit_unpacked(rel,buf.getvalue())
        elif rel.endswith(".png") and re.search(r"/(?:login-logo|logo-256)-",rel):
            buf=io.BytesIO()
            canvas.resize((256,256),Image.Resampling.LANCZOS).save(buf,format="PNG")
            edit_unpacked(rel,buf.getvalue())
        elif re.search(r"/login-logo(?:-light)?-[^/]+\.svg$",rel):
            img=io.BytesIO()
            canvas.resize((256,256),Image.Resampling.LANCZOS).save(img,format="PNG")
            encoded=base64.b64encode(img.getvalue()).decode("ascii")
            svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><image width="512" height="512" href="data:image/png;base64,{encoded}"/></svg>'
            edit_unpacked(rel,svg.encode("utf8"))

    # Localized visible messages, not the app protocol, URLs, userData paths or
    # internal enum DICLOAK. Only change text in the translation dictionary.
    main=unpacked/"dist/assets/index-C7Bw2kjt.js"
    rel="dist/assets/index-C7Bw2kjt.js"
    if main.is_file():
        original_main=main.read_bytes()
        if hash_file(main)!=get_meta(hdr,rel)["integrity"]["hash"]:
            raise RuntimeError("Compiled locale checksum mismatch")
        lo,hi=1250000,2300000
        segment=original_main[lo:hi]
        if segment.count(b"DICloak")<25:
            raise RuntimeError("Unexpected compiled language labels; branding aborted")
        updated=original_main[:lo]+segment.replace(b"DICloak",b"Dyclokpro")+original_main[hi:]
        # The remote profile lock must succeed before the browser can open.
        # Retry one rejected network request, NOT application-level rejections
        # or tokenless responses. Never bypass server-side ownership checks.
        original_lock=(b'const o=await e.options.trySendMsg(()=>(async(e,t=!1)=>await '
                       b'Yoe.patch(Joe(`/v1/env/${e}/lock_env`),{},{noLoading:t,isClientIp:!0}))'
                       b'(e.envId,!0),()=>{throw new Error(mae.LOCK_ENV_FAIL)})')
        retry_lock=(b'const o=await e.options.trySendMsg(async()=>{let last;'
                    b'for(let attempt=0;attempt<2;attempt++){try{return await '
                    b'Yoe.patch(Joe(`/v1/env/${e.envId}/lock_env`),{},{noLoading:!0,isClientIp:!0})}'
                    b'catch(err){last=err;if(attempt===0)await new Promise(resolve=>setTimeout(resolve,650))}}'
                    b'throw last},()=>{throw new Error(mae.LOCK_ENV_FAIL)})')
        if updated.count(original_lock)!=1:
            raise RuntimeError("Original lock handler changed; do not publish")
        updated=updated.replace(original_lock,retry_lock)
        # Prevent accidental logging of proxy passwords and lock tokens.
        secrets_in_logs=b'console.log("proxyPasswd",a.proxyPasswd);'
        token_log=b'if(console.log("lockResp",o),i===I3.OPEN_ENV_LIMIT_ERROR)'
        if updated.count(secrets_in_logs)!=1 or updated.count(token_log)!=1:
            raise RuntimeError("Original lock log anchors changed")
        updated=updated.replace(secrets_in_logs,b'')
        updated=updated.replace(token_log,b'if(i===I3.OPEN_ENV_LIMIT_ERROR)')
        if b'if(!(null==r?void 0:r.token))throw new Error(mae.LOCK_ENV_FAIL_FOR_TOKEN)' not in updated:
            raise RuntimeError("Protected mandatory lock-token validation missing")
        if b'mle=[qse,Wse,Kse,Jse,Qse,ele,Yse,tle,nle,ale,ole,rle]' not in updated:
            raise RuntimeError("Protected lock-before-open stage ordering changed")
        edit_unpacked(rel,updated)
        print("LOCK_BEFORE_OPEN_TOKEN_VALIDATION_PRESERVED=true")
        print("LOCK_NETWORK_RETRY_ON_REJECTION_ONLY=true")
        print("PROXY_AND_TOKEN_CONSOLE_LOGGING_DISABLED=true")
        with main.open("rb") as js:
            subprocess.run(["node","--check","--input-type=module"],stdin=js,check=True)
    else:
        raise RuntimeError("Expected locale bundle absent")

    # ASAR offsets for packed files are relative to the beginning of the data
    # segment; moving the whole segment preserves every original file offset.
    rewritten=json.dumps(hdr,separators=(",",":"),ensure_ascii=True).encode("utf8")
    pad=(-len(rewritten))%4
    prefix=struct.pack("<IIII",4,8+len(rewritten)+pad,4+len(rewritten)+pad,len(rewritten))
    previous_data_offset=8+b
    temp=asar.with_suffix(".rebrand-temp.asar")
    with asar.open("rb") as old, temp.open("wb") as new:
        new.write(prefix);new.write(rewritten);new.write(b"\x00"*pad)
        old.seek(previous_data_offset)
        shutil.copyfileobj(old,new,1024*1024*8)
    temp.replace(asar)
    with asar.open("rb") as f:
        pa,pb,pc,pd=struct.unpack("<IIII",f.read(16))
        if pa!=4 or pb!=8+pd+(-pd)%4 or pc!=pd+4+(-pd)%4:
            raise RuntimeError("ASAR header rebuild failed")
        json.loads(f.read(pd))
    print("ASAR_BRANDING_METADATA_VERIFIED=true")

def walk_files(header):
    result={}
    def rec(folder,prefix):
        for name,meta in folder.get("files",{}).items():
            rel=prefix+name
            if "files" in meta: rec(meta,rel+"/")
            else: result[rel]=meta
    rec(header,"")
    return result

def main():
    p=argparse.ArgumentParser()
    p.add_argument("--installer",type=Path,required=True)
    p.add_argument("--out",type=Path,required=True)
    p.add_argument("--logo-base64",type=Path,required=True)
    args=p.parse_args()
    extract(args.installer,args.out)
    canvas,ico=prepare_icon(args.logo_base64,args.out)
    modify_asar(args.out,canvas,ico)
    # Rebrand the live taskbar/tray asset; do not touch bundled Chromium internals.
    import io
    tray=args.out/"resources/electron/tray-icon.png"
    if tray.is_file():
        canvas.resize((64,64),Image.Resampling.LANCZOS).save(tray,format="PNG")
    # Preserve native Windows executable identity from v5.9. Changing its
    # filename can affect legacy process discovery. The installer/shortcuts,
    # title, UI, and EXE icon still use the visible Dyclokpro brand.
    exe=args.out/"DICloak.exe"
    if not exe.is_file():
        raise RuntimeError("Missing native compatibility executable")
    if (args.out/"Dyclokpro.exe").exists():
        raise RuntimeError("Unexpected duplicate Electron executable")
    if not (args.out/"Chromium/Application/ginsbrowser.exe").exists():
        raise RuntimeError("Native profile runtime changed unexpectedly")
    print("ICON_CUSTOMIZED=true")
    print("VISIBLE_APPLICATION_NAME=Dyclokpro")
    print("INTERNAL_PROFILE_STORAGE_ID=DICloak (preserved)")
    print("AUTO_UPDATE_DISABLE_PATCH=preserved from v5.9; no updater behavior changed")
    print("REAL_PROFILE_OPENING_TEST=not performed")

if __name__=="__main__":
    try: main()
    except Exception as exc:
        print("RELEASE_BLOCKED: "+str(exc),file=sys.stderr)
        sys.exit(1)
