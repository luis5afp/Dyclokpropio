# DyclokPRO v6.18 — investigación del cierre de sesión tras entrar

Base: tag v6.17, que distribuye exactamente el binario v6.16, SHA256 03621252bb532766d984838213e25411b69220ff491ea86d0f81a928c104ff81.

## Código revisado
- release-build/v6.10/main-account-prelude.js: crea directorios de datos independientes por cuenta antes de cargar el bundle original.
- release-build/v6.12/session-durability.js: flush periódico de datos persistentes y cookies; no modifica caducidad, tokens, ni revocación.
- release-build/v6.16/archive-audit-backend.js: sólo lee metadatos de archivos archivados, sin acceder a credenciales.

## Hipótesis, NO causas confirmadas
- El renderer navega a login por expiración o error de API.
- La cuenta usa un contexto Electron diferente al esperado.
- El servicio remoto revoca o rechaza la sesión.
- Un evento de logout automático borra el estado tras la autenticación.

## Pruebas requeridas antes de proclamar corrección
1. Cuenta de prueba autenticada: inicio y permanencia en sesión.
2. Cierre y reapertura: comprobar persistencia válida sin forzar cookies de sesión expiradas.
3. Dos cuentas distintas simultáneas: comprobar aislamiento de cookies, perfil de red y carpeta de datos.
4. Simular expiración/401/403 y verificar que sólo el contexto correcto se desconecta.
5. Recopilar únicamente eventos de navegación, clases de error y timestamp; nunca tokens, passwords o cookies.
6. Instalación en Windows, inspección del ejecutable y comparación de SHA256.

NO reemplazar el binario por un instalador renombrado. NO desactivar revocación del servidor ni falsificar vigencia del token.
Estado: investigación preparada, no existe aún cambio de autenticación validado ni release v6.18.
