# v30.0.10 — reparar excepción por SHA256 interno nulo en expandCheck

## Evidencia
El informe Dyclok-Diagnostico-Completo-20261026-083848.txt registra 175 eventos.
Durante la apertura del perfil 244, fetchEnvInfo y otras etapas previas
terminaron. La fase expandCheck comenzó, el IPC generate-sha256-hash-for-plugins
respondió null y poco después expandCheck falló con UNCLASSIFIED.
No se alcanzaron paramsMerge ni openEnv.

## Causa local reproducible
El controlador original utiliza la expresión:
    r="fulfilled"===n.status?n.value:""
Y más tarde:
    r.slice(0,10)
Si el IPC resuelve con null, se produce TypeError antes de la validación remota.
Este error es reproducible en el handler real del renderer recuperado.

## Parche limitado
Se normaliza solamente el valor nulo/no-string:
    r="fulfilled"===n.status&&typeof n.value==="string"?n.value:""

- Hash real de tipo cadena: se conserva intacto.
- Null, excepción o tipo inesperado: hash ausente (cadena vacía), nunca falso hash válido.
- Se mantienen las comprobaciones SHA256, el verificador remoto y el bloqueo
  obligatorio cuando el servidor rechaza la integridad.
- No se cambia caché, extensiones, perfiles, configuraciones ni cookies.
- El parche se instala después de las comprobaciones de base y antes del EXE.

## Pruebas de regresión
El nuevo test ejecuta el handler real expandCheck de la distribución:
1. Antes del parche, null causa TypeError antes de enviar al servidor.
2. Después del parche, null llega como hash ausente al verificador remoto.
3. El rechazo del servidor sigue bloqueando con EXPAND_SHA256_CHECK_FAIL.
4. Si el servidor aprueba, continúa sin alterar el valor vacío.
5. Los hashes auténticos pasan sin modificaciones.

El CI prueba sintaxis JS, compatibilidad de la base y el arranque del EXE.
La compilación NO prueba el perfil real 244 ni el servidor remoto.

## Después de instalar
Respaldar perfiles, abrir Diagnóstico, pulsar Iniciar y abrir el perfil 244.
Si falla, pulsar Detener, Exportar TXT y compartir el informe.
No se garantiza corregir una extensión o recurso ausente en Windows ni un
rechazo legítimo de integridad del servidor. Se corrige la excepción por null.
