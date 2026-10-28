# DyclokPRO 51.0 — candidato, no publicado

Se preparó un script de compilación NSIS con comprobaciones de archivos esenciales de Electron/Chromium, sintaxis JavaScript y presencia del parche de expiración de sesión.

**No existe aún un instalador v51.0 validado en Windows**. La base `main` de este repositorio no contiene los bundles v50.8: se necesita el payload íntegro recuperado del instalador v50.8 del usuario y el parche de sesión aplicado, sin incluir perfiles personales en GitHub. Se intentó instalar NSIS en el entorno de análisis y no fue posible.

No publicar Release hasta verificar con cuentas de prueba: inicio, persistencia tras reinicio, cambio entre usuarios, cookies y acceso a perfiles. La hipótesis de unidades de expiración no confirma por sí sola la causa del cierre.
