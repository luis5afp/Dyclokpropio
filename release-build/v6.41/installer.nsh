!macro preInit
  SetRegView 64
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$LOCALAPPDATA\Programs\DyclokPRO"
  SetRegView 32
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$LOCALAPPDATA\Programs\DyclokPRO"
!macroend

!macro customInstall
  CreateDirectory "$SMPROGRAMS\DyclokPRO"
  CreateShortCut "$SMPROGRAMS\DyclokPRO\DyclokPRO.lnk" "$INSTDIR\DyclokPRO.exe" "" "$INSTDIR\DyclokPRO.ico" 0
  CreateShortCut "$DESKTOP\DyclokPRO.lnk" "$INSTDIR\DyclokPRO.exe" "" "$INSTDIR\DyclokPRO.ico" 0
  CreateDirectory "$LOCALAPPDATA\DyclokPRO\Cuentas"
!macroend

!macro customUnInstall
  IfFileExists "$INSTDIR\Cuentas" 0 dyclok_no_cuentas
    RMDir "$INSTDIR\Cuentas"
    IfFileExists "$INSTDIR\Cuentas" 0 dyclok_no_cuentas
      DetailPrint "Cuentas cannot be safely unlinked; preserving user data."
      Abort "No se puede desvincular Cuentas; se cancela para proteger los datos."
  dyclok_no_cuentas:
  Delete "$DESKTOP\DyclokPRO.lnk"
  Delete "$SMPROGRAMS\DyclokPRO\DyclokPRO.lnk"
  RMDir "$SMPROGRAMS\DyclokPRO"
!macroend
