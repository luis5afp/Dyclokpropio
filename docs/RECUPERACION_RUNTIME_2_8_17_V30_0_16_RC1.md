# v30.0.16-rc1 — restauración experimental del runtime 2.8.17

## Hipótesis y alcance

El usuario confirma que el instalador `Dyclokpropio_2.8.17_win_x64.exe.exe` abría los perfiles 244/243/240; en la compilación experimental `v30.0.15-rc1` la UI se abre pero el estado `Abriendo…` vuelve a `Abrir` sin ventana Chromium. El smoke test separado de 30.0.15 también falla con `TypeError ... null (reading 'stdin')`, posiblemente un error secundario durante la salida. No atribuir causalidad sin eventos de apertura.

El instalador antiguo SHA256 `61e53a27a492834abe9377b75714293bdb4b9a39c603bba924cf9b5ac171e265` contiene un archivo 7z embebido en offset 436311. Se pudo extraer el ASAR original (sin ejecutarlo): SHA256 `b44f85af91210ed348327932b919bf06ed9d7ae39d303fffe73a633c1477e379`. Su `main.js` SHA256 `7505d30613fcd823590803a2cfae8271c8c0988e1f486fb5be9e486c49b7d2be`, bundle `main-D3DCTpfx.js` SHA256 `50e4a2c141322a4258863036516e61c297878f0199b5cd9999912df0582558e4`, preload SHA256 `3cd018705e5b447ee77a053ba7d791f07ed734264ff234e9296dfc140b98193f`. NO son compatibles por simple sustitución individual con los bundles 3.0.0 de 30.0.15.

## Estrategia de la primera variante local

Se preparó un kit de compilación Windows x64 `Dyclok_v30.0.16-rc1_RECUPERACION_2.8.17_COMPILAR_EN_WINDOWS.zip`, entregado directamente al usuario (no contiene ni sube binarios de terceros). Este kit:

1. Requiere el instalador 2.8.17 local exacto y verifica su SHA256.
2. Extrae su archivo 7z interno mediante `7za.exe` existente de la compilación anterior.
3. Conserva **juntos** `resources/app.asar`, `resources/app.asar.unpacked/`, `DICloak.exe`, `Chromium/`, `plugins/`, `DicSyncService.exe` y dependencias y rutas originales del instalador, comprobando el SHA256 de `app.asar`.
4. Omite `SourceData/`, `Chromium/User Data/`, `Chromium/Application/SetupMetrics/` y `resources/CookiesTemplate/` para impedir que se incluyan datos de cookies, historial, contraseñas, metricas o sesiones del instalador antiguo. Elimina `resources/app-update.yml` para impedir la actualización accidental del prototipo.
5. Genera, mediante NSIS `makensis.exe` ya instalado por electron-builder, un instalador **aparte**: `Dyclokpropio_30.0.16-rc1_LEGADO_PRUEBA_win_x64.exe`. Conserva el binario interior `DICloak.exe` (nombre y runtime originales); no copia el código 3.0.0 ni promete sus nuevas funciones. No toca directamente otras instalaciones ni perfiles; tiene desinstalación dirigida a la carpeta separada y archivos instalados, no a `%APPDATA%`.
6. Exige copia de seguridad antes de instalar/ejecutar: aunque se instale en otra carpeta, el runtime viejo puede apuntar al `userData` compartido.

## Límites y controles de publicación

Este enfoque es una **línea base de diagnóstico**, NO una fusión definitiva y tampoco está verificado en Windows. No se publica release de v30.0.16 ni se cambia `latest`. No se publican los binarios originales porque incluyen componentes de terceros sujetos a derechos de redistribución. La ausencia de `SourceData` original o `CookiesTemplate` podría impedir la inicialización: si así sucede, construir una plantilla totalmente limpia, nunca copiar las bases de datos de cookies/historial del instalador anterior.

Antes de añadir funciones nuevas o declarar éxito: probar 244, luego 243 y 240, comprobar ventana real de Chromium y proceso `ginsbrowser.exe`; comparar eventos de apertura y solo entonces portar cambios de la versión 30.x individualmente con pruebas de regresión.

Repositorio base de v30.0.15: `feature/v30-0-15-rc1-chromium-142-reconstruccion-20261026`. Este experimento se mantiene aislado para no cambiar una versión en producción.
