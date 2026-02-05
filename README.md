# 🚚 Sistem Check Sheet Pemeriksaan Truck

Sistem manajemen pemeriksaan truck dengan fitur upload foto dan database permanent storage.

## ✨ Fitur Utama

- ✅ **Checklist 20 Item** - Pemeriksaan komprehensif kondisi truck
- 📷 **Upload Foto** - Upload multiple foto untuk setiap item (support resize otomatis)
- 💾 **Auto-Save Local** - Data tersimpan otomatis di browser
- ☁️ **Database Cloud** - Simpan permanen ke server database
- 📄 **Export PDF** - Cetak laporan pemeriksaan
- 📊 **Summary Dashboard** - Ringkasan real-time hasil pemeriksaan
- 🔍 **Filter & Search** - Cari data berdasarkan tanggal, supplier, nomor truck
- 📱 **Responsive Design** - Berfungsi optimal di desktop dan mobile

## 🛠️ Teknologi

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- jsPDF untuk export PDF
- LocalStorage untuk auto-save

### Backend
- Node.js + Express
- SQLite3 Database
- RESTful API

## 📦 Instalasi

### Prerequisites
- Node.js (versi 14 atau lebih baru)
- npm atau yarn

### Step 1: Download/Clone Project
```bash
# Clone atau extract project
cd truck-inspection-system
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Struktur Folder
Pastikan struktur folder seperti ini:
```
truck-inspection-system/
├── server.js                      # Backend server
├── package.json                   # Dependencies
├── public/                        # Frontend files
│   └── index.html                # Main HTML file
├── database/                      # Database folder (auto-created)
│   └── inspections.db            # SQLite database (auto-created)
└── README.md                      # This file
```

### Step 4: Setup Folder Public
```bash
# Buat folder public
mkdir public

# Copy file HTML ke public
cp inspection_truck_enhanced.html public/index.html
```

### Step 5: Jalankan Server
```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

Server akan berjalan di: **http://localhost:3000**

## 🚀 Cara Penggunaan

### 1. Akses Aplikasi
Buka browser dan akses:
```
http://localhost:3000
```

### 2. Isi Form Pemeriksaan
1. Isi informasi dasar (tanggal, waktu, supplier, dll)
2. Lakukan checklist untuk setiap item (OK/Not OK/N/A)
3. Tambahkan catatan jika perlu
4. **Upload foto** dengan klik tombol "📷 Tambah Foto"

### 3. Upload Foto
- Klik tombol "📷 Tambah Foto" pada item yang ingin difoto
- Pilih satu atau beberapa foto (max 5MB per foto)
- Foto akan otomatis di-resize untuk menghemat storage
- Klik foto untuk melihat full size
- Klik tombol X untuk menghapus foto

### 4. Simpan Data
- **💾 Simpan Data** - Simpan lokal di browser (auto-save setiap 2 detik)
- **☁️ Simpan ke Database** - Simpan permanen ke server database
- **📄 Export PDF** - Download laporan dalam format PDF

## 🗄️ Struktur Database

### Tabel: inspections
Menyimpan data utama pemeriksaan
```sql
- id: Primary key
- tanggal: Tanggal pemeriksaan
- waktu: Waktu pemeriksaan
- supplier: Nama supplier
- driver: Nama driver
- nomorTruck: Nomor polisi truck
- inspector: Nama checker
- conclusion: Kesimpulan (approved/conditional/rejected)
- overallNotes: Catatan keseluruhan
- createdAt: Timestamp created
- updatedAt: Timestamp updated
```

### Tabel: inspection_items
Menyimpan hasil checklist
```sql
- id: Primary key
- inspectionId: Foreign key ke inspections
- itemId: ID item checklist (1-20)
- status: Status (ok/not-ok/na)
- notes: Catatan per item
```

### Tabel: inspection_photos
Menyimpan foto dalam base64
```sql
- id: Primary key
- inspectionId: Foreign key ke inspections
- itemId: ID item yang difoto
- photoData: Data foto dalam base64
- createdAt: Timestamp upload
```

## 🔌 API Endpoints

### GET /api/health
Health check server
```bash
curl http://localhost:3000/api/health
```

### GET /api/inspections
Ambil semua data pemeriksaan
```bash
# Semua data
curl http://localhost:3000/api/inspections

# Filter by date range
curl http://localhost:3000/api/inspections?startDate=2024-01-01&endDate=2024-12-31

# Filter by supplier
curl http://localhost:3000/api/inspections?supplier=PT%20ABC

# Filter by truck number
curl http://localhost:3000/api/inspections?nomorTruck=B1234XYZ
```

### GET /api/inspections/:id
Ambil detail pemeriksaan tertentu
```bash
curl http://localhost:3000/api/inspections/1
```

### POST /api/inspections
Buat pemeriksaan baru
```bash
curl -X POST http://localhost:3000/api/inspections \
  -H "Content-Type: application/json" \
  -d '{
    "tanggal": "2024-02-05",
    "waktu": "10:30",
    "supplier": "PT ABC",
    "driver": "John Doe",
    "nomorTruck": "B 1234 XYZ",
    "inspector": "Jane Smith",
    "conclusion": "approved",
    "overallNotes": "Semua kondisi baik",
    "items": {
      "1": "ok",
      "2": "ok"
    },
    "notes": {
      "1": "Sangat bersih"
    },
    "photos": {
      "1": ["data:image/jpeg;base64,..."]
    }
  }'
```

### PUT /api/inspections/:id
Update pemeriksaan
```bash
curl -X PUT http://localhost:3000/api/inspections/1 \
  -H "Content-Type: application/json" \
  -d '{...}'
```

### DELETE /api/inspections/:id
Hapus pemeriksaan
```bash
curl -X DELETE http://localhost:3000/api/inspections/1
```

### GET /api/statistics
Ambil statistik
```bash
# All time statistics
curl http://localhost:3000/api/statistics

# Date range statistics
curl http://localhost:3000/api/statistics?startDate=2024-01-01&endDate=2024-12-31
```

## 🌐 Deploy ke Production

### Option 1: Deploy ke VPS (Recommended)

1. **Upload files ke server**
```bash
scp -r truck-inspection-system/ user@your-server.com:/var/www/
```

2. **Install dependencies di server**
```bash
ssh user@your-server.com
cd /var/www/truck-inspection-system
npm install --production
```

3. **Setup PM2 untuk auto-restart**
```bash
npm install -g pm2
pm2 start server.js --name truck-inspection
pm2 save
pm2 startup
```

4. **Setup Nginx reverse proxy**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. **Update API_URL di index.html**
```javascript
const API_URL = 'https://your-domain.com/api';
```

### Option 2: Deploy ke Heroku

1. **Install Heroku CLI**
2. **Create Procfile**
```
web: node server.js
```

3. **Deploy**
```bash
heroku create truck-inspection
git add .
git commit -m "Initial commit"
git push heroku main
```

4. **Update API_URL**
```javascript
const API_URL = 'https://truck-inspection.herokuapp.com/api';
```

## 📱 Share/Embed

Aplikasi ini bisa di-share dengan:

1. **Share URL langsung**
   - Kirim link: `http://your-domain.com`
   - User bisa langsung akses tanpa login

2. **Embed di website lain**
```html
<iframe 
  src="http://your-domain.com" 
  width="100%" 
  height="800px"
  frameborder="0">
</iframe>
```

3. **QR Code**
   - Generate QR code dari URL
   - Scan untuk akses cepat dari mobile

## 🔒 Keamanan

### Untuk Production:
1. **Tambahkan Authentication**
2. **Setup HTTPS/SSL**
3. **Rate Limiting**
4. **Input Validation**
5. **SQL Injection Protection** (sudah menggunakan prepared statements)

## 🐛 Troubleshooting

### Server tidak bisa start
```bash
# Check port 3000 sudah digunakan?
lsof -i :3000

# Atau ganti port di server.js
const PORT = process.env.PORT || 3001;
```

### Foto tidak muncul setelah di-share
- Pastikan foto sudah tersimpan di database (bukan hanya localStorage)
- Klik tombol "☁️ Simpan ke Database" setelah upload foto

### Storage penuh
- Hapus beberapa foto
- Export ke PDF
- Simpan ke database lalu clear localStorage

### Database locked
- Tutup semua koneksi database yang terbuka
- Restart server

## 📊 Monitoring

### Check database size
```bash
ls -lh database/inspections.db
```

### View database content
```bash
sqlite3 database/inspections.db

# Lihat jumlah data
SELECT COUNT(*) FROM inspections;

# Lihat 10 data terakhir
SELECT id, tanggal, supplier, nomorTruck FROM inspections 
ORDER BY createdAt DESC LIMIT 10;
```

## 🤝 Support

Untuk bantuan lebih lanjut:
- Email: support@wjf.com
- Dokumentasi: [Link ke docs]

## 📝 License

MIT License - Free to use and modify

---

**Dibuat dengan ❤️ untuk WJF Quality Control System**
