import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!email || !password || password.length < 6) {
      return NextResponse.json({ error: "Email dan password minimal 6 karakter wajib diisi." }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "Email sudah terdaftar." }, { status: 400 });
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, password: hashed, role: "kasir" } });
    return NextResponse.json({ id: user.id, email: user.email, name: user.name }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Gagal mendaftar." }, { status: 500 });
  }
}
