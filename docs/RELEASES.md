# Versiones instalables de Dyclokpropio

GitHub tiene **dos lugares diferentes** donde pueden aparecer los instaladores:

- **Releases**: versiones públicas con enlace directo al archivo `.exe`. Es la página recomendada para descargar.
- **Actions > Artifacts**: ZIP generado por una compilación de prueba; antes solo se guardaba aquí la versión nueva, por lo que Releases seguía mostrando `v30.0.0`.

## Publicación automática en Releases

La acción [Safe Base Windows Release](../.github/workflows/release-safe-base.yml) está preparada para publicar una versión al actualizar `main` con cambios en los archivos de compilación que activa ese flujo.

1. Calcula el siguiente identificador `v30.0.N` según las etiquetas existentes en GitHub. Después de `v30.0.0`, la siguiente será `v30.0.1`.
2. Ejecuta las comprobaciones de integridad del runtime y de la extensión Cookies Pro Privada.
3. Compila el instalador Windows NSIS de 64 bits y hace una prueba básica de inicio.
4. Calcula el SHA-256 del instalador generado.
5. **Si todo termina correctamente**, crea una etiqueta nueva y un GitHub Release con estos archivos:
   - `Dyclokpropio_30.0.N_win_x64.exe`
   - `SHA256SUMS.txt`
   - `VERSION.txt`

**Página oficial de descargas:** https://github.com/luis5afp/Dyclokpropio/releases/latest

El Release público no se publica si fallan las verificaciones o la compilación; comprueba el resultado en la pestaña Actions si no aparece una versión nueva.

## Dos versiones diferentes

- **Versión interna:** `3.0.0` en `package.json`, se conserva para compatibilidad con el código recuperado.
- **Versión de entrega:** `30.0.N`, visible en GitHub Releases y en el nombre del instalador. No se escribe en `package.json`.

En consecuencia, la versión que muestre Windows dentro de la aplicación podría seguir siendo `3.0.0`, aunque el archivo de instalación se llame `Dyclokpropio_30.0.1_win_x64.exe`.

## Compilación manual alternativa

El flujo [Build Windows Installer](../.github/workflows/release-windows.yml) permite crear una versión pública mediante una etiqueta `vX.Y.Z` (por ejemplo, `v30.0.2`). Si se ejecuta manualmente sin etiqueta, solo almacena un artefacto descargable en Actions, no en Releases.

Para generar un instalador local en Windows:

```powershell
npm install --legacy-peer-deps
node tools/unpack-bundled-extension.js
node tools/verify-build-assets.js
node tools/verify-bundled-extension.js
node tools/verify-safe-base.js
npx electron-builder install-app-deps
npm run build:win
```

## Protección de los perfiles

Las comprobaciones automáticas y el arranque básico de Electron **no demuestran** que todas las funciones de perfiles, autenticación o extensión funcionen en el equipo del usuario. Antes de instalar una nueva versión, guarda una copia de seguridad de los perfiles y sus datos. Nunca subas `SourceData/` ni datos de sesión a un repositorio público.
