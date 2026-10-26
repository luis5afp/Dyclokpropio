# Cookies Pro Privada v16.9.10 — integración de fábrica

A partir de la integración [PR #3](https://github.com/luis5afp/Dyclokpropio/pull/3), el código de Dyclokpropio **incluye el paquete de Cookies Pro Privada** dentro del repositorio: `bundled-extensions/Cookies-Pro-v16.9.10-runtime.zip`.

## ¿Tengo que instalarla manualmente perfil por perfil?

**No es el objetivo de esta versión:** el flujo de compilación incluye el paquete y el cargador `src/main/bundled-extension-bootstrap.js` intenta activar automáticamente la extensión cuando la aplicación inicia los procesos Chromium de perfiles nuevos y existentes.

La integración no modifica las cookies ni comparte los datos entre perfiles. Para perfiles que ya están abiertos, ciérralos antes de probar el nuevo instalador.

### Limitación importante

**La carga automática no está demostrada aún en un navegador de perfil real en Windows.** Funciona cuando el navegador es lanzado mediante las llamadas de Node.js que intercepta el bootstrap y el kernel acepta `--load-extension`. Chrome oficial 137+ ignora ese flag; algunos kernels de Chromium sí lo admiten. La extensión exige Chromium 130 o superior.

**No se debe anunciar como garantizada para todos los perfiles hasta probar un instalador completo en Windows.** Consulta las verificaciones y pruebas obligatorias en [COOKIES_PRO_INTEGRATION.md](COOKIES_PRO_INTEGRATION.md).

## Método alternativo si el kernel no admite el cargador

El administrador de extensiones de DICloak permite subir el ZIP por la interfaz, activarlo en un grupo de extensiones y asociar grupos a perfiles. Es la alternativa oficial cuando el cargador no funciona con el kernel de navegador usado.

1. Abre **Extensiones / Gestión de extensiones**, sube el paquete ZIP de la extensión y habilítalo en un grupo.
2. Asocia ese grupo a los perfiles desde **Configuración avanzada → Extensiones**, o agrega la extensión al grupo que ya tengan para no quitar otras extensiones.
3. Para automatizar únicamente la **asignación del grupo** mediante API local, existe `tools/set-extension-group-for-profiles.ps1`. Esa herramienta no sube el ZIP. Requiere una clave API local que nunca debe guardarse en el repositorio.

Documentación oficial: https://help.dicloak.com/how-to-add-extensions-and-apply-them-to-profiles/

## Privacidad

El paquete tiene permisos para administrar cookies y leer sitios HTTP/HTTPS. Usarlo solo en perfiles propios/autorizados. El código del repositorio **no incluye cookies, contraseñas o archivos de sesión de ningún perfil**.
