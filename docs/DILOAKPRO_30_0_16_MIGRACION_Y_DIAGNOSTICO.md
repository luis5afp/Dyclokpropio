# diloakPRO 30.0.16 — motor nativo DICloak 3.0.7 / diagnóstico 0.4.2

## Objetivo
Una sola instalación por usuario y una sola identidad en Windows, con diagnóstico de
**metadatos** del tráfico saliente. Mantener el motor original y su verificación de integridad
PE/ASAR. Esta versión es una **RC experimental**; no reemplaza las versiones estables de
Dyclokpropio y no se instala sobre el DICloak original del fabricante.

## Instalación y migración segura
- Identidad NSIS estable: `com.diloakpro.desktop`, producto: **diloakPRO**, versión `30.0.16`.
- Carpeta de instalación estable: `%LOCALAPPDATA%\Programs\diloakPRO`.
- Acceso directo único: `diloakPRO.lnk` (escritorio y menú Inicio).
- Instaladores futuros con el mismo appId sustituyen los archivos de esta aplicación.
- Durante la instalación busca **solo** las nueve ediciones nativas de laboratorio
  documentadas (0.3.0, 0.3.1, 0.3.2, 0.3.3, 0.3.4, 0.3.9, 0.4.0, 0.4.1 y RC1/RC2).
  Solo ejecuta su propio desinstalador si tiene entrada HKCU coincidente, ubicación
  exacta en %LOCALAPPDATA%\Programs y ejecutable con ruta validada.
- Si la verificación falla, **no elimina el programa antiguo a la fuerza**:
  informa y permite desinstalación manual.
- No toca datos de perfiles, contraseñas, cookies, descargas de usuarios ni
  la instalación oficial DICloak. Tampoco modifica la línea estable v30.0.15
  de Dyclokpropio.
- El informe de migración está en
  `%LOCALAPPDATA%\diloakPRO\install-migration.json`.
- El ejecutable interno es `DICloak.exe` para mantener el motor Electron; el
  producto, instalador y accesos directos se muestran como **diloakPRO**.

## Diagnóstico de datos salientes
- HTTP(S) Node: método, ruta convertida a plantilla (sin IDs ni query), estado,
  duración y **Content-Length declarado si está disponible**. No lee ni persiste
  el contenido ni las cabeceras privadas.
- Cuenta solicitudes a rutas `*/upload`, pero **no demuestra** que se transfieran
  archivos ni identifica su contenido.
- Muestra la ejecución de etapas de configuración (proxy, cookies, extensiones,
  huella, apertura) y distingue explícitamente esas etapas de la verificación
  real de credenciales, cookies, salida de proxy y relación con la sesión
  Chromium, que permanecen *no verificadas*.
- Muestreo de procesos y conexiones: excluye la instancia de PowerShell que
  realiza el muestreo y sus hijos. Puede haber limitaciones de visibilidad.
- Los informes se guardan como JSON en Descargas tras pulsar el botón.
- No se realizan capturas de tráfico de Chromium, interceptación TLS,
  recolección de tokens, contraseñas o valores de cookies, ni copias de bases
  de datos del navegador. Las IP y PID sí pueden ser sensibles y deben
  revisarse antes de compartir el informe.

## Verificación
- Windows CI: pruebas unitarias, descarga oficial verificada por SHA-256,
  modificación ASAR, integridad PE de Electron, instalador NSIS, instalación
  en ruta estable y smoke test.
- Prueba de migración: instalar primero una RC2 publicada y comprobar que la
  instalación de diloakPRO retira el ejecutable antiguo y deja un registro
  de migración satisfactorio.
- **Pendiente:** interacción real con el botón de diagnóstico en un perfil
  Chromium de pruebas y comprobación visual de credenciales/proxy en el PC
  del usuario.

## Redistribución
Ejecutable experimental modificado y no firmado digitalmente. Los componentes
originales del motor pertenecen a terceros; la distribución pública requiere
la autorización correspondiente.
