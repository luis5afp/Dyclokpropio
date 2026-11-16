# Operación → Abrir: vinculación de sesiones y recepción del servidor de pruebas

## Solicitud

Al pulsar **Operación → Abrir** debe asociarse de forma inequívoca
la sesión Chromium real al ID interno del perfil. Después, y **solo**
para los endpoints de laboratorio propios expresamente autorizados,
debe poder guardarse el contenido íntegro de documentos y descargas
recibidos. El botón **Almacén → Abrir** seguirá consultando la carpeta
del mismo perfil. No se deben fabricar respuestas `FAKE_` como
sustituto de los eventos del navegador.

## Qué está preparado

El módulo `tools/almacen-profile-test-receiver.cjs` permite a un
adaptador **interno y confiable del proceso nativo**:

- Asociar un objeto de sesión Chromium real con `row.id`.
- Rechazar un evento sin asociación de sesión verificable.
- Guardar cuerpos originales recibidos en
  `Almacén/<perfil>/archivos/<evento>/<nombre-original>`, usando bytes
  `Buffer`, sin transformar, cifrar de nuevo, ofuscar, renombrar ni
  descomprimir, cuando el nombre es seguro para Windows.
- Limitarse a una ruta de un servidor HTTPS autorizado, o a HTTP en
  localhost cuando el operador lo configure explícitamente.
- Impedir que dos sesiones no verificadas compartan un perfil; separar
  de forma verificable dos sesiones y dos carpetas de datos de prueba.
- Rechazar URLs ajenas a la ruta autorizada, URLs con parámetros y
  cuerpos demasiado grandes. No guardar cabeceras `Set-Cookie`,
  `Authorization` ni `Proxy-Authorization` ni archivos de credenciales.

## Por qué aún no hay instalador 0.3.5

**No se ha vinculado todavía al proceso que ejecuta Chromium**.
El repositorio recuperado incluye la tabla Vue que llama
`openEnv` desde el botón **Operación → Abrir**, pero la copia de
DICloak 3.0.7 utilizada para los instaladores está ofuscada y es
distinta a la interfaz recuperada de la versión 3.0.0.

Los diagnósticos de GitHub Actions
`inspect-official-operation-open.yml` intentaron leer el módulo de
la versión 3.0.7: uno falló al leer directamente del ASAR y el segundo
fue bloqueado por un error de transporte del servidor CDN. No sería
correcto modificar a ciegas el botón de una compilación oficial y
afirmar que está conectado al navegador.

La vinculación final necesita observar un evento confiable con
un **objeto o identificador de sesión real** cuando termina de
arrancar el perfil. Un clic del renderer con `row.id` no demuestra
por sí solo la identidad del navegador externo.

## Captura total frente a verificación

Guardar indistintamente todas las respuestas de todos los sitios
podría incluir contraseñas, tokens de autenticación, cookies de sesión,
datos personales y contenido privado de terceros. Esta integración
se limita deliberadamente a documentos y descargas de endpoints
de laboratorio **con consentimiento y control del operador**.

Para comprobar que *todo el material de prueba* llegó:
1. El servidor propio emite un manifiesto de `ID de prueba`,
   nombres, tamaños y SHA-256 de cada archivo de ensayo enviado.
2. El receptor autorizado almacena los bytes del archivo recibido
   y calcula sus hashes.
3. Se compara la lista y los SHA-256 de los eventos, detectando
   ausencias y transformaciones. No se compara una cookie HTTP
   directamente con la base de datos cifrada nativa de Chromium.
4. La auditoría de integridad del almacenamiento Chromium
   (PR #48) permanece independiente y de solo lectura.

**Falta la URL HTTPS exacta del endpoint propio del usuario**, nunca
proporcionar cookies, contraseñas ni tokens. La ausencia de dicha
URL y la falta de un vínculo probado a las sesiones Chromium
impiden activar una conexión real extremo a extremo.

## Pruebas

`node --test tools/test-almacen-profile-test-receiver.cjs`

Pruebas con dos objetos de sesión ficticios, documentos JSON/binarios
y distintos perfiles. Comprueba hashes idénticos, aislamiento,
rechazo de orígenes desconocidos y no creación de datos cuando un
evento se rechaza. No constituye una prueba de la captura real de
una sesión DICloak.

No empaquetar un nuevo instalador, modificar `main` o anunciar
captura completa hasta confirmar el punto de integración y
realizar una prueba de navegación con el servidor autorizado.
