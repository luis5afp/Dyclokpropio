# Renderer reconstruido

La interfaz original no fue recuperada como archivos fuente `.vue`/`.ts`; solo se
dispone de la salida compilada de Vite en `dist/`.

Esta carpeta es el destino para reconstruir la interfaz de forma mantenible.

## Regla de migración

1. `dist/` permanece intacto como referencia funcional.
2. Cada pantalla nueva se reconstruye aquí antes de sustituir su chunk compilado.
3. Los nombres observables en `dist/assets/` se usan para identificar componentes.
4. No se elimina un chunk recuperado hasta tener equivalencia funcional comprobada.
5. Las llamadas Electron deben pasar por la API documentada en
   `src/preload/index.js` y `src/shared/ipc-channels.js`.

## Estado

- Contrato IPC del preload: reconstruido.
- Wrapper principal de Electron: reconstruido.
- Lógica interna del bundle principal: aún usa adaptador de compatibilidad.
- Componentes Vue originales: no recuperables exactamente sin source maps.
- Migración de UI: pendiente, pantalla por pantalla.
