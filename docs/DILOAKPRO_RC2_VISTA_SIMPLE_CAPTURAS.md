# RC2 LAB — captura, visualización y guardado para revisión manual

## Decisión de producto
El usuario desea **capturar, mostrar y guardar** evidencias. La comparación
contra su servidor es **manual**; diloakPRO no declara `COINCIDE` o
`DIFERENTE` por su cuenta.

## Pantalla principal simplificada

| Botón | Acción real |
|---|---|
| **Iniciar captura** | Comienza muestreo básico de procesos Windows y TCP |
| **Detener** | Detiene muestras Windows y guarda diagnóstico |
| **Ver evidencias** | Abre visor de observaciones y hashes, no muestra secretos |
| **Guardar** | Genera JSON, TXT y SHA-256 del diagnóstico |
| **Añadir archivo** | Permite elegir un archivo propio exportado y guardarlo cifrado con una contraseña |
| **Abrir carpeta** | Abre el Almacén por perfil en Windows |
| **Avanzado** | Muestra/oculta API V2, CDP, perfil, importación de comprobante del servidor y restauración |

La interfaz no requiere que el usuario compare nada. El propósito de guardar
**hash del servidor / hash del navegador / ID único** es facilitar la revisión
posterior de quien administra el servidor.

## Ejemplos de archivos propios

- `.crx` o `.xpi`: paquete de extensión exportado.
- `.zip`: archivo exportado por herramientas oficiales.
- `.json`: archivo de prueba (por ejemplo, configuración de proxy,
  fingerprint o cookies **sintéticas**).
- `.har`: exportación de red de una prueba que controlas.
- `.txt`: informe de laboratorio.

Todo archivo que elijas se guarda con **AES-256-GCM** en
`%LOCALAPPDATA%\diloakPRO\ArchivoRC2\Perfiles\Perfil-...\RespaldosCifrados`,
sin eliminar ni cambiar el original. El registro guarda fecha, tipo general,
tamaño y nombre del archivo cifrado; no copia el nombre original ni su
contenido a JSON/TXT abiertos. Una exportación guardada no demuestra que el
navegador la tenga aplicada.

## Qué es y qué no es captura

1. **Windows**: número de procesos y TCP; no muestra cuerpos HTTP.
2. **Servidor propio de laboratorio instrumentado**: cuerpo JSON de
   prueba y las categorías que realmente aparecieron, sin credenciales
   reales en informes abiertos.
3. **Chromium con CDP habilitado por el perfil**: se obtiene SHA-256 de la
   respuesta JSON de laboratorio observada; se registra como `CAPTURADO`,
   sin comparación automática.
4. **Prueba independiente del servidor**: importar `*.proof.json` añade
   ID, SHA y categorías al visor como `IMPORTADO`, sin dictamen.
5. **Archivos elegidos por el usuario**: se copian cifrados para un eventual
   análisis local del propietario. No se extraen automáticamente cookies
   de Chromium, contraseñas, tokens o credenciales de proxy.

Las funciones técnicas que requieren consentimiento siguen conservando sus
controles originales en **Avanzado**, pero no abarrotan la vista principal.

## Pruebas
- `dotnet run -c Release --project tools/tests/rc2-archive/Archive.Tests.csproj`
  incluye comprobación del modo `CAPTURADO` sin veredicto.
- El workflow RC2 construye el ejecutable Windows solo si pasan las pruebas y
  comprueba que el DICloak 3.0.9 oficial siga intacto.
- No afirmar que funciona con cookies reales, proxy aplicado, extensiones
  cargadas o login sin pruebas independientes que lo demuestren.
