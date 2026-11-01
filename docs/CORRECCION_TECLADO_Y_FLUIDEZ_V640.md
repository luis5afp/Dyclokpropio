# DyclokPRO v6.40 — escritura en cuentas auxiliares y rendimiento

## Problema reproducido en la captura de v6.39

Una cuenta auxiliar muestra el formulario de DICloak 3.0.7 pero el usuario no puede introducir credenciales. El motor no informó necesariamente un fallo de sesión. La causa principal en la integración es que la ventana Electron se aloja con `SetParent`, que solo transfiere parentesco y representación visual, no el foco de teclado entre hilos de GUI de procesos distintos.

## Código corregido

- `EngineInputFocus.cs`: lee `GetGUIThreadInfo`, preserva identificadores HWND (no datos de texto), establece el foco mediante `AttachThreadInput` y `SetFocus`, y desconecta la cola de entrada en `finally`.
- `EngineWindowHost.cs`: recuerda el control enfocado del motor antes de reubicar su ventana, y restaura el foco después de seleccionar la pestaña. Conserva la posibilidad de abrir la ventana original externamente.
- `IntegratedAccountsWindow.cs`: realiza la restauración tras la selección de cuentas y después del alojamiento inicial. No ejecuta esa restauración en el temporizador de actualización. El inicio de las cuentas auxiliares ahora se realiza en segundo plano mediante `Task.Run` para no bloquear la interfaz principal.
- Menú `⋯` -> **Activar escritura en esta cuenta**, o pulsar `Ctrl + Alt + F`. No se implementa captura de teclado.
- `EngineFocusSmoke.cs`: prueba sintética de escritura entre procesos Win32 independientes; solo confirma que el control de ensayo recibió la cadena ficticia. No utiliza la pantalla de login ni accede a contraseñas.

## Comprobaciones

El flujo `.github/workflows/verify-integrated-640.yml` exige: compilación .NET, prueba sintética de teclado entre procesos, motor oficial sin modificaciones, aislamiento Chromium por cuenta, dos ventanas independientes, alojamiento HWND y cambio de pestañas.

El flujo de empaquetado `.github/workflows/publish-v6-40-keyboard-focus.yml` añade una prueba de entrada real al instalador NSIS antes de autorizar la publicación de la versión experimental.

## Prueba manual decisiva que sigue pendiente

1. Respaldar `%LOCALAPPDATA%\DyclokPRO\Cuentas`.
2. Iniciar la cuenta principal y verificar perfiles.
3. Abrir una cuenta auxiliar y pulsar sus campos de correo y contraseña; escribir **manualmente** en ambos, sin compartir capturas de contraseñas.
4. Cambiar de pestaña, volver a la auxiliar y comprobar que puede seguir escribiendo.
5. Si un campo no responde, probar menú `⋯` > **Activar escritura en esta cuenta**. Si persiste, seleccionar **Abrir cuenta en ventana externa**: permite utilizar el motor original sin el alojamiento Win32.
6. Probar dos sesiones autenticadas con usuarios distintos, cambiar pestañas y reiniciar sin pérdida de sesión.

**Limitación:** el test automatizado demuestra el teclado en una ventana de prueba WinForms alojada entre procesos; no certifica la entrada HTML real en el motor Electron en todas las versiones de Windows, niveles de DPI o permisos. El ejecutable y `app.asar` del motor oficial 3.0.7 permanecen intactos.

**No registrar ni enviar contraseñas, cookies ni claves de API como evidencia.**
