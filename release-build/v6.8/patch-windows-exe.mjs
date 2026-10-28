import {rcedit} from "rcedit";
import fs from "node:fs";
const [exe,icon]=process.argv.slice(2);
if(!exe||!icon||!fs.existsSync(exe)||!fs.existsSync(icon))throw Error("Missing EXE or icon for Windows resource patch");
await rcedit(exe,{
  icon,
  "version-string":{
     ProductName:"DyclokPRO",FileDescription:"DyclokPRO — Navegador de perfiles",
     InternalName:"DyclokPRO",OriginalFilename:"DICloak.exe",CompanyName:"DyclokPRO",
     Comments:"DyclokPRO v6.8"
  },
  "file-version":"6.8.0","product-version":"6.8.0",
});
console.log("WINDOWS_EXE_ICON_AND_VERSION_STRINGS_PATCHED=true");
