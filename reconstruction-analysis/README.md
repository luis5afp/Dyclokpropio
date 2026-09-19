# Automated recovery analysis

Generated from the compiled application bundles.

- Main-process JS files scanned: 4
- Renderer JS files summarized: 164
- IPC channels mapped: 44
- Candidate route/path strings: 23
- Primary main bundle: dist-electron/main-CuCOh59n.js
- Primary renderer bundle: dist/assets/index-2aSE6uVi.js

## Next reconstruction step

Use ipc-map.json to extract each ipcMain handler into a named module under src/main/services/.
Use route-candidates.json and recovered-component-index.json to rebuild Vue router/views without deleting the legacy dist/ tree.
