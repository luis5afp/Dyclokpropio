!macro preInit
  SetRegView 64
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$LOCALAPPDATA\Programs\DICloak-Nativo-Almacen-Lab-030"
  SetRegView 32
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$LOCALAPPDATA\Programs\DICloak-Nativo-Almacen-Lab-030"
!macroend

!macro customInstall
  CreateDirectory "$SMPROGRAMS\DICloak Almacén Lab"
  CreateShortCut "$SMPROGRAMS\DICloak Almacén Lab\DICloak Almacén Lab.lnk" "$INSTDIR\DICloak.exe"
  CreateShortCut "$DESKTOP\DICloak Almacén Lab.lnk" "$INSTDIR\DICloak.exe"
!macroend

!macro customUnInstall
  Delete "$DESKTOP\DICloak Almacén Lab.lnk"
  Delete "$SMPROGRAMS\DICloak Almacén Lab\DICloak Almacén Lab.lnk"
  RMDir "$SMPROGRAMS\DICloak Almacén Lab"
!macroend
