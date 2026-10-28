!macro preInit
  ; Install strictly in the current user's application directory.
  ; Do not touch existing DICloak user data or previous Dyclokpro installations.
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
  Delete "$SMPROGRAMS\DyclokPRO\Perfiles locales.lnk"
  RMDir "$SMPROGRAMS\DyclokPRO"
  ; Never delete $LOCALAPPDATA\Dyclokpro\LocalProfiles or cloud profile data.
!macroend
