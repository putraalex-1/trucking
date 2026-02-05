#!/bin/bash

# Script untuk setup otomatis Truck Inspection System
# Usage: ./setup.sh

echo "╔═══════════════════════════════════════════════════════╗"
echo "║  🚚 Truck Inspection System - Auto Setup             ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js tidak terinstall!"
    echo "📥 Download dan install Node.js dari: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm tidak terinstall!"
    exit 1
fi

echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Gagal install dependencies!"
    exit 1
fi

echo "✅ Dependencies berhasil diinstall"
echo ""

# Create public folder if not exists
if [ ! -d "public" ]; then
    echo "📁 Membuat folder public..."
    mkdir -p public
fi

# Copy HTML file to public
if [ -f "inspection_truck_enhanced.html" ]; then
    echo "📄 Copying HTML file ke public..."
    cp inspection_truck_enhanced.html public/index.html
    echo "✅ File HTML berhasil dicopy"
else
    echo "⚠️  File inspection_truck_enhanced.html tidak ditemukan"
fi

echo ""

# Setup database
echo "🗄️  Setting up database..."
node setup_database.js

if [ $? -ne 0 ]; then
    echo "❌ Gagal setup database!"
    exit 1
fi

echo ""
echo "╔═══════════════════════════════════════════════════════╗"
echo "║  ✅ Setup selesai!                                    ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""
echo "🚀 Untuk menjalankan server:"
echo "   npm start"
echo ""
echo "📱 Setelah server running, akses di:"
echo "   http://localhost:3000"
echo ""
echo "🧪 Untuk testing API:"
echo "   npm test"
echo ""
