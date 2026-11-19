'use strict';
/**
 * Pure, privacy-preserving opening audit. Every input event must already have
 * passed validateDiagnostic(). Never inspect response bodies, cookie values,
 * passwords, 2FA codes or authentication headers. Hashing a secret without a
 * shared, server-side proof does not establish successful application.
 */
const PHASES=Object.freeze([
  {key:'configuration',label:'Configuración del perfil',stages:['stage_fetch_env_info','stage_backend_data_fetch']},
  {key:'proxy',label:'Configuración del proxy',stages:['stage_pre_proxy_check','stage_proxy_check','stage_proxy_check_result']},
  {key:'cookiePlan',label:'Preparación de cookies',stages:['stage_cookie_encrypt_plan']},
  {key:'storage',label:'Almacenamiento',stages:['stage_localstorage_sync','stage_indexeddb_sync']},
  {key:'extensions',label:'Extensiones',stages:['stage_expand_check','stage_extension_download']},
  {key:'fingerprint',label:'Huella digital',stages:['stage_params_merge','stage_merge_env_params_rpa']},
  {key:'browserOpen',label:'Apertura del navegador',stages:['stage_open_env','stage_browser_start']}
]);
const COVERAGE=Object.freeze({
  mainElectronHTTP:'partial_node_http_request_only',
  chromiumNetwork:'not_captured_by_http_observer',
  fullTrafficCapture:false,
  chromiumToProfileIdentity:'not_verified',
  receivedPayloadIntegrity:'not_verified_without_server_and_client_proofs',
  credentialsRestoration:'not_verified',
  cookieRestoration:'not_verified',
  proxyExitAuthentication:'not_verified',
  twoFactorAuthentication:'not_verified',
  secretValuesStored:false
});
function stageState(events,stages){
  const matching=events.filter(e=>e.stage&&stages.includes(e.stage));
  const completed=matching.filter(e=>e.event==='operation_step_completed');
  const failed=matching.filter(e=>e.event==='operation_step_failed');
  return {
    status:failed.length?'failed_stage':completed.length?'stage_completed':'not_observed',
    completedStages:[...new Set(completed.map(e=>e.stage))],
    failedStages:[...new Set(failed.map(e=>e.stage))],
    // Some stages are alternatives in different kernel/renderer flows.
    effectVerified:false
  };
}
function makeOpeningAudit({events=[],counters={},checks={}}={}){
  const safe=Array.isArray(events)?events:[];
  const stages=Object.fromEntries(PHASES.map(p=>[p.key,{label:p.label,...stageState(safe,p.stages)}]));
  const starts=safe.filter(e=>e.event==='capture_started');
  const ends=safe.filter(e=>e.event==='capture_finished');
  const opened=safe.filter(e=>e.event==='operation_open_requested');
  const requests=new Map(),orphans=[];
  for(const e of safe){
    if(!['native_http_request','native_http_response','native_http_transfer','native_http_error'].includes(e.event))continue;
    if(!e.requestId){orphans.push({event:e.event,at:e.at});continue;}
    let r=requests.get(e.requestId);
    if(!r){r={requestId:e.requestId,firstObservedAt:e.at,method:null,
      routeTemplate:null,scope:null,association:null,status:null,
      responseMs:null,outboundBodyBytesQueued:null,inboundBodyBytesObserved:null,
      transferState:null,peerIp:null,peerPort:null,
      authorizationHeaderPresent:null,cookieHeaderPresent:null,
      proxyAuthorizationHeaderPresent:null,setCookieHeaderPresent:null,
      requestObserved:false,responseObserved:false,transferObserved:false,
      errorObserved:false};requests.set(e.requestId,r);}
    if(!r.method&&e.method)r.method=e.method;
    if(!r.routeTemplate&&e.routeTemplate)r.routeTemplate=e.routeTemplate;
    if(!r.scope&&e.scope)r.scope=e.scope;
    if(e.captureRelation==='ambiguous')r.association='ambiguous';
    else if(!r.association&&e.captureRelation)r.association=e.captureRelation;
    if(e.event==='native_http_request')r.requestObserved=true;
    if(e.event==='native_http_response'){
      r.responseObserved=true;
      if(Number.isInteger(e.status))r.status=e.status;
      if(Number.isInteger(e.elapsedMs))r.responseMs=e.elapsedMs;
      if(e.peerIp)r.peerIp=e.peerIp;
      if(Number.isInteger(e.peerPort))r.peerPort=e.peerPort;
    }
    if(e.event==='native_http_error')r.errorObserved=true;
    if(e.event==='native_http_transfer'){
      r.transferObserved=true;
      r.transferState=e.transferState||null;
      for(const [source,dest] of [
        ['outboundBodyBytesQueued','outboundBodyBytesQueued'],
        ['inboundBodyBytesObserved','inboundBodyBytesObserved'],
        ['requestAuthorizationPresent','authorizationHeaderPresent'],
        ['requestCookiePresent','cookieHeaderPresent'],
        ['requestProxyAuthorizationPresent','proxyAuthorizationHeaderPresent'],
        ['responseSetCookiePresent','setCookieHeaderPresent']
      ])if(e[source]!==undefined)r[dest]=e[source];
    }
  }
  const http=[...requests.values()];
  const summary={
    events:safe.length,requests:http.filter(r=>r.requestObserved).length,
    responses:http.filter(r=>r.responseObserved).length,
    requestsWithoutObservedResponse:http.filter(r=>r.requestObserved&&!r.responseObserved).length,
    requestsWithoutObservedOutcome:http.filter(r=>r.requestObserved&&!r.responseObserved&&!r.errorObserved).length,
    errors:http.filter(r=>r.errorObserved).length,
    transferSummaries:http.filter(r=>r.transferObserved).length,
    browserProcesses:safe.filter(e=>e.event==='native_process_seen'&&e.processClass==='browser').length,
    sampledConnections:safe.filter(e=>e.event==='native_connection_seen').length,
    concurrentAmbiguityEvents:safe.filter(e=>e.captureRelation==='ambiguous').length
  };
  const timeline={
    firstOpeningRequestedAt:opened[0]?.at||null,
    captureStartedAt:starts[0]?.at||null,
    captureFinishedAt:ends.at(-1)?.at||null,
    captureFinishReason:ends.at(-1)?.finishReason||null,
    coverageStartedBeforeOpen:Boolean(starts[0]&&opened[0]&&
      Date.parse(starts[0].at)<=Date.parse(opened[0].at)),
    captureRunningAtExport:starts.length>ends.length
  };
  const verification={
    proxyConfigurationStage:stages.proxy.status,
    cookiesPreparationStage:stages.cookiePlan.status,
    browserOpenStage:stages.browserOpen.status,
    browserProcessObserved:summary.browserProcesses>0,
    credentialsApplied:'not_verified',
    cookiesApplied:'not_verified',
    proxyAuthenticated:'not_verified',
    twoFactorCompleted:'not_verified',
    serverToClientPayloadEqual:'not_verified_without_paired_proofs'
  };
  return {
    schema:1,purpose:'opening_traffic_metadata_audit',
    timeline,summary,stages,http,orphans,verification,
    coverage:{...COVERAGE},
    notes:[
      'Resultados de etapas no demuestran aplicación correcta de credenciales, cookies o proxy.',
      'El observador HTTP no cubre todo el tráfico Chromium ni Node fetch/WebSockets.',
      'La ausencia de respuesta observada no implica necesariamente error del servidor.',
      'IP/puerto pueden corresponder a un proxy y la asociación al perfil es temporal.',
      'No contiene contraseñas, tokens, cookies, códigos 2FA ni cuerpos HTTP.',
      'Para verificar igualdad de contenido se necesitan comprobantes del servidor y cliente de confianza.'
    ]
  };
}
function renderAuditTXT(report){
  const a=report.audit||makeOpeningAudit(report);
  const lines=[
    'diloakPRO | Auditoría de comunicación y apertura | METADATOS',
    'Generado (UTC): '+(report.exportedAt||'sin fecha'),
    'Versión: '+(report.delivery||'no informada'),
    '',
    'CAPTURA',
    'Inicio: '+(a.timeline.captureStartedAt||'sin registro'),
    'Operación Abrir: '+(a.timeline.firstOpeningRequestedAt||'sin registro'),
    'Fin: '+(a.timeline.captureFinishedAt||'sin registro'),
    'Inicio previo a Abrir: '+(a.timeline.coverageStartedBeforeOpen?'sí':'no confirmado'),
    'Motivo de fin: '+(a.timeline.captureFinishReason||'no observado'),
    '',
    'RESUMEN HTTP Y PROCESOS',
    'Solicitudes Node observadas: '+a.summary.requests,
    'Respuestas observadas: '+a.summary.responses,
    'Solicitudes sin respuesta registrada: '+a.summary.requestsWithoutObservedResponse,
    'Sin resultado observado: '+a.summary.requestsWithoutObservedOutcome,
    'Errores: '+a.summary.errors,
    'Procesos navegador observados: '+a.summary.browserProcesses,
    'Conexiones muestreadas: '+a.summary.sampledConnections,
    'Eventos de asociación ambigua: '+a.summary.concurrentAmbiguityEvents,
    '',
    'ETAPAS (completadas NO implican configuración aplicada)'
  ];
  for(const [key,s] of Object.entries(a.stages)){
    lines.push(key+' | '+s.label+' | '+s.status+' | comprobado en Chromium: NO');
  }
  lines.push('','SOLICITUDES Y RESPUESTAS (rutas anonimizadas)');
  for(const r of a.http){
    lines.push([r.firstObservedAt,r.method||'?',r.routeTemplate||'?',
      r.status??'sin HTTP',r.responseMs==null?'sin duración':r.responseMs+' ms',
      r.responseObserved?'respuesta observada':r.errorObserved?'error observado':'sin respuesta observada',
      'salida='+String(r.outboundBodyBytesQueued??'?'),
      'entrada='+String(r.inboundBodyBytesObserved??'?'),
      r.association||'sin asociación'].join(' | '));
  }
  lines.push('','VERIFICACIÓN PENDIENTE',
    'Credenciales: no verificadas.',
    'Cookies: no verificadas.',
    'Autenticación del proxy: no verificada.',
    '2FA: no verificado.',
    'Asociación exacta del proceso Chromium con el perfil: no verificada.',
    'La comparación byte a byte exige pruebas coordinadas en servidor y cliente.',
    'El informe no guarda contenidos, secretos ni valores reutilizables.',
    '','COBERTURA: Node http(s).request (parcial), fases UI y muestreo Windows.',
    'Sin captura íntegra de red de Chromium, fetch ni WebSocket.',
    '');
  return lines.join('\r\n');
}
module.exports={makeOpeningAudit,renderAuditTXT,PHASES,COVERAGE};
