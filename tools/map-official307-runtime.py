#!/usr/bin/env python3
"""Metadata-only architecture map of the official DICloak 3.0.7 ASAR.
Never exports proprietary source, signatures, session values, cookies or credentials.
"""
import argparse, collections, hashlib, json, re, struct
from pathlib import Path

EXPECTED="b8ca8e2f36753149b23a6d339042bcf91c650e242d84c0d3af98e8141c0d1dcf"
CORE=[
  ("electron",re.compile(r"^dist-electron/.*\.js$")),
  ("renderer",re.compile(r"^dist/assets/index-[\w-]+\.js$")),
  ("index_html",re.compile(r"^dist/index\.html$"))
]
INDICATORS=[
 "ipcMain.handle","ipcMain.on","ipcRenderer.invoke","ipcRenderer.send",
 "getLocalVersionInfo","version-local-info","get-device-id",
 "getNewDeviceId","getDeviceId","axios","X-Version","X-DC-M1","X-DC-M2",
 "X-API-KEY","setToken","setUserInfo","refreshToken","userData",
 "sessionData","app.getVersion","update-app","patchVersion"
]
ROUTES=re.compile(r"/(?:gin/)?v[1-9][0-9]*/(?:env|profile|browser|proxy|user|member|team)(?:/[A-Za-z_-]+)?")
HOSTS=re.compile(r"https?://([a-z0-9.-]+\.[a-z]{2,})",re.I)

def hashfile(p):
 h=hashlib.sha256()
 with p.open("rb") as f:
  for b in iter(lambda:f.read(1024*1024),b""):h.update(b)
 return h.hexdigest()

def index_asar(path):
 with path.open("rb") as f:
  a,b,c,d=struct.unpack("<IIII",f.read(16))
  pad=(-d)%4
  if (a,b,c)!=(4,d+8+pad,d+4+pad):raise ValueError("ASAR header not supported")
  hdr=json.loads(f.read(d))
 files={}
 def walk(prefix,node):
  for name,entry in node.get("files",{}).items():
   full=prefix+name
   if "files" in entry:walk(full+"/",entry)
   else:files[full]=entry
 walk("",hdr)
 return files,16+d+pad

def get_entry(path,files,base,name):
 entry=files[name]
 if entry.get("unpacked"):
  return (path.parent/(path.name+".unpacked")/name).read_bytes()
 if "offset" not in entry:raise ValueError("Missing packed offset for "+name)
 length=int(entry.get("size",0))
 if length>48000000:raise ValueError("Oversize source "+name)
 with path.open("rb") as f:
  f.seek(base+int(entry["offset"]))
  result=f.read(length)
 if len(result)!=length:raise ValueError("Truncated ASAR entry "+name)
 return result

def kind(name):
 if name.startswith("node_modules/"):return "dependencies"
 if name.startswith("dist-electron/"):return "electron_and_ipc"
 if name.startswith("dist/assets/"):return "renderer_assets"
 if name.startswith("dist/"):return "renderer"
 return "runtime"

def inspect(path):
 sha=hashfile(path)
 if sha!=EXPECTED:raise ValueError("Unknown ASAR - exact official 3.0.7 required: "+sha)
 files,base=index_asar(path)
 pkg=json.loads(get_entry(path,files,base,"package.json"))
 if pkg.get("version")!="3.0.7":raise ValueError("Wrong engine version")
 hits=[]
 for name in sorted(files):
  roles=[role for role,regex in CORE if regex.search(name)]
  if not roles:continue
  if int(files[name].get("size",0))>48000000:continue
  raw=get_entry(path,files,base,name)
  s=raw.decode("utf8","replace")
  signals={word:s.count(word) for word in INDICATORS if word in s}
  routes=sorted(set(ROUTES.findall(s)))[:80]
  hosts=sorted(set(HOSTS.findall(s)))[:80]
  hits.append({"file":name,"kind":roles,"bytes":len(raw),
    "sha256":hashlib.sha256(raw).hexdigest(),
    "signals":signals,"route_patterns":routes,"hosts":hosts})
 return {"engine_version":pkg["version"],"patch_version":pkg.get("patchVersion"),
  "asar_sha256":sha,"files_total":len(files),
  "families":dict(collections.Counter(kind(s) for s in files)),
  "core":hits,"source_code_exported":False,
  "official_internal_client_unmodified":True,
  "authentication_live_tested":False}

def markdown(data):
 lines=[
  "# Motor DICloak 3.0.7 - arquitectura inspeccionada",
  "",
  "Mapa estático, generado a partir del paquete oficial sin copiar su código fuente.",
  "No demuestra la autenticación o la carga de perfiles en un servidor real.",
  "",
  "- Versión del motor: "+data["engine_version"],
  "- Versión del parche: "+str(data["patch_version"]),
  "- SHA256 ASAR: "+data["asar_sha256"],
  "- Archivos del ASAR: "+str(data["files_total"]),
  "",
  "## Componentes",
  "| Familia | Archivos |",
  "|---|---:|"]
 for k,v in sorted(data["families"].items()):lines.append("| "+k+" | "+str(v)+" |")
 lines += ["","## Bundles identificados","| Archivo | Tamaño (bytes) | Indicadores presentes |","|---|---:|---|"]
 for file in data["core"]:
  keys=", ".join(file["signals"].keys())
  lines.append("| "+file["file"]+" | "+str(file["bytes"])+" | "+keys[:140]+" |")
 lines += ["","## Estrategia de integración limpia","",
  "Mantener EXE y ASAR oficiales íntegros. El cliente HTTP autenticado, los tokens y las firmas pertenecen al motor original.",
  "Implementar fuera del motor los controles de DyclokPRO: pestañas de cuentas, archivos, diagnóstico y configuración.",
  "Consultar perfiles mediante una API local documentada y autorizada, sin copiar módulos de autenticación internos.",
  "Validar en Windows login, carga real de perfiles y persistencia antes de declarar una versión estable.",""]
 return "\n".join(lines)

def main():
 ap=argparse.ArgumentParser()
 ap.add_argument("--asar",type=Path,required=True)
 ap.add_argument("--out",type=Path,required=True)
 args=ap.parse_args()
 data=inspect(args.asar)
 args.out.mkdir(parents=True,exist_ok=True)
 (args.out/"engine307-map.json").write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding="utf8")
 (args.out/"engine307-report.md").write_text(markdown(data),encoding="utf8")
 print("ENGINE307_MAP=PASS")
 print("ENGINE_VERSION="+data["engine_version"])
 print("PATCH_VERSION="+str(data["patch_version"]))
 print("ASAR_ENTRIES="+str(data["files_total"]))
 print("CORE_COMPONENTS="+str(len(data["core"])))
 print("SENSITIVE_VALUES_EXPORTED=FALSE")
if __name__=="__main__":main()
