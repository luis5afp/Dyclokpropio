'use strict';
/**
 * Content-safe network diagnostics. The only URL values exported are the
 * hostname, allowlisted static path words, and structural counts. Query
 * values, IDs, credentials, arbitrary path segments and response bodies
 * never pass through this module.
 */
const net=require('node:net');
const ROUTE_WORDS=new Set([
 'api','gin','openapi','v1','v2','v3','v4','v5','v6','env','envs',
 'profile','profiles','request','start','stop','open','close',
 'login','logout','sync','data','local','remote','status','config',
 'info','list','update','version','download','upload','check',
 'proxy','browser','extension','extensions','user','users','get',
 'set','settings','health','events','session','sessions','http',
 'auth','files','file','desktop','windows','gateway','network',
 'resource','resources','storage','cookie','cookies','verify',
 'verifycode','challenge','fingerprint','kernel','service',
 'account','accounts','security','connect','connection',
 'bootstrap','initialize','register','tokens','token',
 'history','navigate','navigation','script','scripts','assets',
 'static','manifest','favicon','json','css','js'
]);
const MIME=new Set([
 'application/json','application/problem+json','application/xml',
 'application/javascript','application/wasm','application/octet-stream',
 'application/x-www-form-urlencoded','application/pdf',
 'text/html','text/plain','text/css','text/javascript','text/xml',
 'image/png','image/jpeg','image/gif','image/webp','image/svg+xml',
 'font/woff','font/woff2','multipart/form-data',
 'application/vnd.diloakpro-lab+json'
]);
const CONTENT_ENCODING=new Set(['gzip','br','deflate','identity','zstd']);
const KNOWN_QUERY_KEYS=new Set(['page','limit','offset','size','sort','order','lang','language','version']);
const HTTP_PROTOCOLS=new Set(['http/1.0','http/1.1','h2','h3','http/2','http/3','quic','http']);
function safeHostname(raw){
 if(typeof raw!=='string'||!raw||raw.length>200)return null;
 let h=raw.toLowerCase().trim();
 // Only strip a numeric port, not credentials, paths, query strings or fragments.
 if(h.startsWith('[')){
   const match=h.match(/^\[([0-9a-f:.]+)\](?::\d{1,5})?$/);
   if(!match||net.isIP(match[1])!==6)return null;
   return match[1];
 }
 if(net.isIP(h))return h;
 const portMatch=h.match(/^([^:@/?#\\]+):(\d{1,5})$/);
 if(portMatch)h=portMatch[1];
 if(h.length>180||h.includes('..')||h.startsWith('-')||h.endsWith('-')||
    !/^(?:[a-z0-9-]{1,63}\.)*[a-z0-9-]{1,63}$/.test(h))return null;
 return h;
}
function describePath(pathname,search=''){
 const parts=typeof pathname==='string'?pathname.split('/').filter(Boolean).slice(0,10):[];
 let masked=0;
 const template='/'+parts.map(raw=>{
   // Only ASCII alphanumeric static terms known to be structural.
   // Never decode URI segments, IDs or arbitrary names into reports.
   const safe=String(raw).toLowerCase();
   if(ROUTE_WORDS.has(safe))return safe;
   masked++;return ':id';
 }).join('/');
 let keys=[];
 if(typeof search==='string'&&search.length<=16000){
   try{
     const query=new URLSearchParams(search.startsWith('?')?search.slice(1):search);
     keys=[...new Set([...query.keys()].map(x=>x.toLowerCase()).filter(x=>KNOWN_QUERY_KEYS.has(x)))].slice(0,9);
   }catch{}
 }
 const area=parts.map(x=>String(x).toLowerCase()).find(x=>
   ['proxy','cookie','cookies','session','auth','login','env',
    'profile','profiles','storage','fingerprint','network','gateway'].includes(x))||'other';
 return {routeTemplate:template,routeDepth:parts.length,routeMaskedSegments:masked,
   queryKeyNames:keys,endpointArea:area};
}
function safeMime(value){
 if(typeof value!=='string'||value.length>250)return 'other';
 const media=value.split(';',1)[0].trim().toLowerCase();
 return MIME.has(media)?media:'other';
}
function safeEncoding(value){
 if(typeof value!=='string'||value.length>60)return 'other';
 return CONTENT_ENCODING.has(value.trim().toLowerCase())?value.trim().toLowerCase():'other';
}
function safeHttpProtocol(value){
 if(typeof value!=='string'||value.length>20)return 'other';
 return HTTP_PROTOCOLS.has(value.toLowerCase())?value.toLowerCase():'other';
}
function statusClass(value){
 return Number.isInteger(value)&&value>=100&&value<=599?
   Math.floor(value/100)+'xx':'unknown';
}
module.exports={safeHostname,describePath,safeMime,safeEncoding,safeHttpProtocol,statusClass};
