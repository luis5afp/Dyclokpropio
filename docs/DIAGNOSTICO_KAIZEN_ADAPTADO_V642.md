# DyclokPRO v6.42 — adaptación de diagnóstico KAIZEN para motor oficial 3.0.7

## Fuentes aportadas
Se revisaron `KAIZEN_PC_Codigo_Diagnostico_Kit.zip` y `KAIZEN-Codigo-Fuente-Diagnostico.zip`. Contienen los módulos de KAIZEN `connectionCapture.js`, `profileChromeCapture.js`, `extensionSnapshot.js`, `passiveResponseCapture.js`, `main.no-updates.js` y `preload.min.js`. Este trabajo no modifica los originales ni copia sus parámetros privados.

**Diferencia de arquitectura:** las fuentes de KAIZEN capturan eventos desde el proceso principal de SU Electron (`http.request`, webRequest, DevTools/CDP y subprocess spawn). Integrarlas dentro de `DICloak.exe` exigiría modificar su `app.asar` oficial; eso puede romper la integridad, autenticación o actualizaciones.

## Implementación no intrusiva
`release-build/v6.35/Launcher/NativeNetLogCapture.cs` integra el **NetLog nativo de Chromium** en el lanzador DyclokPRO, sin modificar una sola solicitud HTTP ni respuesta. Al estar habilitado, en el siguiente inicio del motor añade exclusivamente estos flags:

```text
--log-net-log=<carpeta/de/la/cuenta>/<fecha>.netlog.json
--net-log-capture-mode=Default|Everything
--net-log-max-size-mb=256
--net-log-duration=900
```

La captura `Everything` puede contener datos sin cifrar altamente confidenciales, cookies, tokens, encabezados de firma y bytes de red. Está **desactivada por defecto**, requiere habilitarse en el diálogo de DyclokPRO y una segunda confirmación explícita para modo completo. No se transmiten logs a terceros. El lanzador intenta usar ACL de Windows para limitar el acceso a la carpeta al usuario actual, SYSTEM y Administradores, y desactiva el registro si no consigue restringirla.

La carpeta con el nombre visible de la cuenta se crea en:

```text
%LOCALAPPDATA%/DyclokPRO/Cuentas/<id>/Diagnostico/<nombre_de_cuenta>_<id_corto>/<AAAA-MM-DD>/
  <fecha>_<id>.netlog.json        [original de Chromium sin modificar]
  <fecha>_<id>.netlog.info.json   [manifest sin secretos]
```

En la carpeta nombrada también hay `eventos-proceso.jsonl` con los eventos de arranque/cierre y códigos de salida (no incluye contenidos privados). El alias proviene del nombre local configurado en DyclokPRO. **No se extrae automáticamente la identidad del servidor**.

### Uso
1. Abre la cuenta y en `⋯` selecciona **Capturar conexiones originales (KAIZEN)**, o abre Diagnóstico lateral → Conexiones.
2. Activa **registro en el próximo inicio** y selecciona modo normal o completo; confirma expresamente el completo.
3. Cierra la cuenta de manera normal y vuelve a abrirla desde el botón `+`. Solo entonces se agregan los flags y empieza la captura.
4. Reproduce el problema durante los 15 minutos siguientes y abre la carpeta con su nombre; consulta el archivo NetLog generado por Chromium.
5. Desactiva nuevas capturas cuando termines y protege el directorio existente. No envíes logs a nadie sin revisar información sensible.

### Límites (no prometer captura total)
- NetLog **no captura todos los cuerpos POST** ni necesariamente el tráfico de biblioteca Node.js, extensiones de perfil externas o navegadores secundarios gestionados por DICloak.
- No realiza interceptación SSL, MITM, inyección de JavaScript, proxy, descifrado de TLS ajeno ni reescribe solicitudes.
- Es un registro de eventos originales de Chromium, no una copia exacta de todos los bytes transmitidos por todas las partes del programa.
- No puede activarse retrospectivamente para una cuenta ya iniciada; exige reiniciar su proceso.
- El tamaño se limita a 256 MB por archivo y la duración a 15 minutos. Chromium puede ignorar flags no compatibles con esa compilación.
- `Everything` puede contener contraseñas y cookies en texto claro. La ACL limita el acceso pero NO cifra automáticamente los archivos.

## Verificación
El flujo `.github/workflows/verify-integrated-642.yml` verifica que:
1. La opción está desactivada por defecto y se validan los nombres seguros.
2. El motor oficial 3.0.7 genera el archivo original al arrancar con los flags.
3. Las cuentas siguen utilizando directorios aislados; la interfaz y el teclado no retroceden.
4. El ejecutable y el `app.asar` originales permanecen byte a byte iguales.

**Documentación de Chromium:** https://www.chromium.org/for-testers/providing-network-details/

**Microsoft — limitaciones de NetLog:** https://learn.microsoft.com/en-us/troubleshoot/entra/entra-id/app-integration/use-netlog-capture-network-traffic
