@echo off
cd /d C:\Users\aizai\Math-Efficiency
start /b npm run dev
timeout /t 3 >nul
npx electron .
