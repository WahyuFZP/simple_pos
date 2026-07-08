# 🧪 Test Automation — Simple POS FnB

## 📋 Setup

Playwright sudah terinstall (`@playwright/test` v1.61). Konfigurasi di `playwright.config.ts`.

### Persiapan Sebelum Test

1. Pastikan PostgreSQL berjalan dan database `simple_pos` sudah di-seed
2. Jalankan `npm run build && npm start` (atau `npm run dev`)

### Setup `playwright.config.ts` (tambahan)

```ts
// playwright.config.ts — tambahkan di dalam `use`
use: {
  baseURL: 'http://localhost:3000',
  // ...
},

// Ganti testDir agar spesifik:
testDir: './tests/pos',

// Tambahkan webServer jika ingin auto-start:
webServer: {
  command: 'npm run dev',
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,
},
```

---

## 🎯 Test Scenarios (Fokus)

### 1️⃣ Authentication — Login

File: `tests/pos/auth.spec.ts`

| Test | Langkah | Expect |
|------|---------|--------|
| **Login sukses** | `page.goto('/login')` → isi email & password valid → klik Masuk | Redirect ke `/pos`, header muncul |
| **Login gagal** | Isi email & password salah → klik Masuk | Tampil error "Email atau password salah." |
| **Akses tanpa login** | `page.goto('/pos')` tanpa login | Redirect ke `/login` |

```typescript
import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';

test.describe('Auth - Login', () => {

  test('login sukses dengan kredensial admin', async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.fill('input[type="email"]', 'admin@simplepos.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(`${BASE}/pos`);
    await expect(page.locator('text=🍽️ POS')).toBeVisible();
  });

  test('login gagal — password salah', async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.fill('input[type="email"]', 'admin@simplepos.com');
    await page.fill('input[type="password"]', 'salah');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Email atau password salah.')).toBeVisible();
  });

  test('redirect ke login jika belum auth', async ({ page }) => {
    await page.goto(`${BASE}/pos`);
    await expect(page).toHaveURL(`${BASE}/login`);
  });
});
```

---

### 2️⃣ POS Flow — Pesan & Bayar

File: `tests/pos/checkout.spec.ts`

| Test | Langkah | Expect |
|------|---------|--------|
| **Tambah item ke cart** | Login → klik menu card | Cart bertambah 1 item |
| **Atur quantity** | Login → tambah item → klik + dan - | Quantity berubah |
| **Hapus item dari cart** | Login → tambah item → klik icon trash | Item hilang dari cart |
| **Checkout sukses** | Login → tambah item → input bayar ≥ total → klik Bayar | Tampil struk, cart kosong, tombol "Pesanan Baru" muncul |

```typescript
import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';

test.describe('POS - Checkout Flow', () => {

  test.beforeEach(async ({ page }) => {
    // Login dulu
    await page.goto(`${BASE}/login`);
    await page.fill('input[type="email"]', 'admin@simplepos.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(`${BASE}/pos`);
  });

  test('klik menu card → item masuk cart', async ({ page }) => {
    const initialText = await page.locator('text=Keranjang kosong').textContent();
    expect(initialText).toBeTruthy();

    // Klik menu card pertama
    await page.locator('button:has-text("Nasi Goreng")').first().click();
    await expect(page.locator('text=Nasi Goreng')).toHaveCount(2); // satu di grid, satu di cart
    await expect(page.locator('text=Keranjang kosong')).not.toBeVisible();
  });

  test('atur quantity di cart', async ({ page }) => {
    await page.locator('button:has-text("Nasi Goreng")').first().click();
    // Quantity default = 1
    await expect(page.locator('span:has-text("1")').last()).toBeVisible();
    // Klik +
    await page.locator('button:has-text("Nasi Goreng")').locator('..').locator('button svg.lucide-plus').click();
    // Tunggu quantity = 2
    await expect(page.locator('text=Nasi Goreng').locator('..').locator('span:has-text("2")')).toBeVisible();
  });

  test('hapus item dari cart', async ({ page }) => {
    await page.locator('button:has-text("Es Teh Manis")').first().click();
    await expect(page.locator('text=Keranjang kosong')).not.toBeVisible();
    // Klik icon trash
    await page.locator('button svg.lucide-trash2').first().click();
    await expect(page.locator('text=Keranjang kosong')).toBeVisible();
  });

  test('checkout — bayar & tampil struk', async ({ page }) => {
    await page.locator('button:has-text("Nasi Goreng")').first().click();
    // Input pembayaran di field dalam CheckoutForm
    await page.fill('input[placeholder="0"]', '30000');
    await page.click('button:has-text("💰 Bayar")');
    // Struk muncul
    await expect(page.locator('text=Terima kasih!')).toBeVisible();
    await expect(page.locator('text=Pesanan Baru')).toBeVisible();
  });
});
```

---

### 3️⃣ Navigasi — Riwayat & Dashboard

File: `tests/pos/navigation.spec.ts`

| Test | Langkah | Expect |
|------|---------|--------|
| **Navigasi ke Riwayat** | Login → klik "Riwayat" | Halaman riwayat tampil |
| **Navigasi ke Dashboard** | Login → klik "Dashboard" | Kartu statistik tampil |
| **Kembali ke Menu** | Login → kunjungi Riwayat → klik "Menu" | Kembali ke grid menu |

```typescript
import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:3000';

test.describe('Navigasi', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.fill('input[type="email"]', 'admin@simplepos.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(`${BASE}/pos`);
  });

  test('navigasi ke riwayat transaksi', async ({ page }) => {
    await page.click('a:has-text("Riwayat")');
    await expect(page).toHaveURL(`${BASE}/pos/history`);
    await expect(page.locator('h1:has-text("Riwayat Transaksi")')).toBeVisible();
  });

  test('navigasi ke dashboard', async ({ page }) => {
    await page.click('a:has-text("Dashboard")');
    await expect(page).toHaveURL(`${BASE}/pos/dashboard`);
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
    await expect(page.locator('text=Transaksi Hari Ini')).toBeVisible();
  });
});
```

---

### 4️⃣ Register (Opsional)

File: `tests/pos/register.spec.ts`

| Test | Langkah | Expect |
|------|---------|--------|
| **Register sukses** | `page.goto('/register')` → isi nama, email, password → klik Daftar | Redirect ke `/login` |
| **Register email duplicate** | Register dengan email yang sudah ada | Tampil error "Email sudah terdaftar." |

---

## 📁 Struktur Folder Test

```
tests/
└── pos/
    ├── auth.spec.ts        # Login, logout, redirect
    ├── checkout.spec.ts    # Alur lengkap pesan → bayar
    ├── navigation.spec.ts  # Navigasi header
    └── register.spec.ts    # Register (opsional)
```

## ▶️ Cara Menjalankan

```bash
# Jalankan semua test
npx playwright test

# Jalankan file spesifik
npx playwright test tests/pos/auth.spec.ts

# Mode UI (visual debug)
npx playwright test --ui

# Mode headed (lihat browser)
npx playwright test --headed

# Lihat report HTML
npx playwright show-report
```

---

## 💡 Tips Playwright

| Tips | Command / Kode |
|------|---------------|
| **Record test** | `npx playwright codegen http://localhost:3000` |
| **Debug mode** | `npx playwright test --debug` |
| **Hanya 1 test** | `test.only(...)` |
| **Skip test** | `test.skip(...)` |
| **Screenshot** | `await page.screenshot({ path: 'screenshot.png' })` |
| **Trace** | Di config: `use: { trace: 'on-first-retry' }` |

> Selanjutnya bisa dieksplor sendiri: test register, test UI responsive, test API langsung, test dengan fixture custom, dsb.
