!macro preInit
  SetRegView 64
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$LOCALAPPDATA\Programs\DICloak-Nativo-Almacen-Diagnostico-Etapas-040"
  SetRegView 32
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$LOCALAPPDATA\Programs\DICloak-Nativo-Almacen-Diagnostico-Etapas-040"
!macroend

!macro customInstall
  CreateDirectory "$SMPROGRAMS\DICloak Almacén Diagnóstico Etapas 0.4.0"
  CreateShortCut "$SMPROGRAMS\DICloak Almacén Diagnóstico Etapas 0.4.0\DICloak Almacén Diagnóstico Etapas 0.4.0.lnk" "$INSTDIR\DICloak.exe"
  CreateShortCut "$DESKTOP\DICloak Almacén Diagnóstico Etapas 0.4.0.lnk" "$INSTDIR\DICloak.exe"
!macroend

!macro customUnInstall
  Delete "$DESKTOP\DICloak Almacén Diagnóstico Etapas 0.4.0.lnk"
  Delete "$SMPROGRAMS\DICloak Almacén Diagnóstico Etapas 0.4.0\DICloak Almacén Diagnóstico Etapas 0.4.0.lnk"
  RMDir "$SMPROGRAMS\DICloak Almacén Diagnóstico Etapas 0.4.0"
!macroend
