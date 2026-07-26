# DompetJujur — UI / UX Design Specification

**Version:** 1.0  
**Design target:** Mobile-first, modern fintech + wellbeing  
**Primary viewport:** 390 × 844 px  
**Secondary:** 360 × 800, 430 × 932, tablet responsive  
**Design promise:** Tenang, dewasa, privat, tidak menghakimi.

---

# 1. Brand Personality

DompetJujur harus terasa:
- tenang;
- manusiawi;
- tegas tetapi tidak keras;
- modern;
- privat;
- terpercaya;
- sederhana.

DompetJujur tidak boleh terasa:
- seperti aplikasi kasino;
- seperti aplikasi game;
- seperti dashboard trading;
- seperti aplikasi rumah sakit;
- seperti ceramah moral;
- terlalu “cute”.

### Brand idea
**“Beri jarak sebelum bertindak.”**

### Suggested tagline
> **Jeda sebentar. Lihat uangmu dengan jujur.**

---

# 2. Design System

## 2.1 Color Palette

### Primary
| Token | Hex | Usage |
|---|---|---|
| `ink-900` | `#16211D` | Main text |
| `forest-700` | `#265C4B` | Primary CTA |
| `forest-600` | `#32705C` | Hover/active |
| `mint-100` | `#E7F2EC` | Calm highlight |
| `paper-50` | `#F8FAF8` | App background |

### Neutral
| Token | Hex | Usage |
|---|---|---|
| `white` | `#FFFFFF` | Cards |
| `stone-100` | `#F1F3F1` | Secondary surfaces |
| `stone-300` | `#D6DBD7` | Borders |
| `stone-500` | `#7A847E` | Secondary text |
| `stone-700` | `#4D5751` | Body text |

### Semantic
| Token | Hex | Usage |
|---|---|---|
| `amber-600` | `#A96617` | Caution, not alarm |
| `amber-100` | `#FFF1D8` | Caution surface |
| `red-600` | `#B54444` | Destructive only |
| `red-100` | `#FCE8E8` | Error |
| `blue-600` | `#3E628F` | Informational |

### Avoid
- neon green;
- casino red/black;
- gold gradients;
- flashing elements;
- coin imagery;
- slot-machine iconography.

---

## 2.2 Typography

Recommended:
- **Inter** for implementation speed.
- Alternative: Geist.

### Scale
| Style | Size | Weight | Line-height |
|---|---:|---:|---:|
| Display | 32 | 700 | 40 |
| H1 | 28 | 700 | 36 |
| H2 | 22 | 650 | 30 |
| H3 | 18 | 650 | 26 |
| Body L | 17 | 450 | 26 |
| Body | 15 | 450 | 23 |
| Label | 13 | 600 | 18 |
| Caption | 12 | 450 | 17 |

Numbers in financial cards:
- 32–40 px
- tabular numerals
- weight 700

---

## 2.3 Spacing

Use 4 px grid.

```text
4   micro
8   compact
12  inline
16  standard
20  section-inner
24  card gap
32  section
40  major section
48  page separation
```

Page horizontal padding:
- 20 px mobile
- 24 px ≥ 430 px

---

## 2.4 Radius

```text
button: 14px
input: 14px
card: 20px
modal/sheet: 24px
pill: 999px
```

Do not over-round every element.

---

## 2.5 Shadows

Use sparingly.

Card:
```css
box-shadow: 0 6px 20px rgba(22,33,29,.06);
```

Floating CTA:
```css
box-shadow: 0 10px 30px rgba(38,92,75,.16);
```

---

## 2.6 Icon Style

Use Lucide icons:
- 20–22 px standard;
- 2 px stroke;
- rounded;
- no filled casino-style icons.

Recommended icons:
- WalletCards
- PauseCircle
- History
- UserRound
- ShieldCheck
- Moon
- CalendarDays
- HeartHandshake
- Trash2
- ChevronRight

---

# 3. Accessibility

- Minimum body text 15 px.
- Touch targets ≥ 44×44 px.
- Color never carries meaning alone.
- Timer must have textual seconds remaining.
- Reduced-motion mode disables breathing scale animation.
- No flashing.
- Error fields include text message, not red border only.
- Main CTA contrast target WCAG AA.
- Input money uses clear grouping: `Rp350.000`.

---

# 4. Voice & Copywriting

## Tone
**calm + direct + non-shaming**

### Use
> “Kita buat jarak sebentar.”

> “Tidak perlu memutuskan sekarang.”

> “Terima kasih sudah jujur.”

> “Keputusan berikutnya masih bisa berbeda.”

### Avoid
> “Kamu gagal.”

> “Kamu kecanduan.”

> “Kamu tidak disiplin.”

> “Stop sekarang juga!”

### CTA Style
Use action language:
- “Mulai jeda”
- “Saya tunda dulu”
- “Simpan rencana”
- “Lihat riwayat”

Avoid vague:
- “Submit”
- “OK”
- “Continue”

---

# 5. App Shell

## Header
- left: context / greeting
- right: privacy icon or profile avatar
- max height: 56 px

## Bottom Navigation
Height: 72–80 px including safe-area.

Tabs:
1. Beranda
2. Jeda
3. Riwayat
4. Saya

“Jeda” can be visually stronger, but not a floating casino-style button.

---

# 6. Screen Specifications

# S01 — Welcome

### Purpose
Explain value in < 10 seconds.

### Hierarchy
1. Logo
2. Headline
3. Supporting copy
4. Privacy trust line
5. Primary CTA
6. Secondary sign-in

### Exact Microcopy
**Headline**
> Jeda sebelum uangmu ikut terbawa suasana.

**Body**
> DompetJujur membantumu berhenti sebentar, melihat dampaknya, lalu memilih dengan lebih sadar.

**Trust**
> Tanpa koneksi rekening. Tanpa menghakimi.

### CTAs
Primary:
> Mulai

Secondary:
> Saya sudah punya akun

### Wireframe
```text
┌────────────────────────────┐
│        DompetJujur         │
│                            │
│  Jeda sebelum uangmu       │
│  ikut terbawa suasana.     │
│                            │
│  DompetJujur membantumu... │
│                            │
│  ✓ Tanpa koneksi rekening  │
│  ✓ Data milikmu            │
│                            │
│ [        Mulai           ] │
│                            │
│    Saya sudah punya akun   │
└────────────────────────────┘
```

---

# S02 — Onboarding: Financial Baseline

### Purpose
Collect minimal context.

### Progress
Step 1 of 2.

### Fields
1. Pendapatan bersih per bulan
2. Kebutuhan wajib per bulan
3. Cicilan / paylater per bulan

### Input Pattern
Prefix:
`Rp`

Use numeric keyboard.

### Microcopy
Header:
> Biar angka punya konteks

Body:
> Cukup estimasi. DompetJujur tidak perlu melihat rekeningmu.

Field labels:
- Pendapatan bulanan
- Kebutuhan wajib
- Cicilan / paylater

Helper:
> Termasuk sewa, makan utama, transport, tagihan, dan kebutuhan rutin.

### Validation
- Empty → “Masukkan estimasi nominal.”
- Negative invalid.
- Huge amount > Rp1.000.000.000 → confirm:
  > “Pastikan nominalnya sudah benar.”

### CTA
> Lanjut

---

# S03 — Onboarding: Risk Window

### Purpose
Personalize context without diagnosis.

### Microcopy
Header:
> Kapan kamu paling rawan impulsif?

Body:
> Pilih yang paling sering terjadi. Ini bisa diubah nanti.

### Options
Cards:
- Setelah kerja
- Larut malam
- Setelah gajian
- Setelah rugi
- Saat limit paylater tersedia
- Lainnya

### Secondary Field
Tanggal gajian:
> Biasanya saya gajian tanggal __

Optional.

### CTA
> Selesai & masuk

---

# S04 — Home

### Purpose
Give immediate access to intervention.

### Hierarchy
1. Greeting
2. Main “Jeda” card
3. Financial context
4. Recent impact
5. Safe plan shortcut

### Sample UI Copy
Greeting:
> Siang, Raka.

Subhead:
> Kamu tidak perlu menunggu sampai keputusan terjadi.

### Main Card
Eyebrow:
> Lagi ada dorongan?

Headline:
> Buat jarak 90 detik.

Body:
> Masukkan nominalnya. Kita lihat dampaknya tanpa menghakimi.

Primary CTA:
> Saya lagi kepikiran

### Financial Context Card
Title:
> Ruang uang bulan ini

Value:
> Rp1.600.000

Meta:
> Setelah kebutuhan wajib & cicilan

Link:
> Atur rencana

### Impact Card
> 5 jeda dibuat bulan ini  
> Rp1.350.000 nominal berhasil ditunda

Do not say “uang diselamatkan”.

### Empty State
> Belum ada sesi jeda. Saat momen rawan datang, tombol ini siap dipakai.

---

# S05 — Pause: Amount

### Purpose
Capture impulse size with zero friction.

### Header
> Mulai Jeda

### Prompt
> Berapa uang yang lagi kepikiran untuk kamu keluarkan?

### Input
Large amount field:
`Rp 350.000`

Quick chips:
- Rp50rb
- Rp100rb
- Rp250rb
- Rp500rb

Chips only as input convenience, not encouragement.

### CTA
> Lanjut

### Secondary
> Batal

### Validation
Zero:
> Masukkan nominal lebih dari Rp0.

---

# S06 — Pause: Trigger

### Purpose
Capture context.

### Header
> Apa yang paling dekat dengan kondisimu sekarang?

### Options
- Lagi stres
- Baru gajian
- Mau balikin kerugian
- Bosan / pengin pelarian
- Lagi pegang limit paylater
- Lainnya

### Urge Score
Question:
> Seberapa kuat dorongannya?

Scale:
1 Tenang — 5 Sangat kuat

No emoji faces.

### CTA
> Lihat dampaknya

---

# S07 — Consequence Snapshot

### Purpose
Make consequence concrete before timer.

### Layout
Large amount card + 1–2 contextual comparisons.

### Example
```text
Rp350.000

22% dari ruang uang fleksibelmu bulan ini.

Setara dengan:
± 7 hari budget transportmu
```

Comparison is only shown when derived from user-entered values.

### Copy
> Tidak ada keputusan yang perlu dibuat di layar ini.

### CTA
> Mulai jeda 90 detik

### Secondary
> Ubah nominal

---

# S08 — Jeda 90 Detik

### Purpose
Create friction.

### Screen Behavior
- Full-screen focus mode.
- Bottom navigation hidden.
- No financial cards.
- Minimal copy.
- Background `paper-50`.
- Circular timer center.

### Structure
```text
┌────────────────────────────┐
│          Jeda              │
│                            │
│      ┌──────────────┐      │
│      │      72      │      │
│      │    detik     │      │
│      └──────────────┘      │
│                            │
│  Tidak perlu memutuskan    │
│  sekarang.                 │
│                            │
│  Tarik napas perlahan.     │
│                            │
│ [Saya tetap ingin lanjut]  │  <- appears after 30s
└────────────────────────────┘
```

### Breathing Interaction
6-second loop:
- 0–3 sec expand;
- 3–6 sec contract.

Copy alternates every 20–30 sec:
1. “Tidak perlu memutuskan sekarang.”
2. “Dorongan bisa berubah.”
3. “Kita cuma memberi jarak.”

### Timer Implementation
Display uses:
```text
remaining = max(pause_eligible_at - now, 0)
```

Not local state only.

### If App Backgrounded
On return:
- recompute remaining;
- do not restart;
- do not auto-complete until screen has re-rendered.

### Reduced Motion
Static circle + progress ring.

---

# S09 — Decision

### Purpose
Record a neutral outcome.

### Header
> Jeda selesai.

### Subcopy
> Sekarang pilih yang paling jujur menggambarkan keputusanmu.

### CTAs
Primary:
> Saya tunda dulu

Secondary:
> Saya pindahkan fokus

Tertiary / text:
> Saya tetap memilih lanjut

The “proceeded” action is visually available but not emphasized.

### Safety
No modal:
> “Are you sure?”

No shame warning.

---

# S10 — Outcome: Delayed

### Purpose
Positive reinforcement without gamification.

### Icon
Simple pause/check icon.

### Copy
Headline:
> Kamu berhasil membuat jarak.

Body:
> Bukan soal sempurna. Yang penting, keputusan tadi tidak terjadi otomatis.

### Reflection
> Sekarang dorongannya terasa bagaimana?

Options:
- Lebih ringan
- Kurang lebih sama
- Lebih kuat
- Lewati

### Amount Context
> Nominal yang ditunda: Rp350.000

### CTA
> Selesai

Secondary:
> Lihat riwayat

No confetti.

---

# S11 — Outcome: Proceeded / Relapse-Safe

### Purpose
Keep user engaged after an undesired outcome.

### Copy
Headline:
> Terima kasih sudah jujur.

Body:
> Catatan ini bukan nilai tentang dirimu. Kita mulai lagi dari keputusan berikutnya.

### Reflection
> Apa yang paling berpengaruh tadi?

One-tap:
- Dorongan terlalu kuat
- Sedang stres
- Merasa harus balik modal
- Tidak ingin berpikir panjang
- Lewati

### Primary CTA
> Kembali ke beranda

### Secondary
> Buat rencana untuk nanti malam

Secondary only if reminder feature exists.

---

# S12 — Redirect Focus

### Purpose
Offer alternative action.

### Header
> Pindahkan fokus 10 menit

### Options
Cards:
- Minum air & berdiri
- Jalan sebentar
- Hubungi orang tepercaya
- Tutup layar 10 menit

### Primary CTA
> Saya pilih ini

### After selection
> Oke. Tidak perlu menyelesaikan semuanya sekarang.

MVP does not verify action completion.

---

# S13 — Rencana Aman Gajian

### Purpose
Define assigned vs flexible money.

### Header
> Rencana uang bulan ini

### Summary
Income:
> Rp6.000.000

Assigned:
> Rp4.400.000

Flexible:
> Rp1.600.000

### Fields
- Pendapatan
- Kebutuhan wajib
- Cicilan
- Buffer aman

### Visualization
Stacked horizontal bar:
- assigned
- buffer
- flexible

Do not use green/red profit-loss bar.

### Copy
> “Uang fleksibel” bukan rekomendasi belanja. Ini hanya sisa setelah angka yang kamu masukkan.

### CTA
> Simpan rencana

---

# S14 — History

### Purpose
Show patterns and progress.

### Header
> Riwayat Jeda

### Summary Cards
- 8 sesi
- 5 ditunda
- Rp1.350.000 nominal ditunda

### Filter
- Semua
- Ditunda
- Tetap lanjut
- Alihkan fokus

### Session Row
```text
Rp350.000
Mau balikin kerugian
24 Jul · 23:14
[Ditunda]
```

Outcome chip colors should be subtle:
- delayed: mint
- proceeded: neutral stone
- redirected: blue soft

Do not use red for “proceeded”.

### Swipe/Delete
Prefer overflow menu:
> Hapus catatan

Confirmation:
> Hapus sesi ini? Tindakan ini tidak dapat dibatalkan.

---

# S15 — Dashboard Detail

### Purpose
Demonstrate impact.

### Cards
**Jeda bulan ini**
> 8

**Berhasil ditunda**
> 5

**Nominal ditunda**
> Rp1.350.000

**Trigger paling sering**
> Larut malam

### Insight copy
> 4 dari 8 sesi terjadi setelah pukul 22.00.

Only show if timestamp is available.

Do not infer mental-health state.

---

# S16 — Profile / Privacy

### Sections
#### Data
- Baseline keuangan
- Tanggal gajian
- Jam rawan

#### Privacy
> DompetJujur tidak membutuhkan akses rekening bank.

#### Controls
- Export data (P2)
- Hapus riwayat
- Hapus akun

### Delete Account
Destructive CTA:
> Hapus akun & data

Confirmation:
> Semua data DompetJujur milikmu akan dihapus. Tindakan ini tidak dapat dibatalkan.

---

# 7. Component Library

## `MoneyInput`
Props:
```ts
type MoneyInputProps = {
  value: number;
  onChange: (value: number) => void;
  label: string;
  helperText?: string;
  error?: string;
};
```

Behavior:
- digits only;
- format with `id-ID`;
- store integer Rupiah.

## `PrimaryButton`
- height 52 px
- full width mobile
- radius 14
- disabled opacity 0.45

## `ChoiceCard`
- 56–64 px min height
- left icon optional
- radio indicator
- border 1 px
- selected state: forest border + mint background

## `ImpactCard`
- 20 px radius
- neutral white surface
- financial number at top
- explanation below

## `PauseTimer`
Props:
```ts
type PauseTimerProps = {
  eligibleAt: string;
  onComplete: () => void;
  allowIntentAfterSeconds?: number;
};
```

Must use server-derived timestamp.

## `OutcomeChip`
Values:
- Ditunda
- Tetap lanjut
- Alihkan fokus

No “success/failure”.

---

# 8. Responsive Rules

### Mobile 360–430 px
- single column;
- 20 px page padding;
- primary CTA full width;
- bottom nav fixed;
- avoid modal centered dialogs; use bottom sheet.

### Tablet ≥ 768 px
- content max-width 520 px for intervention flows;
- dashboard max-width 900 px;
- cards can form 2-column grid.

### Desktop
Keep intervention panel narrow:
`max-width: 480–520 px`

Do not stretch timer across screen.

---

# 9. Motion Specification

### Page transition
- 160–220 ms
- fade + translateY 6 px

### Card update
- 180 ms

### Money count-up
- max 500 ms
- run once

### Breathing orb
- 6 sec ease-in-out
- disabled under `prefers-reduced-motion`

### Decision reveal
At 90 sec:
- 220 ms fade-in
- no celebratory burst

---

# 10. Empty / Loading / Error States

## Global Loading
Skeleton only for cards/history.

## History Empty
Headline:
> Belum ada riwayat.

Body:
> Sesi Jeda pertamamu akan muncul di sini.

CTA:
> Mulai Jeda

## Dashboard Empty
> Belum cukup data untuk melihat pola. Kamu tetap bisa memakai Jeda kapan saja.

## Offline
> Koneksi sedang terputus. Timer tetap berjalan di perangkat ini. Hasil akan disimpan saat koneksi kembali.

Hackathon implementation can show reconnect retry; true offline sync is P2.

## Server Error
> Ada yang belum tersimpan. Coba lagi—kami tidak akan menghapus inputmu.

---

# 11. Safety UX Rules

1. Never show betting odds.
2. Never compare gambling “strategies”.
3. Never call an outcome “win”.
4. Never use streaks.
5. Never punish relapse visually.
6. Never require sharing with another person.
7. Do not expose private financial numbers on notification previews.
8. Do not request bank password/PIN.
9. Free-text notes are optional.
10. Use deterministic intervention copy in MVP.

---

# 12. Key Screen Wireframes

## Home
```text
┌────────────────────────────┐
│ DompetJujur          [◉]   │
│                            │
│ Siang, Raka.               │
│                            │
│ ┌────────────────────────┐ │
│ │ Lagi ada dorongan?     │ │
│ │                        │ │
│ │ Buat jarak 90 detik.   │ │
│ │                        │ │
│ │ [Saya lagi kepikiran]  │ │
│ └────────────────────────┘ │
│                            │
│ Ruang uang bulan ini       │
│ ┌────────────────────────┐ │
│ │ Rp1.600.000            │ │
│ │ setelah kebutuhan...   │ │
│ │ Atur rencana       →   │ │
│ └────────────────────────┘ │
│                            │
│ Bulan ini                  │
│ 5 jeda · Rp1.350.000       │
│ nominal ditunda            │
│                            │
│ Beranda  Jeda  Riwayat Saya│
└────────────────────────────┘
```

## Consequence Snapshot
```text
┌────────────────────────────┐
│ ←                          │
│                            │
│ Nominal yang kamu masukkan │
│                            │
│        Rp350.000           │
│                            │
│ ┌────────────────────────┐ │
│ │ 22% dari ruang uang    │ │
│ │ fleksibel bulan ini.   │ │
│ └────────────────────────┘ │
│                            │
│ Tidak ada keputusan yang   │
│ perlu dibuat di layar ini. │
│                            │
│ [ Mulai jeda 90 detik ]    │
│      Ubah nominal          │
└────────────────────────────┘
```

## Pause
```text
┌────────────────────────────┐
│            Jeda            │
│                            │
│                            │
│          ◯  72             │
│            detik           │
│                            │
│ Tidak perlu memutuskan     │
│ sekarang.                  │
│                            │
│ Tarik napas perlahan.      │
│                            │
│                            │
│ Saya tetap ingin lanjut    │
└────────────────────────────┘
```

## Decision
```text
┌────────────────────────────┐
│ Jeda selesai.              │
│                            │
│ Sekarang pilih yang paling │
│ jujur menggambarkan        │
│ keputusanmu.               │
│                            │
│ [ Saya tunda dulu       ]  │
│                            │
│ [ Saya pindahkan fokus  ]  │
│                            │
│   Saya tetap memilih       │
│   lanjut                   │
└────────────────────────────┘
```

---

# 13. UI Acceptance Checklist

- [ ] Core pause flow usable one-handed.
- [ ] No core flow > 5 screens before timer.
- [ ] Jeda CTA visible above fold on Home.
- [ ] No red outcome for relapse/proceeded.
- [ ] No confetti or streak.
- [ ] All Rupiah values use grouping.
- [ ] Timer persists after refresh.
- [ ] Primary text readable at 360 px.
- [ ] Bottom CTA not hidden by browser safe area.
- [ ] `prefers-reduced-motion` supported.
- [ ] Destructive actions require confirmation.
- [ ] Privacy disclaimer accessible in ≤ 2 taps.

---

# 14. Recommended shadcn/ui Mapping

| UI Need | shadcn/ui |
|---|---|
| Buttons | `Button` |
| Cards | `Card` |
| Inputs | `Input` |
| Choice controls | `RadioGroup` |
| Dialog delete | `AlertDialog` |
| Mobile secondary flow | `Sheet` |
| Tabs/filter | `Tabs` |
| Progress | custom + `Progress` |
| Toast | `Sonner` |
| Form validation | `react-hook-form` + `zod` |

---

# 15. Suggested Front-End Route Structure

```text
app/
  (public)/
    page.tsx
    login/page.tsx

  (app)/
    layout.tsx
    onboarding/page.tsx
    home/page.tsx

    pause/
      new/page.tsx
      [id]/
        snapshot/page.tsx
        timer/page.tsx
        decision/page.tsx
        outcome/page.tsx

    plan/page.tsx
    history/page.tsx
    profile/page.tsx
```

For hackathon speed, route count can be reduced by using a client-side stepper inside `/pause/new`.

---

# 16. Demo Mode

Use query:
```text
?demo=1
```

Behavior:
- production UX label remains “Jeda 90 Detik”;
- demo timer runs 12 seconds;
- a small unobtrusive `DEMO` badge appears;
- seeded metrics load automatically.

Never fake production analytics without labeling demo state.

---

# Final UI Principle

> **The user should feel that DompetJujur is standing beside them, not judging them from above.**
