# DyclokPRO v6.43 — una sola ventana visible y recuperación del motor oficial

## Síntoma aportado por el usuario

Captura: DICloak 3.0.7 con perfiles en una ventana nativa al fondo y DyclokPRO en otra ventana vacía al frente. El usuario espera trabajar únicamente en la ventana de DyclokPRO.

## Causa de raíz encontrada en v6.42

En `Program.Main`, el lanzador ejecutaba `BrowserRibbon.StartNative("legacy")` **antes de crear** `IntegratedAccountsWindow`. A su vez, `IntegratedAccountsWindow.FormClosing` efectuaba `p.Host.Detach()` dejando **todos los procesos oficiales vivos**. Al reiniciar DyclokPRO, Electron podía aplicar su bloqueo de instancia única, reactivar la ventana anterior y terminar el nuevo PID; el gestor conservaba una referencia a un proceso terminado y quedaba una interfaz vacía, mientras la aplicación oficial original seguía fuera.

`EngineWindowHost.TryAttach` no podía corregir ese fallo porque solo incorpora el `MainWindowHandle` del proceso recibido. La prueba de versiones anteriores solo verificaba éxito de SetParent para un proceso nuevo, no recuperación del proceso superviviente ni ausencia de ventanas externas.

## Cambios de la versión

- **Manager first:** DyclokPRO muestra su propia ventana antes de lanzar el motor. La pestaña principal presenta estado de conexión y no queda vacía al fallar la recuperación.
- **Recuperación de proceso:** el gestor almacena `PID + fecha de inicio UTC + ruta exacta del EXE` por cuenta en `engine-running.json` (sin credenciales, cookies, URLs ni tokens). En el arranque confirma PID, fecha, ruta y sesión Windows y **recupera** el proceso anterior.
- **Compatibilidad anterior:** para la cuenta principal de v6.42 sin registro previo se busca una única instancia con ventana real del mismo `DICloak.exe` de la instalación y misma sesión de Windows. Los PID registrados para cuentas auxiliares quedan excluidos. Si hay varias coincidencias ambiguas, se muestra una instrucción clara en vez de mezclar sesiones.
- **Un solo espacio visual:** la integración exige `SetParent` al HWND del proceso oficial y la prueba verifica mediante `EnumWindows` que ese proceso no mantenga una segunda ventana de primer nivel visible en el escritorio.
- **Cierre conjunto seguro:** cerrar DyclokPRO envía `WM_CLOSE` al motor de cada cuenta. Tras un plazo de cierre normal, si siguen procesos vivos, presenta **tres opciones**: forzar (advertencia de datos sin guardar), dejarlos visibles fuera (explícito) o cancelar el cierre. Nunca fuerza la salida de forma silenciosa, nunca elimina perfiles ni tokens.
- **Fallo visible:** un error de registro, de arranque o de HWND muestra un mensaje en la pestaña y conserva el diagnóstico; no simula una cuenta conectada con una pantalla vacía.
- Mantiene la API firmada original 3.0.7, el `app.asar` oficial intacto, el NetLog KAIZEN optativo por cuenta y las sesiones Chromium aisladas.

## Arquitectura y límite

**Una ventana visible no significa un único proceso físico.** El cliente original sigue ejecutándose como `DICloak.exe` por debajo. No se dispone de su código fuente oficial, ni se incorpora dentro del proceso WinForms o se sustituye su cliente HTTP firmado. Sin la licencia y fuentes del proveedor, una reconstrucción íntegra del motor sería un proyecto distinto. El objetivo de esta versión es evitar DOS PROGRAMAS EN PANTALLA sin falsificar la estructura interna.

## Pruebas

`.github/workflows/verify-integrated-643.yml`:

1. Principal de 3.0.7 arrancado previamente y segunda llamada: mismo PID, sin segundo proceso Electron.
2. Inicio normal de ventana DyclokPRO primero; el motor se inicia cuando ya existe el host.
3. Un HWND oficial integrado, cero ventanas externas del mismo PID.
4. Dos procesos de cuentas separados, pestañas y cierre de secundaria.
5. Escribir texto de prueba dentro de otro proceso Win32 sin capturar credenciales.
6. Motor oficial 3.0.7 íntegro y NetLog opcional.

`.github/workflows/publish-v6-43-one-window.yml` repite las pruebas sobre el EXE instalado antes de publicarlo.

## Prueba manual decisiva en tu Windows

1. **Respalda** `%LOCALAPPDATA%\DyclokPRO\Cuentas`.
2. Cierra las ventanas de DyclokPRO/DICloak antes de instalar (evita reemplazar ficheros activos).
3. Instala v6.43 y abre DyclokPRO desde su acceso directo. El programa debe abrir su host, mostrar el estado inicial y enseñar DICloak **dentro** de su pestaña, no como aplicación duplicada.
4. Abre otra cuenta con `+`, inicia sesión, cambia entre pestañas y revisa que ningún motor quede como segunda ventana al fondo.
5. Cierra DyclokPRO. El motor debe aceptar cierre normal; si no, se mostrará un diálogo explícito con tres opciones.
6. Ábrelo otra vez y verifica la recuperación de las cuentas guardadas sin pantalla blanca.
7. Si hay dos DICloak independientes con ruta diferente al del paquete, cierra el cliente oficial externo. DyclokPRO nunca debe secuestrar o cerrar un proceso no asociado de otro proveedor/instalación.

**No afirmar que login real múltiple haya sido probado por CI**. El usuario debe confirmar en su Windows.
