# diloakPRO con motor 3.0.9 y Diagnóstico externo (candidato)

Esta versión experimental agrega el botón flotante **Diagnóstico** como ejecutable independiente `diloakPRO.exe` al lado del **DICloak.exe** genuino. El motor 3.0.9 y su `resources/app.asar` quedan byte por byte intactos. El acceso directo abre `diloakPRO.exe`, que a su vez abre el motor original. No se inyecta código en el proceso de autenticación.

## Para probarlo en Windows

1. Descarga el artefacto de la ejecución de Actions correspondiente a esta rama y extrae el ZIP para obtener el instalador EXE.
2. Respaldar perfiles antes de instalar, aunque el instalador usa carpeta independiente `%LOCALAPPDATA%\Programs\diloakPRO-Motor309-Prueba`.
3. Usa el acceso directo **diloakPRO Motor 3.0.9 Prueba**, no el acceso directo del cliente DICloak antiguo.
4. Al abrirse DICloak debe aparecer un botón flotante azul **Diagnóstico** en su zona inferior derecha.
5. Pulsa **Diagnóstico → Iniciar**, abre un perfil de prueba y pulsa **Exportar JSON**. El informe se guarda en Descargas con prefijo `diloakPRO-Diagnostico-Windows309-`.
6. Comprueba que también puedes iniciar sesión y que Chromium realmente se abre. Estas funciones **no se prueban mediante el muestreo de red**.
7. Para cerrar el observador independiente, abre su panel y pulsa **Salir**.

## Datos que el diagnóstico captura

- Hora UTC de cada muestreo.
- Número de procesos `DICloak.exe`.
- Número de procesos descendientes identificables a través de Windows.
- Conteo de procesos `chrome.exe`, `chromium.exe`, `ginsbrowser.exe` que sean descendientes.
- Conteo de conexiones TCP atribuidas a los procesos descendientes mediante APIs Windows (no contenido).

## Lo que NO captura ni demuestra

- Respuestas JSON originales que recibe el motor interno DICloak, ni sus cabeceras privadas.
- Credenciales, cookies o tokens de sesión.
- Proxy/fingerprint/extensiones realmente aplicados por Chromium.
- Identidad exacta de un perfil por su PID, CDP o eventos internos de la aplicación.
- El módulo experimental completo de laboratorio R4 de la línea antigua 3.0.0.

El botón es una **interfaz externa superpuesta**, no un componente inyectado en el navegador. Esta limitación es intencional: editar el ASAR de un motor firmado podría romper su integridad o el inicio de sesión.

## Requisitos para extender a integral

Obtener datos con **APIs oficiales**, un plugin/puente autorizado del motor 3.0.9 o mediante un punto de pruebas específico de tu propio servidor. Nunca registrar tráfico privado de proveedores ajenos. La comparación SHA-256 íntegra de los mensajes del servidor y la verificación de sus efectos en Chromium deben mantenerse como **dos comprobaciones independientes**.

**Estado:** compilación y test de instalación automatizados ≠ validación de comportamiento en la PC del usuario.
