// tests/pos/checkout.spec.ts
// Test: Tambah item, atur qty, hapus item, checkout → struk

import { test, expect } from '@playwright/test';

test.describe('POS - Checkout Flow', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@simplepos.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/pos');
  });

  test('cart awalnya kosong', async ({ page }) => {
    await expect(page.locator('text=Keranjang kosong')).toBeVisible();
  });

  test('klik menu card → item masuk cart', async ({ page }) => {
    // Klik card menu pertama (Nasi Goreng)
    const firstCard = page.locator('button:has-text("Nasi Goreng")').first();
    await firstCard.click();

    // Item muncul di cart (nama menu ada di dua tempat: grid + cart)
    await expect(page.locator('text=Nasi Goreng').first()).toBeVisible();
    await expect(page.locator('text=Keranjang kosong')).not.toBeVisible();
  });

  test('atur quantity di cart dengan tombol + dan -', async ({ page }) => {
    // Tambah Nasi Goreng ke cart
    await page.locator('button:has-text("Nasi Goreng")').first().click();

    // Cari row cart yang mengandung "Nasi Goreng", lalu klik +
    const cartRow = page.locator('.flex.items-center.gap-3', { hasText: 'Nasi Goreng' });
    await cartRow.locator('button').nth(1).click(); // tombol +

    // Quantity harus jadi 2
    await expect(cartRow.locator('span:has-text("2")')).toBeVisible();

    // Klik - → kembali ke 1
    await cartRow.locator('button').nth(0).click(); // tombol -
    await expect(cartRow.locator('span:has-text("1")')).toBeVisible();
  });

  test('hapus item dari cart', async ({ page }) => {
    // Tambah Es Teh Manis
    await page.locator('button:has-text("Es Teh Manis")').first().click();
    await expect(page.locator('text=Keranjang kosong')).not.toBeVisible();

    // Klik tombol trash di row cart
    const cartRow = page.locator('.flex.items-center.gap-3', { hasText: 'Es Teh Manis' });
    await cartRow.locator('button svg.lucide-trash2').click();

    // Cart harus kosong lagi
    await expect(page.locator('text=Keranjang kosong')).toBeVisible();
  });

  test('tombol kosongkan menghapus semua item', async ({ page }) => {
    // Tambah dua item
    await page.locator('button:has-text("Nasi Goreng")').first().click();
    await page.locator('button:has-text("Es Jeruk")').first().click();

    // Klik "Kosongkan"
    await page.locator('button:has-text("Kosongkan")').click();

    await expect(page.locator('text=Keranjang kosong')).toBeVisible();
  });

  test('checkout — bayar & tampil struk sukses', async ({ page }) => {
    // Tambah item
    await page.locator('button:has-text("Nasi Goreng")').first().click();

    // Cek total muncul
    await expect(page.locator('text=Total')).toBeVisible();
    await expect(page.locator('text=Rp25.000')).toBeVisible();

    // Input bayar 30000
    await page.fill('input[placeholder="0"]', '30000');

    // Cek kembalian muncul
    await expect(page.locator('text=Kembalian')).toBeVisible();

    // Klik Bayar
    await page.click('button:has-text("💰 Bayar")');

    // Struk muncul
    await expect(page.locator('text=Terima kasih!')).toBeVisible();
    await expect(page.locator('text=Pesanan Baru')).toBeVisible();
  });

  test('checkout gagal — uang kurang', async ({ page }) => {
    await page.locator('button:has-text("Ayam Bakar")').first().click();
    // Total Ayam Bakar = 35000, input 10000
    await page.fill('input[placeholder="0"]', '10000');

    // Tombol bayar harus disabled
    const payBtn = page.locator('button:has-text("💰 Bayar")');
    await expect(payBtn).toBeDisabled();
  });
});
