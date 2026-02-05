# 🚀 CARA DEPLOY KE GITHUB - SUPER SIMPLE!

## 📱 Pilih Salah Satu:

---

### ✨ OPTION 1: Frontend Only (PALING MUDAH)
**Website langsung online gratis tanpa perlu server!**

#### Langkah-langkah:

1. **Buat Repository di GitHub**
   - Login ke https://github.com
   - Klik "+" → "New repository"
   - Nama: `truck-inspection`
   - Public ✅
   - Centang "Add README" ✅
   - Klik "Create repository"

2. **Upload Files**
   - Klik "Add file" → "Upload files"
   - Upload files ini:
     ```
     ✅ public/ (folder lengkap dengan index.html)
     ✅ index.html (redirect file)
     ✅ .nojekyll
     ✅ README.md
     ```
   - Commit!

3. **Aktifkan GitHub Pages**
   - Settings → Pages (menu kiri)
   - Source: Branch = **main**, Folder = **/ (root)**
   - Save
   - Tunggu 1-2 menit

4. **SELESAI! 🎉**
   - URL: `https://username.github.io/truck-inspection/`
   - Buka dan pakai!

**Catatan:** Data disimpan di browser (LocalStorage). Cocok untuk personal/tim kecil.

---

### 💾 OPTION 2: Full Stack (Dengan Database)
**Data tersimpan permanent di server database**

#### Langkah-langkah:

1. **Upload SEMUA Files ke GitHub**
   - Buat repository (sama seperti Option 1)
   - Upload **SEMUA file** (termasuk server.js, package.json, dll)

2. **Deploy ke Railway.app** (Gratis!)
   - Daftar di https://railway.app (pakai akun GitHub)
   - New Project → Deploy from GitHub repo
   - Pilih repository `truck-inspection`
   - Otomatis detect & deploy!
   - Dapat URL: `https://truck-inspection-xxx.up.railway.app`

3. **Update Frontend**
   - Edit file `public/index.html` di GitHub
   - Cari baris: `const API_URL = 'http://localhost:3000/api';`
   - Ganti jadi: `const API_URL = 'https://truck-inspection-xxx.up.railway.app/api';`
   - (Ganti xxx dengan URL Railway Anda)
   - Commit

4. **SELESAI! 🎉**
   - Akses Railway URL
   - Data tersimpan permanent di database!

**Alternatif Railway:**
- Render.com (gratis unlimited, tapi sleep after 15 min)
- Vercel (untuk frontend, backend perlu serverless)
- Heroku (perlu credit card)

---

## 🆘 TROUBLESHOOTING

### "404 Not Found"
- Tunggu 2-3 menit setelah deploy
- Pastikan folder `public/` ada
- Hard refresh: Ctrl+Shift+R

### "Application Error" di Railway
- Check Logs di Railway dashboard
- Pastikan PORT = 3000 di Environment Variables

### Data tidak tersimpan
- **Frontend only**: Normal, data di browser
- **Full stack**: Check API_URL sudah benar

---

## 📋 QUICK COMMANDS

**Setup Local:**
```bash
# Windows
setup.bat

# Mac/Linux
chmod +x setup.sh
./setup.sh
```

**Git Commands:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/truck-inspection.git
git push -u origin main
```

**Update Code:**
```bash
git add .
git commit -m "Update: description"
git push
```

---

## 📞 Butuh Bantuan?

Baca dokumentasi lengkap:
- **DEPLOY_GITHUB.md** - Panduan detail
- **README.md** - Dokumentasi sistem
- **QUICK_START.md** - Setup local

---

**TIPS:** Mulai dari Option 1 dulu untuk test. Kalau cocok, upgrade ke Option 2 untuk database permanent! ✨
