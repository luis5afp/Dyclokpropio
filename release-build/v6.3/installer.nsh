; Dyclokpro v6.2: add a separate Start Menu launcher, never replace the cloud profile button.
!macro customInstall
  CreateDirectory "$SMPROGRAMS\Dyclokpro"
  CreateShortCut "$SMPROGRAMS\Dyclokpro\Perfiles locales.lnk" "$INSTDIR\Dyclokpro_Perfiles_Locales.exe" "" "$INSTDIR\Dyclokpro.ico" 0
!macroend

!macro customUnInstall
  Delete "$SMPROGRAMS\Dyclokpro\Perfiles locales.lnk"
  RMDir "$SMPROGRAMS\Dyclokpro"
  ; IMPORTANT: never delete $LOCALAPPDATA\Dyclokpro\LocalProfiles.
!macroend
