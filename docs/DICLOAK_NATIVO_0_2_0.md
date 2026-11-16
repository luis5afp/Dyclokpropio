# DICloak Nativo 0.2.0 — instalador experimental de Windows

El instalador `DICloak_Nativo_0.2.0_win_x64.exe` usa **solo `DICloak.exe`**
como ejecutable principal (motor DICloak oficial 3.0.7).

## Cambios concretos

Se suprimen exclusivamente dos ventanas **opcionales** de la interfaz:

1. Apertura automática del popover **Centro de actualizaciones**.
2. Mensaje modal **Descarga completada — ¿Instalar ahora?** cuando termina una
   descarga opcional del proveedor.

El navegador sigue consultando actualizaciones y conservando los botones de
instalación desde su interfaz. El aviso de actualización obligatoria
`ue.value&&100===j.value&&(E.value=!0)` permanece activo. **Ocultar el cuadro
no equivale a instalar automáticamente el paquete que se haya descargado.**
Este instalador no trae todavía un actualizador automático propio.

## Protecciones

- Se exige el SHA-256 del instalador **oficial** DICloak 3.0.7.
- Se exige el SHA-256 exacto de `resources/app.asar` y del renderer original.
- La transformación afecta un único archivo compilado de interfaz,
  `dist/assets/index-bGjMkmkL.js`, y recalcula su integridad interna ASAR.
- El PE original `DICloak.exe` se mantiene idéntico, y el flujo de
  autenticación, firmas y comunicaciones no se modifica.
- La transformación conserva el tamaño del renderer y la tabla de offsets ASAR.
- El instalador rechaza las compilaciones con fallos de sintaxis, hash o
  comprobación del arranque de Windows.
- No empaqueta `DyclokPRO.exe`, ni datos privados de `SourceData` ni
  `Chromium/User Data`.
- Se instala en `%LOCALAPPDATA%\Programs\DICloak-Nativo-Lab` para evitar
  sobrescribir el programa oficial y otras líneas del proyecto.

## Compilación

Workflow: `.github/workflows/build-dicloak-native-020.yml`. Al terminar
**todas** las verificaciones se genera un artefacto experimental en la pestaña
Actions con el EXE y `SHA256SUMS.txt`.

**No se publica un GitHub Release público automáticamente**, puesto que la
distribución modificada de un programa de terceros debe comprobarse con sus
permisos/licencias y requerirá ensayos reales de inicio de sesión y perfiles.
La prueba de arranque en Actions es básica: no sustituye una prueba funcional
en Windows con perfiles de ensayo.

Este cambio depende de la rama del PR #38 (interfaz sin cuadros opcionales),
que a su vez depende del PR #37 (motor DICloak sin launcher).

Antes de instalar en tu computadora, respalda tus perfiles y sesiones, y
comprueba que el motor original y los datos de tus cuentas funcionan. No borres
la instalación previa hasta haber validado la nueva.
