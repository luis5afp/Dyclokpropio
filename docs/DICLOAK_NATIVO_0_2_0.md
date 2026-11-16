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
- El ejecutable original se conserva inicialmente como referencia de hash.
  Para conservar la verificación ASAR de Electron al cargar el paquete modificado,
  la compilación experimental reconstruye el recurso PE `INTEGRITY/ELECTRONASAR`
  con el nuevo hash de cabecera. Los fuses de Electron se verifican para garantizar
  que **no se desactiva la comprobación ASAR**. No se modifica la lógica de
  autenticación ni el código de red.
- La transformación conserva el tamaño del renderer y la tabla de offsets ASAR.
- El instalador rechaza las compilaciones con fallos de sintaxis, hash o
  comprobación del arranque de Windows. La modificación del recurso PE
  **elimina/invalida la firma Authenticode original**; no se puede distribuir
  con la identidad del proveedor y requerirá permiso de distribución
  y una firma propia del proyecto antes de publicarse como versión estable.
- No empaqueta `DyclokPRO.exe`, ni datos privados de `SourceData` ni
  `Chromium/User Data`.
- Se instala en `%LOCALAPPDATA%\Programs\DICloak-Nativo-Lab` para evitar
  sobrescribir el programa oficial y otras líneas del proyecto.

## Firma y distribución

**0.2.0 sigue siendo un laboratorio, no una versión oficial de DICloak.**
No se afirma que el archivo modificado esté firmado por el proveedor.
No desactivar la validación ASAR, ni alterar avisos obligatorios, ni
instalar esta build sobre una instalación existente. Para publicar hay que
confirmar permisos/licencia sobre los componentes redistribuidos y firmar
`DICloak.exe` con el certificado del distribuidor; después, repetir pruebas
de perfil, sesión y navegación en Windows.

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

---

## Validación de Windows para el candidato 0.2.0

**Resultado del workflow de laboratorio:** aprobado el 16 de noviembre de 2026.

- Reconstrucción de las dos modificaciones opcionales de interfaz: **PASS**
- Actualización coherente de `INTEGRITY/ELECTRONASAR`: **PASS**
- Fuses de seguridad de Electron sin cambios: **PASS**
- Generación del instalador NSIS: **PASS**
- Instalación en `DICloak-Nativo-Lab` y hashes: **PASS**
- Prueba de arranque de `DICloak.exe` modificado en Windows: **PASS**
- Publicación de artefacto **experimental** en Actions: **PASS**

**Workflow:** https://github.com/luis5afp/Dyclokpropio/actions/runs/43822581233

**Artefacto:** `DICloak-Nativo-0.2.0-Windows-Experimental`
(descargar desde la sección *Artifacts* de ese workflow).

El artefacto contiene `DICloak_Nativo_0.2.0_win_x64.exe` y
`SHA256SUMS.txt`.

**No es una publicación estable:** la transformación del recurso de integridad
del PE invalida la firma original del proveedor. La nueva compilación necesita
permiso de redistribución y firma Authenticode propia antes de usarla como
distribución estable. No se ha comprobado aún el funcionamiento completo con
login remoto, perfiles reales ni sesiones existentes; no sustituir una
instalación en uso.

**Importante:** no se incorpora todavía un actualizador silencioso de la nueva
línea nativa; ocultar los avisos opcionales no significa aplicar automáticamente
las actualizaciones.
