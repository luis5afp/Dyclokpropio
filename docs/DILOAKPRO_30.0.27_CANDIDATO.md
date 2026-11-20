# diloakPRO 30.0.27 — integración candidata

**Estado:** rama de integración; **NO es todavía una versión estable ni una publicación en GitHub Releases**. Requiere CI, instalación y prueba funcional con Chromium en Windows.

## Objetivo

Llevar las comprobaciones R4 de laboratorio al diagnóstico ordinario de diloakPRO sin convertir la aplicación en un capturador indiscriminado.

- El programa se abre normalmente desde su ejecutable gráfico, **sin consola de configuración**.
- El botón **Diagnóstico** mantiene el registro de etapas, HTTP, procesos y conexiones.
- **Solo cuando el operador lo activa expresamente** y define un origen exacto de pruebas, se registran las respuestas Node HTTP(S) de ese servidor.
- Los cuerpos del servidor de pruebas se guardan como bytes originales del flujo Node **antes de cualquier descompresión o JSON.parse**, en archivos locales **AES-256-GCM .dplab**. Las cabeceras recibidas se incluyen únicamente dentro del archivo cifrado.
- Si el servidor devuelve X-Diloakpro-Body-SHA256, se compara con el SHA-256 de los mismos bytes recibidos. El resultado es **idéntico**, **diferente** o **no verificable**.
- Se conserva el comprobante separado .proof.json sin incluir valores privados. Los informes TXT/JSON ordinarios solo guardan resultados y cantidades.
- La captura tiene límites (4 MiB por respuesta, 24 respuestas, 16 MiB agregados) y **no se activa por defecto**.

## Activación opcional — SOLO servidor propio con datos sintéticos

Inicia diloakPRO desde PowerShell con estas variables de **la sesión actual**, usando tu propio servidor y una frase de cifrado de al menos 16 caracteres. Ajusta la ruta al ejecutable realmente instalado:

~~~powershell
$env:DILOAKPRO_LAB_CAPTURE_ENABLE = '1'
$env:DILOAKPRO_LAB_CAPTURE_ORIGIN = 'http://127.0.0.1:8765'
$env:DILOAKPRO_LAB_CAPTURE_PASSPHRASE = Read-Host 'Frase de cifrado (datos ficticios)'
& 'C:\RUTA\AL\PROGRAMA\Dyclokpropio.exe'
Remove-Item Env:DILOAKPRO_LAB_CAPTURE_ENABLE,Env:DILOAKPRO_LAB_CAPTURE_ORIGIN,Env:DILOAKPRO_LAB_CAPTURE_PASSPHRASE -ErrorAction SilentlyContinue
~~~

En la interfaz, abre **Diagnóstico → Iniciar** antes de solicitar a tu servidor la respuesta de prueba. No se necesita un acceso directo distinto llamado «Laboratorio». Fuera de esa ejecución, el botón realiza el diagnóstico sin capturar cuerpos.

**Importante:** la frase de cifrado existe temporalmente en el entorno del proceso. No ejecutes simultáneamente procesos o scripts ajenos desde esa misma sesión. No uses contraseñas, cookies ni cuentas reales.

Solo se admite HTTP en localhost, 127.0.0.1 o ::1; para un servidor remoto debe usarse HTTPS con el **origen exacto** (esquema, host y puerto). Los orígenes de infraestructura DICloak/IpFly quedan excluidos expresamente.

## Comprobante exigido al servidor

Cabecera:

~~~text
X-Diloakpro-Body-SHA256: <64 caracteres hexadecimales>
~~~

Calcula el SHA-256 sobre los **bytes del cuerpo HTTP efectivamente enviados**. Si usas Content-Encoding: gzip, calcula sobre el cuerpo **gzip** transmitido, no sobre el JSON descomprimido. Ningún hash demuestra por sí solo que Chromium haya aplicado la configuración.

Los archivos .dplab quedan en la carpeta LabCaptures dentro de los datos de usuario de Electron. No los subas a GitHub ni a informes compartidos.

## Cobertura y límites reales

- Sí: cuerpo recibido por algunas conexiones Node HTTP(S), si procede del origen autorizado; comprobante del servidor; informe de resultados, cifrado local.
- No: captura universal de fetch, tráfico web de Chromium, TLS completo, cookies aplicadas, restauración de credenciales o configuración efectiva de proxy, extensiones y fingerprint.
- No modificar automáticamente los perfiles; la observación es pasiva.
- **No** ejecutar actualización silenciosa desde esta candidata: el build de prueba declara versión 0.0.0, y la publicación estable sigue bloqueada hasta validación.

## Verificaciones necesarias antes de publicar

1. GitHub Actions: test-diloakpro-lab-integrity.js debe superar respuesta normal, gzip, error de SHA-256 y comprobante ausente.
2. Superar pruebas de regresión del diagnóstico existente y verify-safe-base.js.
3. Compilar NSIS x64 y descargar el artefacto **solo desde Actions**, no desde Releases.
4. En un PC Windows de pruebas, instalar en carpeta controlada y validar interfaz, apertura de Chromium y cierre limpio.
5. Verificar que NO sustituya ni borre los perfiles existentes; si corresponde, probar actualización de una instalación previa.
6. Solo después, crear la etiqueta y Release estable con instalador y SHA-256, en una revisión independiente.

No se han alterado el motor original ni la base compilada protegida. El cambio se realiza en los módulos de diagnóstico y empaquetado existentes.
