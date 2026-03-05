@echo off
REM Hugo Installation Script for Windows (Non-Admin)

echo.
echo ==================================================
echo UnifyRoute: Hugo Installation Guide
echo ==================================================
echo.
echo Since admin rights are needed for Chocolatey, follow these steps:
echo.
echo METHOD 1: Download Pre-built Binary (Easiest)
echo ---------------------------------------------------
echo.
echo 1. Visit: https://github.com/gohugoio/hugo/releases
echo.
echo 2. Download the file: hugo_extended_0.120.0_windows-amd64.zip
echo    (Look for the EXTENDED version - important!)
echo.
echo 3. Extract the ZIP file to a folder like: C:\Hugo\bin
echo.
echo 4. Add to PATH:
echo    - Right-click "This PC" or "My Computer" -^> Properties
echo    - Click "Advanced system settings" on the left
echo    - Click "Environment Variables" button
echo    - Under "User variables", click "New"
echo    - Variable name: PATH
echo    - Variable value: C:\Hugo\bin
echo    - Click OK
echo.
echo 5. Close and reopen Command Prompt/PowerShell
echo.
echo 6. Verify installation:
echo    hugo version
echo.
echo ==================================================
echo METHOD 2: Using Windows Package Manager
echo ==================================================
echo.
echo If you have Windows Package Manager installed:
echo winget install Hugo.Hugo.Extended
echo.
echo ==================================================
echo METHOD 3: Manual Setup (If above doesn't work)
echo ==================================================
echo.
echo 1. Download: https://github.com/gohugoio/hugo/releases/download/v0.120.0/hugo_extended_0.120.0_windows-amd64.zip
echo.
echo 2. Extract hugo.exe to: y:\Github\UnifyRouteWeb\bin\
echo.
echo 3. In your project, update Makefile or use:
echo    .\bin\hugo server -D
echo.
echo ==================================================
echo.
echo Once Hugo is installed, run from UnifyRouteWeb folder:
echo.
echo   Hugo server: hugo server -D
echo   Build:      hugo --minify
echo   Docker:     docker-compose up -d
echo.
pause
