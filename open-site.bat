@echo off
cd /d c:\Users\Dell\OneDrive\Desktop\DU
start "UNIPOD Server" cmd /k "npm start"
timeout /t 2 >nul
start http://localhost:3000
