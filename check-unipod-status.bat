@echo off
setlocal

set "ROOT=c:\Users\Dell\OneDrive\Desktop\DU"
set "LOG_DIR=%ROOT%\logs"
set "FLUTTER_LOG=%LOG_DIR%\flutter-web.log"
set "BACKEND_LOG=%LOG_DIR%\backend.log"

echo ==========================================
echo   UNIPOD - Diagnostic rapide
echo ==========================================

echo.
echo [Backend health]
powershell -NoProfile -Command "try { Invoke-RestMethod -Uri 'http://localhost:3000/api/health' -TimeoutSec 5 | ConvertTo-Json -Compress } catch { 'BACKEND_DOWN' }"

echo.
echo [Ports]
powershell -NoProfile -Command "Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue | Where-Object { $_.LocalPort -in 3000,5050 } | Select-Object LocalAddress,LocalPort,OwningProcess | Format-Table -AutoSize"

echo.
echo [Dernieres lignes backend.log]
if exist "%BACKEND_LOG%" (
  powershell -NoProfile -Command "Get-Content '%BACKEND_LOG%' -Tail 20"
) else (
  echo Aucun log backend.
)

echo.
echo [Dernieres lignes flutter-web.log]
if exist "%FLUTTER_LOG%" (
  powershell -NoProfile -Command "Get-Content '%FLUTTER_LOG%' -Tail 40"
) else (
  echo Aucun log flutter.
)

echo.
pause

