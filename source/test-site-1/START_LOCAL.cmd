@echo off
pushd "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required. Install Node.js and run this file again.
  pause
  exit /b 1
)
echo Open the Local URL printed below. The lab is at /lab/.
echo Close this window or press Ctrl+C to stop the local server.
node scripts/serve.mjs
popd
pause
