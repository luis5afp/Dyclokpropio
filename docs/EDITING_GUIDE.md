# Guía de edición del proyecto recuperado

## Objetivo

Convertir gradualmente la aplicación recuperada en un proyecto mantenible sin perder la versión que ya funciona.

## Antes de modificar

1. Crea una rama nueva de Git, por ejemplo `recovery/main-cleanup`.
2. Conserva `dist-electron/main.js` y `main-CuCOh59n.js` sin modificaciones.
3. Haz cambios primero en archivos nuevos (`*.readable.js`, `src-recovered/`, `docs/`).
4. Prueba cada cambio antes de reemplazar un punto de entrada.

## Primer archivo ya reconstruido

`dist-electron/main.readable.js` es una versión legible equivalente al pequeño wrapper `dist-electron/main.js`.

Para probarla sin reemplazar nada, puedes cambiar temporalmente `package.json`:

```json
"main": "dist-electron/main.readable.js"
```

Después ejecuta:

```powershell
npm install
npm start
```

Si la aplicación se comporta igual, ese wrapper puede convertirse en el punto de entrada permanente.

## Siguiente prioridad

El siguiente objetivo técnico es dividir `dist-electron/main-CuCOh59n.js` en dominios identificables, por ejemplo:

- ventanas y ciclo de vida de Electron;
- IPC;
- perfiles/entornos;
- automatización/RPA;
- logging;
- red/proxy;
- actualizaciones;
- persistencia local.

No conviene renombrar variables masivamente hasta identificar cada dominio con pruebas.

## Interfaz Vue

La carpeta `dist/` es una compilación de producción. Para mejoras pequeñas se puede trabajar sobre chunks compilados, pero para mantenimiento serio conviene crear una nueva carpeta `src/` y migrar gradualmente las pantallas.
