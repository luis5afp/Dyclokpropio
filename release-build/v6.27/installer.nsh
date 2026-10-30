!macro preInit
  SetRegView 64
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$LOCALAPPDATA\Programs\DyclokPRO"
  SetRegView 32
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$LOCALAPPDATA\Programs\DyclokPRO"
!macroend

!macro customInstall
  CreateDirectory "$SMPROGRAMS\DyclokPRO"
  CreateShortCut "$SMPROGRAMS\DyclokPRO\Perfiles locales.lnk" "$INSTDIR\Dyclokpro_Perfiles_Locales.exe" "" "$INSTDIR\DyclokPRO.ico" 0
!macroend

!macro customUnInstall
  ; Do not traverse the Cuentas NTFS junction into private profile data.
  IfFileExists "$INSTDIR\Cuentas" 0 dyclok_no_cuentas
    RMDir "$INSTDIR\Cuentas"
    IfFileExists "$INSTDIR\Cuentas" 0 dyclok_no_cuentas
      DetailPrint "Cuentas cannot be unlinked safely. Preserving user data."
      Abort "No se puede desvincular Cuentas. Se cancela para proteger los perfiles."
  dyclok_no_cuentas:
  Delete "$SMPROGRAMS\DyclokPRO\Perfiles locales.lnk"
  RMDir "$SMPROGRAMS\DyclokPRO"
!macroend
