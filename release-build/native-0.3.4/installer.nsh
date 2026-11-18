!macro preInit
  SetRegView 64
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$LOCALAPPDATA\Programs\DICloak-Nativo-Almacen-Audit-034"
  SetRegView 32
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$LOCALAPPDATA\Programs\DICloak-Nativo-Almacen-Audit-034"
!macroend

!macro customInstall
  CreateDirectory "$SMPROGRAMS\DICloak Almacén Audit 0.3.4"
  CreateShortCut "$SMPROGRAMS\DICloak Almacén Audit 0.3.4\DICloak Almacén Audit 0.3.4.lnk" "$INSTDIR\DICloak.exe"
  CreateShortCut "$DESKTOP\DICloak Almacén Audit 0.3.4.lnk" "$INSTDIR\DICloak.exe"
!macroend

!macro customUnInstall
  Delete "$DESKTOP\DICloak Almacén Audit 0.3.4.lnk"
  Delete "$SMPROGRAMS\DICloak Almacén Audit 0.3.4\DICloak Almacén Audit 0.3.4.lnk"
  RMDir "$SMPROGRAMS\DICloak Almacén Audit 0.3.4"
!macroend
