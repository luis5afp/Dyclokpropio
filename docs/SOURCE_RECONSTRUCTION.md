# Reconstrucción de código fuente

## Objetivo

Convertir el programa recuperado en un proyecto que pueda mantenerse y
modificarse en el futuro sin editar directamente bundles ofuscados/minificados.

La reconstrucción **no pretende afirmar que los archivos nuevos sean el código
fuente original**. Son equivalentes mantenibles creados a partir del
comportamiento y contratos observables del programa recuperado.

## Estrategia

### Capa 1 — preservación

Se conservan sin cambios:

- `dist/`
- `dist-electron/`
- plugins y binarios de runtime

El tag `v30.0.0` sirve como referencia histórica del programa recuperado.

### Capa 2 — contratos legibles

Se introducen:

- `src/shared/ipc-channels.js`
- `src/preload/index.js`
- `src/main/index.js`
- `src/main/legacy-bundle.js`

Estos archivos permiten que el código nuevo dependa de nombres estables en vez
de nombres generados por Vite.

### Capa 3 — extracción del proceso principal

Las funciones del bundle `dist-electron/main-CuCOh59n.js` se migrarán por
dominios: ventanas, perfiles/entornos, almacenamiento, kernels, red, RPA,
actualizaciones, logging y servicios locales.

Durante la transición, `legacy-bundle.js` mantiene compatibilidad.

### Capa 4 — reconstrucción Vue

Como no hay `.vue`, `.ts` ni source maps originales, la interfaz se migrará
por comportamiento:

1. inventariar rutas/chunks;
2. recrear shell y router;
3. recrear stores;
4. migrar pantallas una por una;
5. comparar con la aplicación recuperada;
6. sustituir chunks únicamente cuando haya paridad.

## Criterio de "completo"

Consideraremos terminada la reconstrucción cuando:

- el arranque ya no dependa de `dist-electron/main-CuCOh59n.js`;
- el preload ofuscado ya no sea necesario;
- la interfaz se compile desde fuentes en `src/renderer/`;
- las pruebas de contrato IPC pasen;
- `npm run build:win` genere un instalador funcional desde las fuentes
  reconstruidas;
- los bundles originales queden solo como referencia/archivo histórico.

## Rama de trabajo

La reconstrucción se realiza en `reconstruction-source` para no romper la rama
`main` mientras se valida cada capa.
