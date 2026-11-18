!macro preInit
  SetRegView 64
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$LOCALAPPDATA\Programs\DICloak-Nativo-Almacen-Diagnostico-039"
  SetRegView 32
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$LOCALAPPDATA\Programs\DICloak-Nativo-Almacen-Diagnostico-039"
!macroend

!macro customInstall
  CreateDirectory "$SMPROGRAMS\DICloak Almacén Diagnóstico 0.3.9"
  CreateShortCut "$SMPROGRAMS\DICloak Almacén Diagnóstico 0.3.9\DICloak Almacén Diagnóstico 0.3.9.lnk" "$INSTDIR\DICloak.exe"
  CreateShortCut "$DESKTOP\DICloak Almacén Diagnóstico 0.3.9.lnk" "$INSTDIR\DICloak.exe"
!macroend

!macro customUnInstall
  Delete "$DESKTOP\DICloak Almacén Diagnóstico 0.3.9.lnk"
  Delete "$SMPROGRAMS\DICloak Almacén Diagnóstico 0.3.9\DICloak Almacén Diagnóstico 0.3.9.lnk"
  RMDir "$SMPROGRAMS\DICloak Almacén Diagnóstico 0.3.9"
!macroend
