# 🏗️ Arsitektur Sistem - Visual Guide

## 📊 Diagram Alur Deployment

```
┌─────────────────────────────────────────────────────────────────┐
│                    PILIHAN DEPLOYMENT                            │
└─────────────────────────────────────────────────────────────────┘
                              |
                              |
                ┌─────────────┴─────────────┐
                |                           |
        ┌───────▼───────┐           ┌──────▼──────┐
        │  OPTION 1      │           │  OPTION 2   │
        │  Frontend Only │           │  Full Stack │
        │  (GitHub Pages)│           │  (Railway)  │
        └───────┬────────┘           └──────┬──────┘
                |                           |
                |                           |
    ┌───────────▼────────────┐   ┌──────────▼────────────┐
    │ • Upload ke GitHub      │   │ • Upload ke GitHub    │
    │ • Aktifkan Pages        │   │ • Connect Railway     │
    │ • Selesai! ✅          │   │ • Auto Deploy         │
    │                        │   │ • Update API_URL      │
    │ URL:                   │   │ • Selesai! ✅        │
    │ username.github.io     │   │                       │
    │                        │   │ URL:                  │
    │ Data: LocalStorage     │   │ xxx.up.railway.app    │
    │ (browser)              │   │                       │
    │                        │   │ Data: SQLite Database │
    └────────────────────────┘   │ (server)              │
                                 └───────────────────────┘
```

---

## 🔄 Alur Kerja Aplikasi

### Option 1: GitHub Pages (Frontend Only)

```
┌─────────┐      ┌─────────────┐      ┌──────────────┐
│ Browser │─────▶│  HTML/JS    │─────▶│ LocalStorage │
│ (User)  │      │  (Static)   │      │  (Browser)   │
└─────────┘      └─────────────┘      └──────────────┘
                        │
                        ▼
                 ┌──────────────┐
                 │ Export PDF   │
                 └──────────────┘
```

**Proses:**
1. User buka website dari GitHub Pages
2. Isi form & upload foto
3. Klik "Simpan Data" → tersimpan di browser
4. Klik "Export PDF" → download laporan

**Kelebihan:**
- ✅ Gratis selamanya
- ✅ Setup mudah (5 menit)
- ✅ Tidak perlu server
- ✅ Hosting unlimited

**Kekurangan:**
- ❌ Data hilang jika clear browser
- ❌ Tidak bisa sharing data antar user
- ❌ Tidak bisa filter/search history

---

### Option 2: Full Stack (Railway/Render)

```
┌─────────┐      ┌─────────────┐      ┌──────────────┐
│ Browser │─────▶│  HTML/JS    │─────▶│  Express.js  │
│ (User)  │      │  (Frontend) │      │  (Backend)   │
└─────────┘      └─────────────┘      └──────┬───────┘
                        │                     │
                        │                     │
                        ▼                     ▼
                 ┌──────────────┐      ┌─────────────┐
                 │ Export PDF   │      │   SQLite    │
                 └──────────────┘      │  Database   │
                                       └─────────────┘
```

**Proses:**
1. User buka website dari Railway URL
2. Isi form & upload foto
3. Klik "Simpan ke Database" → POST ke API
4. Backend simpan ke SQLite database
5. Data bisa diakses dari mana saja
6. Klik "Export PDF" → download laporan

**Kelebihan:**
- ✅ Data permanent
- ✅ Bisa sharing antar user
- ✅ Filter & search history
- ✅ Backup data mudah
- ✅ RESTful API available

**Kekurangan:**
- ⚠️ Perlu setup backend
- ⚠️ Railway free tier: $5/bulan limit
- ⚠️ Render free tier: sleep after 15 min

---

## 📁 Struktur Database (Option 2)

```
┌─────────────────────────────────────────────────────┐
│                   inspections                        │
├─────────────────────────────────────────────────────┤
│ • id (PRIMARY KEY)                                   │
│ • tanggal, waktu                                     │
│ • supplier, driver, nomorTruck                       │
│ • inspector, conclusion, overallNotes                │
│ • createdAt, updatedAt                               │
└─────────┬───────────────────────────────────────────┘
          │
          ├────────────────────┬──────────────────────┐
          │                    │                      │
    ┌─────▼──────┐      ┌──────▼──────┐      ┌───────▼────────┐
    │inspection_ │      │inspection_  │      │inspection_     │
    │items       │      │photos       │      │(future tables) │
    ├────────────┤      ├─────────────┤      └────────────────┘
    │• itemId    │      │• photoData  │
    │• status    │      │  (base64)   │
    │• notes     │      └─────────────┘
    └────────────┘
```

**Relasi:**
- `inspection_items.inspectionId` → `inspections.id`
- `inspection_photos.inspectionId` → `inspections.id`
- CASCADE DELETE: hapus inspection = hapus items & photos

---

## 🔌 API Endpoints (Option 2)

```
GET    /api/inspections              ← Ambil semua data
GET    /api/inspections/:id          ← Ambil satu data
POST   /api/inspections              ← Buat data baru
PUT    /api/inspections/:id          ← Update data
DELETE /api/inspections/:id          ← Hapus data
GET    /api/statistics               ← Statistik
GET    /api/health                   ← Health check
```

**Request Flow:**
```
Browser → Frontend → API → Database → Response → Frontend → Browser
```

---

## 🚀 Deployment Flow

### GitHub Pages:
```
Local Files → Git Push → GitHub Repo → GitHub Actions → Live Website
   (1 min)      (1 sec)    (instant)      (1-2 min)       (instant)
```

### Railway:
```
Local Files → Git Push → GitHub Repo → Railway Webhook → Build → Deploy
   (1 min)      (1 sec)    (instant)      (instant)      (2-3 min)
```

---

## 📱 User Flow

```
1. Akses Website
   ↓
2. Isi Data Dasar
   (supplier, driver, truck, etc)
   ↓
3. Lakukan Checklist
   (OK/Not OK/N/A untuk 20 item)
   ↓
4. Upload Foto (opsional)
   (multiple foto per item)
   ↓
5. Tambah Notes (opsional)
   (catatan per item)
   ↓
6. Isi Kesimpulan
   (approved/conditional/rejected)
   ↓
7. Simpan Data
   • LocalStorage (Option 1)
   • Database (Option 2)
   ↓
8. Export PDF (opsional)
   ↓
9. Selesai! ✅
```

---

## 🔄 Update Workflow

```
Edit Code Locally
      ↓
Test di Browser
      ↓
Git Add & Commit
      ↓
Git Push ke GitHub
      ↓
      ├─→ GitHub Pages: Auto Deploy (1-2 min)
      └─→ Railway/Render: Auto Deploy (2-5 min)
      ↓
Live Website Updated! ✅
```

---

## 💾 Data Storage Comparison

| Feature | LocalStorage | Database |
|---------|-------------|----------|
| **Permanence** | Hilang jika clear browser | Permanent di server |
| **Capacity** | ~5-10 MB | Unlimited (tergantung hosting) |
| **Sharing** | ❌ Tidak bisa | ✅ Bisa antar user |
| **Backup** | Manual export PDF | ✅ Auto backup |
| **Search** | ❌ Terbatas | ✅ Full search & filter |
| **Speed** | ⚡ Instant | 🐢 Tergantung network |
| **Setup** | ✅ Zero setup | ⚠️ Perlu setup backend |

---

## 🎯 Rekomendasi Berdasarkan Use Case

```
┌──────────────────────┬─────────────────┬─────────────────┐
│   Use Case           │  Rekomendasi    │  Platform       │
├──────────────────────┼─────────────────┼─────────────────┤
│ Personal use         │  Option 1       │  GitHub Pages   │
│ Testing/Demo         │  Option 1       │  GitHub Pages   │
│ Team < 5 orang       │  Option 1 or 2  │  GitHub/Railway │
│ Team > 5 orang       │  Option 2       │  Railway/VPS    │
│ Production use       │  Option 2       │  Railway/VPS    │
│ Need history         │  Option 2       │  Railway/VPS    │
│ Need reports         │  Option 2       │  Railway/VPS    │
└──────────────────────┴─────────────────┴─────────────────┘
```

---

## 📈 Scaling Path

```
Phase 1: GitHub Pages (LocalStorage)
   │
   ├─→ Cukup untuk personal/testing
   │
   ▼
Phase 2: Railway/Render (SQLite)
   │
   ├─→ Cukup untuk team < 50 inspections/day
   │
   ▼
Phase 3: VPS + PostgreSQL
   │
   ├─→ Untuk production > 100 inspections/day
   │
   ▼
Phase 4: Cloud + Load Balancer
   │
   └─→ Enterprise level
```

---

**Pilih sesuai kebutuhan Anda! Start simple, scale later! 🚀**
