# Panduan Build APK KissAsian Mobile

## Opsi 1: Build Menggunakan EAS (Recommended - Cloud Build)

### Keuntungan:
- Tidak perlu install Android SDK
- Build di server Expo
- Lebih stabil dan cepat

### Langkah-langkah:

1. **Install EAS CLI** (sudah ada di project)
   ```bash
   npm install -g eas-cli
   ```

2. **Login ke Expo**
   ```bash
   eas login
   ```

3. **Konfigurasi EAS** (jika belum ada)
   ```bash
   eas build:configure
   ```

4. **Build APK**
   ```bash
   eas build --platform android --profile preview
   ```

5. **Download APK**
   - Tunggu build selesai (biasanya 10-15 menit)
   - Download APK dari link yang diberikan
   - Install di HP Android Anda

---

## Opsi 2: Build Lokal (Memerlukan Android SDK)

### Prerequisites:
- Android SDK (min API 31)
- Java Development Kit (JDK 11+)
- Gradle

### Langkah-langkah:

1. **Install Android SDK**
   ```bash
   # Untuk Linux/Mac
   brew install android-sdk
   
   # Atau download dari https://developer.android.com/studio
   ```

2. **Set Environment Variables**
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
   ```

3. **Export Project**
   ```bash
   cd /home/ubuntu/kissasian-mobile
   npx expo export --platform android --output-dir ./dist
   ```

4. **Build APK**
   ```bash
   cd dist/android
   ./gradlew assembleRelease
   ```

5. **Cari APK**
   - APK akan berada di: `dist/android/app/build/outputs/apk/release/app-release.apk`

---

## Opsi 3: Build Menggunakan Expo Go (Testing Only)

### Keuntungan:
- Paling cepat untuk testing
- Tidak perlu build APK

### Langkah-langkah:

1. **Download Expo Go** dari Play Store

2. **Jalankan dev server**
   ```bash
   cd /home/ubuntu/kissasian-mobile
   pnpm start
   ```

3. **Scan QR Code** dengan Expo Go

---

## Instalasi APK di HP Android

### Cara 1: Menggunakan ADB
```bash
adb install app-release.apk
```

### Cara 2: Manual
1. Copy file APK ke HP
2. Buka file manager
3. Tap file APK
4. Tap "Install"
5. Tunggu selesai

### Cara 3: Email/Cloud
1. Upload APK ke Google Drive
2. Download di HP
3. Tap file dan install

---

## Troubleshooting

### Build gagal di EAS
- Pastikan sudah login: `eas login`
- Cek koneksi internet
- Lihat log error: `eas build --platform android --profile preview --logs`

### APK tidak bisa diinstall
- Pastikan HP memperbolehkan instalasi dari sumber tidak dikenal
- Settings > Security > Unknown Sources (ON)
- Pastikan versi Android minimal API 31

### Aplikasi crash saat dibuka
- Cek log: `adb logcat`
- Pastikan semua dependencies terinstall
- Coba uninstall dan reinstall

### Video tidak bisa diputar
- Pastikan koneksi internet stabil
- Cek apakah KissAsian masih aktif
- Coba ubah kualitas video

---

## Tips & Tricks

1. **Faster Build**: Gunakan `--profile preview` untuk build yang lebih cepat
2. **Debugging**: Gunakan `adb logcat` untuk melihat log aplikasi
3. **Testing**: Gunakan Expo Go untuk testing cepat sebelum build APK
4. **Size Optimization**: Aplikasi ini sekitar 50-100MB, tergantung dependencies

---

## File Output

Setelah build selesai, file APK akan berada di:
- **EAS Build**: Download dari dashboard Expo
- **Local Build**: `dist/android/app/build/outputs/apk/release/app-release.apk`

---

## Next Steps

Setelah APK siap:
1. Test di berbagai device Android
2. Optimize performa jika diperlukan
3. Siapkan untuk publish ke Play Store (jika ingin)
4. Buat changelog dan release notes

---

## Support

Jika ada masalah, cek:
- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
