# DICloak Almacén 0.4.0 — nombres de etapas del diagnóstico

## Lectura de la salida de 0.3.9
El usuario obtuvo 25 eventos del perfil, desde «Operación → Abrir» a las 11:19:22 p. m. hasta etapas completadas a las 11:19:31 p. m., con cero errores, respuestas autorizadas y documentos.

- Las filas «Etapa de apertura no identificada» son un defecto de interpretación de los identificadores internos de etapa. No prueban que fallaran.
- La etiqueta «Etapa de apertura completada» no señalaba qué etapa finalizó.
- Los ceros HTTP/documentos son **esperados**: esta interfaz no captura cuerpos ni tráfico de red. No significan que DICloak no recibiera datos.
- No se ha demostrado por los eventos la identidad real del proceso Chromium ni el contenido enviado por el servidor.

## Cambio técnico
- El renderer del motor oficial DICloak 3.0.7 compara t.stepType con las constantes de la enumeración M. La inyección anterior enviaba el valor interno tal cual; ahora **resuelve el nombre simbólico a partir de la enumeración del propio motor**, y el controlador nativo vuelve a validarlo contra una lista cerrada.
- El panel ahora muestra el nombre de la etapa para los eventos de finalización o fallo.
- Se añadieron los símbolos PROXY_CHECK y PROXY_CHECK_RESULT observados en el módulo oficial, sin registrar ningún valor ni configuración de proxy.
- No se almacena texto sin filtrar, cabeceras, contraseñas, cookies, claves de API, tokens ni cuerpos HTTP.

## Verificación prevista
Ejecutar Diagnóstico → Ver **antes** de pulsar Operación → Abrir en un perfil de pruebas y observar las etapas con su nombre. La versión se distribuye como instalador **experimental separado**, no como parche sobre el DICloak oficial. No instalar en producción ni desactivar SmartScreen, antivirus o comprobaciones de sesión.

La versión 0.4.0 **no convierte el panel en captura total de red**. Solo muestra fases notificadas por el cliente; el receptor de documentos de servidor propio aprobado sigue por separado y necesita una sesión Chromium verificable. Almacén → Abrir sigue realizando una auditoría de solo lectura de la carpeta Chromium cerrada.

## Pruebas
- verify-dicloak-stage-enum-040.yml: tests Windows/Linux e inspección del paquete 3.0.7.
- build-dicloak-native-040.yml: compilación de 0.4.0, integridad ASAR/fuses, instalador aislado, arranque Windows.
- No se ha probado inicio de sesión autenticado ni tráfico del usuario. Modificar el ejecutable invalida la firma Authenticode del fabricante.
