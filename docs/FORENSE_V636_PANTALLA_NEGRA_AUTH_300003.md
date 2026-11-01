# DyclokPRO v6.36 — análisis de causa raíz: pantalla negra y cierre de sesión al cargar perfiles

**Fecha:** 2026-10-31 (Lima). **Estado:** análisis forense reproducible con binarios de referencia y pruebas Windows; NO es una corrección todavía y NO existe v6.37 publicada.

## 1. Síntomas del usuario
- Captura: ventana negra/oscura con barra de título `DICloak - V3.0.7 | 1.2.4.1`, sin contenido visible de la interfaz.
- Usuario: al iniciar sesión entra, pero al cargar los perfiles vuelve a inicio de sesión.
- Registros anteriores: `POST /v1/env/list` devolvió `code:300003` (`GHOST_USER`) con HTTP 200. La captura nueva **no incluye** el HTTP ni el código; es correlación histórica, no prueba del mismo evento.

## 2. ORIGEN EXACTO DE LA BARRA DE TÍTULO (verificado)

En ambos instaladores originales el `package.json` contiene:
- `version: "3.0.7"`
- `patchVersion: "1.2.4.1"`

La interfaz genera el título con `getLocalVersionInfo()` y el formato `DICloak - V{version} | {patchVersion}`. En v6.28 está en `dist/assets/index-C7Bw2kjt.js` (offset aprox. 2.738.049); en el verdadero 3.0.7 está en `dist/assets/index-CZSYLU7X.js` (offset aprox. 3.526.429).

**Consecuencia:** la barra de título NO certifica qué motor se está ejecutando. La única identificación sólida usa ubicación del proceso y hash del `resources/app.asar`.

SHA-256 verificados:
- v6.28 original: `ef36e6ff2e72b1bacf8174a5e1ba5c5c930b13a229d28f37b8e6822796c5fadd`.
- v6.36 con adaptador (según compilación de la release): `aabad1798fc7bba5391a161a823cd9a875317f587d413fa72f01e8178a26c7e8`.
- 3.0.7 genuino firmado, sin modificar: `b8ca8e2f36753149b23a6d339042bcf91c650e242d84c0d3af98e8141c0d1dcf`.

La marca visual de v6.28 contiene código que cambia el título visible a DyclokPRO; que se vea el título nativo de DICloak puede indicar que ese código no se ejecutó, que la vista no cargó o que otro componente sobrescribió el título. **No demuestra por sí solo una avería gráfica ni identifica el binario instalado**.

## 3. ARQUITECTURA DISTINTA A PESAR DE LA MISMA VERSIÓN

Binarios extraídos con SHA de instalador verificado:
- EXE DyclokPRO v6.28 `954016364fe3e4c1a41b54d810388f8ca79d67a184d3ad25993b74c2d2b1c606`.
- EXE DICloak oficial 3.0.7 `01b412f603b1aeb0a9f479476d4dca2f1fe653c7d35b344a6fb59b45d1cc93ae`.

| Componente | Base v6.28/v6.36 | Oficial 3.0.7 |
| --- | --- | --- |
| `dist-electron/main.js` | 47.650 bytes (v6.28), SHA `199b1a514ea2f4c6d395315bbf022182cd56fc26c12babd061063586b999cbb6` | 7.703 bytes, SHA `4ce4de9dcf1b76f92a56d05622eec84c97dfddb582d8c97ebe6fea2c5b595d72` |
| `dist/assets/index-*.js` | `index-C7Bw2kjt.js`, 2.745.700 bytes | `index-CZSYLU7X.js`, 3.535.796 bytes |
| Versionado | 3.0.7 en manifiesto por experimento; lógica antigua 2.8.17 | Manifiesto y módulos genuinos 3.0.7 |
| Autenticación | `X-Version`, token y equipo de la generación antigua | Canal nuevo de firmas y codificación; fuente distinta |
| Eventos de `300003` | Al recibir `GHOST_USER`, el código antiguo activa `LOGOUT_STOP_ENV_SUCCESS` | `GHOST_USER` se delega al nuevo `handleGhostUser` |

## 4. DIFERENCIA CRÍTICA EN `POST /v1/env/list` (CANDIDATA A CAUSA RAÍZ)

**Código antiguo:** en el bundle `index-C7Bw2kjt.js` se llama al endpoint `/v1/env/list` con `noLoading` y `isRetry`, sin el parámetro `payloadCodec` usado por la nueva generación. En los componentes viejos aparecen referencias a `X-Version`, pero no se encontraron referencias literales a `X-DC-M1` ni `X-DC-M2`.

**Código oficial 3.0.7:** `index-CZSYLU7X.js` añade un codificador de carga `payloadCodec` a la misma solicitud. El programa oficial contiene el módulo específico `dist-electron/openapi/appVersionHeaders-B8wop-qt.js`, referencias explícitas a `X-DC-M1` y `X-DC-M2`, y un gestor propio de `GHOST_USER`. Este módulo NO existe en el paquete antiguo.

**Inferencia fundamentada:** falsificar solo `package.json.version=3.0.7` no instala el protocolo nuevo. Si el servidor requiere esa arquitectura, podrá rechazar el listado de perfiles con `300003`. **No demostrar causalidad definitiva sin examinar el código HTTP de esa petición en una sesión real autorizada.** No intentar recrear firmas, tokens ni respuestas de autorización.

## 5. PANTALLA NEGRA — AÚN SIN CAUSA DEMOSTRADA

El instalador v6.36 añadió `compat307-backend.js` al prelude `main.js` y `dyclokpro-compat307.js` al HTML. Las verificaciones anteriores compararon hashes de fuentes protegidas, pero **solo ejecutaron `--dyclok-self-test`**, que sale del proceso antes de completar el inicio gráfico. NO verificaron `did-finish-load`, `dom-ready`, errores de preload, cierres del renderer o contenido del DOM.

Hipótesis a separar con evidencia:
1. Fallo de carga `file://...` o de un recurso `app.asar.unpacked`.
2. Excepción del renderer durante Vue/login, o al volver al inicio de sesión.
3. Renderizador GPU/hardware acceleration (no atribuirlo por defecto: la imagen muestra la ventana principal, no necesariamente una ventana de perfil Chromium).
4. Instalación equivocada/shortcut a otro `DICloak.exe`; la barra de título es idéntica en ambos motores.

Para comprobarlo en una compilación de diagnóstico deben capturarse **solo eventos y códigos** de `webContents`: `did-fail-load`, `did-finish-load`, `render-process-gone`, `preload-error`, `unresponsive` y estado del DOM (sin copiar el DOM ni cookies), con consentimiento del usuario. Documentación oficial Electron: https://www.electronjs.org/docs/latest/api/web-contents

## 6. HERRAMIENTA DE DIAGNÓSTICO INMEDIATO — SIN CAMBIAR EL PROGRAMA

`tools/Diagnostico_Motor_v637.ps1` enumera procesos de DICloak/DyclokPRO y calcula únicamente SHA256 de los `app.asar` de instalación, clasificando exactamente v6.28, v6.36 o 3.0.7 oficial. No lee las líneas de comandos, sesiones, cookies, tokens, perfiles, contraseñas ni solicitudes HTTP, no cierra procesos.

Ruta del informe local por defecto: `%TEMP%\DyclokPRO_Diagnostico_Motor.txt`.

Prueba automatizada Windows: https://github.com/luis5afp/Dyclokpropio/actions/runs/41266464756 — success.

## 7. CONCLUSIÓN Y CRITERIOS PARA LA SOLUCIÓN

- Mantener las **funciones de UI** de v6.28 como requisitos del producto, pero no usar el antiguo cliente autenticador renombrado como sustituto del 3.0.7 oficial.
- Arquitectura propuesta: motor genuino 3.0.7 **íntegro** para autenticación y perfiles; capa DyclokPRO separada para pestañas de interfaz, nombres y archivo mediante APIs autorizadas. No inyectar en `app.asar` protegido ni crear firmas de solicitudes.
- Ajustar el diseño al soporte oficial de sesiones/cuentas concurrentes; perfiles múltiples y cuentas múltiples del cliente no son necesariamente equivalentes.
- En paralelo aislar la causa del renderer negro mediante la fuente del proceso y los eventos de Electron; no publicar otra versión que solo pase `--self-test`.
- **Puerta de publicación:** pruebas reales de UI visible, login, listado y apertura de perfiles, y prueba de persistencia de cuentas. El archivado de `300003` se ha corregido, pero no modifica la respuesta del servidor ni arregla la sesión.

**NO se ha publicado ni confirmado una corrección v6.37.** Se ha documentado la diferencia real de motores y preparado un diagnóstico local seguro.
