# Program update policy

Automatic program update checking is disabled in the reconstructed application.

The change intentionally:

- removes the renderer request to `/v1/app/notice` used by the program update center;
- removes the recurring 10-minute version check;
- disables automatic and manual self-update IPC actions;
- keeps local version information available for diagnostics;
- does not change environment, proxy, RPA, storage or normal application startup behavior.

Blocked self-update IPC channels:

- `update-app`
- `update-app-check-pack`
- `update-app-full-update`
- `update-app-patch-update`
- `update-app-cancel-download`
- `update-app-restart`

This policy is verified by `npm run verify:update-policy`.
