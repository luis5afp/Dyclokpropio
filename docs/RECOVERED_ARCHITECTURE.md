# Arquitectura recuperada de Dyclokpropio

> Este documento describe lo que se pudo recuperar del instalador. No representa el proyecto fuente original.

## 1. Tecnología identificada

- Electron 31.7.7
- Vue 3
- Vite (salida compilada en `dist/`)
- Node.js/CommonJS para el proceso principal
- `electron-builder` + NSIS para generar el instalador de Windows

## 2. Puntos de entrada

### Proceso principal de Electron

- `dist-electron/main.js`: wrapper original ofuscado.
- `dist-electron/main.readable.js`: reconstrucción legible del wrapper, añadida durante la recuperación.
- `dist-electron/main-CuCOh59n.js`: bundle principal recuperado (~5.9 MB). Contiene la mayor parte de la lógica del proceso principal.
- `dist-electron/multipart-parser-BHl0gU7Q.js`: parser auxiliar separado por el bundler.

El wrapper original carga estos módulos antes del bundle principal:

- `electron`
- `path`
- `child_process`
- `fs`
- `crypto`
- `ts-md5`
- `get-port-please`
- `lodash`

Y reexporta desde el bundle principal:

- `envIdStopEnv`
- `fetchIpCheckKeyFromServer`
- `getCurrentAppLogPath`
- `getRpaTaskIdByPids`
- `log`
- `logPath`
- `rpaLog`

También expone `BrowserWindow` desde Electron.

## 3. Interfaz

La aplicación web compilada está en `dist/`.

- `dist/index.html`: entrada de la interfaz.
- `dist/assets/index-BUIbb6Pa.js`: bundle principal de la interfaz (~3.3 MB).
- `dist/assets/index-DL8dDO_o.css`: hoja de estilos principal.
- `dist/assets/*.js`: chunks cargados bajo demanda.
- `dist/assets/*.json`: traducciones y datos empaquetados.
- `dist/assets/*.{png,gif,svg,ico,ttf,...}`: recursos visuales y tipografías.

No se encontraron source maps (`.map`) ni archivos fuente `.vue`/`.ts`, por lo que los nombres originales de componentes y módulos no pueden recuperarse automáticamente de forma exacta.

## 4. Recursos nativos / externos

El proyecto recuperado incluye referencias a módulos nativos y herramientas que deben tratarse con cuidado al reconstruir:

- SQLite
- hooks/gestión de ventanas de Windows
- Puppeteer/Chrome Remote Interface
- proxies SOCKS/HTTP
- FFmpeg y recursos auxiliares en la copia completa recuperada

## 5. Estrategia recomendada para futuras mejoras

No editar directamente el bundle principal de 5.9 MB como primera opción. Mantenerlo como referencia y reconstruir el proyecto por capas:

1. Mantener `dist/` funcionando sin cambios.
2. Sustituir el wrapper ofuscado por una entrada legible solo después de verificar paridad.
3. Extraer funciones del proceso principal a módulos nuevos bajo `src-recovered/main/`.
4. Para cambios de interfaz, identificar primero el chunk responsable y documentar el comportamiento.
5. A largo plazo, recrear componentes Vue nuevos y migrar pantalla por pantalla fuera del bundle compilado.

## 6. Regla de conservación

Nunca borrar los archivos originales recuperados. Los archivos `*.readable.js` y futuros módulos reconstruidos deben coexistir con los bundles originales hasta que la aplicación reconstruida pase pruebas funcionales.
