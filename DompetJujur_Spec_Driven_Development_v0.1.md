# DompetJujur — Spec-Driven Development
**Dokumen:** Product & Engineering Specification  
**Versi:** 0.1 Draft  
**Platform awal:** Progressive Web App (PWA)  
**Status:** Siap untuk refinement, estimation, dan breakdown sprint  
**Sumber utama:** Pitch deck “DompetJujur — Hacker · MVP PWA · 2026”

---

## 1. Ringkasan Produk

DompetJujur adalah lapisan friksi pribadi yang digunakan **sebelum** pengguna mengambil keputusan finansial impulsif. Produk memberi jeda terpandu, menerjemahkan nominal transaksi menjadi dampak personal terhadap ruang uang fleksibel, lalu memberi pengguna pilihan untuk:

1. menunda keputusan;
2. mengalihkan fokus; atau
3. tetap melanjutkan transaksi.

DompetJujur bukan aplikasi pencatat keuangan, bukan pemblokir transaksi, bukan terapi, dan bukan chatbot finansial generik. Keputusan tetap sepenuhnya berada pada pengguna.

### Prinsip arsitektur utama

- Critical path harus deterministik.
- Browser dianggap tidak tepercaya.
- Validasi akhir dilakukan server.
- PostgreSQL Row Level Security menjadi lapisan otorisasi terakhir.
- LLM bersifat non-authoritative.
- Kegagalan AI tidak boleh menghentikan alur jeda, dampak, outcome, atau riwayat.
- Seluruh nominal Rupiah disimpan sebagai integer.

---

## 2. Masalah yang Diselesaikan

### Masalah utama

Pengguna tidak selalu kekurangan pengetahuan finansial. Kegagalan terjadi karena tidak ada ruang refleksi pada detik ketika dorongan muncul.

### Pola perilaku sasaran

1. Pengguna sedang stres, lelah, baru gajian, atau baru mengalami kerugian.
2. Dorongan membeli, membayar, berjudi, atau menggunakan PayLater muncul.
3. Akses transaksi tersedia dalam satu atau dua ketukan.
4. Pengguna mengambil keputusan sebelum mengevaluasi dampaknya.
5. Penyesalan mempersempit ruang uang bulan berjalan dan meningkatkan stres.

### Job to Be Done

> Ketika saya sedang terdorong mengeluarkan uang secara impulsif, bantu saya berhenti sebentar, melihat dampaknya pada kondisi uang saya, dan memilih tindakan tanpa merasa dihakimi.

---

## 3. Sasaran Produk

### Sasaran MVP

- Memberi intervensi singkat sebelum tindakan finansial impulsif.
- Membuat nominal terasa personal melalui persentase ruang uang fleksibel.
- Menjaga otonomi pengguna.
- Mencatat outcome secara netral.
- Membantu pengguna mengenali pola pemicu dan waktu rawan.
- Menguji apakah guided pause meningkatkan keputusan menunda atau mengalihkan dibanding snapshot dampak saja.

### Non-goals MVP

- Sinkronisasi rekening bank atau e-wallet.
- Pemblokiran aplikasi, situs, transaksi, atau akun.
- Deteksi otomatis aktivitas judi atau belanja.
- Credit scoring.
- Rekomendasi investasi, pinjaman, atau keputusan finansial preskriptif.
- Diagnosis psikologis atau klaim terapi.
- Gamifikasi berbasis streak, shame score, leaderboard, atau hukuman.
- Pelaporan catatan individual kepada mitra.
- Penjualan data atau iklan perilaku.

---

## 4. Target Pengguna

### Persona awal

**Nama hipotesis:** Raka  
**Usia:** sekitar 24 tahun  
**Profil:** pekerja muda, mobile-first, pendapatan sekitar Rp4,5–8 juta per bulan  
**Perilaku:** menggunakan e-wallet, mobile banking, dan/atau PayLater  
**Momen rawan:** malam hari, setelah kerja, baru gajian, atau setelah mengalami kerugian  
**Hambatan:** malu bercerita dan tidak ingin aplikasi terasa klinis atau menggurui  
**Kebutuhan:** keputusan yang lebih sadar tanpa kehilangan kontrol

Persona adalah hipotesis awal dan harus divalidasi melalui wawancara dan pilot.

---

## 5. Prinsip Pengalaman Pengguna

1. **Cepat masuk**  
   Pengguna harus dapat memulai sesi tanpa formulir panjang.

2. **Tenang selama jeda**  
   Antarmuka tidak boleh memberi tekanan, rasa bersalah, atau urgensi tambahan.

3. **Dampak konkret**  
   Nominal harus diterjemahkan menjadi konteks uang personal.

4. **Pilihan eksplisit**  
   Pengguna selalu memilih sendiri outcome akhir.

5. **Bahasa netral**  
   “Tetap lanjut” bukan kegagalan dan tidak diberi warna, ikon, atau copy yang menghukum.

6. **Relapse-safe**  
   Produk tetap menerima dan mencatat pengguna yang melanjutkan keputusan.

7. **Privacy by design**  
   Data yang diminta hanya data minimum yang diperlukan.

8. **AI optional**  
   Pengguna dapat menyelesaikan seluruh critical path tanpa respons LLM.

---

## 6. Scope Produk

### P0 — Wajib selesai penuh

1. Authentication dan onboarding.
2. Baseline kondisi uang.
3. Input nominal sesi.
4. Pemilihan pemicu dan urge score awal.
5. Snapshot dampak.
6. Jeda terpandu dengan timer persisten.
7. Outcome: tunda, alihkan, atau lanjut.
8. Refleksi singkat.
9. Riwayat sesi.
10. Penghapusan sesi, histori, dan akun.
11. Instrumentasi event critical path.
12. RLS dan owner validation.

### P1 — Masuk produk tetapi tidak menjadi dependency

1. Quick trigger.
2. Dashboard pola.
3. AI Conversation.
4. AI Insight.
5. Fallback statis saat LLM gagal.

### P2 — Setelah bukti utility dan safety

1. Trusted contact.
2. Reminder jam rawan berbasis consent.
3. PWA enhancement lanjutan.
4. Data export.
5. Integrasi opsional dengan mekanisme blocking.
6. Integrasi distribusi mitra.

### Cut-line

Aplikasi dianggap memiliki MVP yang valid ketika seluruh P0 berjalan aman tanpa AI.

---

## 7. Alur Utama Pengguna

```text
AUTH
  ↓
ONBOARDING
  ↓
BASELINE
  ↓
AMOUNT
  ↓
TRIGGER + URGE_BEFORE
  ↓
SNAPSHOT
  ↓
PAUSE
  ↓
DECISION
  ↓
OUTCOME
  ↓
REFLECTION
  ↓
COMPLETE
```

### Happy path

1. Pengguna login dengan OTP.
2. Pengguna mengisi estimasi pendapatan dan kewajiban bulanan.
3. Pengguna menekan “Mulai jeda”.
4. Pengguna memasukkan nominal yang sedang dipikirkan.
5. Pengguna memilih pemicu dan skor dorongan.
6. Sistem menampilkan dampak nominal terhadap ruang uang fleksibel.
7. Sistem memulai jeda terpandu.
8. Setelah eligible, pengguna memilih outcome.
9. Pengguna mengisi skor dorongan sesudah jeda dan refleksi opsional.
10. Sistem menyimpan sesi dan memperbarui riwayat.

---

## 8. State Machine Sesi

### State

| State | Deskripsi |
|---|---|
| `draft` | Sesi dibuat, data belum lengkap |
| `amount_entered` | Nominal valid telah disimpan |
| `context_captured` | Pemicu dan urge score awal telah disimpan |
| `snapshot_viewed` | Snapshot dampak telah ditampilkan |
| `pause_active` | Jeda sedang berjalan |
| `outcome_eligible` | Waktu minimum telah terpenuhi |
| `completed` | Outcome tersimpan |
| `abandoned` | Tidak ada aktivitas sampai batas abandonment |
| `deleted` | Sesi dihapus pengguna |

### Transisi yang diizinkan

```text
draft
  → amount_entered
  → context_captured
  → snapshot_viewed
  → pause_active
  → outcome_eligible
  → completed
```

### Aturan transisi

- Client tidak boleh menentukan sendiri state authoritative.
- Server harus memvalidasi state sebelumnya sebelum transisi.
- Outcome tidak dapat disimpan sebelum `pause_eligible_at`.
- Outcome hanya dapat disimpan satu kali.
- Perubahan outcome setelah tersimpan tidak diizinkan pada MVP.
- Refresh, pindah tab, atau lock screen tidak boleh mereset timer.
- Retry jaringan tidak boleh membuat sesi atau outcome duplikat.
- Pengguna hanya dapat mengakses sesi miliknya.

---

## 9. Aturan Bisnis

### 9.1 Nominal

- Mata uang MVP: IDR.
- Nilai disimpan sebagai integer Rupiah.
- Input tidak boleh negatif atau nol.
- Separator tampilan mengikuti format Indonesia.
- Nilai maksimum perlu dikonfigurasi untuk mencegah overflow dan input tidak masuk akal.
- Client dapat memformat input, tetapi server melakukan parsing dan validasi akhir.

### 9.2 Ruang uang fleksibel

**Hipotesis formula MVP:**

```text
flexible_money = estimated_monthly_income - monthly_obligations
impact_percentage = session_amount / flexible_money × 100
```

Aturan:

- `flexible_money` tidak boleh kurang dari nol.
- Jika `flexible_money <= 0`, sistem tidak menampilkan persentase yang menyesatkan.
- Pada kondisi tersebut, tampilkan pesan netral bahwa nominal akan menambah tekanan pada ruang uang bulan ini.
- Persentase adalah konteks refleksi, bukan penilaian kesehatan finansial.
- Formula final perlu dikonfirmasi product owner sebelum implementasi.

### 9.3 Timer

Nilai default MVP:

```text
pause_duration_seconds = 90
pause_eligible_at = started_at + pause_duration_seconds
remaining_seconds = max(
  ceil((pause_eligible_at - current_server_time) / 1000),
  0
)
```

Aturan:

- `started_at` dan `pause_eligible_at` dibuat server.
- Browser hanya merender countdown.
- Server memverifikasi eligibility saat outcome dikirim.
- Timer harus dapat dikonfigurasi untuk eksperimen 30, 60, dan 90 detik.
- Durasi aktif disimpan pada setiap sesi.
- Setelah 30 detik, sistem boleh mencatat intent awal apabila fitur tersebut diaktifkan.
- Outcome final hanya dibuka setelah durasi varian terpenuhi.
- Tidak boleh ada klaim bahwa 90 detik adalah durasi klinis optimal.

### 9.4 Outcome

Enum:

```text
delayed
redirected
proceeded
```

Makna:

- `delayed`: pengguna menunda keputusan.
- `redirected`: pengguna mengalihkan fokus atau memilih tindakan alternatif.
- `proceeded`: pengguna tetap melanjutkan keputusan.

Aturan:

- Ketiga outcome memiliki bobot penyimpanan yang setara.
- UI tidak boleh memberi label gagal pada `proceeded`.
- Sistem tidak boleh mengubah outcome berdasarkan jawaban AI.
- Copy konfirmasi harus netral.
- Nominal pada sesi `delayed` tidak boleh dilabel sebagai “uang yang diselamatkan”; gunakan “nominal yang ditunda”.

### 9.5 Urge score

Skala yang diusulkan:

```text
1–5
```

- `urge_before` wajib sebelum pause.
- `urge_after` opsional tetapi disarankan setelah outcome.
- Urge delta:

```text
urge_delta = urge_after - urge_before
```

Nilai negatif menunjukkan dorongan menurun.

### 9.6 Trigger

Daftar awal yang diusulkan:

- setelah kerja;
- malam atau larut malam;
- baru gajian;
- setelah rugi;
- stres;
- lelah;
- promosi atau FOMO;
- PayLater;
- lainnya.

Trigger harus dapat dikelola sebagai konfigurasi produk, bukan hard-coded di banyak komponen.

---

## 10. Functional Requirements

### FR-01 Authentication

- Pengguna dapat meminta OTP.
- Pengguna dapat login dan logout.
- Session harus aman dan dikelola server.
- User ID auth harus menjadi sumber identitas utama untuk RLS.
- Error tidak boleh mengungkap apakah suatu email/nomor terdaftar apabila kanal auth memerlukan perlindungan enumeration.

**Acceptance criteria**

- OTP valid membuat session.
- OTP tidak valid ditolak.
- Pengguna yang logout tidak dapat membaca endpoint privat.
- Dua pengguna tidak dapat membaca data satu sama lain.

### FR-02 Onboarding dan baseline

Data minimum:

- estimasi pendapatan bulanan;
- total kewajiban bulanan;
- zona waktu;
- consent terhadap pemrosesan data;
- pilihan reminder, default off.

**Acceptance criteria**

- Nilai tersimpan sebagai integer Rupiah.
- Baseline dapat diperbarui.
- Perubahan baseline tidak mengubah snapshot historis sesi lama.
- Setiap sesi menyimpan nilai snapshot baseline yang dipakai saat sesi dibuat.

### FR-03 Membuat sesi jeda

Input:

- nominal;
- trigger;
- urge_before;
- optional note awal.

Output:

- session ID;
- snapshot dampak;
- status sesi.

**Acceptance criteria**

- Request idempotent.
- Input invalid ditolak server.
- Session ID tidak dapat ditebak secara berurutan.
- Pengguna hanya menerima sesi miliknya.

### FR-04 Snapshot dampak

Tampilan minimum:

- nominal sesi;
- nominal ruang uang fleksibel;
- persentase dampak;
- copy netral;
- CTA menuju jeda.

Contoh:

```text
Rp350.000
= 22% dari ruang uang fleksibel bulan ini
```

**Acceptance criteria**

- Persentase dihitung server atau menggunakan nilai canonical server.
- Nilai historis tidak berubah ketika baseline diperbarui.
- Kondisi flexible money nol/negatif ditangani tanpa division by zero.
- Tidak ada copy preskriptif seperti “jangan beli”.

### FR-05 Guided pause

Komponen:

- countdown;
- prompt napas atau refleksi singkat;
- snapshot dampak tetap terlihat;
- tombol keluar yang tidak manipulatif;
- dukungan reduced motion.

**Acceptance criteria**

- Refresh tidak mereset timer.
- Pindah tab tidak mereset timer.
- Lock screen tidak mereset timer.
- Jam perangkat yang diubah tidak dapat membuka outcome lebih awal.
- Browser hanya menggunakan waktu server sebagai acuan authoritative.
- Ketika jaringan terputus, UI menjelaskan status dan melakukan retry aman.

### FR-06 Outcome

Setelah eligible, tampilkan:

- “Tunda dulu”
- “Alihkan fokus”
- “Tetap lanjut”

**Acceptance criteria**

- Request sebelum eligible menghasilkan penolakan server.
- Request kedua setelah outcome tersimpan menghasilkan respons idempotent atau conflict yang aman.
- Outcome tersimpan dengan timestamp server.
- Tidak ada hierarchy visual yang mempermalukan salah satu opsi.

### FR-07 Refleksi

Field:

- urge_after;
- refleksi teks opsional;
- pilihan tindakan berikutnya opsional;
- acknowledgment netral.

**Acceptance criteria**

- Pengguna dapat melewati teks refleksi.
- Refleksi tidak diwajibkan agar sesi dianggap selesai.
- Copy penutup tidak menghakimi outcome.

### FR-08 Riwayat

Tampilan:

- tanggal dan waktu;
- nominal;
- trigger;
- outcome;
- urge delta jika tersedia;
- refleksi pengguna sendiri.

**Acceptance criteria**

- Hanya data pengguna sendiri.
- Pengguna dapat membuka detail.
- Pengguna dapat menghapus satu sesi.
- Penghapusan tercermin pada dashboard dan insight berikutnya.

### FR-09 Dashboard

Metrik minimum:

- jumlah sesi;
- delay rate;
- redirected rate;
- proceeded rate;
- nominal yang ditunda;
- trigger paling sering;
- jam rawan;
- rata-rata urge delta.

**Acceptance criteria**

- Tidak ada shame score.
- Tidak ada leaderboard.
- Tidak ada streak yang mendorong compulsive use.
- Metrik menggunakan istilah harm reduction, bukan keberhasilan klinis.

### FR-10 AI Conversation

Tujuan:

- memberi dialog reflektif, tenang, dan non-directive;
- membantu pengguna memberi nama pada situasi;
- menawarkan tindakan pengalihan yang aman;
- tidak membuat keputusan finansial untuk pengguna.

Context yang diizinkan:

- nominal sesi saat ini;
- trigger;
- urge score;
- snapshot dampak;
- pilihan bahasa;
- sejumlah kecil riwayat milik pengguna bila consent aktif.

Context yang dilarang:

- data pengguna lain;
- seluruh histori mentah tanpa batas;
- secrets;
- prompt internal;
- data mitra;
- informasi yang tidak diperlukan.

**Acceptance criteria**

- Pemanggilan hanya server-side.
- Timeout dan error menghasilkan fallback statis.
- Core pause tetap berjalan saat AI unavailable.
- Respons tidak dapat mengubah timer, nominal, atau outcome.
- Respons disaring terhadap kategori larangan.

### FR-11 AI Insight

Tujuan:

- merangkum pola dari riwayat pengguna sendiri;
- menampilkan trigger, jam rawan, dan perubahan urge;
- memberi bahasa reflektif, bukan diagnosis.

**Acceptance criteria**

- Insight menyebut periode data yang dianalisis.
- Insight tidak dibuat bila data terlalu sedikit.
- Insight memiliki fallback berbasis rule/template.
- Insight dapat dihapus atau diregenerasi.
- Penghapusan sesi membuat insight lama dianggap stale.
- Mitra tidak dapat melihat insight individual.

### FR-12 Pengaturan privasi

Fitur:

- hapus satu sesi;
- hapus seluruh histori;
- hapus akun;
- consent AI;
- consent reminder;
- penjelasan data yang dikumpulkan dan tidak dikumpulkan.

**Acceptance criteria**

- Penghapusan akun memutus akses user.
- Data aplikasi dihapus atau dianonimkan sesuai kebijakan yang ditetapkan.
- UI menunjukkan status proses secara jelas.
- Tidak ada bank sync pada MVP.
- Tidak meminta PIN, password rekening, nomor rekening, kontak, lokasi presisi, atau browsing history.

---

## 11. Data Model

### 11.1 `profiles`

| Field | Type | Catatan |
|---|---|---|
| `user_id` | uuid PK | referensi auth user |
| `display_name` | text nullable | opsional |
| `timezone` | text | default dari perangkat lalu dikonfirmasi |
| `locale` | text | default `id-ID` |
| `created_at` | timestamptz | server |
| `updated_at` | timestamptz | server |

### 11.2 `financial_baselines`

| Field | Type | Catatan |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK | owner |
| `monthly_income_idr` | bigint | integer Rupiah |
| `monthly_obligations_idr` | bigint | integer Rupiah |
| `flexible_money_idr` | bigint | hasil canonical |
| `effective_from` | timestamptz | |
| `created_at` | timestamptz | |

Baseline sebaiknya versioned agar sesi lama tidak berubah ketika nilai baru dimasukkan.

### 11.3 `pause_sessions`

| Field | Type | Catatan |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK | owner |
| `status` | enum | state authoritative |
| `amount_idr` | bigint | |
| `trigger_code` | text | |
| `trigger_other` | text nullable | |
| `urge_before` | smallint | |
| `urge_after` | smallint nullable | |
| `baseline_id` | uuid FK | baseline yang digunakan |
| `flexible_money_snapshot_idr` | bigint | historical snapshot |
| `impact_percentage_bps` | integer nullable | basis points untuk presisi |
| `pause_duration_seconds` | integer | varian eksperimen |
| `started_at` | timestamptz nullable | server |
| `pause_eligible_at` | timestamptz nullable | server |
| `outcome` | enum nullable | |
| `outcome_at` | timestamptz nullable | server |
| `reflection_text` | text nullable | |
| `completed_at` | timestamptz nullable | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### 11.4 `session_events`

Untuk observability dan eksperimen.

| Field | Type | Catatan |
|---|---|---|
| `id` | uuid PK | |
| `session_id` | uuid FK | |
| `user_id` | uuid FK | denormalized untuk RLS |
| `event_name` | text | allowlist |
| `event_version` | integer | |
| `event_at` | timestamptz | server |
| `properties` | jsonb | tanpa data sensitif berlebihan |

### 11.5 `ai_conversations`

| Field | Type | Catatan |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK | |
| `session_id` | uuid FK nullable | |
| `status` | enum | active, completed, failed |
| `model_key` | text | alias internal, bukan secret |
| `created_at` | timestamptz | |

### 11.6 `ai_messages`

| Field | Type | Catatan |
|---|---|---|
| `id` | uuid PK | |
| `conversation_id` | uuid FK | |
| `user_id` | uuid FK | owner |
| `role` | enum | user, assistant |
| `content` | text | |
| `safety_flags` | jsonb | hasil guardrail |
| `created_at` | timestamptz | |

### 11.7 `ai_insights`

| Field | Type | Catatan |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK | |
| `period_start` | date | |
| `period_end` | date | |
| `source_session_count` | integer | |
| `content` | text | |
| `generation_mode` | enum | llm, fallback |
| `stale_at` | timestamptz nullable | |
| `created_at` | timestamptz | |

### 11.8 `user_consents`

| Field | Type | Catatan |
|---|---|---|
| `user_id` | uuid | |
| `consent_type` | text | ai, reminder, research |
| `granted` | boolean | |
| `version` | text | versi notice |
| `updated_at` | timestamptz | |

---

## 12. RLS dan Authorization

### Policy dasar

Setiap tabel privat harus menerapkan:

```text
select: auth.uid() = user_id
insert: auth.uid() = user_id
update: auth.uid() = user_id
delete: auth.uid() = user_id
```

### Defense in depth

- Server action memeriksa session user.
- Query selalu difilter dengan owner.
- RLS tetap aktif sebagai final authorization.
- Service-role key tidak boleh dipakai pada request path biasa tanpa alasan eksplisit.
- Admin atau support access tidak masuk MVP.
- LLM tidak memiliki akses database langsung.
- Prompt context dibangun oleh server dari query yang telah melewati authorization.

### Test wajib

- User A tidak dapat membaca sesi User B.
- User A tidak dapat mengubah outcome User B.
- User A tidak dapat menghapus insight User B.
- ID valid milik user lain tetap menghasilkan not found/forbidden yang aman.
- Service key tidak pernah dikirim ke browser.

---

## 13. API / Server Action Contracts

Nama endpoint dapat disesuaikan dengan konvensi Next.js.

### `POST /api/baselines`

Request:

```json
{
  "monthlyIncomeIdr": 6000000,
  "monthlyObligationsIdr": 4400000
}
```

Response:

```json
{
  "baselineId": "uuid",
  "flexibleMoneyIdr": 1600000,
  "effectiveFrom": "ISO-8601"
}
```

### `POST /api/pause-sessions`

Request:

```json
{
  "amountIdr": 350000,
  "triggerCode": "after_work",
  "urgeBefore": 5,
  "idempotencyKey": "uuid"
}
```

Response:

```json
{
  "sessionId": "uuid",
  "status": "context_captured",
  "snapshot": {
    "amountIdr": 350000,
    "flexibleMoneyIdr": 1600000,
    "impactPercentage": 21.88
  }
}
```

### `POST /api/pause-sessions/:id/start`

Response:

```json
{
  "status": "pause_active",
  "startedAt": "ISO-8601",
  "pauseEligibleAt": "ISO-8601",
  "durationSeconds": 90,
  "serverNow": "ISO-8601"
}
```

### `GET /api/pause-sessions/:id/status`

Response:

```json
{
  "status": "pause_active",
  "serverNow": "ISO-8601",
  "pauseEligibleAt": "ISO-8601",
  "remainingSeconds": 42
}
```

### `POST /api/pause-sessions/:id/outcome`

Request:

```json
{
  "outcome": "delayed",
  "urgeAfter": 3,
  "reflectionText": "Saya akan melihat lagi besok pagi.",
  "idempotencyKey": "uuid"
}
```

Success:

```json
{
  "status": "completed",
  "outcome": "delayed",
  "completedAt": "ISO-8601"
}
```

Early request:

```json
{
  "code": "PAUSE_NOT_ELIGIBLE",
  "serverNow": "ISO-8601",
  "pauseEligibleAt": "ISO-8601"
}
```

### `POST /api/ai/conversation`

Request context harus memakai `sessionId`, bukan menerima seluruh context bebas dari client.

```json
{
  "sessionId": "uuid",
  "message": "Saya masih merasa harus membelinya sekarang."
}
```

Server:

1. memverifikasi owner;
2. mengambil bounded context;
3. menjalankan input guardrail;
4. memanggil model;
5. menjalankan output guardrail;
6. menyimpan response;
7. mengembalikan fallback jika gagal.

---

## 14. Guardrail AI

### Posisi AI

AI hanya:

- mendampingi dialog;
- membantu refleksi;
- menyarankan alihan fokus yang aman;
- merangkum pola data pengguna sendiri.

AI tidak boleh:

- menghitung atau menentukan outcome;
- membuka timer;
- memberi odds atau strategi taruhan;
- memberi diagnosis;
- mengklaim terapi;
- memberi rekomendasi finansial preskriptif;
- menyuruh pengguna berutang;
- mempromosikan PayLater;
- membuat keputusan otomatis;
- menggunakan data pengguna lain.

### System policy minimum

```text
Anda adalah pendamping refleksi yang tenang dan non-directive.
Jangan mengambil keputusan finansial untuk pengguna.
Jangan memberikan diagnosis, terapi, odds, strategi taruhan,
rekomendasi investasi, atau saran pinjaman.
Akui bahwa keputusan tetap milik pengguna.
Gunakan hanya konteks yang diberikan.
Jangan mengklaim mengetahui transaksi atau kondisi keuangan lain.
```

### Output contract yang disarankan

```json
{
  "response": "string",
  "intent": "reflect | redirect | clarify | support",
  "safety": {
    "allowed": true,
    "flags": []
  }
}
```

### Fallback

Jika timeout, rate limit, safety rejection, atau vendor failure:

```text
“Tidak apa-apa jika percakapan tidak tersedia saat ini.
Kamu tetap dapat melanjutkan jeda dan memilih sendiri langkah berikutnya.”
```

Sediakan beberapa prompt statis:

- “Apa yang membuat keputusan ini terasa mendesak?”
- “Apakah keputusan ini masih bisa ditinjau lagi besok?”
- “Apa kegiatan dua menit yang bisa memindahkan perhatianmu sekarang?”
- “Bagian mana dari dampak nominal tadi yang paling terasa?”

---

## 15. Instrumentasi dan Analytics

### Event minimum

```text
auth_completed
onboarding_started
onboarding_completed
baseline_created
pause_session_created
trigger_selected
snapshot_viewed
pause_started
pause_30s_reached
pause_completed
outcome_selected
reflection_submitted
session_abandoned
history_viewed
session_deleted
account_deletion_requested
ai_conversation_started
ai_response_success
ai_response_fallback
ai_insight_viewed
```

### Event properties minimum

- `session_id`
- `experiment_id`
- `variant_id`
- `pause_duration_seconds`
- `trigger_code`
- `outcome`
- `urge_before`
- `urge_after`
- `amount_bucket`, bukan selalu nominal mentah pada analytics pihak ketiga
- `client_platform`
- `network_status`
- `app_version`

### Privacy

- Jangan mengirim reflection text ke analytics eksternal.
- Jangan mengirim email, nomor telepon, atau identifier auth mentah.
- Gunakan pseudonymous ID.
- Analytics harus memiliki retention policy.
- Product analytics tidak boleh menjadi jalan mem-bypass RLS.

---

## 16. Metrik Produk

### Primary metric

**Delayed or redirected rate**

```text
(delayed sessions + redirected sessions) / completed sessions
```

### Secondary metrics

- pause completion rate;
- urge delta;
- delayed amount;
- 7-day return;
- session abandonment;
- time to start session;
- AI fallback rate.

### Guardrail metrics

- discomfort report;
- privacy complaint;
- early outcome rejection frequency;
- repeated retry error;
- account deletion rate;
- support escalation;
- AI safety flag rate.

### Interpretasi

- “Nominal ditunda” bukan “uang diselamatkan”.
- Delay rate tidak membuktikan outcome jangka panjang.
- Pilot awal tidak digunakan untuk klaim kausal populasi.
- Efektivitas klinis bukan target klaim MVP.

---

## 17. Eksperimen Produk

### Tahap 1 — Uji mekanisme

**Hipotesis**

Snapshot dampak + guided pause meningkatkan delayed/redirected rate dibanding snapshot dampak saja.

**Control A**

```text
Snapshot → Outcome
```

**Variant B**

```text
Snapshot → Guided Pause → Outcome
```

**Primary outcome**

- delayed/redirected rate.

**Secondary outcome**

- urge delta.

**Guardrail**

- abandonment;
- discomfort;
- privacy concern;
- rage click atau repeated exit.

### Tahap 2 — Uji durasi

Varian:

- 30 detik;
- 60 detik;
- 90 detik.

Semua varian tetap memiliki:

- snapshot dampak;
- guided prompt;
- outcome netral.

### Target pilot

- 30–50 pekerja muda;
- durasi sekitar dua minggu;
- prototype terinstrumentasi;
- wawancara kualitatif setelah penggunaan.

Target ini adalah discovery pilot, bukan sampel untuk generalisasi populasi.

### Assignment

- Random assignment per user untuk mengurangi carryover.
- Variant ID disimpan di server.
- User tidak boleh berpindah varian di tengah eksperimen kecuali ada alasan safety.
- Hasil dianalisis bersama data abandonment dan discomfort.

---

## 18. Non-Functional Requirements

### Security

- HTTPS only.
- Secure, httpOnly session cookies.
- CSRF protection sesuai mekanisme framework.
- Rate limiting pada auth, session creation, dan AI.
- Server-side schema validation.
- Secrets hanya di environment server.
- Dependency scanning.
- Audit log untuk operasi sensitif.
- RLS aktif di production.
- Error response tidak membocorkan stack trace.

### Reliability

- Retry harus idempotent.
- Timer tetap benar setelah refresh.
- Outcome tidak dapat diduplikasi.
- Core flow tetap tersedia saat provider AI gagal.
- Failure state memiliki aksi pemulihan yang jelas.
- Database migration dapat di-roll back atau memiliki forward fix yang terdokumentasi.

### Performance — target engineering

- Halaman critical path usable pada koneksi mobile lambat.
- Bundle critical path tidak memuat SDK AI.
- Server response critical path diprioritaskan dibanding dashboard.
- PWA shell dapat dibuka cepat setelah kunjungan pertama.
- Countdown tidak bergantung pada render 60 fps.

### Accessibility

- Mendukung viewport 360 px.
- Keyboard navigation.
- Screen-reader labels.
- Reduced motion.
- Kontras memadai.
- Countdown tidak diumumkan setiap detik ke screen reader.
- Tidak mengandalkan warna sebagai satu-satunya indikator.
- Focus state terlihat.
- Bahasa outcome netral dan mudah dipahami.

### Privacy

- Data minimization.
- Consent terpisah untuk AI dan reminder.
- Penghapusan granular.
- Tidak ada bank sync.
- Tidak ada lokasi presisi.
- Tidak ada akses kontak.
- Tidak ada browsing surveillance.
- Data mitra hanya agregat.

---

## 19. UI Screen Inventory

### Public

1. Landing.
2. Privacy summary.
3. Login/OTP.
4. Error auth.

### Onboarding

5. Welcome.
6. Baseline income.
7. Baseline obligations.
8. Privacy and consent.
9. Onboarding complete.

### Critical path

10. Home / Quick trigger.
11. Amount entry.
12. Trigger selection.
13. Urge score.
14. Impact snapshot.
15. Guided pause.
16. Outcome selection.
17. Reflection.
18. Session complete.

### Supporting

19. History list.
20. Session detail.
21. Dashboard.
22. AI Conversation.
23. AI Insight.
24. Settings.
25. Privacy controls.
26. Delete session confirmation.
27. Delete history confirmation.
28. Delete account confirmation.
29. Offline/error state.
30. AI fallback state.

---

## 20. Copy Rules

### Gunakan

- “Beri jarak sebelum bertindak.”
- “Kamu tidak perlu memutuskan sekarang.”
- “Nominal ini setara dengan … dari ruang uang fleksibel bulan ini.”
- “Tunda dulu.”
- “Alihkan fokus.”
- “Tetap lanjut.”
- “Terima kasih sudah jujur.”
- “Keputusan tetap milikmu.”

### Hindari

- “Kamu gagal.”
- “Kamu kalah.”
- “Jangan boros.”
- “Pilihan buruk.”
- “Selamat, kamu menang.”
- “Uang berhasil diselamatkan.”
- “Kamu kecanduan.”
- “AI menyarankan kamu untuk …”
- Countdown atau notifikasi yang menambah rasa panik.

---

## 21. Testing Strategy

### Static checks

- Type checking.
- Linting.
- Formatting.
- Secret scanning.
- Dependency audit.
- Migration validation.

### Unit tests

- parsing Rupiah;
- flexible money formula;
- impact percentage;
- timer remaining calculation;
- state transition guard;
- outcome eligibility;
- urge delta;
- metric aggregation;
- AI fallback selection.

### Component tests

- amount input;
- snapshot;
- countdown;
- outcome buttons;
- neutral state rendering;
- reduced motion;
- 360 px viewport;
- loading and error states.

### Integration tests

- baseline versioning;
- session creation;
- timer server validation;
- idempotent outcome;
- deletion cascade;
- consent enforcement;
- AI context bounding;
- stale insight handling.

### RLS tests

- two-user read isolation;
- two-user update isolation;
- two-user delete isolation;
- direct query attempts;
- session_events isolation;
- AI message isolation.

### E2E critical path

1. Login.
2. Complete onboarding.
3. Create session.
4. View snapshot.
5. Start pause.
6. Refresh.
7. Verify timer continues.
8. Attempt early outcome and confirm rejection.
9. Complete eligible outcome.
10. Submit reflection.
11. View history.
12. Delete session.
13. Delete account.

### AI safety tests

- request odds;
- request gambling strategy;
- request diagnosis;
- request prescriptive financial advice;
- prompt injection;
- attempt to expose system prompt;
- attempt to retrieve another user’s data;
- model timeout;
- malformed model output.

---

## 22. Release Gates

MVP tidak boleh dirilis jika salah satu kondisi berikut gagal:

- Timer dapat direset lewat refresh.
- Outcome dapat disimpan terlalu awal.
- User dapat membaca atau mengubah data user lain.
- Nominal tersimpan sebagai floating point.
- AI failure memblokir core flow.
- Account deletion tidak bekerja.
- Reflection text terkirim ke analytics eksternal.
- UI outcome memberi shame treatment.
- Reduced motion tidak dihormati.
- Critical path rusak pada viewport 360 px.
- Retry menghasilkan outcome duplikat.
- Consent AI diabaikan.

---

## 23. Observability

### Log yang diperlukan

- request ID;
- user pseudonymous ID;
- session ID;
- route/action;
- state before/after;
- latency;
- error code;
- experiment variant;
- AI provider result tanpa menyimpan secret.

### Jangan log

- OTP;
- auth token;
- reflection text mentah;
- prompt lengkap yang memuat data sensitif;
- email/nomor telepon mentah;
- secrets;
- bank credential.

### Alert minimum

- lonjakan auth failure;
- outcome conflict;
- RLS error;
- AI fallback rate tinggi;
- database error;
- account deletion failure;
- unusual early-outcome attempts;
- elevated client crash.

---

## 24. Deployment Architecture

```text
Browser / Installed PWA
        ↓
Next.js Application
- UI
- Server Actions / Route Handlers
- Authentication checks
- Domain services
        ↓
Supabase
- Auth
- PostgreSQL
- RLS
        ↓
LLM Provider
- server-side only
- bounded context
- timeout
- guardrails
- fallback
```

### Deployment principles

- Modular monolith untuk MVP.
- Satu deployment unit agar mudah dioperasikan.
- Domain logic dipisah dari UI.
- AI adapter dipisah dari core services.
- Feature flag untuk AI dan eksperimen timer.
- Migration berjalan melalui pipeline yang terkontrol.
- Preview environment tidak menggunakan data production.

---

## 25. Struktur Modul yang Disarankan

```text
src/
  app/
    (public)/
    (auth)/
    (app)/
      pause/
      history/
      dashboard/
      settings/
    api/
  components/
    amount/
    pause/
    outcome/
    reflection/
    privacy/
  domain/
    money/
    pause-session/
    metrics/
    experiments/
  server/
    auth/
    db/
    repositories/
    services/
    ai/
    analytics/
  lib/
    validation/
    time/
    idempotency/
  tests/
    unit/
    integration/
    e2e/
supabase/
  migrations/
  policies/
  tests/
```

### Boundary

- `domain/` tidak bergantung pada UI.
- `server/ai/` tidak boleh mengubah state sesi langsung.
- Repository selalu menerima `userId` explicit.
- Komponen client tidak menerima service-role capability.
- Formula dan state transition berada pada satu sumber canonical.

---

## 26. Error Model

Error code minimum:

```text
AUTH_REQUIRED
VALIDATION_ERROR
BASELINE_REQUIRED
SESSION_NOT_FOUND
INVALID_STATE_TRANSITION
PAUSE_NOT_STARTED
PAUSE_NOT_ELIGIBLE
OUTCOME_ALREADY_RECORDED
CONSENT_REQUIRED
RATE_LIMITED
AI_UNAVAILABLE
DELETE_FAILED
INTERNAL_ERROR
```

### Prinsip UX error

- Jelaskan apa yang terjadi.
- Berikan langkah pemulihan.
- Jangan menyalahkan pengguna.
- Jangan menampilkan error teknis mentah.
- Untuk AI error, arahkan kembali ke core flow.
- Untuk network error saat countdown, tetap render berdasarkan timestamp tersimpan dan sinkronkan kembali ke server.

---

## 27. Definition of Done

Sebuah story dianggap selesai ketika:

- acceptance criteria terpenuhi;
- unit/component/integration test relevan tersedia;
- RLS test tersedia untuk data privat;
- analytics event telah direview;
- copy telah diperiksa agar non-shaming;
- kondisi loading, empty, error, dan retry tersedia;
- aksesibilitas keyboard dan screen reader diperiksa;
- viewport 360 px diuji;
- tidak menambah dependency AI pada critical path;
- dokumentasi schema dan migration diperbarui;
- privacy impact diperiksa;
- code review selesai;
- berjalan di preview environment.

---

## 28. Breakdown Epic

### Epic A — Foundation

- Repo dan CI.
- Next.js + TypeScript.
- Supabase project.
- Auth OTP.
- Environment management.
- Observability dasar.
- Feature flag.

### Epic B — Baseline dan privacy

- Onboarding.
- Financial baseline versioning.
- Consent.
- Settings privacy.
- Delete flows.

### Epic C — Pause critical path

- Amount input.
- Trigger.
- Urge score.
- Snapshot.
- Timer server.
- Outcome.
- Reflection.
- State machine.
- Idempotency.

### Epic D — History dan metrics

- Session list/detail.
- Dashboard deterministic.
- Event schema.
- Product metrics.

### Epic E — AI bounded layer

- Conversation adapter.
- Guardrails.
- Fallback.
- Insight generation.
- Stale handling.
- AI consent.

### Epic F — Experimentation

- Variant assignment.
- Configurable timer.
- Exposure events.
- Analysis export.
- Guardrail monitoring.

### Epic G — Hardening

- RLS suite.
- E2E.
- Accessibility.
- Performance.
- Security review.
- Pilot release.

---

## 29. Urutan Implementasi yang Direkomendasikan

1. Tetapkan schema, state machine, dan RLS.
2. Bangun auth dan baseline.
3. Bangun critical path tanpa AI.
4. Tambahkan timer persisten dan validasi server.
5. Tambahkan outcome, reflection, dan history.
6. Tambahkan instrumentasi.
7. Lakukan test dua-user RLS dan E2E.
8. Tambahkan dashboard deterministic.
9. Integrasikan AI Conversation dengan fallback.
10. Integrasikan AI Insight.
11. Aktifkan feature flag eksperimen.
12. Jalankan pilot terbatas.
13. Evaluasi utility, safety, dan privacy sebelum scale.

---

## 30. Keputusan yang Masih Perlu Dikunci

1. Formula final ruang uang fleksibel:
   - pendapatan dikurangi kewajiban saja; atau
   - pengguna mengisi angka ruang fleksibel secara langsung.

2. Skala urge:
   - 1–5; atau
   - 0–10.

3. Apakah intent pada detik ke-30 masuk MVP atau hanya event internal.

4. Batas maksimal nominal sesi.

5. Definisi abandonment:
   - berdasarkan durasi;
   - status browser;
   - atau inactivity window.

6. Retention period untuk:
   - session events;
   - AI messages;
   - logs;
   - analytics.

7. Kanal OTP:
   - email;
   - WhatsApp;
   - SMS.

8. Vendor LLM dan strategi data retention provider.

9. Apakah AI Conversation tersedia saat pause, setelah pause, atau keduanya.

10. Data minimum sebelum AI Insight boleh dibuat.

11. Apakah pengguna boleh mengubah outcome setelah sesi selesai.

12. Kebijakan soft delete versus hard delete.

13. Mekanisme dukungan untuk pengguna yang mengungkapkan situasi berisiko tinggi.

---

## 31. Acceptance Scenario Utama

### Scenario: timer tidak dapat dilewati

```gherkin
Given pengguna memiliki sesi dengan pause_duration 90 detik
And server membuat pause_eligible_at
When pengguna mengirim outcome sebelum pause_eligible_at
Then server menolak dengan PAUSE_NOT_ELIGIBLE
And tidak ada outcome yang tersimpan
When pengguna mengirim outcome setelah pause_eligible_at
Then outcome disimpan satu kali
And sesi berubah menjadi completed
```

### Scenario: refresh tidak mereset timer

```gherkin
Given pause telah berjalan selama 40 detik
When pengguna refresh halaman
Then aplikasi mengambil status sesi dari server
And remaining time sekitar 50 detik
And started_at tidak berubah
```

### Scenario: AI gagal

```gherkin
Given pengguna sedang berada pada pause flow
And provider AI timeout
When pengguna meminta percakapan
Then aplikasi menampilkan fallback netral
And countdown tetap berjalan
And pengguna tetap dapat memilih outcome setelah eligible
```

### Scenario: isolasi data

```gherkin
Given User A dan User B memiliki sesi masing-masing
When User A meminta detail sesi User B
Then server tidak mengembalikan data sesi
And RLS menolak query
And tidak ada informasi sensitif yang bocor
```

### Scenario: outcome proceeded tetap netral

```gherkin
Given pengguna menyelesaikan pause
When pengguna memilih "Tetap lanjut"
Then sesi disimpan sebagai proceeded
And UI tidak menampilkan label gagal
And pengguna tetap dapat mengisi refleksi
And sesi tetap muncul pada riwayat
```

---

## 32. Exit Criteria MVP

MVP siap masuk pilot ketika:

- seluruh P0 selesai;
- zero known critical security issue;
- RLS two-user suite lulus;
- E2E critical path lulus;
- timer bertahan setelah refresh dan perubahan tab;
- outcome early submission ditolak;
- deletion flow lulus;
- analytics event tervalidasi;
- AI dapat dimatikan tanpa merusak aplikasi;
- copy non-shaming direview;
- accessibility critical path lulus;
- pilot consent dan privacy notice tersedia;
- experiment configuration tervalidasi;
- runbook incident dan rollback tersedia.

---

## 33. Ringkasan Prinsip Implementasi

```text
Pause, See, Choose.

Pause:
Server menentukan waktu, client hanya merender.

See:
Nominal diterjemahkan menjadi dampak personal
menggunakan snapshot baseline yang immutable.

Choose:
Outcome selalu milik pengguna dan dicatat secara netral.

AI:
Mendampingi, tidak memutuskan.

Data:
Minimum, private, removable, dan terisolasi per pengguna.
```
