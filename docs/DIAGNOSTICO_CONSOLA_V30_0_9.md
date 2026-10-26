# v30.0.9 — botón Diagnóstico inspirado en KAIZEN (metadatos, no cuerpos)

## Motivación
El perfil 244 sigue mostrando UNKNOWN_ERROR en la versión v30.0.7. La
v30.0.8 incorpora seguimiento de etapas, pero requiere exportación manual.
El proyecto KAIZEN usa un inspector detallado de solicitudes, respuestas y
eventos. En KAIZEN también se almacenan cuerpos íntegros de respuestas,
cabeceras y URLs, y por eso NO se copia literalmente su política de captura:
en un navegador multiperfil podrían quedar expuestas cookies y credenciales.

## Uso
1. Respaldar perfiles antes de cambiar de instalador.
2. Abrir Dyclokpropio y pulsar el nuevo botón flotante **Diagnóstico**.
3. Pulsar **Iniciar**. El diagnóstico solo graba mientras esté habilitado.
4. Abrir una vez el perfil que falla.
5. Pulsar **Detener** y luego **Exportar TXT**.
6. Adjuntar el archivo **Dyclok-Diagnostico-Completo-*.txt** de Descargas.
   El archivo debe seguir revisándose antes de compartirlo.

## Qué captura
- Etapas originales de apertura: fetchEnvInfo, expandCheck, paramsMerge,
  lockEnv, openEnv, etc., y fase/código de error filtrado.
- Peticiones HTTP efectuadas desde el renderer mediante fetch o XHR:
  método, destino solo clasificado como app/local/remoto, respuesta HTTP,
  tiempo transcurrido, éxito o error de transporte.
- IPC del renderer: llamada y respuesta cuando el puente permite
  envolver invoke; nombres de canal exclusivamente de una lista permitida,
  y tipo del resultado (null, boolean, object, etc.).
- Eventos ordenados por secuencia y hora UTC (máximo 3000 por sesión).
- La captura guardada en userData no supera 1.5 MiB y el exportador
  solo entrega metadatos ya filtrados.

## Limitaciones
No se capturan solicitudes del proceso principal de Node ni del Chromium
externo de los perfiles. No se registran cuerpos, cabeceras, URLs, parámetros,
IDs de perfil, tokens, contraseñas, cookies o pilas de excepción. El puente
IPC de Electron podría ser inmutable y, en ese caso, la interfaz informa
que solo captura HTTP y etapas de apertura. Los errores desconocidos se
clasifican como UNCLASSIFIED y no se guardan mensajes libres.

Esta implementación NO corrige por sí sola UNKNOWN_ERROR. Sirve para
generar una secuencia causal reproducible sin sustituir la revisión de los
archivos originales por inferencias. No desactiva comprobaciones SHA256 ni
protecciones de extensiones ni altera la configuración de perfiles.

## Garantías de la compilación
- Se conserva íntegro el HTML original guardado en Git.
- Las pruebas del botón verifican SHA256 antes de insertar la etiqueta HTML
  y copiar el script de interfaz a dist/ únicamente durante la compilación.
- Se conserva la instrumentación ya revisada del controlador de apertura.
- Las pruebas rechazan tráfico/IPC proveniente de ventanas remotas,
  y comprueban que los datos simulados privados no aparecen en el TXT.
- Si falla el diagnóstico, el publicador de Windows rechaza el instalador.
