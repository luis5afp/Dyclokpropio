# Recuperar diloakPRO con el Diagnóstico ORIGINAL, no con panel externo

## Decisión basada en el diagnóstico del usuario

La versión 30.0.27 RC1 conserva «Diagnóstico de diloakPRO» **en la propia interfaz**. El informe de 20-11-2026 contiene 187 eventos de HTTP, IPC, procesos y conexiones. Indica cobertura parcial: no guarda cuerpos de respuestas HTTP y no verifica que Chromium aplicara cookies, proxy, extensiones o fingerprint.

El usuario ha pedido mantener **esa interfaz** y solucionar el inicio de sesión, en vez de adoptar un panel flotante independiente.

## Hallazgos verificados

- Esta rama conserva los módulos originales de interfaz, consola y observación junto a la captura del laboratorio.
- El paquete original del runtime todavía declara internamente **3.0.0**, mientras el servidor exige >=3.0.5.
- El motor oficial **3.0.9** ya fue comprobado con firma y versión internas. Integrarlo correctamente NO equivale a editar el número de versión.
- La firma/integridad del motor 3.0.9 puede fallar si se cambian archivos de su ASAR sin un mecanismo autorizado.
- El informe del usuario incluye al menos dos eventos IPC_NO_HANDLER: uno para get-cache-info y otro de categoría other. No se ha confirmado su causa.
- Las pruebas actuales de captura de laboratorio son parciales y no demuestran la configuración realmente aplicada en Chromium.

## Condiciones obligatorias de la reparación

1. Conservar en la **interfaz original** los botones Iniciar, Detener, Exportar TXT y Exportar JSON, así como las etapas, HTTP Node/renderer, IPC, procesos y conexiones.
2. Mantener la captura exacta byte por byte del servidor propio de pruebas, cifrada y activada expresamente; sin capturar otros orígenes.
3. Resolver la compatibilidad de inicio de sesión con el **motor genuino 3.0.9**, verificando firma, integridad y autenticación, sin modificar solo un nombre/versión o falsear cabeceras.
4. Encontrar un mecanismo de integración admisible y verificable con el motor actualizado sin alterar su firma. Si no existe, declarar este punto como BLOQUEANTE, no sustituir silenciosamente el panel.
5. Informar por separado: respuesta efectivamente capturada, configuración detectada y efecto observado en Chromium. Cuando no se pueda comprobar, indicar NO VERIFICADO.
6. Depurar IPC_NO_HANDLER contra un handler real; nunca silenciar errores.
7. Preservar perfiles y probar instalación, actualización, rollback, inicio de sesión y apertura de Chromium en Windows.

## Comprobaciones

La prueba de conservación del panel y de los módulos originales se ejecuta mediante:

  node tools/verify-diloakpro-original-preservation.cjs

La puerta de publicación bloquea intencionadamente mientras el motor siga en 3.0.0:

  node tools/verify-diloakpro-original-preservation.cjs --release-gate

Incluso una nueva cadena declarando 3.0.9 no basta: hace falta confirmar que es realmente un cliente compatible y que las sesiones y perfiles funcionan.

**No existe aún un instalador corregido ni se ha publicado una versión estable nueva.** La rama de panel flotante es experimental y no sustituye este trabajo.
