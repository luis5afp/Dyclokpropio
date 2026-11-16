@echo off
setlocal
cd /d "%~dp0.."
where node >nul 2>&1
if errorlevel 1 (
  echo ERROR: Node.js no esta instalado o no se encuentra en PATH.
  echo Instala Node.js y abre de nuevo este panel.
  pause
  exit /b 1
)
if not exist "tools\run-dicloak-diagnostic-panel.cjs" (
  echo ERROR: No se encontro el modulo del panel en esta carpeta.
  pause
  exit /b 1
)
echo ==========================================================
echo DICloak - Diagnostico local de comunicacion de prueba
echo ==========================================================
echo Abre solo eventos locales; no registra cookies o claves.
echo El navegador DICloak no se modificara.
set "DICLOAK_AUTOOPEN_DIAGNOSTIC_PANEL=1"
node "tools\run-dicloak-diagnostic-panel.cjs"
echo El panel ha terminado.
pause
endlocal
