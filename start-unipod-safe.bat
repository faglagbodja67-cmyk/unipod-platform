@echo off
setlocal

set "ROOT=c:\Users\Dell\OneDrive\Desktop\DU"
set "FLUTTER_APP=%ROOT%\unipod_mobile_flutter"
set "LOG_DIR=%ROOT%\logs"
set "FLUTTER_LOG=%LOG_DIR%\flutter-web.log"
set "BACKEND_LOG=%LOG_DIR%\backend.log"

if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

echo ==========================================
echo   UNIPOD - Mode Safe (Web + Flutter)
echo ==========================================

where node >nul 2>nul
if errorlevel 1 (
  echo [ERREUR] Node.js introuvable.
  pause
  exit /b 1
)

where flutter >nul 2>nul
if errorlevel 1 (
  echo [ERREUR] Flutter introuvable.
  pause
  exit /b 1
)

echo [1/5] Nettoyage des processus bloques...
taskkill /F /IM dart.exe >nul 2>nul
taskkill /F /IM dartvm.exe >nul 2>nul
taskkill /F /IM adb.exe >nul 2>nul

echo [2/5] Lancement backend...
start "UNIPOD Backend" cmd /k "cd /d %ROOT% && node server.js 1>> \"%BACKEND_LOG%\" 2>>&1"

echo [3/5] Verification backend...
timeout /t 2 >nul
powershell -NoProfile -Command "try { $r=Invoke-RestMethod -Uri 'http://localhost:3000/api/health' -TimeoutSec 5; if($r.ok -eq $true){ exit 0 } else { exit 1 } } catch { exit 1 }"
if errorlevel 1 (
  echo [ATTENTION] Backend non confirme. Consulte %BACKEND_LOG%
) else (
  echo [OK] Backend actif sur http://localhost:3000/
)

echo [4/5] Ouverture site web...
start "" "http://localhost:3000/"

echo [5/5] Lancement Flutter Web + logs...
start "UNIPOD Flutter Web" cmd /k "cd /d %FLUTTER_APP% && flutter config --enable-web && flutter pub get && flutter run -d chrome --web-hostname 0.0.0.0 --web-port 5050 1>> \"%FLUTTER_LOG%\" 2>>&1"

echo.
echo Demarrage termine.
echo Site web        : http://localhost:3000/
echo Flutter web     : http://localhost:5050/
echo Telephone (LAN) : utilisez l'IP locale du PC, ex. http://192.168.x.x:5050/
echo Log backend     : %BACKEND_LOG%
echo Log flutter web : %FLUTTER_LOG%
echo.
pause
