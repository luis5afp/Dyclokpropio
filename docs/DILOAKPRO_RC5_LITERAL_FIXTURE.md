# diloakPRO RC5 — Prueba literal de respuesta sintética

## Qué permite verificar
El propietario de un **servidor de laboratorio** puede devolver datos totalmente ficticios
(correo de ejemplo, contraseña inválida, configuración de proxy simulada y cookies de prueba)
para inspeccionarlos **sin máscara ni sustitución** en el panel Diagnóstico y en el JSON exportado.

- `literalBodyText`: texto UTF-8 del cuerpo observado, carácter por carácter, sin parsear ni reformatear.
- `literalBodyBase64`: representación reversible de **los bytes recibidos**; no es cifrado ni un resumen.
- `literalBodySha256`: SHA-256 del cuerpo observado para comparación con el servidor.
- `literalSetCookieValues`: valores exactos de las cabeceras `Set-Cookie` de esa respuesta,
  en orden (sin renombrarlas ni ocultarlas).

El JSON puede escapar caracteres según el formato JSON; al **interpretar** la cadena
se recuperan los mismos caracteres originales. Para igualdad de bytes, comparar Base64
o SHA-256 calculado con los mismos bytes del cuerpo enviados desde el servidor.

## Activar únicamente para tu servidor de pruebas

1. Usa una URL HTTPS **completa y exacta**, por ejemplo
   `https://laboratorio.example.invalid/fixture/rc5?caso=1`, o un servidor
   HTTP local en `127.0.0.1`, `localhost` o `[::1]`.
2. Antes de iniciar el programa experimental, define la variable de entorno
   `DILOAKPRO_TEST_LITERAL_URL` con esa URL. En PowerShell:
   ```powershell
   $env:DILOAKPRO_TEST_LITERAL_URL = 'https://laboratorio.example.invalid/fixture/rc5?caso=1'
   # A continuación, inicia el ejecutable experimental desde la misma sesión.
   ```
3. En el endpoint, responde **HTTP 200** con:
   ```http
   X-Diloakpro-Fixture: synthetic-only-v1
   Content-Type: application/vnd.diloakpro-lab+json; charset=utf-8
   Set-Cookie: sesion=SOLO_PRUEBA_123; HttpOnly; Path=/
   ```
   Incluye dentro del cuerpo los campos ficticios que quieras comparar:
   ```json
   {
     "correo": "prueba+ñ@ejemplo.invalid",
     "contrasena": "FALSA_Aa09!ñ💡|=+",
     "proxy": {"host": "proxy.example.invalid", "usuario": "falso", "clave": "SOLO_PRUEBA"},
     "cookie": "sesion=SOLO_PRUEBA_123"
   }
   ```
4. Abre el panel **Diagnóstico de comunicación** y pulsa
   **Consultar servidor de prueba**. Ese botón envía un GET sin
   cookies, credenciales, autenticación ni proxy del perfil real.
5. Comprueba el apartado **Contenido literal de pruebas** y usa
   **Guardar JSON en Descargas**. Busca el evento `native_http_lab_literal`.
   Compáralo con los bytes que registró **tu propio servidor**.

La captura solo se habilita si coinciden la URL exacta configurada y las
cabeceras de respuesta, y solo si el cuerpo no excede 64 KiB. Se admiten como
máximo 8 cabeceras Set-Cookie de hasta 8192 bytes cada una. No se siguen
redirecciones automáticamente. El modo sin configuración se mantiene sin
captura literal.

## Alcance y límites importantes
- **No** registra globalmente credenciales, contraseñas o cookies del perfil DICloak.
- La prueba manual confirma la respuesta del endpoint sintético al cliente de Node
  dentro de la aplicación. **No verifica** si Chromium recupera o restaura
  credenciales/proxy/cookies del perfil, ni si una ruta de producción del proveedor
  cambia su contenido.
- Si quieres comprobar todo el trayecto entre servidor y navegador, necesitas
  evidencias de cada extremo de ese trayecto específico; el registro Node no
  equivale a inspeccionar las conexiones nativas de Chromium.
- El informe literal se guarda localmente y contiene **valores sin máscara**:
  no lo compartas si el servidor incluyó por error credenciales reales.
- Estado: cambios experimentales en GitHub; falta validación de instalador Windows.

## Pruebas automatizadas

```shell
node --test tools/test-diloakpro-lab-literal-rc5.cjs
```

Las pruebas comparan texto, Base64, SHA-256, Set-Cookie, el endpoint manual,
el JSON exportado/guardado y la denegación de respuestas normales o URL distintas.
