# DompetJujur — Personal Impulse Friction Layer

DompetJujur adalah *friction layer* pribadi yang membantu pengguna menciptakan jeda pada momen rawan pengeluaran uang impulsif, memvisualisasikan dampak keputusan finansial secara nyata tanpa menghakimi, dan memberikan catatan refleksi berbasis AI (LLM).

---

## 🌟 Fitur Utama

- **Passwordless Auth (Email OTP)**: Autentikasi aman tanpa kata sandi menggunakan 6-digit One-Time Password via Supabase Auth.
- **Jeda 90 Detik (Killer Feature)**: Intervensi utama yang memberikan jeda dan visualisasi dampak pengeluaran terhadap ruang uang fleksibel bulanan.
- **Rencana Aman Gajian**: Pengalokasian pendapatan bulanan ke dalam kebutuhan wajib, cicilan/paylater, dan batas aman harian.
- **AI Reflection Summary**: Ringkasan refleksi suportif pascal-jeda menggunakan LLM (OpenRouter) dengan mekanisme *deterministic fallback* jika koneksi terputus.
- **Riwayat & Metrics**: Agregasi sesi penundaan pengeluaran dan jumlah nominal yang berhasil ditunda tanpa rasa bersalah (*anti-shame*).
- **Privacy-First & Non-Judgmental**: Bebas pelacakan rekening bank, tanpa *leaderboard*, tanpa *streak*, dan tanpa narasi menghakimi.

---

## 🛠️ Stack Teknologi

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Lucide React.
- **Backend & Database**: Supabase (PostgreSQL, Row Level Security, Supabase Auth via Email OTP).
- **AI / LLM**: Vercel AI SDK (`ai`, `@ai-sdk/openai`), OpenRouter API.
- **Testing**: Playwright End-to-End Testing (76+ test cases).

---

## 🚀 Panduan Menjalankan Secara Lokal

### 1. Prasyarat
- Node.js >= 18
- npm / pnpm / yarn

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Salin `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```

Isi variabel environment berikut di `.env.local`:
```env
# Supabase Local / Online
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
APP_ENV=development
ALLOW_DEMO_MODE=true

# AI / OpenRouter
OPENROUTER_API_KEY=your-openrouter-api-key
LLM_MODEL=deepseek/deepseek-v4-flash
```

### 4. Menjalankan Supabase & Migration
Jika menggunakan Supabase CLI lokal:
```bash
npx supabase start
```
Atau jalankan skrip SQL migration berurutan di SQL Editor Supabase:
1. `supabase/migrations/0001_initial_schema.sql`
2. `supabase/migrations/0002_rls.sql`
3. `supabase/migrations/0003_grants.sql`

### 5. Menjalankan Server Pengembang
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) pada peramban.

---

## 🧪 Pengujian End-to-End (E2E)

Proyek ini dilengkapi dengan suite pengujian otomatis Playwright yang mencakup alur Onboarding, Pause Flow, History, Profile, Dashboard, PWA, dan AI Timeout Fallback.

Jalankan pengujian E2E:
```bash
npx playwright test
```

Tampilkan laporan pengujian:
```bash
npx playwright show-report
```

---

## 📂 Struktur Proyek

```text
├── app/                  # Route Handlers & App Router Pages (Next.js)
│   ├── (app)/            # Authenticated App Shell (Dashboard, Pause, History, Profile)
│   ├── (public)/         # Public Pages (Landing, Login, Onboarding)
│   └── api/              # API Routes (AI Summary, Dashboard Data, Health)
├── components/           # UI Components (shadcn/ui, layout components)
├── lib/                  # Utility functions, formatters, errors, & Supabase client
├── modules/              # Core Domain Modules (Auth, Pause, Financial Baseline)
├── supabase/             # Migrations & Seed data
├── tests/                # E2E Playwright Specs
└── docs/                 # Documentation & Architecture Specifications
```

---

## 🔒 Kebijakan Keamanan & Privasi

- Data keuangan pengguna dimasukkan secara estimasi mandiri tanpa perlu menghubungkan akun rekening bank (*zero-bank-link*).
- Setiap tabel pada PostgreSQL dilindungi oleh aturan *Row Level Security (RLS)* berbasis `auth.uid()`.
