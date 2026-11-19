# diloakPRO 30.0.25 RC12 — Captura de respuestas cifrada y limitada al servidor propio

## Para qué sirve

RC12 amplía la recepción previa a Chromium para **guardar los bytes originales del flujo de respuesta de Node de un servidor de laboratorio autorizado**. El almacenamiento está desactivado normalmente; no utiliza F12, Open API ni CDP. Las conexiones que aparecen en las auditorías a los servidores propios del fabricante DICloak siguen registrando **solo metadatos**, nunca sus cuerpos.

Se ha diseñado para un servidor controlado por el usuario que envíe **datos sintéticos o desechables**. Es importante no convertirlo en una captura indiscriminada de cookies y contraseñas reales.

## Activación manual para una sola apertura

1. Haz una copia de seguridad del perfil y cierra por completo diloakPRO.
2. Identifica el **origen exacto** de tu servidor de pruebas, incluyendo protocolo y puerto, por ejemplo `http://127.0.0.1:8080` o `https://laboratorio.example.test:8443`. No escribas una URL con ruta o parámetros.
3. Usa el lanzador que se incluye en el paquete RC12:

```powershell
cd "$env:USERPROFILE\Downloads"
$exe=Join-Path $env:LOCALAPPDATA 'Programs\diloakPRO\DICloak.exe'
.\Iniciar-diloakPRO-RC12-LAB.ps1 -ExecutablePath $exe -LabOrigin 'http://127.0.0.1:8080'
```

Introduce una **frase de cifrado de al menos 16 caracteres**, en tu propio equipo. No la compartas ni la pongas en capturas de pantalla. El lanzador establece temporalmente estas variables solo para el proceso que inicia:

- `DILOAKPRO_LAB_CAPTURE_ENABLE=1`
- `DILOAKPRO_LAB_CAPTURE_ORIGIN` (origen exacto, sin comodines)
- `DILOAKPRO_LAB_CAPTURE_PASSPHRASE` (secreto de cifrado; lo borra de las variables de la PowerShell iniciadora tras arrancar el programa)

La frase de cifrado viaja como variable de entorno del proceso hijo mientras este se ejecuta. Otras aplicaciones con permisos suficientes en tu equipo podrían acceder a ella; utiliza una máquina de pruebas y cierra el proceso tras terminar.

Solo se admite HTTP sin TLS para `localhost`, `127.0.0.1` o `::1`. Para otros servidores se exige HTTPS. Se rechazan dominios DICloak e ipflygates y no se aceptan comodines.

**Si no habilitas estas variables, RC12 no escribe ningún archivo de tráfico.** No se guarda automáticamente ninguna captura de otros servidores.

## Qué se guarda y dónde

Los archivos cifrados se crean bajo **`LabCaptures` en la carpeta `userData` de Electron** (habitualmente bajo `%APPDATA%`). Cada apertura tiene una subcarpeta propia y cada respuesta completa crea un fichero aleatorio `UUID.dplab`. No hay archivos de datos en claro.

Cada fichero cifrado contiene:

- Fecha, método y **URL completa** de la solicitud al servidor de laboratorio.
- Código y texto de estado HTTP; **cabeceras originales de la respuesta**, incluidas las que el servidor de prueba envíe con datos ficticios.
- **Cuerpo original en bytes binarios**, como entra por `IncomingMessage.push`, sin consumir ni alterar el flujo normal.
- Para respuestas `gzip`, los bytes siguen comprimidos en el archivo, tal como llegaron al stream Node (después de descifrar TLS y antes de que el código consumidor los descomprima).

El formato `.dplab` utiliza AES-256-GCM, clave derivada con scrypt, sal y nonce aleatorios, y autenticación del contenido. No se publica la frase de cifrado. Se permiten como máximo **24 respuestas por apertura, 4 MiB por respuesta y 16 MiB sumados**; las respuestas cortadas o demasiado grandes no se guardan. El proceso continúa normalmente si falla la captura.

## Abrir un archivo cifrado en tu equipo

Instala Node.js si todavía no lo tienes y conserva estos dos archivos incluidos en el ZIP: `tools/diloak-lab-read.cjs` y `tools/diloak-lab-response-capture.cjs` en la misma carpeta.

Crea una carpeta vacía para la salida, por ejemplo `C:\LabResultados`, y ejecuta:

```powershell
node .\tools\diloak-lab-read.cjs 'C:\RUTA\ARCHIVO.dplab' 'C:\LabResultados'
```

El lector pide la frase de cifrado **sin mostrarla** y crea expresamente dos archivos locales:

- `UUID.response.json`: URL, cabeceras, estado, fecha.
- `UUID.response.body.bin`: **bytes originales exactos del cuerpo de respuesta**, que pueden ser comprimidos o datos binarios.

No imprime cookies ni tokens en la consola, no sobrescribe archivos existentes y no realiza conexiones de red. Esos dos archivos **están en claro** después del descifrado: trátalos como material sensible, evita carpetas sincronizadas y elimínalos al terminar.

## Límites técnicos y garantías

- Se instrumentan las respuestas Node `http.request`, `https.request`, `http.get` y `https.get` que coincidan exactamente con el origen permitido. **No** cubre automáticamente Electron `net`, HTTP/2, fetch/Undici ni los componentes nativos.
- La comunicación original no se redirige, no se cambian cabeceras ni se alteran bytes. El cifrado se calcula sobre fragmentos a medida que pasan; la escritura al disco empieza **después** del evento `end` del stream.
- Las respuestas incompletas, fallos de cifrado o límites excedidos se descartan. No se asegura entrega al servidor de una solicitud saliente ni aceptación de cookies por Chromium.
- El JSON/TXT normal de **Diagnóstico → Ver** mantiene únicamente contadores y metadatos; el contenido completo únicamente existe cifrado en los `.dplab` autorizados.
- Una copia exacta del stream recibido no es una prueba de igualdad con los bytes de la máquina servidora. Esa verificación necesita un comprobante del servidor de prueba.
- La instalación no tiene firma de código propia, es experimental y requiere pruebas en un equipo Windows controlado antes de distribuirse. No redistribuir componentes del fabricante sin autorización.

## Prueba automatizada

`node --test tools/test-diloakpro-lab-respuestas-cifradas-3025.cjs`

La prueba utiliza un servidor HTTP local con credenciales, cookies y 2FA **ficticios**; verifica que el consumidor recibe exactamente los mismos bytes comprimidos, que el fichero cifrado descifra correctamente y que ningún dominio/puerto distinto queda capturado.
