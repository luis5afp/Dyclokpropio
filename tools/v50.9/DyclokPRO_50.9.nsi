Unicode True
!include "MUI2.nsh"
Name "DyclokPRO 50.9"
OutFile "DyclokPRO_50.9_win_x64.exe"
InstallDir "$LOCALAPPDATA\Programs\DyclokPRO"
RequestExecutionLevel user
SetCompressor /SOLID lzma
!define MUI_ICON "payload\Dyclokpro.ico"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_LANGUAGE "Spanish"
Section "Instalar"
 SetOutPath "$INSTDIR"
 File /r "payload\*.*"
 CreateDirectory "$SMPROGRAMS\DyclokPRO"
 CreateShortcut "$SMPROGRAMS\DyclokPRO\DyclokPRO.lnk" "$INSTDIR\DICloak.exe"
 CreateShortcut "$DESKTOP\DyclokPRO.lnk" "$INSTDIR\DICloak.exe"
SectionEnd
