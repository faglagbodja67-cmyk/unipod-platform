@echo off
setlocal

set "ROOT=c:\Users\Dell\OneDrive\Desktop\DU"
set "FLUTTER_APP=%ROOT%\unipod_mobile_flutter"

echo ==========================================
echo   UNIPOD - Demarrage Web + Flutter
echo ==========================================

if not exist "%ROOT%\server.js" (
  echo [ERREUR] server.js introuvable dans %ROOT%
  pause
  exit /b 1
)

if not exist "%FLUTTER_APP%\pubspec.yaml" (
  echo [ERREUR] Projet Flutter introuvable dans %FLUTTER_APP%
  pause
  exit /b 1
)

where flutter >nul 2>nul
if errorlevel 1 (
  echo [ERREUR] Flutter n'est pas detecte dans le PATH.
  echo Ajoute Flutter au PATH puis relance ce script.
  pause
  exit /b 1
)

echo [1/4] Nettoyage anciens processus Flutter...
taskkill /F /IM dart.exe >nul 2>nul
taskkill /F /IM dartvm.exe >nul 2>nul
taskkill /F /IM adb.exe >nul 2>nul

echo [2/4] Lancement backend Node.js...
start "UNIPOD Backend" cmd /k "cd /d %ROOT% && node server.js"

echo [3/4] Ouverture du site web...
timeout /t 2 >nul
start "" "http://localhost:3000/"

echo [4/4] Lancement Flutter en mode Web (Chrome)...
start "UNIPOD Flutter Web" cmd /k "cd /d %FLUTTER_APP% && flutter config --enable-web && flutter pub get && flutter run -d chrome --web-port 5050"

echo.
echo Demarrage lance.
echo - Site web: http://localhost:3000/
echo - App Flutter Web: http://localhost:5050/ (ouvre via flutter run)
echo.
pause

