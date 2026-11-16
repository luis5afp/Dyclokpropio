# DICloak Nativo 0.3.0 — prueba de la columna Almacén

**Esta versión es un laboratorio, no un capturador de sesiones reales.**
Reutiliza DICloak 3.0.7 como único ejecutable visible y conserva los dos
cambios anteriores que suprimen los avisos opcionales de actualización.

## Cambio visible

En la tabla **Perfiles**, aparecerá una columna **Almacén** entre **Estado**
y **Operación**, con un botón **Abrir** por perfil.

Al pulsar por primera vez **Abrir** en una fila, el programa:

1. Identifica la fila mediante `row.id`; no utiliza el número visible.
2. Solicita una respuesta a un servidor HTTP simulado creado exclusivamente
   en `127.0.0.1` (no envía datos a Internet).
3. Guarda los bytes recibidos sin transformación: cabeceras `Set-Cookie`
   **falsas**, cuerpo JSON con credencial/proxy ficticios y archivos TXT/ZIP
   de demostración. Los valores llevan prefijos `FAKE_` o `DEMO`.
4. Abre el Explorador de Windows en la carpeta del perfil:

`%LOCALAPPDATA%\DICloak-Nativo-Almacen-Lab-030\<row.id>\`

La segunda pulsación vuelve a abrir la carpeta, sin repetir los datos de
prueba durante esa ejecución. Cada fila escribe en su propia carpeta.

## Limitación esencial

**NO se interceptan páginas reales, respuestas externas, cookies reales,
sesiones, credenciales o proxies del navegador.** Esta prueba verifica el
recorrido completo **interfaz → IPC del proceso principal → servidor
localhost ficticio → archivo por perfil → Explorador de Windows**.
La asociación con el `row.id` de la fila todavía es un modo laboratorio:
el motor no ha proporcionado una vinculación confiable de cada navegador
activo con una identidad de descarga. No usarlo como prueba de capturar
«todo» lo que recibe un servidor real.

## Protección e instalación

- Instalación independiente en
  `%LOCALAPPDATA%\Programs\DICloak-Nativo-Almacen-Lab-030`.
- No modifica ni desinstala tu DICloak Nativo 0.2.0.
- El nuevo código se empaqueta **dentro de `app.asar`**, no como JS
  externo sin cobertura de integridad. Se conserva el recurso
  `INTEGRITY/ELECTRONASAR` del PE con el nuevo hash y se comprueban los
  fuses de Electron.
- **La firma original Authenticode deja de ser válida al reconstruir el PE.**
  No distribuir como instalador oficial. Se requieren autorización del
  propietario del software y firma propia antes de una publicación estable.
- No se han ejecutado pruebas automáticas con sesiones o perfiles reales.
  Antes de probar en un equipo habitual, respaldar los perfiles y cerrar
  procesos del navegador si es necesario.

## Pruebas

- `node --test tools/test-almacen-native-lab-main.js` valida
  las carpetas, respuestas ficticias y la separación por perfil.
- `.github/workflows/build-dicloak-native-030.yml` reconstruye el ASAR,
  actualiza la referencia de integridad del PE, genera un instalador Windows,
  lo instala en un entorno aislado y prueba el arranque.
- El resultado, si todo finaliza correctamente, se sube únicamente
  como artefacto experimental de GitHub Actions. No se publica Release.

Para validar visualmente, abre dos perfiles de la tabla y pulsa **Abrir**
en la columna Almacén. Cada uno debería abrir una carpeta distinta que
contenga `respuestas-pruebas\<evento>\headers.raw`, `body.raw`
y `archivos\<evento>\ejemplo-lab.txt` o `ejemplo-lab.zip`.
El contenido de prueba debe mantenerse igual, incluidos los bytes binarios.
