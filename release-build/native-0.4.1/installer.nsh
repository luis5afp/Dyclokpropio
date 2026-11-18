!macro preInit
  SetRegView 64
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$LOCALAPPDATA\Programs\DICloak-Nativo-Almacen-Diagnostico-Legible-041"
  SetRegView 32
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$LOCALAPPDATA\Programs\DICloak-Nativo-Almacen-Diagnostico-Legible-041"
!macroend

!macro customInstall
  CreateDirectory "$SMPROGRAMS\DICloak Almacén Diagnóstico Legible 0.4.1"
  CreateShortCut "$SMPROGRAMS\DICloak Almacén Diagnóstico Legible 0.4.1\DICloak Almacén Diagnóstico Legible 0.4.1.lnk" "$INSTDIR\DICloak.exe"
  CreateShortCut "$DESKTOP\DICloak Almacén Diagnóstico Legible 0.4.1.lnk" "$INSTDIR\DICloak.exe"
!macroend

!macro customUnInstall
  Delete "$DESKTOP\DICloak Almacén Diagnóstico Legible 0.4.1.lnk"
  Delete "$SMPROGRAMS\DICloak Almacén Diagnóstico Legible 0.4.1\DICloak Almacén Diagnóstico Legible 0.4.1.lnk"
  RMDir "$SMPROGRAMS\DICloak Almacén Diagnóstico Legible 0.4.1"
!macroend
