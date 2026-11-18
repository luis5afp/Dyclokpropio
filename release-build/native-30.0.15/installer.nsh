!macro preInit
  SetRegView 64
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$LOCALAPPDATA\Programs\Dyclokpropio-Motor-042-Diagnostico-3015"
  SetRegView 32
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$LOCALAPPDATA\Programs\Dyclokpropio-Motor-042-Diagnostico-3015"
!macroend

!macro customInstall
  CreateDirectory "$SMPROGRAMS\Dyclokpropio Motor 0.4.2 Diagnóstico 30.0.15"
  CreateShortCut "$SMPROGRAMS\Dyclokpropio Motor 0.4.2 Diagnóstico 30.0.15\Dyclokpropio Motor 0.4.2 Diagnóstico 30.0.15.lnk" "$INSTDIR\DICloak.exe"
  CreateShortCut "$DESKTOP\Dyclokpropio Motor 0.4.2 Diagnóstico 30.0.15.lnk" "$INSTDIR\DICloak.exe"
!macroend

!macro customUnInstall
  Delete "$DESKTOP\Dyclokpropio Motor 0.4.2 Diagnóstico 30.0.15.lnk"
  Delete "$SMPROGRAMS\Dyclokpropio Motor 0.4.2 Diagnóstico 30.0.15\Dyclokpropio Motor 0.4.2 Diagnóstico 30.0.15.lnk"
  RMDir "$SMPROGRAMS\Dyclokpropio Motor 0.4.2 Diagnóstico 30.0.15"
!macroend
