# 🚀 Panduan Deploy ke GitHub & GitHub Pages

Panduan lengkap untuk deploy sistem Truck Inspection ke GitHub dan hosting gratis di GitHub Pages.

## 📋 Prerequisites

1. **Akun GitHub** - Daftar gratis di https://github.com
2. **Git terinstall** - Download di https://git-scm.com/
3. **File project lengkap**

---

## 🎯 Option 1: Deploy Frontend Only (GitHub Pages)

Paling mudah! Website langsung online gratis dengan URL seperti:
`https://username.github.io/truck-inspection/`

### Step 1: Buat Repository di GitHub

1. Login ke GitHub
2. Klik tombol **"+"** pojok kanan atas → **"New repository"**
3. Isi form:
   - **Repository name**: `truck-inspection` (atau nama lain)
   - **Description**: "Sistem Check Sheet Pemeriksaan Truck"
   - **Public** (pilih ini agar bisa gunakan GitHub Pages gratis)
   - ✅ Centang **"Add a README file"**
4. Klik **"Create repository"**

### Step 2: Upload Files

**Cara 1: Via Web (Paling Mudah)**

1. Di halaman repository, klik **"Add file"** → **"Upload files"**
2. Drag & drop atau pilih file berikut:
   ```
   ├── public/
   │   └── index.html        (versi static)
   ├── index.html            (redirect file)
   ├── .nojekyll
   ├── .gitignore
   ├── README.md
   ├── QUICK_START.md
   └── API_DOCUMENTATION.md
   ```
3. Tulis commit message: "Initial commit - Frontend app"
4. Klik **"Commit changes"**

**Cara 2: Via Git Command Line**

```bash
# Di folder project Anda
git init
git add .
git commit -m "Initial commit - Frontend app"
git branch -M main
git remote add origin https://github.com/USERNAME/truck-inspection.git
git push -u origin main
```

Ganti `USERNAME` dengan username GitHub Anda.

### Step 3: Aktifkan GitHub Pages

1. Di repository, klik tab **"Settings"**
2. Scroll ke bawah, klik **"Pages"** di menu kiri
3. Di bagian **"Source"**:
   - Branch: pilih **main**
   - Folder: pilih **/ (root)**
4. Klik **"Save"**
5. Tunggu 1-2 menit
6. Refresh halaman, akan muncul URL:
   ```
   🎉 Your site is live at https://username.github.io/truck-inspection/
   ```

### Step 4: Akses Website

Buka URL yang diberikan! Website Anda sudah online 🎊

**Catatan:**
- Frontend only = data disimpan di browser (LocalStorage)
- Cocok untuk penggunaan personal/tim kecil
- Gratis selamanya
- Update: push file baru ke repository, otomatis deploy

---

## 🖥️ Option 2: Deploy Full Stack (Frontend + Backend)

Untuk menyimpan data permanent dengan database, perlu hosting yang support Node.js.

### Platform Hosting Gratis:

#### A. Railway.app (Recommended)

**Kelebihan:**
- Gratis $5 credit/bulan
- Support Node.js + SQLite
- Auto-deploy dari GitHub
- HTTPS otomatis

**Cara Deploy:**

1. **Push ke GitHub** (ikuti Option 1 step 1-2, tapi upload SEMUA file termasuk backend)

2. **Buat akun Railway**
   - Buka https://railway.app
   - Sign up dengan akun GitHub

3. **Create New Project**
   - Klik "New Project"
   - Pilih "Deploy from GitHub repo"
   - Pilih repository `truck-inspection`
   - Railway akan otomatis detect Node.js app

4. **Configure Environment**
   - Klik project → "Settings"
   - Add variable:
     ```
     PORT=3000
     NODE_ENV=production
     ```

5. **Deploy**
   - Railway otomatis build & deploy
   - Tunggu 2-3 menit
   - Akan dapat URL: `https://truck-inspection-production.up.railway.app`

6. **Update Frontend**
   - Edit `public/index.html`
   - Ganti baris API_URL:
     ```javascript
     const API_URL = 'https://truck-inspection-production.up.railway.app/api';
     ```
   - Push ke GitHub, Railway auto-redeploy

#### B. Render.com

**Kelebihan:**
- Gratis unlimited
- Auto-deploy dari GitHub
- HTTPS otomatis

**Kekurangan:**
- Sleep after 15 min inactive (perlu 30 detik untuk wake up)

**Cara Deploy:**

1. **Push ke GitHub** (semua file)

2. **Buat akun Render**
   - Buka https://render.com
   - Sign up dengan GitHub

3. **New Web Service**
   - Dashboard → "New +"  → "Web Service"
   - Connect repository: `truck-inspection`
   - Settings:
     - Name: `truck-inspection`
     - Environment: **Node**
     - Build Command: `npm install`
     - Start Command: `npm start`
     - Plan: **Free**
   - Klik "Create Web Service"

4. **Tunggu Deploy**
   - Render akan build & deploy (5-10 menit pertama kali)
   - URL: `https://truck-inspection.onrender.com`

5. **Update Frontend**
   - Edit `public/index.html`, update API_URL
   - Push ke GitHub

#### C. Heroku (Perlu Credit Card)

Dulunya gratis, sekarang butuh verifikasi CC (tapi tetap bisa pakai free tier).

**Cara Deploy:**

1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli

2. Login:
   ```bash
   heroku login
   ```

3. Create app:
   ```bash
   heroku create truck-inspection
   ```

4. Push:
   ```bash
   git push heroku main
   ```

5. Open:
   ```bash
   heroku open
   ```

---

## 🔧 Setup Custom Domain (Opsional)

Jika punya domain sendiri (contoh: `inspection.mycompany.com`):

### Untuk GitHub Pages:

1. Beli domain di Namecheap, GoDaddy, dll
2. Di DNS settings, tambah CNAME record:
   ```
   inspection → username.github.io
   ```
3. Di GitHub repo Settings → Pages → Custom domain
4. Masukkan domain Anda
5. Tunggu propagasi DNS (5-60 menit)

### Untuk Railway/Render:

1. Di dashboard project → Settings → Domains
2. Add custom domain
3. Ikuti instruksi update DNS di registrar Anda

---

## 📝 Workflow Development

### Update Website:

**Frontend only:**
```bash
# Edit file
git add .
git commit -m "Update: fitur baru"
git push origin main
# GitHub Pages auto-deploy dalam 1-2 menit
```

**Full stack:**
```bash
# Edit file
git add .
git commit -m "Update: fitur baru"
git push origin main
# Railway/Render auto-deploy dalam 2-5 menit
```

### Rollback jika error:

```bash
# Lihat history
git log --oneline

# Rollback ke commit sebelumnya
git revert HEAD
git push origin main
```

---

## 🔒 Keamanan untuk Production

Jika deploy full stack untuk production:

1. **Environment Variables**
   - Simpan API keys, database URL di environment variables
   - Jangan commit file `.env` ke Git

2. **Authentication**
   - Tambah login system
   - JWT token untuk API
   - Rate limiting

3. **HTTPS**
   - Railway/Render/Heroku otomatis pakai HTTPS
   - Untuk VPS sendiri, gunakan Let's Encrypt

4. **Database Backup**
   - Export database regular
   - Simpan backup di cloud storage

---

## 📊 Monitoring

### GitHub Pages:

- Settings → Pages → lihat deployment status
- Insights → Traffic untuk statistik visitor

### Railway/Render:

- Dashboard menampilkan:
  - Deployment logs
  - Resource usage
  - Metrics (CPU, Memory)
  - Error logs

---

## 🐛 Troubleshooting

### "404 Not Found" di GitHub Pages

**Solusi:**
- Pastikan ada file `index.html` di root atau folder `public/`
- Pastikan GitHub Pages aktif di Settings
- Tunggu 1-2 menit untuk propagasi
- Hard refresh browser (Ctrl+Shift+R)

### "Application Error" di Railway/Render

**Solusi:**
- Check deployment logs di dashboard
- Pastikan `package.json` benar
- Pastikan PORT sudah di-set di environment variables
- Check apakah ada error di code

### Data tidak tersimpan

**Frontend only (GitHub Pages):**
- Data tersimpan di LocalStorage browser
- Jika clear cache/cookies, data hilang
- Normal behavior untuk static site

**Full stack:**
- Check apakah API endpoint benar
- Check console browser untuk error
- Pastikan backend server running
- Check database connection

### Website lambat loading

**Solusi:**
- Optimize images (sudah ada resize otomatis)
- Minify CSS/JS untuk production
- Gunakan CDN untuk assets static
- Upgrade hosting plan jika perlu

---

## 💡 Tips & Best Practices

1. **Gunakan Branch**
   ```bash
   # Buat branch untuk development
   git checkout -b development
   
   # Merge ke main setelah testing
   git checkout main
   git merge development
   ```

2. **Commit Messages yang Jelas**
   ```bash
   git commit -m "Fix: bug upload foto"
   git commit -m "Add: filter by date"
   git commit -m "Update: UI improvements"
   ```

3. **Testing Sebelum Deploy**
   - Test di local dulu
   - Test di berbagai browser
   - Test di mobile

4. **Documentation**
   - Update README.md jika ada perubahan
   - Dokumentasikan API changes
   - Catat breaking changes

---

## 📞 Getting Help

- **GitHub Issues**: Untuk bug reports
- **GitHub Discussions**: Untuk pertanyaan
- **Documentation**: Baca README.md lengkap
- **Stack Overflow**: Tag `github-pages`, `railway`, dll

---

## ✅ Checklist Deploy

- [ ] Repository dibuat di GitHub
- [ ] Files di-upload (semua atau frontend only)
- [ ] `.gitignore` mencegah upload `node_modules/`
- [ ] GitHub Pages diaktifkan (untuk frontend only)
- [ ] Railway/Render di-setup (untuk full stack)
- [ ] API_URL diupdate di frontend
- [ ] Testing di production URL
- [ ] Custom domain setup (opsional)
- [ ] Monitoring & logging aktif
- [ ] Backup strategy ready

---

**Selamat! Website Anda sudah online! 🎉**

Untuk pertanyaan lebih lanjut, buka issue di GitHub repository atau hubungi tim support.
