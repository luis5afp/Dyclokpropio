# DyclokPRO v6.44 — identificación visible de cuentas y carpeta de diagnóstico

## Síntomas confirmados en la captura del usuario

- La cuenta oficial abierta muestra perfiles reales (44), pero en la barra de DyclokPRO hay nombres genéricos como `Iniciar sesión` y `Nueva cuenta`.
- El gestor obtenía la etiqueta de `cuentas.json` o `cuenta-nombre.txt`, **no del inicio de sesión dentro del proveedor**.
- El panel de diagnóstico estaba escondido en `⋯` y `Abrir diagnóstico` enviaba al journal general, no a la carpeta de la cuenta seleccionada.
- Una ventana visible `DICloak.exe` no demuestra que se haya autenticado el usuario ni que sus perfiles remotos se hayan cargado.

## Correcciones

1. Cabecera simplificada: `Nombre`, `Carpeta`, `Diag`, `+` y `⋯`.
2. Las etiquetas genéricas históricas `Iniciar sesión 4`, `Cuenta 841ab3`, `Nueva cuenta...` se muestran explícitamente como **Sin identificar**. No se atribuye un nombre de usuario falso.
3. Cuando se abre desde `+` una cuenta guardada sin nombre válido, se ofrece identificarla con un **alias local** que se conserva en `cuentas.json` y `cuenta-nombre.txt`. Se puede omitir; no interrumpe el motor y no se leen tokens ni contraseñas.
4. `Nombre` permite asignar/corregir alias de la cuenta seleccionada, incluida la cuenta principal. La pestaña y el panel reflejan el mismo nombre.
5. `Carpeta` abre directamente `%LOCALAPPDATA%\DyclokPRO\Cuentas\<id>\Diagnostico\<Alias>_<id_corto>\` de la cuenta seleccionada. Se crea un `LEER_PRIMERO.txt` con indicación del journal, las capturas de Chromium originales, posibles carpetas con alias anteriores y los archivos originales de perfiles ubicados en el directorio de su cuenta.
6. Dentro del panel `Diag` se muestra `Carpeta de esta cuenta`, `Capturar red`, `Actualizar` y `Eventos generales`.
7. Los registros NetLog se conservan byte por byte. Se crea un índice de rutas, **no se copian ni reescriben los registros, solicitudes o cookies**. Los datos sensibles permanecen locales.
8. La descripción de estado se modifica de «Ventana integrada» a «Motor visible; login/perfiles NO verificados». No equivale una ventana abierta a perfiles remotos disponibles.

## Límite del nombre automático

No disponemos de una API autorizada que entregue a DyclokPRO el nombre de la persona autenticada dentro del `DICloak.exe` oficial. Por lo tanto, v6.44 ofrece un alias local seguro, **no promete leer automáticamente el nombre Eddie/Danna desde la pantalla del motor**.

Si quieres extraer nombres desde el proveedor de forma automática, hace falta primero confirmar una API oficial o interfaz documentada que proporcione esa información con permisos, sin robar ni reutilizar sus tokens.

## Límite del «guardar todo»

NetLog, de forma opcional y previa al inicio, guarda los eventos que Chromium permite; no garantiza todos los POST, tráfico Node.js, datos remotos de perfiles o exportaciones. `eventos-proceso.jsonl` registra arranque/cierre. `ArchivoOriginal/Perfiles` conserva los archivos realmente existentes sin crear perfiles ficticios.

La carpeta muestra **todo lo que realmente haya sido capturado**, no un volcado completo garantizado del tráfico del motor.

## Pruebas

El flujo `.github/workflows/verify-integrated-644.yml` y el instalador `.github/workflows/publish-v6-44-account-diagnostics.yml` verifican: alias local guardado, marcadores genéricos, carpeta nombrada, conservación exacta de bytes de un archivo de prueba NetLog, teclado, motor sin modificación, recuperación del proceso, pestañas de dos cuentas y empaquetado NSIS.

**Sigue pendiente una prueba con tus dos cuentas reales:** ingresar en cada una, abrir la lista de perfiles, verificar si aparecen los perfiles correctos, y constatar que el cambio de cuentas no altera las sesiones.

Respalda `%LOCALAPPDATA%\DyclokPRO\Cuentas` antes de instalar.
