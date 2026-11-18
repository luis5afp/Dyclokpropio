!macro preInit
  SetRegView 64
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$LOCALAPPDATA\Programs\DICloak-Nativo-Lab"
  SetRegView 32
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$LOCALAPPDATA\Programs\DICloak-Nativo-Lab"
!macroend

!macro customInstall
  CreateDirectory "$SMPROGRAMS\DICloak Nativo"
  CreateShortCut "$SMPROGRAMS\DICloak Nativo\DICloak Nativo.lnk" "$INSTDIR\DICloak.exe"
  CreateShortCut "$DESKTOP\DICloak Nativo.lnk" "$INSTDIR\DICloak.exe"
!macroend

!macro customUnInstall
  Delete "$DESKTOP\DICloak Nativo.lnk"
  Delete "$SMPROGRAMS\DICloak Nativo\DICloak Nativo.lnk"
  RMDir "$SMPROGRAMS\DICloak Nativo"
!macroend
