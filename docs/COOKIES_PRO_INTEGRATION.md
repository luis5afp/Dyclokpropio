# Cookies Pro Privada v16.9.10 integrada en Dyclokpropio

## Contenido

La extension MV3 proporcionada por el propietario de este repositorio se
guarda en `bundled-extensions/Cookies-Pro-v16.9.10-runtime.zip` y se extrae
sin modificar a `plugins/.cookies-pro-privada/` durante la compilacion. Tiene acceso a
cookies y paginas web; asegurate de distribuirla solo a quien deba usarla.

El instalador copia `plugins/` fuera de `app.asar` a `resources/plugins/`
despues de ejecutar `node tools/unpack-bundled-extension.js` tras `npm install`.
Su punto de entrada es `src/main/bundled-extension-bootstrap.js` (configurado
con `extraMetadata.main` en `electron-builder.yml`). Este cargador llama al
proceso principal original `dist-electron/main.js` sin modificarlo.

El cargador anade `--load-extension=<ruta-interna-de-la-extension>` a los
procesos Chromium lanzados a traves de `child_process.spawn` o `execFile`.
Respeta otras extensiones ya cargadas y no modifica perfiles, cookies ni
almacenamiento de los usuarios.

## Limitacion de compatibilidad IMPORTANTE

**Esta es una integracion a nivel del proceso lanzador, no una modificacion del
navegador Chromium.** Solo funcionara si el navegador de DICloak se inicia
mediante esas APIs de Node y acepta `--load-extension`. No se interceptan
lanzadores nativos ni procesos disparados desde un servicio externo. Los
Chrome oficiales 137+ ignoran `--load-extension` aunque Chromium y variantes
no oficiales lo siguen admitiendo.

Por esa razon los perfiles existentes y nuevos estan cubiertos por el mismo
mecanismo de arranque, pero NO debe anunciarse la extension como instalada en
el 100 % de los perfiles hasta comprobarla en una instalacion Windows real.
El navegador del perfil debe usar Chromium 130 o superior (`manifest.json`).
Los perfiles ya abiertos requieren cerrarse y abrirse de nuevo.

## Validacion

- `node tools/verify-safe-base.js` (verifica que el runtime original no cambio)
- `npm install --legacy-peer-deps` y `node tools/unpack-bundled-extension.js` (extrae la extension)
- `node tools/verify-build-assets.js` (comprueba el paquete de la extension)
- `node tools/verify-bundled-extension.js` (prueba reglas de argumentos de inicio)
- `npm install --legacy-peer-deps`
- `npx electron-builder install-app-deps`
- `npm run build:win`

### Prueba imprescindible en Windows

1. Instala el `.exe` generado y cierra todos los perfiles.
2. Abre un perfil existente (p. ej. numero 244) y abre `chrome://extensions`.
3. Comprueba que **Cookies Pro Privada 16.9.10** figura habilitada y su icono se
   encuentra visible en el menu de extensiones.
4. Prueba otro perfil existente y luego crea un perfil nuevo y abrelo.
5. Cierra el programa y vuelve a abrir un perfil: la extension debe seguir
   cargandose. Comprueba que las cookies de un perfil no estan visibles en otro.

Si el navegador no se lanza desde Node, hay que integrar la extension en el
modulo nativo de arranque del kernel (o en la configuracion oficial de grupos
de extensiones de DICloak) en lugar de utilizar los flags.
