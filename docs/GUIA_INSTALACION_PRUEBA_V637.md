# Guía de instalación y verificación — DyclokPRO v6.37 (prelanzamiento)

## Instalación

1. Cierra todas las ventanas del gestor DyclokPRO y DICloak (no cierres sesión desde la aplicación si no quieres cerrar la sesión remota).
2. Antes de instalar, respalda manualmente `%LOCALAPPDATA%\DyclokPRO\Cuentas` y otras carpetas de usuario que necesites conservar. El instalador no debe eliminar AppData.
3. Instala el EXE de GitHub Releases **v6.37** únicamente si las verificaciones de CI de esa publicación han terminado correctamente.
4. Abre el acceso directo `DyclokPRO` en Windows. El programa debe iniciar el cliente oficial 3.0.7 antes de mostrar las pestañas externas.
5. Usa **+ Cuenta** para crear una cuenta auxiliar (sin copiar credenciales), y pulsa una pestaña para activar o restaurar su ventana.
6. Usa **Archivos** para los perfiles locales, el inspector de archivos anteriores o el panel de API oficial.
7. Usa **Diag** para abrir el diagnóstico, y púlsalo otra vez para cerrarlo.

## Perfil mediante API local V1 (opcional)

1. Inicia sesión en DICloak 3.0.7.
2. En DICloak, activa *More > Settings > Open API* y consulta la URL/puerto y la clave.
3. En DyclokPRO, abre **Archivos > Perfiles del motor 3.0.7 (API local V1)**.
4. Introduce el puerto y la clave en esa ventana; no se guardan al cerrarla.
5. Pulsa **Consultar perfiles**. El programa debe leer el código de respuesta y mostrar IDs, nombres y estados.
6. **Abrir perfil** y **Cerrar perfil** utilizan los PATCH oficiales. Antes de realizar la acción, verifica la cuenta a la que pertenece el servicio local; el puerto por defecto no demuestra qué instancia lo está atendiendo.

## Diagnóstico del cierre de sesión

1. Pulsa **Diag** y anota si el proceso sigue en estado «Ejecutándose» cuando la aplicación vuelve al formulario de login.
2. Si el proceso se cierra completamente, anota el código de salida de Windows.
3. Abre la carpeta de diagnóstico desde el panel y revisa `eventos-sesion.jsonl`. El archivo solo incluye clases de evento, tipo principal/auxiliar, PID, hora UTC y códigos de salida. No incluye tokens ni cookies.
4. No publiques capturas con tus claves, datos de acceso o archivos JSON de perfil sin revisar.

## Pruebas decisivas pendientes

- Cuenta principal: login real, carga de todos los perfiles, cierre y reanudación.
- Cuenta secundaria: login aislado, carga de perfiles y confirmación de sesión propia.
- Abrir/cerrar perfiles por la API local de la cuenta correcta.
- Confirmar que el panel de archivos muestra únicamente archivos existentes y que la función de archivado opcional no afirma haber respaldado archivos físicos de Chromium.
- Comprobar que las pestañas externas no ocultan controles del cliente principal.

**Nota:** v6.37 es una reconstrucción de funciones propias, no el código fuente original del motor 3.0.7. No se certificará como estable hasta las pruebas de autenticación reales.