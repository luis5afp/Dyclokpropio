# Final reconstruction report

## Delivery status

The maximum reliable reconstruction possible from the recovered installer artifacts is now operationally complete on the `reconstruction-source` branch.

This statement has a precise meaning:

- every recovered JavaScript/CSS/JSON/HTML runtime input used by the reconstructed package has a versioned editable copy under `src/runtime/`;
- the reconstructed build removes those code/runtime files from the legacy `dist/` and `dist-electron/` copies before packaging and overlays the editable mirror from `src/runtime/`;
- the build aborts if an editable runtime file is missing;
- reconstructed preload and main-process contracts are validated automatically;
- the Windows reconstructed installer has already been built and smoke-launched successfully in GitHub Actions.

## Verified build

Latest successful validation recorded by the branch:

- generated: 2026-09-19T03:46:08.9094266Z
- installer: `Dyclokpropio_3.0.0_win_x64_reconstructed.exe`
- bytes: 190399568
- SHA-256: `00c921fbf5433b08ff67d0cb6088b31764d54c3be8a9c7e90e15d22260b4eb13`
- editable runtime mirror: enabled
- smoke launch: passed

The validation workflow installs dependencies, rebuilds native Electron modules, runs the reconstruction contract suite, creates the NSIS installer and launches the unpacked executable as a smoke test.

## Editable coverage

The bootstrap manifest currently records:

- renderer editable runtime files: 561
- Electron editable runtime files: 21
- source maps recovered from the installer: none

The renderer also has reconstructed maintainable Vue SFCs under `src/renderer/components/reconstructed/`, while the complete compatibility mirror remains editable under `src/runtime/dist/`.

## What cannot be recovered exactly

The installer did not contain the original Vue/TypeScript source tree or source maps. Therefore no reconstruction can truthfully restore, byte-for-byte:

- original comments;
- original local variable names removed by minification/obfuscation;
- original `.vue` file boundaries when several source modules were merged into a chunk;
- original TypeScript types that were erased during compilation;
- source code for distributed native executables such as `DicSyncService.exe`, FFmpeg or other third-party/native binaries.

Those are information-loss limits of the supplied artifacts, not unfinished copying work.

## Practical definition of finished

For this repository, reconstruction is considered finished at the operational/editability level when all of the following remain true:

1. all recovered JS/CSS/JSON/HTML runtime inputs have editable copies in `src/runtime/`;
2. `npm run verify:editable-runtime` reports zero missing files;
3. `npm run verify:reconstruction` passes;
4. `npm run build:reconstructed:win` builds the Windows installer;
5. the generated executable passes the smoke-launch step.

The clean semantic rewrite under `src/main/` and `src/renderer/` can continue as normal refactoring, but it is no longer required in order to edit and rebuild the recovered application.

## Branch policy

- `main`: recovered stable reference.
- `reconstruction-source`: editable/rebuildable reconstruction and validation tooling.

Do not delete the recovered reference bundles until any future clean rewrite has equivalent behavior and tests.
