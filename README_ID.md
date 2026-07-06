# KissAsian Mobile 📱

Aplikasi mobile untuk menonton drama Asia (khususnya drama China) dengan fitur lengkap dan user-friendly.

## 🎬 Fitur Utama

✅ **Banner Carousel** - Tampilan drama populer dengan auto-scroll  
✅ **Riwayat Tontonan** - Simpan episode yang terakhir ditonton  
✅ **Pencarian** - Cari drama berdasarkan judul  
✅ **Detail Drama** - Informasi lengkap dan daftar episode  
✅ **Video Player** - Pemutar video dengan kontrol penuh  
✅ **Kualitas Video** - Pilih resolusi hingga 1080p  
✅ **Kontrol Video** - Play/pause, maju/mundur 10 detik  
✅ **Penyimpanan Lokal** - Riwayat dan favorit tanpa login  
✅ **Notifikasi** - Update drama terbaru otomatis  

## 📋 Persyaratan

- Android 12+ (API 31+)
- Koneksi internet stabil
- Storage minimal 100MB

## 🚀 Instalasi

### Opsi 1: Download APK Langsung
1. Download file `app-release.apk`
2. Buka file manager di HP
3. Tap file APK
4. Tap "Install"
5. Tunggu selesai

### Opsi 2: Build Sendiri

#### Menggunakan EAS (Recommended)
```bash
# Install EAS CLI
npm install -g eas-cli

# Login ke Expo
eas login

# Build APK
eas build --platform android --profile preview

# Download dari link yang diberikan
```

#### Build Lokal (Memerlukan Android SDK)
```bash
# Export project
npx expo export --platform android --output-dir ./dist

# Build APK
cd dist/android
./gradlew assembleRelease

# APK akan berada di: app/build/outputs/apk/release/app-release.apk
```

## 📖 Cara Menggunakan

### Halaman Beranda
- Scroll untuk melihat banner drama populer
- Lihat riwayat tontonan Anda
- Jelajahi drama terbaru dalam grid

### Mencari Drama
1. Tap tab "Cari" di bawah
2. Ketik judul drama
3. Tap tombol cari
4. Pilih drama dari hasil

### Menonton Drama
1. Tap drama untuk melihat detail
2. Tap episode yang ingin ditonton
3. Gunakan kontrol video untuk play/pause
4. Tap tombol kualitas untuk mengubah resolusi

### Menambah Favorit
1. Buka detail drama
2. Tap tombol hati (❤️)
3. Drama akan ditambah ke favorit

## ⚙️ Pengaturan

### Mengubah Kualitas Video
- Tap tombol kualitas di kanan bawah video player
- Pilih resolusi yang diinginkan
- Aplikasi akan mengingat pilihan Anda

### Menghapus Riwayat
- Riwayat otomatis dihapus setelah 50 item
- Untuk menghapus manual, uninstall dan reinstall aplikasi

## 🐛 Troubleshooting

### Video tidak bisa diputar
**Solusi:**
- Pastikan koneksi internet stabil
- Coba ubah kualitas video ke yang lebih rendah
- Refresh halaman dengan menutup dan membuka kembali

### Aplikasi crash
**Solusi:**
- Uninstall aplikasi
- Hapus cache: Settings > Apps > KissAsian Mobile > Storage > Clear Cache
- Reinstall aplikasi

### Scraping gagal / Drama tidak muncul
**Solusi:**
- Periksa koneksi internet
- Coba buka KissAsian di browser untuk memastikan masih aktif
- Jika domain berubah, aplikasi perlu update

### Notifikasi tidak muncul
**Solusi:**
- Pastikan notifikasi diizinkan: Settings > Apps > KissAsian Mobile > Notifications > ON
- Aplikasi harus berjalan di background

## 📊 Spesifikasi Aplikasi

| Aspek | Detail |
|-------|--------|
| Platform | Android 12+ |
| Ukuran | ~50-100MB |
| Framework | React Native + Expo |
| Database | AsyncStorage (Lokal) |
| Video Player | React Native Video |
| Scraping | Axios + Cheerio |

## ⚠️ Disclaimer

- Aplikasi ini adalah untuk tujuan edukasi
- Gunakan sesuai dengan kebijakan privasi KissAsian
- Pastikan Anda memiliki hak untuk mengakses konten
- Developer tidak bertanggung jawab atas penggunaan yang melanggar hukum

## 📝 Lisensi

Aplikasi ini dibuat dengan tujuan edukasi. Gunakan dengan bertanggung jawab.

## 🤝 Support

Jika ada pertanyaan atau bug, silakan buat issue atau hubungi developer.

---

**Versi:** 1.0.0  
**Last Updated:** Juli 2026  
**Status:** Beta

Selamat menonton! 🎬
