# Línea de desarrollo DyclokPRO: base v6.28

**Decisión del proyecto (31 de octubre de 2026):** a partir de ahora, las correcciones y adaptaciones continuarán desde el instalador **DyclokPRO_6.28_win_x64.exe** y el código fuente de su tag `v6.28`. La nueva rama es `fix/v6.36-desde-v6.28-base`; no procede de v6.35 ni del gestor externo WinForms.

## Instalador de referencia verificado

- Publicación: https://github.com/luis5afp/Dyclokpropio/releases/tag/v6.28
- Instalador Windows x64: `DyclokPRO_6.28_win_x64.exe`
- SHA-256: `954016364fe3e4c1a41b54d810388f8ca79d67a184d3ad25993b74c2d2b1c606`
- Tamaño: `330865096` bytes
- Tag de origen: `v6.28` — commit `b8e9117fd034fccea4cb0d1bcc4bcdf466f4f68f`
- Fuente de compilación: `tools/release-v6-28-internal307-ab.py` y `.github/workflows/publish-v6-28-version-ab.yml`
- `release-build/v6.28/raw-archive-ui.js` y `raw-archive-backend.js` incluyen el archivador anterior.

## Comportamiento que se debe conservar

1. Ventana DyclokPRO original, no sustituirla por gestor externo ni por la pantalla oficial aislada.
2. Cuentas múltiples con pestañas superiores, nombres de cuenta, incorporación y cambio rápido entre cuentas; conservar `cuentas.json` y datos existentes.
3. Visualización, selección y apertura de perfiles de navegador dentro de la interfaz anterior.
4. Carpeta `Cuentas/<cuenta>/ArchivoOriginal/Perfiles`, archivo automático de JSON por perfil identificado y diagnóstico de configuración/proxy/cookies disponibles, sin reescribir datos originales.
5. Acceso a carpetas locales, perfiles locales, icono y marca DyclokPRO, sin perder los archivos de Chromium ya instalados.
6. No sobrescribir, descifrar, migrar ni borrar `Electron`, `Session`, `Engine307`, `ArchivoOriginal`, cookies o datos del usuario sin comprobar compatibilidad y consentimiento.

## Defecto reproducido pendiente — crítico

El paquete v6.28 NO es una versión autenticada estable. Su script de build comprueba que el cliente original es **2.8.17** y cambia solo `package.json.version` a **3.0.7** para una prueba A/B. No incorpora realmente el motor oficial 3.0.7.

El inicio de sesión puede funcionar y después **`POST /v1/env/list` devolver `code:300003`** y cerrar la sesión cuando cargan perfiles. No afirmar que el cambio de número de versión solucione esto: verificar la respuesta real, la versión del cliente esperada y compatibilidad de los módulos sin falsificar firmas ni credenciales. El motor oficial 3.0.7 dispone de comprobación de integridad de ASAR y rechaza las inyecciones internas del sistema anterior; no evadir ese control.

El antiguo archivador solo observaba JSON en XHR/fetch: **no descargaba automáticamente cookies completas, bookmarks, LocalStorage, IndexedDB ni todos los binarios del perfil Chromium**. Guardar un JSON de error no equivale a recuperar un archivo original.

## Orden de trabajo para siguientes cambios

1. Congelar y comprobar el EXE base v6.28 mediante SHA-256. Conservar una copia de seguridad de carpetas de usuario y prueba limpia de instalación/arranque.
2. Auditar la secuencia de inicio de sesión → perfil/lista → error `300003`. Recopilar únicamente ruta, método, código HTTP y código de negocio; redactar cookies, tokens, contraseñas y device IDs. Comparar contra un cliente oficialmente compatible con las mismas condiciones, sin suplantar cabeceras.
3. Corregir el cierre de sesión en una rama de prueba **sin eliminar funciones anteriores**. No ocultar mensajes legítimos de autenticación ni forzar acceso con credenciales inválidas.
4. Corregir la clasificación de perfiles para descartar `env/open_detail` y otros nombres de operaciones como IDs. Asociar carpetas con ID y nombre real recibidos y separar respuestas `General` de respuestas de un único perfil.
5. Portar únicamente funciones que tengan una interfaz autorizada y que superen pruebas reales, sin modificar archivos firmados/protegidos del proveedor.
6. Antes de publicar un nuevo EXE: CI Windows de instalación, visualización, navegación, sesiones separadas e integridad, **además de prueba manual del login, carga de todos los perfiles y apertura del Chromium**. Mantener v6.28 instalador para reversión.

## Limitación

Esta rama fija la **base de desarrollo**, no es una release v6.36 ni una corrección ya verificada del error `300003`. No publicar un instalador como «reparado» hasta que la prueba con sesión real pase.
