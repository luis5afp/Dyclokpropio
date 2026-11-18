!macro preInit
  SetRegView 64
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$LOCALAPPDATA\Programs\DICloak-Nativo-Almacen-Lab-033"
  SetRegView 32
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$LOCALAPPDATA\Programs\DICloak-Nativo-Almacen-Lab-033"
!macroend

!macro customInstall
  CreateDirectory "$SMPROGRAMS\DICloak Almacén Lab 0.3.3"
  CreateShortCut "$SMPROGRAMS\DICloak Almacén Lab 0.3.3\DICloak Almacén Lab 0.3.3.lnk" "$INSTDIR\DICloak.exe"
  CreateShortCut "$DESKTOP\DICloak Almacén Lab 0.3.3.lnk" "$INSTDIR\DICloak.exe"
!macroend

!macro customUnInstall
  Delete "$DESKTOP\DICloak Almacén Lab 0.3.3.lnk"
  Delete "$SMPROGRAMS\DICloak Almacén Lab 0.3.3\DICloak Almacén Lab 0.3.3.lnk"
  RMDir "$SMPROGRAMS\DICloak Almacén Lab 0.3.3"
!macroend
