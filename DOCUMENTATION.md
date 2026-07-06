# KissAsian Mobile - Dokumentasi

## Deskripsi Aplikasi

KissAsian Mobile adalah aplikasi mobile untuk menonton drama Asia (khususnya drama China) dengan fitur lengkap termasuk:

- **Banner Carousel**: Menampilkan drama populer dengan auto-scroll setiap 5 detik
- **Riwayat Tontonan**: Menyimpan episode yang terakhir ditonton
- **Pencarian**: Mencari drama berdasarkan judul
- **Detail Drama**: Menampilkan informasi lengkap drama dan daftar episode
- **Video Player**: Pemutar video dengan kontrol penuh
- **Pemilihan Kualitas**: Pilih resolusi video hingga 1080p
- **Kontrol Video**: Maju/mundur 10 detik, play/pause
- **Penyimpanan Lokal**: Menyimpan riwayat dan favorit tanpa login
- **Notifikasi**: Update drama terbaru

## Struktur Proyek

```
kissasian-mobile/
├── app/
│   ├── screens/
│   │   ├── HomeScreen.tsx          # Halaman utama dengan banner dan drama terbaru
│   │   ├── SearchScreen.tsx        # Halaman pencarian drama
│   │   ├── DramaDetailScreen.tsx   # Detail drama dan daftar episode
│   │   └── VideoPlayerScreen.tsx   # Pemutar video
│   └── index.tsx                   # Navigasi utama (tab navigation)
├── services/
│   ├── kissasianScraper.ts        # Scraping data dari KissAsian
│   ├── database.ts                # Penyimpanan lokal (riwayat, favorit)
│   └── notificationService.ts     # Notifikasi update drama
├── app.json                        # Konfigurasi Expo
└── package.json                    # Dependencies
```

## Teknologi yang Digunakan

- **React Native**: Framework untuk aplikasi mobile
- **Expo**: Platform untuk build dan deploy
- **TypeScript**: Type safety untuk JavaScript
- **Axios**: HTTP client untuk scraping
- **Cheerio**: HTML parser untuk scraping
- **React Navigation**: Navigasi antar screen
- **React Native Video**: Video player
- **AsyncStorage**: Penyimpanan lokal
- **Expo Notifications**: Sistem notifikasi

## Fitur Utama

### 1. Halaman Beranda (Home)
- Banner carousel yang menampilkan drama populer
- Riwayat tontonan (5 drama terakhir)
- Daftar drama terbaru dalam grid 3 kolom
- Tombol "Lihat Semua" untuk melihat lebih banyak drama

### 2. Halaman Pencarian (Search)
- Input field untuk pencarian drama
- Hasil pencarian ditampilkan dalam list
- Klik drama untuk melihat detail

### 3. Detail Drama (Drama Detail)
- Poster drama
- Tombol favorit (hati)
- Genre tags
- Tombol "Mulai Menonton"
- Daftar semua episode dalam grid 2 kolom
- Klik episode untuk mulai menonton

### 4. Video Player
- Tampilan fullscreen
- Kontrol play/pause
- Tombol maju/mundur 10 detik
- Progress bar dengan durasi
- Pemilihan kualitas video (360p, 480p, 720p, 1080p)
- Auto-hide controls setelah 3 detik
- Penyimpanan progress otomatis setiap 5 detik

### 5. Penyimpanan Lokal
- Riwayat tontonan (max 50 item)
- Daftar favorit
- Pengaturan aplikasi
- Semua data disimpan di AsyncStorage

### 6. Notifikasi
- Notifikasi otomatis untuk drama baru setiap 6 jam
- Background task untuk check update
- Notifikasi dapat diklik untuk membuka drama

## Cara Menggunakan

### Development
```bash
# Install dependencies
pnpm install

# Run di web
pnpm run web

# Run di Android (memerlukan Android SDK)
pnpm run android

# Run di iOS (memerlukan macOS)
pnpm run ios
```

### Build APK
```bash
# Build APK untuk Android
eas build --platform android

# Atau build lokal (memerlukan Android SDK)
npx expo export --platform android
cd dist/android
./gradlew assembleRelease
```

## Konfigurasi

### Mengubah Domain KissAsian
Jika domain KissAsian berubah, edit file `services/kissasianScraper.ts`:
```typescript
const KISSASIAN_URL = 'https://kissasian.tf'; // Ubah ke domain baru
```

### Mengubah Tema Warna
Edit file `app/screens/*.tsx` dan ubah warna:
- Primary: `#FF6B6B` (merah)
- Background: `#1a1a1a` (hitam gelap)
- Secondary: `#2a2a2a` (abu-abu gelap)

## Troubleshooting

### Video tidak bisa diputar
- Pastikan koneksi internet stabil
- Coba ubah kualitas video
- Refresh halaman

### Scraping gagal
- Periksa apakah domain KissAsian masih aktif
- Coba gunakan VPN jika ada pemblokiran regional
- Periksa log error di console

### Aplikasi lambat
- Hapus riwayat tontonan yang terlalu banyak
- Restart aplikasi
- Bersihkan cache

## Batasan & Catatan Penting

1. **Scraping**: Aplikasi ini melakukan scraping dari KissAsian. Gunakan sesuai dengan kebijakan privasi dan ToS KissAsian.

2. **Konten**: Pastikan Anda memiliki hak untuk mengakses konten yang ditampilkan.

3. **Performa**: Scraping real-time dapat mempengaruhi performa aplikasi. Pertimbangkan untuk menggunakan cache atau API backend di masa depan.

4. **Iklan**: Aplikasi ini memblokir iklan dari KissAsian. Jika ingin mendukung KissAsian, pertimbangkan mengakses situs langsung.

## Rencana Pengembangan Selanjutnya

- [ ] Backend API untuk caching dan performa lebih baik
- [ ] Sistem login untuk sinkronisasi antar perangkat
- [ ] Download episode untuk nonton offline
- [ ] Subtitle selection
- [ ] Social sharing
- [ ] Rating dan review
- [ ] Rekomendasi drama berdasarkan history
- [ ] Dark/Light mode toggle
- [ ] Multiple language support

## Support & Kontribusi

Jika ada bug atau saran, silakan buat issue atau pull request.

## Lisensi

Aplikasi ini dibuat untuk tujuan edukasi. Gunakan dengan bertanggung jawab.
