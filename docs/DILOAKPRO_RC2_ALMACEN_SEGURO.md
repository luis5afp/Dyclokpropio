# diloakPRO RC2 LAB — Almacén por perfil y respaldos cifrados

> Función experimental de laboratorio. DICloak 3.0.9 y su \`app.asar\` permanecen inalterados.

## 1. Archivos que guarda automáticamente

En Windows, la aplicación crea (solo cuando se registra un diagnóstico):

\`\`\`text
%LOCALAPPDATA%\diloakPRO\ArchivoRC2\Perfiles\
  Perfil-General\                     (si no se indicó ID de perfil)
  Perfil-123456\                      (ejemplo de ID del usuario)
    Diagnosticos\
      diagnostico-AAAAMMDD-...json
      diagnostico-AAAAMMDD-...txt
      diagnostico-AAAAMMDD-...sha256
    RespaldosCifrados\
      archivo-AAAAMMDD-...dlvault
\`\`\`

Se guarda al detener la grabación, al finalizar una consulta API V2 autorizada,
al desconectar CDP y cada 60 segundos durante una grabación con muestras.
También hay botones **Guardar Almacén** y **Abrir Almacén**.

Los JSON/TXT recogen únicamente estos campos de diagnóstico:
- Procesos del motor, Chromium, descendientes y conteos TCP de Windows.
- Estado y códigos HTTP observados mediante CDP autorizado, sin URLs, cabeceras ni cuerpos.
- Estado y capacidades de API local, cuando se hayan consultado voluntariamente.
- Presencia de configuración de extensiones, proxy y fingerprint, *no su contenido privado*.
- Estado del proceso de perfil (\`running\` si la API lo confirma), NO autenticación web.
- Registro de acciones propias del monitor: iniciar, detener, comprobar, conectar,
  guardar, respaldar/restaurar; SIN argumentos sensibles ni comandos arbitrarios.
- Campos \`NO_VERIFICADO\` para cookies aplicadas, proxy efectivo,
  fingerprint efectivo, extensiones ejecutándose, login web y JSON interno.
- Archivo de integridad SHA-256 de cada JSON (no firma digital).

**Atención:** guardado automático de diagnósticos NO equivale a respaldar datos de
la cuenta ni permitir recuperar sesiones autenticadas.

## 2. Respaldo de archivos propios seleccionados (cifrado)

Usa **Cifrar archivo seleccionado** si tienes una exportación oficial de
extensiones, configuración, cookies, proxy o sesión que DICloak permita
exportar legalmente y bajo tu control. Este diálogo puede seleccionar un ZIP,
JSON, TXT u otro archivo que tengas legítimamente; la aplicación NO busca
archivos de Chromium ni obtiene contraseñas/cookies mediante un procedimiento oculto.

1. Selecciona manualmente el archivo que deseas conservar.
2. Confirma el aviso sobre contenido privado.
3. Escribe y confirma una contraseña de 12 caracteres o más.
4. Se guarda un único archivo \`.dlvault\` en \`RespaldosCifrados\`.

Cifrado: **AES-256-GCM**, clave derivada de contraseña mediante
**PBKDF2-HMAC-SHA256 con 310 000 iteraciones**, sal y nonce aleatorios.
El archivo tiene etiqueta de autenticación y el contenido no se escribe
en texto plano dentro del Almacén. Tamaño máximo por archivo: **64 MiB**.

**Conserva la contraseña en un administrador de contraseñas.** No queda
almacenada en el JSON/TXT ni en GitHub. Si se pierde, el respaldo no puede
restaurarse. La exportación original seleccionada no se elimina: si contiene
secretos sin cifrar, debes protegerla por separado.

## 3. Recuperación

1. Pulsa **Restaurar respaldo**.
2. Selecciona el \`.dlvault\`.
3. Elige una ruta de salida nueva y fuera de las carpetas internas de Chromium.
4. Confirma el aviso y escribe la contraseña.
5. El programa verifica la etiqueta AES-GCM antes de escribir la salida.
   **No sobrescribe** un archivo existente ni importa datos automáticamente
   dentro de DICloak.

El archivo restaurado vuelve a ser legible: si contiene datos privados,
protégelo y no lo subas a GitHub ni lo compartas.

## 4. Límites y prohibiciones por diseño

- No se extraen ni guardan contraseñas, tokens, claves API ni valores de cookies
  en informes JSON/TXT sin cifrar.
- No se copian carpetas de perfiles ni bases Chromium automáticamente.
- No se salta el cifrado del proveedor ni se modifica la autenticación.
- No se envían respaldos ni informes por red: se guardan localmente en Windows.
- Un ZIP de extensión guardado manualmente no significa que la extensión esté cargada.
- Un estado "configuración leída" no demuestra que el proxy/fingerprint/cookie
  se haya aplicado realmente en Chromium.
- El respaldo cifrado es de **archivos propios seleccionados**; no es una
  exportación completa automática del proveedor.
- Probar cifrado/restauración solo con datos sintéticos en CI; probar perfiles
  reales y restauración únicamente tras copia de seguridad.

## 5. Verificación automatizada

\`\`\`powershell
dotnet run -c Release --project tools/tests/rc2-archive/Archive.Tests.csproj
\`\`\`

El workflow RC2 ejecuta las pruebas de JSON/TXT, separación de datos privados,
cifrado/restauración correcta y rechazo de contraseñas incorrectas antes de
construir el instalador Windows.

El control de privacidad de Windows y los permisos de DICloak siguen
prevaleciendo sobre las funciones de laboratorio.
