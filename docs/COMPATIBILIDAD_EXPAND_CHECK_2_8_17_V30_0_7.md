# Dyclokpropio v30.0.7 — compatibilidad EXPAND_CHECK 2.8.17

## Alcance comprobado
Se examinó el instalador original 2.8.17 aportado por el usuario. Se reconstruyó su 7z y se extrajo `app.asar`; el JS de renderer 2.8.17 coincide con el SHA-256 `711358b0f8eea819858186a2b3f4df6546598c7525cd2dd4506fd30c65fcbdd1` registrado en su ASAR. El renderer del runtime 3.0.0 tiene SHA-256 `7de2a353b92c130b93b5c455826efaa6e1c8788cf44f99185b450e61379dc0df`.

Las diferencias identificadas de `EXPAND_CHECK` explican por qué `EXPAND_DOWNLOAD_FAIL` podía aparecer en 3.0.0 incluso sin un registro fallido del descargador. Son un **candidato plausible**, no una prueba de la causa específica en la computadora del usuario.

## Cambio controlado que se incorpora a v30.0.7

1. Separar la política explícita `blockOnPluginDownloadFail` de la comprobación de integridad, igual que en 2.8.17. No se fuerza el bloqueo por falta de una extensión solo por haber activado la política de integridad. **La comprobación de integridad sigue siendo obligatoria por separado.**
2. Si está activada la política de bloqueo y falta una extensión requerida, devolver el código específico histórico `PLUGIN_DOWNLOAD_FAIL_BLOCKED` en lugar de agruparlo en `EXPAND_DOWNLOAD_FAIL`.
3. Si faltan valores para preparar hashes, no abortar anticipadamente antes de solicitar la validación al servidor. Enviar los valores locales **reales**, aunque estén vacíos; el servidor debe verificar y aprobar los hashes, o `EXPAND_SHA256_CHECK_FAIL` sigue bloqueando la apertura. Nunca simular un hash o un resultado válido.
4. Conservar los manejadores originales de descarga, la verificación SHA-256 de plugins y navegador, el endpoint de validación de hashes, y la comprobación del resultado remoto. No se cambian los grupos asignados ni se eliminan perfiles.
5. Cookies Pro Privada automática **continúa desactivada** como en v30.0.6, para no mezclar esta prueba con otro cambio.

La parte nueva de descarga/reintento y todas las demás funciones 3.0.0 permanecen tal como estaban. **No se está sustituyendo todo el navegador 3.0.0 por la versión 2.8.17**: se transporta la semántica relevante de `EXPAND_CHECK` al renderer 3.0.0.

## Compilación verificable

- El archivo original del renderer queda **sin modificar en Git**.
- `tools/apply-legacy-expand-check.js` valida su SHA-256 original, ubica exactamente los cuatro puntos de cambio, verifica que el código SHA-256/validación remota permanece presente y comprueba el SHA-256 resultante esperado (`04aeafcf291e98d4ab2f632f77c49d21d5cfda3c813addbc433fd8dd2a3cf37b`).
- El parche solo se aplica al directorio temporal de compilación Windows **después** de verificar la integridad de la base original. Si el runtime cambia inesperadamente, el proceso aborta y no publica ningún EXE.
- La prueba `tools/verify-legacy-expansion-compat.js` ejecuta el handler real extraído del renderer transformado y comprueba que la validación de hashes todavía impide abrir perfiles con hashes rechazados.

## Prueba en Windows

1. Respalda los perfiles y cierra completamente todas las instancias viejas antes de instalar el EXE v30.0.7.
2. Prueba primero el perfil 243, después 244 y 240. No cambies grupos ni borres la caché.
3. Si abren, comprueba también que siguen cargándose las extensiones **necesarias** y que el estado/cookies de un perfil no aparece en otro.
4. Si aparece `PLUGIN_DOWNLOAD_FAIL_BLOCKED`, identifica la extensión obligatoria pendiente en Extensiones → Gestión de grupos. No desactives ese bloqueo por tu cuenta.
5. Si aparece `EXPAND_SHA256_CHECK_FAIL`, un hash o recurso interno no supera la verificación. No se debe suprimir esa comprobación.
6. Si persiste `EXPAND_DOWNLOAD_FAIL`, registra el error e investiga IPC, servidor y ruta de datos; la regresión podía tener más de un factor.

**Límite:** GitHub CI y smoke tests de Windows no prueban los datos de los perfiles ni el servicio remoto del usuario. La v30.0.7 es una prueba controlada de compatibilidad, no una garantía de que todos los perfiles abran.
