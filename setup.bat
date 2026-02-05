@echo off
REM Script untuk setup otomatis Truck Inspection System - Windows
REM Usage: setup.bat

echo ╔═══════════════════════════════════════════════════════╗
echo ║  🚚 Truck Inspection System - Auto Setup             ║
echo ╚═══════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js tidak terinstall!
    echo 📥 Download dan install Node.js dari: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version
echo.

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm tidak terinstall!
    pause
    exit /b 1
)

echo ✅ npm version:
npm --version
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ❌ Gagal install dependencies!
    pause
    exit /b 1
)

echo ✅ Dependencies berhasil diinstall
echo.

REM Create public folder if not exists
if not exist "public" (
    echo 📁 Membuat folder public...
    mkdir public
)

REM Copy HTML file to public
if exist "inspection_truck_enhanced.html" (
    echo 📄 Copying HTML file ke public...
    copy inspection_truck_enhanced.html public\index.html
    echo ✅ File HTML berhasil dicopy
) else (
    echo ⚠️  File inspection_truck_enhanced.html tidak ditemukan
)

echo.

REM Setup database
echo 🗄️  Setting up database...
node setup_database.js

if %errorlevel% neq 0 (
    echo ❌ Gagal setup database!
    pause
    exit /b 1
)

echo.
echo ╔═══════════════════════════════════════════════════════╗
echo ║  ✅ Setup selesai!                                    ║
echo ╚═══════════════════════════════════════════════════════╝
echo.
echo 🚀 Untuk menjalankan server:
echo    npm start
echo.
echo 📱 Setelah server running, akses di:
echo    http://localhost:3000
echo.
echo 🧪 Untuk testing API:
echo    npm test
echo.
pause
