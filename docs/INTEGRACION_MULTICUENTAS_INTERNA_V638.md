# DyclokPRO v6.38 — sesiones y pestañas internas

## Defecto comprobado en v6.37

- La barra de cuentas era una ventana WinForms externa, posicionada cada 750 ms en relación con la ventana oficial.
- Las cuentas auxiliares tenían APPDATA/LOCALAPPDATA diferentes, pero no se establecía explícitamente un `--user-data-dir` de Chromium.
- El gestor daba por abierta una cuenta al devolver un PID de `Process.Start()`, aunque Electron pudiera cerrar la segunda instancia o concentrar la primera.

## Cambio de arquitectura de v6.38

La aplicación nueva presenta **una ventana propia** `IntegratedAccountsWindow` con `TabControl` interno. Cada cuenta tiene su `EngineWindowHost` que utiliza `SetParent` sobre una ventana del **DICloak.exe oficial**. Son procesos nativos independientes alojados visualmente en el gestor; **no son módulos ejecutados en el mismo proceso Electron**.

El ejecutable y el `app.asar` oficial 3.0.7 permanecen sin modificar. Sus tokens, clientes HTTP y firmas firmadas permanecen bajo control del proveedor.

La cuenta principal preserva los directorios de Windows originales; las auxiliares reciben APPDATA, LOCALAPPDATA, TEMP, TMP y un `--user-data-dir` Chromium específico.

Cada pestaña puede mostrar el estado de arranque o de integración. Si Windows deniega el alojamiento visual por DPI/permisos, el proceso sigue vivo y puede recuperarse como ventana externa; nunca se copian sesiones para remediar el fallo.

## Pruebas realizadas o necesarias

1. Compilación .NET Windows del nuevo host.
2. Comparación de rutas `--user-data-dir` para dos auxiliares.
3. Arranque de dos ventanas genuinas del motor original (sin introducir credenciales): aprobado en el flujo automático inicial.
4. Prueba de alojamiento HWND del motor oficial dentro de TabControl (CI bajo prueba).
5. Prueba en Windows del usuario: autenticar dos cuentas, cargar perfiles y cambiar pestañas múltiples veces.
6. Probar teclado, foco, maximizar, minimización y escalas de DPI 100%, 125%, 150%.
7. Verificar que las API keys locales estén asociadas a la instancia de cuenta correcta.

No considerar esta modificación equivalente al código fuente interno oficial ni declarar solución definitiva para el cierre de sesión hasta que la autenticación remota haya sido probada.

Documentación Windows: https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setparent
Documentación Electron: https://www.electronjs.org/docs/latest/api/app/
