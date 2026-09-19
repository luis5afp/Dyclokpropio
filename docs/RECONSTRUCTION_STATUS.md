# Reconstruction status

The goal of `reconstruction-source` is a fully editable replacement built from
maintainable sources. It is not a claim that the original proprietary source
tree was recovered byte-for-byte.

## Verified

- Recovered Windows application can be packaged into an NSIS installer.
- Reconstructed Electron main wrapper has a contract test.
- Reconstructed preload exposes the same API shape as the recovered preload.
- Automated preload comparison reports **0 behavior mismatches**.
- 693 renderer assets were indexed into 437 logical groups.
- 44 preload IPC channels were mapped.
- 54 direct renderer IPC calls were cataloged.
- Shared editable IPC catalog and renderer adapter are present under `src/`.

## In reconstruction

- Extract business logic from `dist-electron/main-CuCOh59n.js` into
  `src/main/services/`.
- Reconstruct Vue router, stores, views and components under
  `src/renderer/`.
- Replace direct raw IPC usage with `src/renderer/services/desktop-ipc.js`.

## Completion gate

The source reconstruction is complete only when all of these are true:

1. `src/main/` no longer imports `dist-electron/main-CuCOh59n.js`.
2. The packaged app uses the reconstructed preload.
3. The UI is compiled from `src/renderer/`, not copied from legacy `dist/`.
4. Contract tests cover IPC boundaries and critical application flows.
5. `npm run build:win` creates a working installer from reconstructed source.
6. The recovered bundles can be removed from the build inputs and retained only
   as historical reference.

Until those gates pass, the legacy bundles remain intact for regression
comparison.
