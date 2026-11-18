# Verificar datos del servidor y almacenamiento nativo Chromium por perfil

## Objetivo exacto

El laboratorio necesita comprobar que lo que entregó el servidor de pruebas
corresponde a lo que recibió el navegador y que **los archivos del
almacenamiento nativo Chromium** no se alteraron, con cookies, datos locales
y bases de datos conservados en **su formato original**.

Eso son **dos comprobaciones independientes**:

1. **Fidelidad de transferencia**: registrar en el servidor de ensayo el
   tamaño y SHA-256 de cada respuesta binaria. Comparar contra el tamaño y
   SHA-256 del archivo recibido por el capturador autorizado *antes de
   cualquier conversión*. Ambos hashes deben coincidir si son exactamente
   los mismos bytes. Una respuesta transformada por compresión HTTP, por
   la pila del navegador o por el programa no tiene necesariamente la
   misma representación en cada punto de la transmisión.
2. **Integridad del almacenamiento nativo**: leer *solo* los bytes de los
   archivos nativos de un perfil Chromium **cerrado**, calcular hashes
   SHA-256 agregados por categoría y comparar dos instantáneas. Si
   cambiaron los hashes, sabemos que cambió el contenedor en disco;
   **eso no prueba por sí solo qué dato llegó desde el servidor**.

## Por qué una cookie no es idéntica en disco a Set-Cookie

Las cookies de una respuesta HTTP se someten a las normas de Chromium:
aceptación/rechazo, dominio/ruta, expiración, particiones, etc. Pueden
persistirse en SQLite y, en Windows, normalmente protegerse con cifrado
propio del navegador o del sistema. **Conservar un archivo nativo sin
modificar no implica quitarle el cifrado original**, que es precisamente
parte de su formato nativo.

No desactivar ni deshacer esa protección, no reescribir `Cookies`,
`Login Data`, `Local Storage`, `IndexedDB`, `Session Storage`, ni
abrir bases de datos vivas con herramientas de escritura.

Para una comparación semántica del caso de prueba, el navegador puede
indicar a través de sus herramientas de diagnóstico si aceptó o bloqueó
la cookie **sin exportar su valor**. El protocolo de depuración puede
ofrecer eventos de respuesta, pero no todos los cuerpos estarán
disponibles, y el cuerpo expuesto puede ser una representación ya
transformada; nunca afirmar 100% de cobertura sin medir pérdidas.

## Módulo de integridad preparado

`tools/audit-chromium-native-storage.cjs`:

- Recibe únicamente una **ruta absoluta elegida explícitamente** para
  un perfil ficticio que esté **cerrado**.
- Lee los bytes existentes de: `Network/Cookies`, `Cookies`, los
  archivos asociados `-wal` y `-shm`, `Login Data`, `Local Storage`,
  `IndexedDB`, `Session Storage`, `WebStorage`, `Service Worker`,
  `Preferences` y otros metadatos nativos enumerados.
- Devuelve solamente cantidad de archivos, tamaño y SHA-256 acumulado
  de cada categoría. No lista cookies, contraseñas, perfiles ni
  nombres de archivo personales. No lee bases SQLite como tablas, no
  desencripta ni guarda una segunda copia de los datos.
- Rechaza symlinks y rutas sospechosas; informa cuando un archivo cambia
  durante la lectura. Requiere cerrar Chromium para evitar copias
  lógicamente inconsistentes.
- La salida **no** es un respaldo: solamente es un resumen de integridad.
  No representa la totalidad del tráfico, las cookies en memoria ni
  todo el estado del navegador.

### Ejemplo de prueba, no de un perfil real

`node tools/audit-chromium-native-storage.cjs "C:\ruta\a\perfil-de-prueba-cerrado"`

El programa entrega un JSON de hashes por categoría, sin valores.
No subir informes, bases de datos ni carpetas reales a repositorios
públicos ni adjuntar cookies/credenciales al chat.

## Estado de integración

**Todavía NO está enlazado al botón Almacén en DICloak.exe** y no realiza
captura de tráfico de una sesión activa. Se preparó deliberadamente como
módulo independiente y de solo lectura, probado con perfiles sintéticos
en Windows y Linux antes de plantear integración en una instalación.

Para un ensayo completo se requiere un dominio/endpoint propio y
autorizado, una identidad de sesión Chromium verificable por perfil,
un registro de hashes del servidor y un mecanismo controlado para recibir
solo respuestas del laboratorio, sin exportar valores de autenticación.
No hay en el repositorio evidencia de ese vínculo todavía.
