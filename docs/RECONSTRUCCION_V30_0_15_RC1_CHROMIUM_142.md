# Reconstruccion Dyclokpropio v30.0.15-rc1: Chromium 142.0.7444.273

**ESTADO: ZIP base completo recibido y verificado; fuente de reconstruccion experimental; NO se ha compilado ni publicado un nuevo instalador Windows.**

## Inventario probado del ZIP versionado
- Archivo: 142.0.7444.273.zip
- SHA256: 02ac2000010e709262394e59a2875a7efab34d5fdc8fa0886d8517c70a87f5ca
- 277 entradas, comprobacion ZIP sin errores.
- Contiene chrome.dll (279044656 bytes), chrome_elf.dll, resources.pak, icudtl.dat y v8_context_snapshot.bin.
- chrome.dll es PE Windows x64.
- No contiene ginsbrowser.exe: no puede abrir perfiles sin el ejecutable original.

## Entradas obligatorias
1. ZIP base del propietario (Chromium.zip o DICloak.zip) que incluya Chromium/Application/ginsbrowser.exe y el resto del runtime nativo.
2. ZIP de version 142.0.7444.273.zip, coincidente con SHA256 arriba.
3. PC Windows x64, Node.js/npm y conexion a dependencias para compilar Electron.
4. Permiso correspondiente para distribuir los binarios si se desea publicarlos.

## Compilar en Windows, en instalacion separada

~~~powershell
git clone --branch feature/v30-0-15-rc1-chromium-142-reconstruccion-20261026 https://github.com/luis5afp/Dyclokpropio.git Dyclok_Reconstruccion
cd Dyclok_Reconstruccion
powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\build-v30-0-15-rc1-from-user-zips.ps1 -ChromiumBaseZip "C:\RUTA\Chromium.zip" -ChromiumVersionZip "C:\RUTA\142.0.7444.273.zip"
~~~

El constructor ya existente verifica recursos protegidos y los plugins originales, extrae el arbol completo de Chromium sin mezclar versiones distintas, construye un instalador NSIS, compara SHA256 de todos los archivos nativos del paquete, y exige el arranque Electron y el registro del IPC nativo de cache en Windows. No elimina perfiles existentes.

Si el ZIP base no contiene ginsbrowser.exe, no coincide la version, o alguna prueba falla, se detiene y NO emite la nueva entrega.

## Archivos esperados solo tras pasar todas las pruebas
- release-delivery/Dyclokpropio_30.0.15-rc1_CHROMIUM_142_PRUEBA_win_x64.exe
- release-delivery/SHA256SUMS-v30.0.15-rc1.txt
- release-delivery/TEST_STATUS-v30.0.15-rc1.txt

## Limites para una version publica
- La apertura real del perfil 244 aun NO fue validada. gost.exe / ENOENT sigue siendo un problema aparte.
- 30.0.15-rc1 es la version de entrega; la version interna recuperada de Electron sigue siendo 3.0.0.
- Esta rama comparte codigo y documentacion, no distribuye el ZIP aportado por el usuario.
- Antes de publicar un instalador: fuente completa autorizada, derechos de redistribucion comprobados, hash, CI Windows y prueba del perfil real con copia de seguridad previa.
- No anunciar ni marcar esta version como estable mientras dichas verificaciones falten.

## Resultado del ZIP base completo recibido (26-oct-2026)

- Archivo: Chromium.zip
- SHA256: `b38ffca00f8d90971b207f032d74b97dda7affe56017c584df14c81c52d672c7`
- 340 entradas (307 archivos), comprobacion CRC ZIP correcta, sin rutas inseguras ni duplicados por mayusculas/minusculas.
- Incluye `Chromium/Application/ginsbrowser.exe` (3.231.280 bytes), comprobado PE Windows x64; SHA256 `21c398f5c5771fca444114fd919e3656ef7ac3d62b2c0df330ea8a28ae307f26`.
- `Chromium/Application/142.0.7444.273/chrome.dll`: SHA256 `f15100d61f86614c35172e9cc484f236f8a12f0746e562128d6e2a9aacef6f59`.
- Los **264 archivos** del ZIP separado de version 142 son **identicos por SHA256** a los 264 archivos bajo `Chromium/Application/142.0.7444.273/` del ZIP base. No se necesita duplicar la version en el instalador.
- `Chromium/version.json`: version principal del proveedor `142.1.7` (distinta del directorio del nucleo `142.0.7444.273`).
- `Chromium/User Data/Crashpad/settings.dat` y dos archivos `Application/SetupMetrics/*.pma` no deben incluirse en el instalador; el stagging existente los excluye.
- Elegibles para empaquetado: **304 archivos de runtime**.

**Faltan pruebas de compilacion NSIS en Windows, arranque real del navegador y perfil 244.** No hay justificacion para afirmar aun que el error de apertura esta arreglado. El problema `gost.exe ENOENT` sigue abierto en la base experimental.

## Diagnostico real del primer build Windows (26-oct-2026)

El primer intento en PC alcanzo exitosamente `Step 4/7`: verifico los dos ZIP por SHA256 y extrajo **304 archivos** de runtime (444780491 bytes), incluyendo ginsbrowser.exe y chrome.dll x64. Paso la compatibilidad e instrumentacion del renderer. **Step 5/7 fallo** durante `npx electron-builder install-app-deps`, al reconstruir `bufferutil` con node-gyp:

```text
Error: Could not find any Visual Studio installation to use
node-gyp failed to rebuild .../node_modules/bufferutil
```

Se trata de **una dependencia faltante de compilacion en la PC**, no de una discrepancia de Chromium. Instalar **Build Tools for Visual Studio 2022** desde Microsoft (https://aka.ms/vs/17/release/vs_buildtools.exe), elegir **Desktop development with C++**, **MSVC x64/x86**, **MSBuild** y un **Windows SDK**, y abrir una terminal nueva. node-gyp puede requerir tambien Python 3. La cantidad de avisos npm sobre paquetes descontinuados y las vulnerabilidades auditadas requieren revision posterior; no prueban por si mismas fallo en Chromium ni deben solventarse ejecutando `npm audit fix --force` sin analisis.

Para ahorrar repetir etapas 1-4, se ha proporcionado un **kit independiente para reanudar desde paso 5** al usuario. Comprueba el renderer final, hashes de chrome.dll y ginsbrowser.exe, baseline protegido, MSVC, empaquetado byte a byte y arranque electron/IPC. **No publica automaticamente ni permite llamar estable al resultado.** Esta ayuda no ha sido ejecutada en la PC del usuario aun.
