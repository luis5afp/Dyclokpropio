!macro preInit
  SetRegView 64
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$LOCALAPPDATA\Programs\diloakPRO-Motor309-RC2-LAB"
  SetRegView 32
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$LOCALAPPDATA\Programs\diloakPRO-Motor309-RC2-LAB"
!macroend

!macro customInstall
  CreateDirectory "$SMPROGRAMS\diloakPRO Motor 3.0.9 RC2 LAB"
  CreateShortCut "$SMPROGRAMS\diloakPRO Motor 3.0.9 RC2 LAB\diloakPRO Motor 3.0.9 RC2 LAB.lnk" "$INSTDIR\diloakPRO.exe"
  CreateShortCut "$DESKTOP\diloakPRO Motor 3.0.9 RC2 LAB.lnk" "$INSTDIR\diloakPRO.exe"
!macroend

!macro customUnInstall
  Delete "$DESKTOP\diloakPRO Motor 3.0.9 RC2 LAB.lnk"
  Delete "$SMPROGRAMS\diloakPRO Motor 3.0.9 RC2 LAB\diloakPRO Motor 3.0.9 RC2 LAB.lnk"
  RMDir "$SMPROGRAMS\diloakPRO Motor 3.0.9 RC2 LAB"
!macroend
