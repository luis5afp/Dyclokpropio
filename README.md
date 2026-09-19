# Dyclokpropio — reconstrucción editable

Esta rama, `reconstruction-source`, contiene la reconstrucción editable y recompilable obtenida a partir del runtime recuperado.

## Estado

- El runtime recuperado se conserva como referencia.
- Todos los archivos recuperados JS/CSS/JSON/HTML que participan en el build tienen una copia editable versionada bajo `src/runtime/`.
- El preload y parte del proceso principal están reconstruidos en módulos legibles bajo `src/preload/`, `src/main/` y `src/shared/`.
- El renderer incluye componentes Vue reconstruidos bajo `src/renderer/` y un mirror editable completo para compatibilidad.
- Hay pruebas automáticas de contratos IPC, almacenamiento, preferencias de ventana, device info, preload y componentes Vue.
- El build reconstruido se valida en Windows y se somete a una prueba de arranque.

El informe completo está en `docs/FINAL_RECONSTRUCTION_REPORT.md`.

## Verificar la reconstrucción

```powershell
npm install --legacy-peer-deps
npx electron-builder install-app-deps
npm run verify:reconstruction
```

La comprobación `verify:editable-runtime` falla si algún archivo recuperado JS/CSS/JSON/HTML deja de tener cobertura editable.

## Ejecutar la entrada reconstruida

```powershell
npm run start:reconstructed
```

## Crear el instalador reconstruido

```powershell
npm run build:reconstructed:win
```

El instalador se genera en `release-reconstructed/`.

## Estructura principal

- `src/main/`: proceso principal reconstruido y capa de migración gradual.
- `src/preload/`: preload legible reconstruido.
- `src/shared/`: contratos IPC compartidos.
- `src/renderer/`: fuente Vue mantenible reconstruida e índices del renderer.
- `src/runtime/`: mirror editable completo del código/runtime recuperado.
- `reconstruction-analysis/`: análisis y trazas de recuperación.
- `reconstruction-work/`: resultados intermedios de desofuscación y formateo.
- `tools/`: extracción, verificación, construcción y análisis.
- `dist/` y `dist-electron/`: referencia del runtime recuperado.

## Límite de la recuperación

El instalador original no contenía source maps ni el árbol original de archivos Vue/TypeScript. Por eso no es posible recuperar de forma exacta comentarios, nombres locales eliminados por minificación, tipos TypeScript borrados durante compilación ni las fuentes de binarios nativos como `DicSyncService.exe`.

La reconstrucción sí está orientada a que la aplicación recuperada pueda editarse, verificarse y volver a empaquetarse sin depender de editar manualmente los bundles de referencia.

## Ramas

- `main`: referencia estable del programa recuperado.
- `reconstruction-source`: versión editable/recompilable y su tooling de validación.
