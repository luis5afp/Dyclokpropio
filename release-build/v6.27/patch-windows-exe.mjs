import {rcedit} from "rcedit";
import fs from "node:fs";
const [exe,icon]=process.argv.slice(2);
if(!exe||!icon||!fs.existsSync(exe)||!fs.existsSync(icon))throw Error("Missing Windows EXE or icon");
await rcedit(exe,{
  icon,
  "version-string":{
    ProductName:"DyclokPRO",FileDescription:"DyclokPRO — Navegador de perfiles",
    InternalName:"DyclokPRO",OriginalFilename:"DICloak.exe",CompanyName:"DyclokPRO",
    Comments:"DyclokPRO v6.27 — motor original v6.16"
  },
  "file-version":"6.27.0","product-version":"6.27.0"
});
console.log("NATIVE_WINDOWS_V626_BRANDING=PASS");
