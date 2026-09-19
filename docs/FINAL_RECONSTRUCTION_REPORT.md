# Final reconstruction report

## Delivery status

The maximum reliable reconstruction possible from the recovered installer artifacts is operationally complete on the `reconstruction-source` branch.

This statement has a precise meaning:

- every recovered JavaScript/CSS/JSON/HTML runtime input used by the reconstructed package has a versioned editable copy under `src/runtime/`;
- the reconstructed build removes those code/runtime files from the legacy `dist/` and `dist-electron/` copies before packaging and overlays the editable mirror from `src/runtime/`;
- the build aborts if an editable recovered runtime file is missing;
- reconstructed preload and main-process contracts are validated automatically;
- the Windows reconstructed installer is built and smoke-launched successfully in GitHub Actions.

## Final verified build

Final delivery workflow: GitHub Actions run `35424415737`.

All required steps passed:

- dependency installation;
- Electron native dependency rebuild;
- complete reconstructed contract suite;
- editable-runtime completeness gate;
- Windows NSIS installer build;
- executable smoke launch;
- SHA-256 generation;
- artifact upload.

Generated installer:

- file: `Dyclokpropio_3.0.0_win_x64_reconstructed.exe`
- bytes: 190400322
- SHA-256: `8e729e91debf06e6d86c667b8825864e6fc7f3de7706dd07a17f2207ccf555ce`

Uploaded artifact:

- name: `Dyclokpropio-reconstructed-windows`
- artifact ID: `10578578347`
- ZIP bytes: 190064385
- ZIP digest: `sha256:25d6211c18d75d74ea1893c5143faf98b57da9bad409e9716b306cf2838c8872`
- generated: 2026-09-19
- expires on GitHub Actions: 2026-12-18

## Editable coverage

The final completeness gate reported:

- recovered renderer inputs: 561;
- editable renderer files: 561;
- recovered Electron inputs: 21;
- editable Electron files: 22;
- missing renderer files: 0;
- missing Electron files: 0.

The extra Electron source file is reconstructed helper code rather than a missing/extra recovered input. In particular, the clean IPC catalog adds `dist-electron/shared/ipc-channels.js`.

The renderer also has maintainable reconstructed Vue SFCs under `src/renderer/components/reconstructed/`, while the complete compatibility mirror remains editable under `src/runtime/dist/`.

## What cannot be recovered exactly

The installer did not contain the original Vue/TypeScript source tree or source maps. Therefore no reconstruction can truthfully restore, byte-for-byte:

- original comments;
- original local variable names removed by minification/obfuscation;
- original `.vue` file boundaries when several source modules were merged into a chunk;
- original TypeScript types that were erased during compilation;
- source code for distributed native executables such as `DicSyncService.exe`, FFmpeg or other third-party/native binaries.

Those are information-loss limits of the supplied artifacts, not unfinished copying work.

## Practical definition of finished

For this repository, reconstruction is finished at the operational/editability level because all of the following are true:

1. all recovered JS/CSS/JSON/HTML runtime inputs have editable copies in `src/runtime/`;
2. `npm run verify:editable-runtime` reports zero missing files;
3. `npm run verify:reconstruction` passes;
4. `npm run build:reconstructed:win` builds the Windows installer;
5. the generated executable passes the smoke-launch step;
6. the installer and checksum are published as a GitHub Actions artifact.

The clean semantic rewrite under `src/main/` and `src/renderer/` can continue as normal refactoring, but it is no longer required in order to edit and rebuild the recovered application.

## Branch policy

- `main`: recovered stable reference.
- `reconstruction-source`: editable/rebuildable reconstruction and validation tooling.

The histories have been synchronized: `reconstruction-source` contains the current `main` history while keeping the reconstructed work. Pull request #1 is mergeable, but `main` remains intentionally preserved as the stable recovered reference.
