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
  ; v6.15: remove the junction *itself*, not its target. Must happen before
  ; electron-builder's recursive $INSTDIR deletion on uninstall/update.
  ; Non-recursive RMDir removes an NTFS junction without traversing account data.
  IfFileExists "$INSTDIR\Cuentas" 0 dyclok_no_cuentas
    RMDir "$INSTDIR\Cuentas"
    ; A real directory or failed junction removal must NEVER be recursively
    ; deleted: abort and leave the installed app and customer data intact.
    IfFileExists "$INSTDIR\Cuentas" 0 dyclok_no_cuentas
      DetailPrint "Cuentas cannot be safely removed; preserving local profile data."
      Abort "No se puede desvincular Cuentas. Para proteger los archivos, se cancela la desinstalacion."
  dyclok_no_cuentas:
  Delete "$SMPROGRAMS\DyclokPRO\Perfiles locales.lnk"
  RMDir "$SMPROGRAMS\DyclokPRO"
  ; Persistent target stays at $LOCALAPPDATA\DyclokPRO\Cuentas.
!macroend
