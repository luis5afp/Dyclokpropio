# diloakPRO 30.0.20 RC7 — Almacén de diagnósticos automático

## Motivo

La RC6 registraba metadatos durante la apertura pero solo los exportaba
a Descargas al pulsar manualmente «Guardar JSON + TXT». El botón de
«Almacén → Abrir» de la aplicación oficial es un espacio distinto:
**no muestra los diagnósticos**. Esto explica el informe del usuario
«Almacén está vacío» pese a haber registrado 71 eventos.

## Comportamiento RC7

1. Pulsar **Operación → Abrir** inicia la captura temporal de metadatos.
2. El sistema deja de observarla unos 15 s después del final de apertura
   o falla, con límite máximo de 120 s.
3. En el evento `capture_finished`, el controlador **guarda
   automáticamente** dos archivos (JSON y TXT) del mismo nombre base,
   aunque el panel nunca haya estado abierto.
4. Los archivos se guardan dentro del directorio de datos del usuario
   de Electron, en `Almacen/Diagnosticos/perfil-<HMAC>/`. Los IDs
   privados del perfil no se incluyen en la ruta ni en los informes.
   Un archivo de clave local `.archive-key` permite volver a consultar
   el perfil tras reiniciar. La clave no se exporta.
5. En **Perfiles → Diagnóstico → Ver**, aparece ahora
   «Almacén → Historial de diagnósticos guardados automáticamente».
   La sección lista cronológicamente los 50 registros más recientes
   del perfil y permite **Ver JSON** y **Ver TXT** allí mismo.
   El archivo seguirá existiendo en el disco hasta que el usuario
   decida eliminarlo, sin borrado automático.
6. Si el sistema no puede guardar, aparece el evento `archive_failed`;
   el fallo de disco no detiene la apertura de Chromium.
7. El botón manual «Guardar JSON + TXT en Descargas» se mantiene como
   exportación separada e independiente.

**Atención:** el botón original **Almacén → Abrir** sigue usando el
mecanismo del fabricante y NO es el nuevo historial. La nueva sección
está dentro de **Diagnóstico → Ver**.

## Qué guarda

- Eventos de apertura, fechas exactas de inicio y fin.
- Rutas HTTP saneadas, estado, tamaño observado, duración e IP/puerto
  cuando están disponibles.
- Resumen del estado de proxy, cookies, extensiones, huella y navegador.
- Limitaciones de cobertura. **Etapa completada ≠ configuración aplicada**.

## Qué NO guarda

No almacena correos de cuentas, valores de cookies, contraseñas,
tokens, códigos 2FA, credenciales de proxy, cabeceras completas,
bodies HTTP ni datos internos de Chromium. No se intercepta todo el
tráfico de navegador, ni Node fetch/WebSocket. No se desactiva TLS.

El fichero contiene direcciones IP observadas y puede contener
metadatos sensibles sobre las conexiones. Debe protegerse como un
archivo de diagnóstico privado.

## Pruebas de regresión

```bash
node --test tools/test-diloakpro-archivo-automatico-3020.cjs
```

Comprueba guardado sin abrir el panel, recuperación tras reinicio,
separación de perfiles, rechazo de rutas arbitrarias, ocultación de
datos no permitidos y comportamiento con disco lleno.

Windows CI reconstruye ASAR y PE, instala el NSIS sobre RC2 y hace
una prueba básica de arranque. Falta siempre verificarlo con
un perfil propio de pruebas en el equipo del usuario.

Versión experimental no firmada digitalmente. La redistribución del
motor original de terceros requiere autorización.
