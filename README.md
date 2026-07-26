# DompetJujur

DompetJujur adalah *friction layer* pribadi yang membantu pengguna menciptakan jeda pada momen impulsif pengeluaran uang, memvisualisasikan dampak keputusan tersebut secara nyata, dan membantu mencatat refleksinya.

## Fitur Utama
- **Passwordless OTP (One-Time Password)**: Autentikasi aman tanpa pusing mengingat *password*. Cukup masukkan email, lalu Anda akan menerima 6-digit OTP untuk masuk.
- **Jeda 90 Detik**: Mengubah keputusan impulsif menjadi keputusan sadar melalui proses intervensi 90 detik.
- **Rencana Aman Gajian**: Visualisasi uang fleksibel.
- **Riwayat Keputusan**: Pencatatan sesi penundaan dan keberhasilan *harm reduction*.

## Stack Teknologi
- **Frontend**: Next.js 15 (App Router), React, TypeScript, Tailwind CSS, shadcn/ui.
- **Backend & Auth**: Supabase (PostgreSQL, Supabase Auth via Email OTP).

## Menjalankan Aplikasi Secara Lokal

1. Pastikan dependensi sudah terpasang:
   ```bash
   npm install
   ```

2. Jalankan Supabase secara lokal:
   ```bash
   npx supabase start
   ```

3. Jalankan server Next.js:
   ```bash
   npm run dev
   ```

4. Buka http://localhost:3000 di *browser* Anda.
5. Untuk kotak masuk (*inbox*) lokal saat *login* OTP, buka Mailpit di http://localhost:54324.
