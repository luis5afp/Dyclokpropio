# Diagnóstico del aviso «Tu sesión ha expirado» de DICloak

## Síntoma observado
En la captura del operador, la aplicación presenta el cuadro
«Confirmación — Tu sesión ha expirado. Por favor, inicia sesión de nuevo».

La imagen **no permite determinar** si se trata de una sesión
auténticamente vencida, de una respuesta 401/403 del backend del
proveedor, de un error de conexión, ni si la alerta proviene del
programa oficial o de una instalación experimental.

## Seguridad y aislamiento
- El panel Diagnóstico Almacén **no gestiona la sesión de la cuenta
  DICloak**, no modifica credenciales y no debe interceptar ni anular
  su comprobación de autenticación.
- Si falta la clave de OpenAPI local, el panel debe mostrar
  «Falta configuración» y quedarse sin conectar: no emitir solicitudes
  de estado de perfil y no provocar intentos de inicio de sesión.
- Si la OpenAPI local devuelve 401, el cliente debe detenerse tras
  esa respuesta; no reintentar contraseñas, no borrar cookies, no
  sobrescribir la sesión de DICloak y no abrir un diálogo propio
  de «sesión caducada».
- No confundir **OpenAPI Key local ausente** con **sesión caducada de la
  cuenta del proveedor**: son dos mecanismos de autenticación distintos.

## Prueba de regresión añadida
\`tools/test-dicloak-auth-prompt-regression.cjs\` cubre:
1. Un panel iniciado sin API Key, sin llamadas de red y con cero
   respuestas/documentos inventados.
2. API local simulada que devuelve 401: una sola solicitud GET,
   devuelve error transparente; los eventos del panel muestran
   solo la operación y el código de estado, sin contenido de
   respuesta ni claves.

No es una prueba de la aplicación autenticada real ni de su servidor.

## Diagnóstico sin saltarse la autenticación
1. Comprobar si el aviso también aparece al abrir la versión
   **oficial**, con la versión experimental cerrada.
2. Si aparece en ambas, iniciar sesión normalmente y comprobar
   conectividad, reloj de Windows y disponibilidad del servidor del
   proveedor, sin intentar saltarse o modificar la validación.
3. Si solo sucede en el ejecutable reconstruido, informar versión,
   momento del fallo y estado sin compartir cookies, tokens ni
   contraseñas; revisar el comportamiento en un perfil ficticio.
4. Confirmar que no haya dos procesos DICloak compitiendo por la
   misma carpeta de sesión; no borrar ni copiar bases de datos
   nativas de Chromium para intentar resolver el mensaje.

No se ha quitado ni parcheado la comprobación de sesión del
fabricante. **Nunca confundir la eliminación de un aviso incorrecto
con la supresión de controles de autenticación.**
