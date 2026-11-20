!macro preInit
  SetRegView 64
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$LOCALAPPDATA\Programs\diloakPRO-Motor309-Prueba"
  SetRegView 32
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$LOCALAPPDATA\Programs\diloakPRO-Motor309-Prueba"
!macroend

!macro customInstall
  CreateDirectory "$SMPROGRAMS\diloakPRO Motor 3.0.9 Prueba"
  CreateShortCut "$SMPROGRAMS\diloakPRO Motor 3.0.9 Prueba\diloakPRO Motor 3.0.9 Prueba.lnk" "$INSTDIR\diloakPRO.exe"
  CreateShortCut "$DESKTOP\diloakPRO Motor 3.0.9 Prueba.lnk" "$INSTDIR\diloakPRO.exe"
!macroend

!macro customUnInstall
  Delete "$DESKTOP\diloakPRO Motor 3.0.9 Prueba.lnk"
  Delete "$SMPROGRAMS\diloakPRO Motor 3.0.9 Prueba\diloakPRO Motor 3.0.9 Prueba.lnk"
  RMDir "$SMPROGRAMS\diloakPRO Motor 3.0.9 Prueba"
!macroend
