# 🚀 Quick Start Guide

Panduan singkat untuk mulai menggunakan sistem dalam 5 menit!

## 📋 Prerequisites

Pastikan sudah install:
- Node.js (Download di: https://nodejs.org/)
- Browser modern (Chrome, Firefox, Safari, Edge)

## ⚡ Instalasi Super Cepat

### 1️⃣ Download Project
Extract file ZIP project ke folder pilihan Anda

### 2️⃣ Install Dependencies
Buka terminal/command prompt di folder project, lalu jalankan:
```bash
npm install
```

Tunggu sampai semua dependency terinstall (~1-2 menit)

### 3️⃣ Setup Folder
```bash
# Windows
mkdir public
copy inspection_truck_enhanced.html public\index.html

# Mac/Linux
mkdir public
cp inspection_truck_enhanced.html public/index.html
```

### 4️⃣ Jalankan Server
```bash
npm start
```

Tunggu sampai muncul pesan:
```
🚚 Truck Inspection System Server
📡 Server running on http://localhost:3000
```

### 5️⃣ Buka Browser
Buka browser dan akses:
```
http://localhost:3000
```

## 🎉 Selesai!

Sekarang Anda bisa:
1. ✍️ Isi form pemeriksaan
2. 📷 Upload foto
3. 💾 Simpan data
4. 📄 Export PDF

## 🔧 Tips Penggunaan

### Upload Foto
- Klik tombol "📷 Tambah Foto" pada setiap item
- Bisa upload multiple foto sekaligus
- Foto otomatis di-resize untuk menghemat space
- Klik foto untuk lihat ukuran penuh

### Simpan Data
- **Simpan Data** → Simpan lokal di browser (cepat, tapi hilang jika clear cache)
- **Simpan ke Database** → Simpan permanen di server (recommended)

### Export PDF
- Klik "📄 Export PDF" untuk download laporan
- PDF include semua data dan jumlah foto per item

## 🌐 Akses dari Device Lain

### Di Jaringan Lokal (LAN)
1. Cari IP komputer server Anda:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

2. Dari device lain di jaringan yang sama, akses:
   ```
   http://[IP-ADDRESS]:3000
   ```
   Contoh: `http://192.168.1.100:3000`

### Akses dari Internet
Untuk akses dari mana saja, Anda perlu:
1. Deploy ke hosting/VPS
2. Atau gunakan ngrok untuk testing:
   ```bash
   # Install ngrok
   npm install -g ngrok
   
   # Jalankan
   ngrok http 3000
   ```
   Akan dapat URL publik seperti: `https://abc123.ngrok.io`

## ❓ Troubleshooting

### "Port 3000 sudah digunakan"
Edit `server.js`, ganti:
```javascript
const PORT = 3000;
```
Menjadi:
```javascript
const PORT = 3001; // atau port lain
```

### "Cannot find module"
Jalankan lagi:
```bash
npm install
```

### Foto tidak muncul setelah reload
Pastikan klik "☁️ Simpan ke Database" setelah upload foto

### Database error
Hapus folder `database` dan restart server (akan create database baru)

## 📱 Akses dari Mobile

1. Pastikan HP dan komputer dalam jaringan WiFi yang sama
2. Akses: `http://[IP-KOMPUTER]:3000`
3. Tambahkan ke Home Screen untuk akses cepat:
   - **iPhone**: Safari → Share → Add to Home Screen
   - **Android**: Chrome → Menu → Add to Home Screen

## 🔄 Update System

Jika ada update:
1. Download file baru
2. Stop server (Ctrl+C)
3. Replace file yang diupdate
4. Restart: `npm start`

Database tidak akan hilang karena disimpan terpisah di folder `database/`

## 💡 Next Steps

Setelah familiar dengan basic usage:
1. Baca [README.md](README.md) untuk fitur lengkap
2. Explore API endpoints
3. Customize sesuai kebutuhan

## 📞 Butuh Bantuan?

- Check [README.md](README.md) untuk dokumentasi lengkap
- Lihat console browser (F12) untuk error messages
- Check terminal server untuk server-side errors

---

**Happy Inspecting! 🚚✅**
