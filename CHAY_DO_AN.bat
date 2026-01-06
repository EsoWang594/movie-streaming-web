@echo off
chcp 65001 >nul
echo ============================================
echo   HUONG DAN CHAY DO AN MOVIE STREAMING
echo ============================================
echo.
echo Buoc 1: Kiem tra MongoDB...
echo.

REM Kiem tra MongoDB
netstat -an | findstr ":27017" >nul
if %errorlevel% equ 0 (
    echo [OK] MongoDB dang chay
) else (
    echo [WARNING] MongoDB co the chua chay
    echo Vui long khoi dong MongoDB truoc
    echo.
    pause
    exit /b
)

echo.
echo Buoc 2: Kiem tra dependencies...
cd backend
if not exist "node_modules" (
    echo Dang cai dat dependencies...
    call npm install
)

echo.
echo Buoc 3: Khoi dong server...
echo.
echo Server se chay tai: http://localhost:5000
echo Nhan Ctrl+C de dung server
echo.
echo ============================================
echo.

node server.js

pause
