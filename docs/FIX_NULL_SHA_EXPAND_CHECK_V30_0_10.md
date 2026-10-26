# v30.0.10 — corregir el fallo por SHA-256 nulo al abrir perfiles

## Evidencia real de la v30.0.9

El informe de sesión aportado por el usuario el 26 de octubre de 2026, con 175 eventos, muestra:

- `fetchEnvInfo`, `proxyCheckResult` y `cookieEncryptPlan` finalizaron correctamente;
- `expandCheck` comenzó a las 08:37:50.336Z;
- el IPC `generate-sha256-hash-for-plugins` devolvió `null` a las 08:37:50.386Z;
- `expandCheck` falló a las 08:37:50.416Z, con código `UNCLASSIFIED`;
- no se registraron `paramsMerge`, `lockEnv` ni `openEnv`.

El archivo no identifica el perfil, la respuesta remota ni la causa por la que el
manejador IPC devolvió `null`. El error anterior de JavaScript sí es reproducible
en la rutina `EXPAND_CHECK` de la v30.0.9: el hash puede ser `null` y la
construcción del identificador de verificación usa `r.slice(0,10)`, que lanza
`TypeError` antes de consultar al verificador remoto.

## Corrección estricta

En la única expresión de construcción del identificador de la extensión interna
se utiliza `String(r??"").slice(0,10)`. La variable `r` **no se modifica**:
si contiene `null`, se envía `null` al servidor de validación de integridad
como valor de `sha256Hash`, sin forzar un hash, un estado positivo o un éxito.
El servidor mantiene el derecho y obligación de rechazar el hash faltante.

El archivo original de renderer permanece inalterado en GitHub. El parche
verifica el SHA256 original `7de2a353b92c130b93b5c455826efaa6e1c8788cf44f99185b450e61379dc0df`,
aplica las modificaciones revisadas y obliga a obtener el nuevo SHA256
`0859bd51a5703b4c01c19c38878642315215341733d5080770faee9a85bb5925`.
La instrumentación de apertura se aplica después de la verificación.

## Prueba de regresión

La suite `verify-legacy-expansion-compat.js` ejecuta el controlador real de
`EXPAND_CHECK` extraído del JS restaurado, simulando exactamente la respuesta
`null` del IPC. Debe alcanzar la validación remota, pasar el valor `null`
original y bloquear el perfil si el verificador rechaza la integridad. Sin
la corrección, dicha prueba falla con `TypeError`.

## Alcance y limitaciones

La corrección elimina la excepción nula identificada, pero **no garantiza**
que el perfil abra si el generador local sigue sin producir el hash correcto
o el servidor remoto lo rechaza. No se modifica caché, cookies, extensiones,
grupos, identidades de perfiles ni validaciones de seguridad. Si la nueva
versión muestra `EXPAND_SHA256_CHECK_FAIL`, el siguiente trabajo deberá
identificar por qué el IPC no genera el hash interno.
