!macro preInit
  ; Stable per-user installation identity for future diloakPRO upgrades.
  SetRegView 64
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$LOCALAPPDATA\Programs\diloakPRO"
  SetRegView 32
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$LOCALAPPDATA\Programs\diloakPRO"
!macroend

!macro customInstall
  ; Only remove exact allowlisted legacy lab installs through verified uninstallers.
  ; Never delete DICloak official app or any Chromium profile data.
  InitPluginsDir
  File "/oname=$PLUGINSDIR\diloakpro-migrate.ps1" "${__FILEDIR__}\migrate-legacy.ps1"
  nsExec::ExecToLog '"$SYSDIR\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -NonInteractive -ExecutionPolicy Bypass -File "$PLUGINSDIR\diloakpro-migrate.ps1" -CurrentInstall "$INSTDIR"'
  Pop $R9
  StrCmp $R9 "0" migrated
  IfSilent migrated 0
  MessageBox MB_ICONEXCLAMATION|MB_OK "diloakPRO fue instalado. Algunas ediciones antiguas no pudieron desinstalarse automaticamente. Revise AppData\Local\diloakPRO\install-migration.json y las Aplicaciones instaladas de Windows. No se borraron perfiles."
migrated:
  CreateDirectory "$SMPROGRAMS\diloakPRO"
  CreateShortCut "$SMPROGRAMS\diloakPRO\diloakPRO.lnk" "$INSTDIR\DICloak.exe"
  CreateShortCut "$DESKTOP\diloakPRO.lnk" "$INSTDIR\DICloak.exe"
!macroend

!macro customUnInstall
  Delete "$DESKTOP\diloakPRO.lnk"
  Delete "$SMPROGRAMS\diloakPRO\diloakPRO.lnk"
  RMDir "$SMPROGRAMS\diloakPRO"
  ; User data, cookies and profile directories are never removed.
!macroend
