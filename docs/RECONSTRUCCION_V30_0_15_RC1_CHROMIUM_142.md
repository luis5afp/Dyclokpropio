# Reconstruccion Dyclokpropio v30.0.15-rc1: Chromium 142.0.7444.273

**ESTADO: fuente de reconstruccion experimental; NO se ha publicado un instalador.**

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
