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
Intenta fijar el icono automaticamente en la barra de herramientas junto al
menu de extensiones. Para ello, antes de abrir cada perfil, agrega el ID de
Cookies Pro Privada a `extensions.pinned_extensions` en las `Preferences`
de Chromium, **solo si el lanzador indica explicitamente una ruta
`--user-data-dir`**. Conserva los demas iconos fijados, el resto de la
configuracion y todas las cookies, y no cambia politicas globales de Chrome.

Si un perfil ya esta abierto o protegido contra escritura, o si su kernel
utiliza un formato de preferencias diferente, este metodo puede no surtir
efecto. La aplicacion no debe impedir abrir el navegador por un fallo al fijar.
No se garantiza que Chrome respete ajustes externos en sus preferencias.

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
3. Comprueba que **Cookies Pro Privada 16.9.10** figura habilitada y que el
   icono de galleta aparece **fijado en la barra**, junto a la pieza del
   menu de extensiones, sin tener que abrir el menu.
4. Prueba otro perfil existente y luego crea un perfil nuevo y abrelo.
5. Cierra el programa y vuelve a abrir un perfil: el icono debe seguir
   fijado y la extension debe seguir cargandose. Comprueba que las cookies de un perfil no estan visibles en otro.

Si el navegador no se lanza desde Node, hay que integrar la extension en el
modulo nativo de arranque del kernel (o en la configuracion oficial de grupos
de extensiones de DICloak) en lugar de utilizar los flags.

## Diagnostico del icono fijo

Si la extension figura en `chrome://extensions` pero no aparece el icono en la barra, primero revisa si el navegador usa un lanzador nativo o no recibe `--user-data-dir`. En ese caso hay que integrar la instalacion y el pin directamente en el kernel / administrador de perfiles de DICloak. El metodo general de Chrome Enterprise `ExtensionSettings.toolbar_pin=default_pinned` existe, pero no se aplica aqui: seria una politica del navegador/sistema, no exclusiva de los perfiles Dyclokpropio. Tampoco alteramos preferencias mientras un perfil esta abierto.
