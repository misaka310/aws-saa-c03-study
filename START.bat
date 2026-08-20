@echo off
setlocal
pushd "%~dp0"

set "QUIZ_FILE=%~dp0quiz\index.html"
set "PORTAL_URL=http://127.0.0.1:8765/"

if /i "%~1"=="--quiz" goto open_quiz

node scripts\build-sites.mjs
if errorlevel 1 (
  echo [ERROR] Could not build the study portal.
  popd
  exit /b 1
)

if /i "%~1"=="--check" (
  echo [OK] Study portal build completed.
  echo [OK] Portal URL: %PORTAL_URL%
  popd
  exit /b 0
)

powershell.exe -NoProfile -WindowStyle Hidden -Command "Start-Process -FilePath 'node.exe' -ArgumentList @('scripts\serve-local.mjs') -WorkingDirectory '%~dp0' -WindowStyle Hidden"
if errorlevel 1 (
  echo [ERROR] Could not start the local study portal server.
  popd
  exit /b 1
)

powershell.exe -NoProfile -Command "Start-Sleep -Milliseconds 700" >nul
start "" "%PORTAL_URL%"
if errorlevel 1 (
  echo [ERROR] Could not open the study portal in the default browser.
  popd
  exit /b 1
)

popd
exit /b 0

:open_quiz
if not exist "%QUIZ_FILE%" (
  echo [ERROR] Quiz file not found: "%QUIZ_FILE%"
  popd
  exit /b 1
)
start "" "%QUIZ_FILE%"
if errorlevel 1 (
  echo [ERROR] Could not open the quiz in the default browser.
  popd
  exit /b 1
)
popd
exit /b 0
