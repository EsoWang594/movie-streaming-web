@echo off
chcp 65001 >nul
echo ============================================
echo   XOA TAT CA USERS CU TRONG DATABASE
echo ============================================
echo.
echo CANH BAO: Script nay se xoa TAT CA users!
echo Ban co muon tiep tuc? (Y/N)
set /p confirm=
if /i not "%confirm%"=="Y" (
    echo Da huy.
    pause
    exit /b
)
echo.
echo Dang xoa users...
echo.

node scripts/clearUsers.js

echo.
pause
