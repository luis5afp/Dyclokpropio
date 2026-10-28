/* DyclokPRO v6.5: visible UI branding only; preserves backend identity used by profiles. */
(()=>{"use strict";
if(window.__dyclokPROv65)return;
Object.defineProperty(window,"__dyclokPROv65",{value:true});
const TARGET="DyclokPRO";
const BRAND=/\b(?:DICloak|Dicloak|Dyclokpro|DyclokPropio|Dyclokpropio)\b/g;
function updateTitle(){
 const title=document.querySelector(".custom-titlebar .app-title");
 if(title){
   if(title.textContent!==TARGET+"  |  v6.5")title.textContent=TARGET+"  |  v6.5";
   if(!title.__dyBrandWatch){
     title.__dyBrandWatch=true;
     const watcher=new MutationObserver(()=>{if(title.textContent!==TARGET+"  |  v6.5")title.textContent=TARGET+"  |  v6.5"});
     watcher.observe(title,{characterData:true,childList:true,subtree:true});
   }
 }
 if(document.title!==TARGET+" v6.5")document.title=TARGET+" v6.5";
}
function allowed(element){
 if(!element||element.closest("tbody,.el-table,.el-table__body,.profile-list,[role=grid],input,textarea,pre,code,[contenteditable=true]"))return false;
 return !!element.closest("aside,nav,header,.custom-titlebar,.el-menu,.sidebar,.login,.auth,.el-dialog,.el-drawer,.el-message-box");
}
function rewrite(node){
 if(node.nodeType===3){
   const value=node.nodeValue;
   if(value&&value.length<160&&BRAND.test(value)&&allowed(node.parentElement)){
     node.nodeValue=value.replace(BRAND,TARGET);
   }
   BRAND.lastIndex=0;
 }else if(node.nodeType===1){
   if(node.matches?.("img")&&node.alt&&BRAND.test(node.alt))node.alt=node.alt.replace(BRAND,TARGET);
   BRAND.lastIndex=0;
   if(node.matches?.("input,textarea,pre,code,.el-table,.el-table__body,[contenteditable=true]"))return;
   for(const child of node.childNodes)rewrite(child);
 }
}
let task=false;
function schedule(){
 if(task)return;
 task=true;
 setTimeout(()=>{task=false;updateTitle();if(document.body)rewrite(document.body)},120);
}
function start(){
 updateTitle();rewrite(document.body);
 const watcher=new MutationObserver(schedule);
 watcher.observe(document.body,{childList:true,subtree:true});
 setTimeout(schedule,1800);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();