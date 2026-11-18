# DICloak Nativo 0.3.2 — botón Almacén y dimensiones

## Problema confirmado en la captura de usuario

La columna **Almacén** ya aparece entre **Estado** y **Operación**.
Sin embargo, su botón **Abrir** es más estrecho y alto que el botón Abrir
de Operación, y al hacer clic no ocurre nada visible.

## Cambios correctivos

1. El botón Almacén utiliza explícitamente **135 × 48 px**, centrado
   vertical y horizontalmente, dentro de una columna de 170 px. Se mantienen
   el color, el borde y las clases del botón Element Plus original.
2. El código `preload` de Electron ahora registra el método limitado
   `window.dicloakAlmacenLab.open(id)` tanto cuando
   `process.contextIsolated===true` (mediante `contextBridge`) como cuando
   es `false` (mediante `window`).
3. Si la versión del preload original ya expone
   `window.ipcRenderer`, el botón puede utilizarlo como alternativa para
   **un solo canal** `almacen-lab:open`. Esto no agrega una API general
   de IPC nueva ni cambia las credenciales.
4. Si la API no existe o el proceso principal rechaza la solicitud,
   se muestra un **mensaje de error visible** al hacer clic, en lugar de
   ignorar la respuesta silenciosamente. Así una prueba funcional puede
   mostrar un motivo como `UNTRUSTED_RENDERER`,
   `NATIVE_SHELL_NOT_CONNECTED` o una excepción
   `No handler registered`, sin adivinar.
5. Se conservan el almacenamiento separado por ID interno y la
   simulación HTTP de localhost con contenido `FAKE_`. No se leen
   cookies auténticas, sesiones ni tráfico externo.

## Instalación de ensayo

Artefacto del workflow `.github/workflows/build-dicloak-native-032.yml`:
`DICloak_Nativo_0.3.2_AlmacenLab_win_x64.exe`.

Se instala aparte de las otras versiones, en:

`%LOCALAPPDATA%\Programs\DICloak-Nativo-Almacen-Lab-032\DICloak.exe`

La barra del motor sigue mostrando **DICloak 3.0.7**. Es correcto:
**0.3.2 es la versión del instalador experimental**, no el motor del
proveedor. Ejecutar exactamente el archivo indicado, no un acceso directo
de 0.2.0, 0.3.0 o 0.3.1.

En **Perfiles** comprobar:

1. El botón **Almacén → Abrir** tiene el mismo ancho y altura que
   **Operación → Abrir**.
2. Al pulsarlo, se abre el Explorador en una carpeta con muestras
   ficticias bajo
   `%LOCALAPPDATA%\DICloak-Nativo-Almacen-Lab-030\<row.id>`.
3. Si aparece un aviso de error, **anotar el texto exacto**, que permite
   corregir la comunicación sin adivinar ni editar cookies.
4. Probar dos perfiles distintos y confirmar la separación de carpetas.

**La compilación y el arranque de Windows no garantizan por sí solos
el comportamiento después del inicio de sesión**; debe validarse desde
la UI real antes de liberar la versión.

Esta rama es experimental, altera la firma Authenticode del proveedor,
y no debe fusionarse en `main` ni redistribuirse como oficial sin
autorización y firma propias.
