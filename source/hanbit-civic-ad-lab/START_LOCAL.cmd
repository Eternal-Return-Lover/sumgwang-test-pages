@echo off
pushd "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required. Install Node.js and run this file again.
  pause
  exit /b 1
)
echo Target: http://127.0.0.1:4173/index.html
echo Lab:    http://127.0.0.1:4173/lab/
echo Close this window or press Ctrl+C to stop the local server.
node scripts/serve.mjs
popd
pause
