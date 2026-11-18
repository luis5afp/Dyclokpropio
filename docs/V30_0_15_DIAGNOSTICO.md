# Dyclokpropio 30.0.15 — diagnóstico ampliado (propuesta)

Base exacta: `v30.0.14` / commit `746dadf2626186042a021fdcb03577b5a0541285`.

## Funciones incorporadas desde el laboratorio 0.4.2

- Mantiene el botón Diagnóstico ya existente y la captura de etapas, fetch/XHR e IPC.
- Al seleccionar **Iniciar** instrumenta temporalmente `node:http.request` y `node:https.request` en el proceso principal. Guarda método, ámbito local/remoto, ruta convertida a plantilla, identificador de correlación generado, estado HTTP, duración y Content-Length declarado.
- En Windows obtiene muestras de procesos descendientes del PID de Electron y sus conexiones TCP/puertos UDP mediante PowerShell cada seis segundos. No registra líneas de comandos de procesos ni rutas ejecutables.
- Observa exclusivamente `userData/dyclok-diagnostic-lab`, creada como carpeta de pruebas; solo registra extensión y tamaño de archivos de laboratorio. **No inspecciona** carpetas de perfiles, cookies ni contenido de archivos.
- Exporta TXT existente y nuevo JSON desde el panel, en la carpeta Descargas.
- Registra duración aproximada de una etapa al emparejar su inicio y fin por nombre, sin asociarla a IDs privados.

## Limitaciones importantes

- Una conexión TCP no demuestra que se haya enviado un archivo. Un evento de fichero local tampoco demuestra transferencia por red.
- No intercepta WebSockets entrantes, clientes HTTP distintos de `node:http(s).request`, tráfico de Chromium externo, tráfico cifrado ni todos los procesos que puedan no ser descendientes directos.
- Los PID, puertos y direcciones IP pueden ser sensibles. Revisar el informe antes de compartirlo.
- La duración de etapas no diferencia perfiles abiertos simultáneamente.
- Solo funciona la observación Windows en Windows, con utilidades PowerShell disponibles.
- Solo hay verificación de código y pruebas automatizadas; la apertura real de perfiles y los flujos de actualización deben comprobarse en Windows.

## Pruebas y entrega

```powershell
node tools/verify-diagnostic-observer.js
node tools/verify-diagnostic-console.js
node tools/verify-open-stage-diagnostics.js
node tools/test-silent-auto-update.js
```

El trabajo se realiza en una rama/PR. **No crear ni publicar la etiqueta v30.0.15 hasta comprobar el instalador NSIS en Windows y confirmar los permisos de redistribución.** El flujo existente `release-safe-base.yml` crea automáticamente la siguiente versión en `main`; la integración en `main` debe realizarse solamente después de pasar las validaciones. El actualizador del programa solo descarga versiones estables posteriores cuya integridad SHA-256 coincida.
