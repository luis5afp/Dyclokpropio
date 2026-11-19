# diloakPRO 30.0.23 RC10 — Diagnóstico de origen HTTP y activación Chromium

## Qué corrige

La RC9 registra las solicitudes HTTP del proceso principal y puede usar CDP para observar HTTP de las páginas Chromium, **pero** la sesión del navegador queda `not_configured` si faltan variables. Cuando las rutas de servidor contienen identificadores, la auditoría muestra `/:id`. Sin información de dominio ni tipo de recurso cuesta saber qué servidor produjo cada HTTP 200.

RC10 amplía los **metadatos autorizados** sin revelar credenciales:

- Dominio de origen para solicitudes Node HTTP/fetch y para recursos web de Chromium.
- Nombre de la familia del endpoint (proxy, env, session, login, gateway, etc.).
- Segmentos estructurales de ruta en lista permitida; los identificadores variables siguen ocultos como `:id`.
- Nombres de parámetros de consulta **solo** de una lista permitida (por ejemplo `page`, `limit`), nunca los valores.
- Respuestas HTTP Node: código, grupo `2xx/3xx/4xx`, tipo MIME conocido, codificación gzip/br/identity/etc., tiempos y bytes observados.
- Respuestas Chromium CDP: dominio, MIME, HTTP/1.1 o h2/h3, origen de caché o service worker, redirecciones 3xx y duración, si la sesión está vinculada.
- Contadores y causas de rechazos de cookies reportados por CDP, sin sus valores.
- Diagnóstico CDP: motivo concreto de `not_configured` o `unavailable`, como puerto ausente, clave ausente, acceso denegado, endpoint no soportado, inspector remoto deshabilitado, WebSocket no disponible o sesión de otro perfil.

## Activación (no automática y sin evasiones)

1. En la aplicación DICloak, consulta **Más → Configuración → Open API** y verifica que tu cuenta tenga la función habilitada.
2. En el perfil de pruebas, habilita **Remote Inspector** si está disponible y autorizado.
3. Identifica el puerto local real de Open API, que **NO** es el puerto del proxy. No pruebes con puertos aleatorios.
4. En la misma PowerShell desde la que lanzarás diloakPRO:

```powershell
$env:DILOAKPRO_DIAG_CDP_ENABLE = '1'
$env:DILOAKPRO_DIAG_API_PORT = '52140'   # EJEMPLO, sustituir por el real
$env:DICLOAK_LOCAL_API_KEY = Read-Host 'Introduce clave Open API local (no compartir)'
& 'RUTA_REAL_AL_EJECUTABLE_DICloak.exe'
```

La API local **debe** responder con el mismo ID de perfil, su estado `running` y el puerto/WS de depuración. La RC10 no busca claves, no enumera puertos y no se conecta a navegadores arbitrarios. Un perfil abierto no demuestra que su Remote Inspector esté habilitado.

La documentación de DICloak describe `GET /openapi/v2/profiles/{profileId}/session` en su [Local API V2 Runtime Interface](https://dicloak.crisp.help/en/article/local-api-v2-runtime-interface-t3iabr/) y el ajuste [Remote Inspector](https://dicloak.crisp.help/en/article/personal-settings-profile-preferences-1jt4g7w/). No todas las versiones o planes de DICloak disponen de estas opciones.

## Limitaciones de cobertura

El observador se conecta al Chromium de perfil identificado **después** de la fase de apertura; puede perder peticiones iniciales. El modo optativo permite observar hasta 60 segundos tras abrir, límite 120 segundos desde la solicitud. Si CDP está desactivado o no hay sesión confirmada, las solicitudes Chromium figurarán como cero y el panel dirá **por qué**; cero no significa ausencia de tráfico.

Ni un HTTP 200 ni `Set-Cookie` en una respuesta demuestran persistencia de cookies. Un indicador de uso de cookies no incluye su valor. La IP/puerto de conexión puede pertenecer a un proxy o una CDN y no acredita la IP de salida del perfil.

No se extraen cuerpos HTTP, parámetros de autenticación, cabeceras completas, contraseñas, tokens, cookies, códigos 2FA ni bases de datos de Chromium. **No hay archivado automático.** El usuario puede exportar voluntariamente JSON/TXT con metadatos. Dominios y rutas estructurales pueden revelar hábitos de navegación: revisar antes de compartir.

## Pruebas automatizadas

```bash
node --test tools/test-diloakpro-contexto-http-3023.cjs
node --test tools/test-diloakpro-chromium-cdp-3022.cjs
```

Windows CI prueba también el ASAR, integridad del ejecutable, migración de instaladores NSIS y arranque básico. RC10 es experimental y requiere una prueba real con Open API/CDP en el equipo del usuario, no solo una simulación. No redistribuir binarios originales de terceros sin los permisos pertinentes.
