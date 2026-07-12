// prisma/seed.ts
// Seed data untuk Simple POS FnB

import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Bersihkan data lama yang corrupt ──────────
  // Hapus user dengan email "  " (bug dari seed sebelumnya)
  const corruptedUser = await prisma.user.findFirst({ where: { email: "  " } });
  if (corruptedUser) {
    await prisma.user.delete({ where: { id: corruptedUser.id } });
    console.log("  🧹 Cleaned up corrupted admin user (email was '  ')");
  }

  // ─── 1. Users ──────────────────────────────────
  const adminPassword = await bcrypt.hash("admin123", 10);
  const kasirPassword = await bcrypt.hash("kasir123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@simplepos.com" },
    update: { password: adminPassword },
    create: {
      name: "Admin",
      email: "admin@simplepos.com",
      password: adminPassword,
      role: "admin",
    },
  });
  console.log(`  ✅ Admin: ${admin.email} (pass: admin123)`);

  const kasir = await prisma.user.upsert({
    where: { email: "kasir@simplepos.com" },
    update: { password: kasirPassword },
    create: {
      name: "Kasir 1",
      email: "kasir@simplepos.com",
      password: kasirPassword,
      role: "kasir",
    },
  });
  console.log(`  ✅ Kasir: ${kasir.email} (pass: kasir123)`);

  // ─── 2. Menu Items ─────────────────────────────
  const menuItems = [
    { name: "Nasi Goreng", price: 25000, category: "makanan" },
    { name: "Mie Goreng", price: 20000, category: "makanan" },
    { name: "Ayam Bakar", price: 35000, category: "makanan" },
    { name: "Soto Ayam", price: 22000, category: "makanan" },
    { name: "Nasi Uduk", price: 18000, category: "makanan" },
    { name: "Gado-gado", price: 15000, category: "makanan" },
    { name: "Sate Ayam", price: 28000, category: "makanan" },
    { name: "Ayam Goreng", price: 20000, category: "makanan" },
    { name: "Es Teh Manis", price: 5000, category: "minuman" },
    { name: "Es Jeruk", price: 7000, category: "minuman" },
    { name: "Kopi Hitam", price: 8000, category: "minuman" },
    { name: "Teh Hangat", price: 4000, category: "minuman" },
    { name: "Jus Alpukat", price: 15000, category: "minuman" },
    { name: "Jus Mangga", price: 12000, category: "minuman" },
    { name: "Es Campur", price: 10000, category: "minuman" },
    { name: "Soda Gembira", price: 12000, category: "minuman" },
    { name: "Pisang Goreng", price: 10000, category: "snack" },
    { name: "Kentang Goreng", price: 15000, category: "snack" },
    { name: "Tahu Crispy", price: 8000, category: "snack" },
    { name: "Roti Bakar", price: 12000, category: "snack" },
    { name: "Pukis", price: 10000, category: "snack" },
    { name: "Martabak Mini", price: 15000, category: "snack" },
  ];

  // Hapus data lama dulu agar idempotent (urutan penting karena foreign key)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  for (const item of menuItems) {
    await prisma.menuItem.create({ data: item });
  }
  console.log(`  ✅ ${menuItems.length} menu items created`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
