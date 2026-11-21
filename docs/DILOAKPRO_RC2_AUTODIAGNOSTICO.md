# RC2 LAB — diagnóstico automático autorizado

## Qué soluciona
Para reducir pasos manuales se añadió **Autorizar diagnóstico automático**.
La autorización ocurre **dentro del programa** con un diálogo claro:
- la API V2 se consulta solo en `127.0.0.1`;
- solo se usa el puerto local documentado habitual **52100**, o el puerto que
  indique la persona si su instalación utiliza otro;
- se consulta la lista de perfiles que están **abiertos** (sin crear, abrir,
  cerrar ni alterar perfiles);
- si existe uno solo, se selecciona sin pedir el ID;
- si hay varios, se exige elegir uno para no mezclar información privada;
- se consulta su estado y configuración por API V2 de solo lectura;
- si el perfil informa un `debug_port` autorizado, se solicita conectar CDP
  para capturar **metadatos** HTTP (solicitud, código de estado, errores);
- el Almacén RC2 guarda resultados JSON/TXT/SHA-256 por perfil.

## Lo único que necesita una autorización inicial
Según la guía oficial de DICloak, la API local requiere la cabecera
`X-API-KEY`. Por eso el programa **no puede obtenerla ni concederse permiso
a sí mismo**: hay que pegar la clave legítima de Open API una vez en el campo
**Clave API local** durante la sesión actual. La app mantiene esa clave solo
en memoria de proceso para repetir comprobaciones autorizadas; no la escribe
en JSON, TXT, respaldos, documentación ni GitHub.

Para encontrarla: DICloak → Más → Configuración → Open API.
Al terminar, pulsa **Revocar acceso** para liberar la referencia a la clave
en memoria y desconectar el monitor. Cerrar la aplicación también interrumpe
las consultas y libera la autorización temporal.

El puerto de API puede quedar vacío inicialmente para probar únicamente el
valor habitual documentado `52100`; si la API no responde, el programa indica
que se requiere el puerto exacto. **No hay escaneo de puertos**.

## Flujo de uso
1. Abre DICloak y un perfil de prueba propio.
2. En RC2 abre **Diagnóstico**.
3. Copia una vez tu clave local `X-API-KEY` al campo de clave (no la envíes por chat).
4. Deja vacíos **Puerto API** e **ID de perfil** si DICloak usa el puerto
   habitual y solo hay un perfil abierto.
5. Pulsa **Autorizar diagnóstico automático**, lee el alcance y confirma.
6. Si hay varios perfiles abiertos, selecciónalo en el desplegable y pulsa
   **Usar perfil elegido**.
7. Si CDP está deshabilitado por la configuración de seguridad del perfil, no
   se lo habilita por la fuerza: el informe lo indica **NO VERIFICADO**.
8. Al terminar, **Detener**, **Guardar Almacén** y **Revocar acceso**.

## Lo que no debe prometer
- No es posible otorgar permisos o extraer una clave secreta del proveedor sin
  la intervención/autorización de la persona propietaria.
- La captura HTTP CDP no obtiene cuerpos JSON exactos, cookies, tokens,
  contraseñas ni credenciales de proxy.
- Estado `running` no equivale a usuario autenticado.
- Configuración de proxy, fingerprint o extensiones no demuestra que Chromium
  la haya aplicado. Verificación real requiere comprobación separada.
- DICloak puede deshabilitar Remote Inspector; no se modifica ni sortea esa
  restricción y el motor original 3.0.9 permanece intacto.
- No hay copia de sesión ni de credenciales en texto plano.

## Fuentes oficiales
- https://help.dicloak.com/api-development-guide/
- https://help.dicloak.com/zh/local-api-v2-%E8%BF%90%E8%A1%8C%E7%8A%B6%E6%80%81%E6%8E%A5%E5%8F%A3/
- https://help.dicloak.com/zh/local-api-v2-%E7%8E%AF%E5%A2%83%E6%8E%A5%E5%8F%A3/
