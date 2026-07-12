# 🧾 Rencana Implementasi — Export Struk ke PDF dengan @react-pdf/renderer

## 📌 Ringkasan

Mengganti/melengkapi sistem struk cetak (saat ini pakai `window.print()` CSS) dengan **PDF receipt** yang digenerate menggunakan `@react-pdf/renderer` (^4.5.1, sudah terinstall). PDF bisa di-download langsung, dan tetap menyediakan opsi cetak.

---

## 🔍 Status Saat Ini

Saat ini, setelah checkout sukses:
1. **CartPanel.tsx** merender struk langsung sebagai HTML di layar (div receipt dengan class `print-receipt`)
2. Tombol **"Cetak Struk"** memanggil `window.print()` → browser print dialog
3. Struk juga bisa di-screenshot manual

**Kelemahan saat ini:**
- Tampilan struk hanya di layar & print — tidak bisa di-download sebagai file PDF
- Tidak ada font yang konsisten (bergantung browser/system fonts)
- Layout HTML print rawan broken antar browser
- Tidak ada opsi download otomatis setelah transaksi

---

## 🎯 Target

1. **PDF Receipt** auto-generated setelah checkout sukses
2. Tombol **Download PDF** (simpan ke perangkat)
3. Tombol **Cetak Struk** tetap dipertahankan (print dari PDF atau HTML)
4. Desain struk PDF konsisten dengan branding POS (warna, font, layout)
5. Bisa dipanggil dari halaman **Riwayat Transaksi** untuk re-print struk lama

---

## 🧱 Komponen PDF — Arsitektur

```
components/
└── receipt/
    ├── ReceiptDocument.tsx      # Root document PDF (@react-pdf Document)
    ├── ReceiptPage.tsx          # Halaman PDF (Page, size="80mm" thermal-like)
    ├── ReceiptHeader.tsx        # Logo + Nama Toko + Info
    ├── ReceiptItems.tsx         # Daftar item yang dibeli
    ├── ReceiptSummary.tsx       # Total, Bayar, Kembali
    ├── ReceiptFooter.tsx        # Terima kasih, footer
    ├── useDownloadReceipt.ts    # Hook: generate blob + download PDF
    └── ReceiptPreview.tsx       # (Opsional) Preview PDF di browser sebelum download
```

---

## 🎨 Design Token — PDF Receipt

### Layout & Size

| Properti | Value | Alasan |
|----------|-------|--------|
| **Page size** | `{ width: 80, height: 'auto' }` dalam `mm` | Ukuran thermal receipt standar (80mm) — terlihat autentik sebagai struk |
| **Orientation** | Portrait | Struk selalu vertikal |
| **Padding** | `{ top: 10, left: 12, right: 12, bottom: 10 }` (mm) | Ruang napas, tapi tidak boros karena lebar terbatas |
| **Max content width** | ~56mm (80 - 12*2 padding) | Sesuai lebar thermal paper |

### Warna (konsisten dengan design system)

| Token | Hex | Penggunaan |
|-------|-----|------------|
| `ink` | `#1A1A1A` | Teks utama (nama item, nominal) |
| `inkMuted` | `#6B645C` | Teks sekunder (label, qty, tanggal) |
| `brand` | `#C73B2B` | Aksen garis pemisah, header |
| `success` | `#2B7A4B` | Nilai kembalian |
| `border` | `#E2DCD3` | Garis pemisah antar section |
| `surface` | `#FFFFFF` | Background putih (kertas struk) |

### Tipografi (konsisten dengan design system web)

| Role | Font | Weight | Size | Penggunaan |
|------|------|--------|------|------------|
| **Store Name** | `Plus Jakarta Sans` | Bold (700) | 14pt | Nama toko di header |
| **Section Title** | `Plus Jakarta Sans` | SemiBold (600) | 10pt | Label section |
| **Item Name** | `Inter` | Medium (500) | 8pt | Nama menu |
| **Item Detail** | `Inter` | Regular (400) | 7pt | Qty, label, tanggal |
| **Nominal** | `JetBrains Mono` | Medium (500) | 9pt | Harga, total, bayar, kembali |
| **Total Amount** | `Plus Jakarta Sans` | Bold (700) | 12pt | Total grand — tampil menonjol |
| **Footer** | `Inter` | Regular (400) | 7pt | Terima kasih, catatan |

### Font Registration (Wajib)

@react-pdf/renderer **tidak bisa** menggunakan `next/font/google` — font harus di-download sebagai file `.ttf` dan diregister manual via `Font.register()`:

```typescript
import { Font } from "@react-pdf/renderer";

Font.register({
  family: "Plus Jakarta Sans",
  fonts: [
    { src: "/fonts/PlusJakartaSans-Regular.ttf", fontWeight: 400 },
    { src: "/fonts/PlusJakartaSans-Medium.ttf", fontWeight: 500 },
    { src: "/fonts/PlusJakartaSans-SemiBold.ttf", fontWeight: 600 },
    { src: "/fonts/PlusJakartaSans-Bold.ttf", fontWeight: 700 },
  ],
});

Font.register({
  family: "Inter",
  fonts: [
    { src: "/fonts/Inter-Regular.ttf", fontWeight: 400 },
    { src: "/fonts/Inter-Medium.ttf", fontWeight: 500 },
  ],
});

Font.register({
  family: "JetBrains Mono",
  fonts: [
    { src: "/fonts/JetBrainsMono-Regular.ttf", fontWeight: 400 },
    { src: "/fonts/JetBrainsMono-Medium.ttf", fontWeight: 500 },
  ],
});
```

**Sumber font files:**
- [Plus Jakarta Sans — Google Fonts](https://fonts.google.com/specimen/Plus+Jakarta+Sans) (download .zip, ekstrak .ttf)
- [Inter — Google Fonts](https://fonts.google.com/specimen/Inter)
- [JetBrains Mono — Google Fonts](https://fonts.google.com/specimen/JetBrains+Mono)

Letakkan file `.ttf` di folder **`public/fonts/`** agar bisa diakses via URL `/fonts/...`.

> **Kenapa repot register font?** Karena @react-pdf/renderer merender PDF di sisi client tanpa akses ke font sistem atau next/font. Satu-satunya cara pakai font kustom adalah registrasi manual. Hasilnya sepadan — struk PDF akan konsisten persis dengan desain web POS.

### Signature Element (Frontend Design Skill)

> Garis putus-putus (`- - - - -`) sebagai pemisah antar section — mengingatkan pada struk thermal asli yang bergerigi. Ini detail kecil tapi langsung recognizable sebagai receipt.

---

## 📋 Data Flow

```
[User klik Bayar] 
      ↓
[API /api/orders → sukses]
      ↓
[CartPanel: setReceipt(data)]
      ↓
[Tampilkan struk HTML di layar (existing)]
      ↓
[User klik "Download PDF"]
      ↓
[useDownloadReceipt hook]
      ├── Buat ReceiptDocument dengan data transaksi
      ├── pdf() render → Blob
      └── Trigger download file: struk-{orderId}.pdf

[User klik "Cetak Struk"]
      ↓
[window.print() — existing, tetap dipertahankan]
```

### Data yang Dilempar ke PDF Document

```typescript
interface ReceiptData {
  storeName: string;        // "Simple POS"
  storeAddress?: string;    // Opsional
  orderId: string;          // "#ABC12345"
  cashierName: string;      // Nama kasir
  date: string;             // Format: "12 Juli 2026, 14:30"
  items: {                  // OrderItemSnapshot[]
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  paymentAmount: number;
  change: number;
}
```

---

## 🛠️ Langkah Implementasi

### Tahap 1 — Font Registration

1. Buat folder `public/fonts/`
2. Download file `.ttf` dari Google Fonts untuk:
   - `PlusJakartaSans-Regular.ttf`, `-Medium.ttf`, `-SemiBold.ttf`, `-Bold.ttf`
   - `Inter-Regular.ttf`, `Inter-Medium.ttf`
   - `JetBrainsMono-Regular.ttf`, `JetBrainsMono-Medium.ttf`
3. Letakkan semua `.ttf` di `public/fonts/`
4. Buat file `components/receipt/fonts.ts` — berisi semua pemanggilan `Font.register()`

### Tahap 2 — Komponen Struk PDF

1. Buat folder `components/receipt/`
2. Buat file `components/receipt/ReceiptDocument.tsx`
   - Import font yang sudah diregister dari `./fonts.ts`
   - Import `Document`, `Page`, `View`, `Text`, `StyleSheet`, `pdf` dari `@react-pdf/renderer`
   - Definisikan `styles` dengan ukuran 80mm width dan family font sesuai role
   - Buat komponen `ReceiptDocument` yang menerima props `data: ReceiptData`
3. Buat sub-komponen:

   - **ReceiptHeader**: Nama toko (Plus Jakarta Sans Bold 14pt), order ID, tanggal, kasir
   - **ReceiptItems**: Tabel item — nama pakai Inter, nominal pakai JetBrains Mono, garis putus-putus
   - **ReceiptSummary**: Total (Plus Jakarta Sans Bold 12pt), bayar, kembalian (JetBrains Mono, hijau)
   - **ReceiptFooter**: "Terima kasih!" + pesan penutup (Inter Regular 7pt)

> Sub-komponen sudah digabung ke Tahap 2 di atas.

### Tahap 3 — Hook Download PDF

Buat `useDownloadReceipt.ts`:

```typescript
function useDownloadReceipt() {
  const downloadReceipt = async (data: ReceiptData) => {
    const blob = await pdf(<ReceiptDocument data={data} />).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `struk-${data.orderId.replace('#', '')}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return { downloadReceipt };
}
```

### Tahap 4 — Integrasi ke CartPanel

Di `CartPanel.tsx`:
- Import `useDownloadReceipt`
- Tambahkan tombol **"Download PDF"** di samping/bawah tombol "Cetak Struk"
- Panggil `downloadReceipt()` dengan data receipt yang sudah ada di state

### Tahap 5 — Integrasi ke Halaman Riwayat (Re-print)

Di `HistoryPage.tsx`:
- Tambahkan tombol/icon **Download PDF** per item riwayat
- Fetch detail lengkap dari order → generate PDF

### Tahap 6 — (Opsional) Preview PDF

Gunakan `@react-pdf/renderer` `<PDFViewer>` untuk menampilkan preview PDF embedded di browser sebelum download. Bisa jadi opsi "Lihat Struk" sebelum download.

---

## 📁 File Changes Summary

| File | Action | Deskripsi |
|------|--------|-----------|
| `components/receipt/ReceiptDocument.tsx` | **CREATE** | Root PDF document |
| `components/receipt/ReceiptHeader.tsx` | **CREATE** | Header struk |
| `components/receipt/ReceiptItems.tsx` | **CREATE** | Daftar item |
| `components/receipt/ReceiptSummary.tsx` | **CREATE** | Total, bayar, kembali |
| `components/receipt/ReceiptFooter.tsx` | **CREATE** | Footer struk |
| `components/receipt/useDownloadReceipt.ts` | **CREATE** | Hook download PDF |
| `components/layout/CartPanel.tsx` | **EDIT** | Tambah tombol download PDF |
| `app/pos/history/page.tsx` | **EDIT** | Tambah tombol download PDF di riwayat |
| `types/index.ts` | **EDIT** | (Opsional) tambah tipe `ReceiptData` jika perlu |

---

## 📐 Contoh Output PDF (Mock)

```
┌──────────────────────────────┐
│        🍽️ SIMPLE POS         │
│  Jl. Contoh No. 123, Jakarta │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│  #ABC12345                   │
│  12 Juli 2026, 14:30         │
│  Kasir: Admin                │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│                              │
│  Nasi Goreng          x2     │
│                    Rp30.000  │
│                              │
│  Es Teh Manis        x1      │
│                     Rp5.000  │
│                              │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│  Total              Rp35.000 │
│  Bayar              Rp50.000 │
│  Kembali         ✅ Rp15.000 │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│                              │
│     Terima kasih!            │
│  Simpan struk ini sebagai    │
│    bukti pembayaran.         │
│                              │
└──────────────────────────────┘
```

---

## ⚠️ Pertimbangan & Catatan

### @react-pdf/renderer v4 — Hal yang Perlu Diperhatikan
- **No `@page` CSS**: Semua styling via `StyleSheet.create()` — tidak bisa pakai CSS print
- **Font**: v4 mendukung `.registerFont()` untuk kustom font (TTF/WOFF)
- **`pdf()` function**: Return `PDFDownloadManager` dengan method `.toBlob()`, `.toBuffer()`, dll — tersedia di client-side
- **`<PDFViewer>`**: Component untuk preview embedded, butuh height tertentu
- **Client-side only**: PDF generation hanya jalan di browser — aman untuk komponen `"use client"`
- **Dynamic text**: Gunakan `Text` component, bisa nesting untuk bold/regular

### Performa
- PDF generation cepat untuk struk 5-20 item (kasus POS)
- Tidak perlu server-side rendering untuk PDF receipt
- Blob size untuk 1 struk diperkirakan < 50KB

### Aksesibilitas
- PDF yang dihasilkan bisa dibaca screen reader
- Nama file bermakna: `struk-ABC12345.pdf`

---

## 🧪 Test Scenarios (Playwright)

Tambahkan test di `tests/pos/checkout.spec.ts`:

| Test | Langkah | Expect |
|------|---------|--------|
| **Download PDF setelah checkout** | Login → checkout → klik Download PDF | File terdownload (cek download event) |
| **PDF di halaman riwayat** | Login → buka riwayat → klik PDF di salah satu transaksi | File terdownload |
| **Konten PDF valid** | Download PDF → parse text → cek order ID dan total | Cocok dengan data transaksi |

---

## 🚀 Urutan Pengerjaan

1. ✏️ **Buat `components/receipt/ReceiptDocument.tsx`** + semua sub-komponen
2. 🔌 **Buat `useDownloadReceipt.ts`** hook
3. 🧩 **Integrasi ke `CartPanel.tsx`** — tambah tombol download
4. 🔍 **Integrasi ke `HistoryPage.tsx`** — download PDF dari riwayat
5. 🧪 **Test Playwright** — pastikan download berfungsi
6. 🎨 **Polish** — register font kustom, refine layout

---

> **Dokumen ini adalah blueprint.** Setiap tahap akan dikerjakan satu per satu setelah mendapat persetujuan.

---

## 🔄 Ringkasan Perubahan dari Rencana Awal

| Aspek | Rencana Awal (Helvetica) | Revisi (Design System) |
|-------|-------------------------|------------------------|
| Font header | `Helvetica-Bold` | `Plus Jakarta Sans Bold` |
| Font body | `Helvetica` | `Inter Medium/Regular` |
| Font nominal | `Helvetica-Bold` | `JetBrains Mono Medium` |
| Font total | `Helvetica-Bold` | `Plus Jakarta Sans Bold` |
| Registration | Opsional (Helvetica built-in) | Wajib download & register .ttf |
| Folder font | Tidak ada | `public/fonts/` |
