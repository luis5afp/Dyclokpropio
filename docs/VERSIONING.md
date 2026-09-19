# Automatic versioning

Production builds use automatic semantic versions.

The first production build after enabling this policy is:

`3.0.1`

Each new production workflow run advances the patch number:

`3.0.1 -> 3.0.2 -> 3.0.3 -> ...`

The version is assigned inside GitHub Actions immediately before dependency
installation and packaging. Electron Builder already uses `${version}` in
the installer filename, so each generated installer gets its own versioned
name.

The automatic application version is independent from the old remote
self-update mechanism. The application remains configured not to check the
server for program updates.

Configuration lives in `versioning.json`; implementation lives in
`tools/set-build-version.js`.

A workflow retry keeps the same GitHub run number and therefore keeps the same
application version. A new production workflow run gets the next version.

The legacy `patchVersion` field is intentionally not used as the release
sequence. It is preserved for compatibility with recovered runtime metadata.
