# 🧾 Simple POS - FnB (Food & Beverage)

## 📋 Ringkasan
Aplikasi **Point of Sale** sederhana untuk usaha Food & Beverage (FnB) berbasis web. Dibangun dengan **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **Prisma ORM** (PostgreSQL), dan **Auth.js** untuk autentikasi.

> **Status Project:** Prisma + PostgreSQL sudah terkonfigurasi.
> **Target:** Aplikasi POS dengan login multi-kasir, data tersimpan di database, responsif untuk tablet/desktop.

---

## 🎯 Fitur Utama (MVP)

### 0. 🔐 Autentikasi (Auth.js / NextAuth v5)
- Login/Register dengan **email & password** (credentials provider)
- **Role-based**: `admin` (full akses) & `kasir` (terbatas)
- Session管理 via **JWT** (stateless, cocok untuk POS)
- Route protection: halaman POS hanya bisa diakses setelah login
- Logout

### 1. 📋 Menu Management (Katalog Produk)
- Menampilkan daftar menu FnB dalam bentuk **grid card**
- Data diambil dari **PostgreSQL via Prisma**
- Setiap item memiliki: `nama`, `harga`, `kategori` (Makanan/Minuman/Snack), `gambar`
- Filter menu berdasarkan **kategori**
- Pencarian menu berdasarkan **nama**

### 2. 🛒 Order Taking (Kasir)
- Klik menu → tambah ke **cart** (state lokal)
- Atur **quantity** (tambah/kurang/hapus) di cart
- Tampilkan **subtotal per item** dan **total keseluruhan**
- Cart bisa dikosongkan (clear)

### 3. 💳 Checkout & Payment
- Input **jumlah bayar** (cash)
- Hitung **kembalian** secara otomatis
- Konfirmasi pembayaran → simpan transaksi ke **PostgreSQL**
- Cetak struk sederhana (print layout)

### 4. 📜 Order History
- Riwayat pesanan yang sudah selesai (dari database)
- Informasi: waktu transaksi, daftar item, total, jumlah bayar, kembalian, nama kasir
- Filter berdasarkan tanggal

### 5. 📊 Dashboard
- Statistik real-time dari database:
  - Total transaksi hari ini
  - Total pendapatan hari ini
  - Jumlah item terjual
  - Grafik sederhana (opsional)

---

## 🧱 Struktur Halaman

### Alur Navigasi

```
┌─────────────────────────────────────┐
│         LOGIN PAGE                   │
│  [Email] [Password] [Login]          │
│         [Register]                   │
└──────────┬──────────────────────────┘
           │ (after login)
           ▼
┌─────────────────────────────────────┐
│  HEADER: [Logo] [Menu] [Riwayat]    │
│          [Dashboard] [User] [Logout] │
├─────────────────────────────────────┤
│                                     │
│   ┌────────────┐ ┌────────────┐    │
│   │ GRID MENU  │ │ CART       │    │
│   │ (Filter +  │ │ PANEL      │    │
│   │  Search)   │ │            │    │
│   │            │ │ Qty +/-    │    │
│   │ [Card]     │ │ Subtotal   │    │
│   │ [Card]     │ │ Total      │    │
│   │ [Card]     │ │ Bayar      │    │
│   │            │ │ Kembali    │    │
│   │            │ │ [Bayar]    │    │
│   └────────────┘ └────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

### Route Structure (App Router)

```
src/app/
├── (auth)/                    # Auth route group (no layout POS)
│   ├── login/page.tsx         # Halaman login
│   └── register/page.tsx      # Halaman register
├── (dashboard)/               # Protected route group
│   ├── layout.tsx             # Layout POS (header + sidebar)
│   ├── page.tsx               # Halaman utama POS (Menu + Cart)
│   ├── history/page.tsx       # Riwayat transaksi
│   └── dashboard/page.tsx     # Statistik dashboard
├── api/
│   ├── auth/[...nextauth]/    # Auth.js API route
│   │   └── route.ts
│   └── orders/route.ts        # API orders (server action alternative)
├── layout.tsx                 # Root layout
├── page.tsx                   # Redirect ke /login atau /(dashboard)
└── globals.css                # Global styles
```

---

## 🗂️ Struktur Folder (Project)

```
src/
├── app/
│   ├── (auth)/                  # Auth route group
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/             # Protected route group
│   │   ├── layout.tsx           # Layout POS (header + sidebar)
│   │   ├── page.tsx             # Halaman utama POS (Menu + Cart)
│   │   ├── history/page.tsx     # Riwayat transaksi
│   │   └── dashboard/page.tsx   # Statistik dashboard
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   │   └── route.ts         # Auth.js handler
│   │   └── orders/route.ts      # API endpoint orders
│   ├── layout.tsx               # Root layout (sudah ada)
│   ├── page.tsx                 # Redirect ke /login atau /dashboard
│   └── globals.css              # Global styles
├── components/
│   ├── ui/                      # UI primitives (button, input, card, etc.)
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Badge.tsx
│   ├── layout/
│   │   ├── Header.tsx           # Header + navigasi + user menu
│   │   └── CartPanel.tsx        # Panel cart (sidebar kanan)
│   ├── menu/
│   │   ├── MenuGrid.tsx         # Grid daftar menu
│   │   ├── MenuCard.tsx         # Card item menu
│   │   └── MenuFilter.tsx       # Filter kategori
│   ├── order/
│   │   ├── CartItem.tsx         # Item di cart
│   │   └── CheckoutForm.tsx     # Form pembayaran
│   ├── history/
│   │   └── OrderHistory.tsx     # Riwayat transaksi
│   └── dashboard/
│       └── Dashboard.tsx        # Statistik dashboard
├── lib/
│   ├── prisma.ts                # Prisma client instance (singleton)
│   ├── auth.ts                  # Auth.js configuration
│   └── utils.ts                 # Utility functions (format rupiah, dll)
├── hooks/
│   ├── useCart.ts               # Hook state cart (client-side)
│   └── useOrders.ts             # Hook fetch orders dari API
└── types/
    ├── index.ts                 # Shared TypeScript interfaces
    └── next-auth.d.ts           # Auth.js type augmentation

prisma/
├── schema.prisma                # Database schema
└── seed.ts                      # Seed data (menu + admin user)
```

---

## 🎨 Design Direction (Frontend Design Skill)

> **Subjek:** FnB Point of Sale — Cepat, hangat, energetik, dan terpercaya.
> **Audience:** Kasir resto/kafe — butuh kecepatan & kejelasan, bukan hiasan.
> **Satu tugas halaman:** Memproses transaksi seenak dan secepat mungkin.

### Token System

#### Palette (6 warna)

| Token | Hex | Peran |
|-------|-----|-------|
| `--surface` | `#F9F7F4` | Background utama — putih hangat susu, bukan cream #F4F1EA |
| `--surface-secondary` | `#F0EDE8` | Kartu & panel — sedikit lebih dalam dari surface |
| `--ink` | `#1A1A1A` | Teks utama — hitam soft, bukan pure #000 |
| `--ink-muted` | `#6B645C` | Teks sekunder — cokelat keabuan hangat |
| `--brand` | `#C73B2B` | Aksen utama — merah tomat segar, bukan terracotta AI-generik |
| `--success` | `#2B7A4B` | Hijau daun — untuk success state, bayar berhasil |
| `--border` | `#E2DCD3` | Garis pemisah halus |

> **Mengapa merah tomat?** FnB = makanan. Merah tomat membangkitkan selera, hangat, dan energetik — cocok untuk ritme kasir yang cepat. Bukan terracotta yang terlalu earthy/tenang.

#### Typography

| Role | Font | Alasan |
|------|------|--------|
| **Display** (judul, nominal) | **`Plus Jakarta Sans`** — weight 700/800 | Tegas, modern, angle terminals yang khas — readable di ukuran kecil sekalipun. Tidak pakai Inter/Geist biar beda dari template Next.js default. |
| **Body** (label, cart) | **`Inter`** — weight 400/500/600 | Terbukti readable di UI padat informasi. Dipasangkan dengan Plus Jakarta Sans untuk kontras yang jelas. |
| **Utility** (harga, qty) | **`JetBrains Mono`** — weight 450/500 | Monospace untuk angka — harga dan quantity jadi lebih cepat dipindai mata kasir. |

> **Mengapa tidak pakai Geist?** Karena Geist sudah jadi font default Next.js (dari `geistFont` di layout.tsx). Skill frontend-design bilang: "pair display and body faces deliberately, not the same families you would reach for on any other project."

#### Layout Concept

```
┌──────────────────────────────────────────────┐
│  HEADER (fixed)                              │
│  🍽️ Logo       [Menu] [Riwayat] [Dashboard]  │
│                     👤 Admin    [Logout]      │
├──────────────────────┬───────────────────────┤
│                      │                       │
│  MENU GRID (scroll)  │  CART PANEL (fixed)   │
│  ┌────┬────┬────┐   │  ┌─────────────────┐  │
│  │🍔  │🍝  │🥤  │   │  │ Item      Qty   │  │
│  │25k │30k │8k  │   │  │ Nasi G.   x2   │  │
│  ├────┼────┼────┤   │  │ Es Teh    x1   │  │
│  │🍟  │🥟  │☕  │   │  │                 │  │
│  │15k │12k │10k │   │  │ ─────────────  │  │
│  └────┴────┴────┘   │  │ Total:  Rp58k  │  │
│                      │  │ Bayar: [____]  │  │
│                      │  │ Kembali: Rp2k  │  │
│                      │  │ [💰 Bayar]     │  │
│                      │  └─────────────────┘  │
└──────────────────────┴───────────────────────┘
```

- **Sidebar cart fixed** — selalu terlihat, tidak perlu scroll. Ini krusial untuk kasir.
- **Menu grid scrollable** — karena menu bisa banyak, pakai virtual scroll jika perlu.
- **No popup modal untuk checkout** — semua terjadi di panel yang sama, mengurangi klik.
- **Struk-style receipt** — setelah bayar, tampilkan animasi struk (signature element).

#### Signature Element: **"Struk Animasi"**

Setiap transaksi berhasil, tampilkan **struk digital** yang muncul dengan animasi *slide-up + print effect* — seolah-olah sedang mencetak struk. Ini bukan sekadar dekorasi:

- Memperkuat **feedback** bahwa transaksi berhasil
- Kasir bisa langsung lihat ringkasan
- Ada tombol **"Cetak"** untuk print ke thermal printer (via browser print)
- Ada tombol **"Pesanan Baru"** untuk reset cart

> **Mengapa ini signature?** POS lain biasanya pakai modal "Sukses!" biasa. Struk animasi ini spesifik untuk FnB — mengingatkan pada experience menerima struk di restoran, tapi dalam bentuk digital yang lebih hidup.

### Self-Critique

| Risiko | Mitigasi |
|--------|----------|
| Terlalu banyak animasi → terkesan AI-generic | Hanya 1 animasi signature (struk), sisanya micro-interaction minimal (hover scale di menu card) |
| Merah tomat terlalu dominan | Hanya untuk aksen tombol & badge, bukan background |
| Monospace (JetBrains Mono) terlalu kaku untuk harga | Hanya untuk angka di cart & struk, body tetap Inter yang bersahabat |
| Layout fixed cart tidak cocok untuk layar kecil | Di mobile, cart panel jadi bottom sheet (slide up dari bawah) |

### Kriteria "Tidak Generic"

| Ciri AI-generic | Yang Kita Lakukan |
|----------------|-------------------|
| Cream #F4F1EA + terracotta | ✅ Putih hangat #F9F7F4 + merah tomat #C73B2B |
| Dark mode + acid green | ✅ Light mode dengan warna hangat (tema FnB) |
| Broadsheet newspaper | ✅ Layout POS grid + sidebar — fungsional |
| Font default Geist/Inter saja | ✅ Plus Jakarta Sans (display) + JetBrains Mono (angka) |
| Animasi scattered | ✅ Satu signature animation terfokus |

---

### Alur Login

```
User buka app → redirect ke /login
    ↓
Input email & password
    ↓
Auth.js (Credentials Provider) validasi ke database
    ↓
Sukses → JWT token → redirect ke /dashboard
    ↓
Gagal → tampilkan error
```

### Alur Transaksi

```
User (sudah login) klik menu
    ↓
useCart.addItem(item) — state lokal React
    ↓
CartPanel update (qty, subtotal, total)
    ↓
User input jumlah bayar → CheckoutForm
    ↓
Konfirmasi → POST ke API /api/orders
    ↓
Prisma simpan Order + OrderItem ke PostgreSQL
    ↓
Cart kosong, SweetAlert sukses
```

### Alur Riwayat & Dashboard

```
User buka tab Riwayat
    ↓
GET /api/orders?type=history
    ↓
Prisma fetch dari PostgreSQL → tampilkan tabel

User buka tab Dashboard
    ↓
GET /api/orders?type=stats
    ↓
Prisma aggregate → tampilkan statistik
```

---

## 💾 Data Model (Prisma Schema)

### Model Autentikasi (Auth.js Required)

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String    // hash bcrypt
  role          String    @default("kasir") // "admin" | "kasir"
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts Account[]
  sessions Session[]
  orders   Order[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

### Model POS

```prisma
model MenuItem {
  id        String   @id @default(cuid())
  name      String
  price     Int      // dalam rupiah (15000 = Rp15.000)
  category  String   // "makanan" | "minuman" | "snack"
  image     String?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  orderItems OrderItem[]
}

model Order {
  id            String      @id @default(cuid())
  cashierId     String                  // relasi ke User (kasir)
  cashier       User        @relation(fields: [cashierId], references: [id])
  items         OrderItem[]
  total         Int         // total dalam rupiah
  paymentAmount Int         // jumlah bayar
  change        Int         // kembalian
  createdAt     DateTime    @default(now())

  @@map("orders")
}

model OrderItem {
  id       String   @id @default(cuid())
  orderId  String
  order    Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  menuId   String
  menu     MenuItem @relation(fields: [menuId], references: [id])
  name     String   // snapshot nama menu saat transaksi
  quantity Int
  price    Int      // snapshot harga per item saat transaksi

  @@map("order_items")
}
```

### TypeScript Types (Frontend)

```typescript
// Untuk cart (client-side state)
interface CartItem {
  menuItem: {
    id: string;
    name: string;
    price: number;
    category: string;
    image?: string;
  };
  quantity: number;
}

// Response dari API
interface OrderResponse {
  id: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  paymentAmount: number;
  change: number;
  cashier: { name: string; email: string };
  createdAt: string;
}
```

---

## 🛠️ Teknologi & Dependency

### Sudah Terinstall
- ✅ **Next.js 16** — Framework React
- ✅ **React 19** — UI Library
- ✅ **TypeScript** — Type safety
- ✅ **Tailwind CSS v4** — Utility CSS
- ✅ **Prisma ORM v7** — Database ORM
- ✅ **@prisma/adapter-pg** — Prisma adapter untuk PostgreSQL
- ✅ **pg** — PostgreSQL driver
- ✅ **dotenv** — Environment variables
- ✅ **tsx** — TypeScript execution (seed)

### Yang Perlu Ditambahkan

**Auth.js (NextAuth v5):**
```bash
npm install next-auth@beta @auth/prisma-adapter
```

**Lainnya:**
```bash
npm install bcryptjs
npm install --save-dev @types/bcryptjs
npm install lucide-react
```

| Package | Fungsi |
|---------|--------|
| `next-auth@beta` | Auth.js v5 untuk Next.js |
| `@auth/prisma-adapter` | Adapter Auth.js ke Prisma |
| `bcryptjs` | Hash password (ringan, no native deps) |
| `lucide-react` | Icons modern & ringan |

**Font tambahan (via Google Fonts CDN atau `next/font`):**
- `Plus Jakarta Sans` — display/heading
- `JetBrains Mono` — angka & utility

> Font di-load via `next/font/google` (zero layout shift, optimal caching).

### Tidak Dipakai
- ❌ **shadcn/ui** — hindari overhead, pakai custom Tailwind
- ❌ **Zustand/Redux** — cukup React state + hooks
- ❌ **framer-motion** — animasi cukup pakai CSS transition + keyframes (lebih ringan)

---

## 📅 Tahapan Implementasi

| Tahap | Deskripsi |
|-------|-----------|
| **1** | **Setup Prisma Schema** — Buat semua model (User, Account, Session, MenuItem, Order, OrderItem) + migration + seed |
| **2** | **Auth.js Setup** — Install next-auth, konfigurasi auth.ts, route handler, login/register page |
| **3** | **UI Primitives** — Buat komponen dasar (Button, Input, Card, Badge) |
| **4** | **Menu Components** — MenuGrid, MenuCard, MenuFilter (fetch dari DB via server component) |
| **5** | **Cart & Checkout** — useCart hook, CartPanel, CartItem, CheckoutForm + API submit order |
| **6** | **Integrasi Halaman Utama** — Gabungkan menu grid + cart panel di page.tsx |
| **7** | **Order History** — Halaman riwayat dengan filter tanggal |
| **8** | **Dashboard** — Statistik dari database |
| **9** | **Polish & Testing** — Responsive, loading states, error handling |

---

## ⚠️ Catatan & Asumsi

1. **PostgreSQL** — database harus running sebelum app dijalankan (`psql -U postgres`)
2. **Password di-hash** dengan bcryptjs sebelum disimpan
3. **Session via JWT** — cocok untuk POS yang tidak perlu session database
4. **Role Admin vs Kasir**:
   - **Admin**: bisa manage menu (CRUD), liat semua transaksi
   - **Kasir**: hanya bisa transaksi, liat riwayat sendiri
5. **Single page POS** — halaman utama kasir adalah menu + cart dalam satu layout
6. **Mobile friendly** — layout responsif untuk tablet (7-10 inch) dan desktop
7. **Database-first** — semua data persisten di PostgreSQL, tidak ada localStorage

---

## ✅ Persetujuan

Silakan review dokumen ini. Jika ada yang ingin diubah/ditambahkan/dikurangi, beri tahu saya. Setelah Anda setuju, saya akan mulai implementasi tahap demi tahap.
