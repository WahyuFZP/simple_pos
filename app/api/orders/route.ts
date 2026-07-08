import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const { items, total, paymentAmount, change } = body;
    if (!items?.length || !total || !paymentAmount) return NextResponse.json({ error: "Data pesanan tidak lengkap." }, { status: 400 });
    const order = await prisma.order.create({
      data: { cashierId: session.user.id, total, paymentAmount, change,
        items: { create: items.map((item: { menuId: string; name: string; quantity: number; price: number }) => ({ menuId: item.menuId, name: item.name, quantity: item.quantity, price: item.price })) }
      }
    });
    return NextResponse.json({ orderId: `#${order.id.slice(0, 8).toUpperCase()}` }, { status: 201 });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "Gagal memproses pesanan." }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "history";

    if (type === "stats") {
      const today = new Date(); today.setHours(0, 0, 0, 0); const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
      const orders = await prisma.order.findMany({ where: { createdAt: { gte: today, lt: tomorrow } }, include: { items: true } });
      return NextResponse.json({ totalTransactions: orders.length, totalRevenue: orders.reduce((s, o) => s + o.total, 0), totalItemsSold: orders.reduce((s, o) => s + o.items.reduce((si, i) => si + i.quantity, 0), 0) });
    }

    const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 50, include: { items: true, cashier: { select: { name: true, email: true } } } });
    const formatted = orders.map((o) => ({ id: `#${o.id.slice(0, 8).toUpperCase()}`, items: o.items.map((i) => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price })), total: o.total, paymentAmount: o.paymentAmount, change: o.change, cashier: { name: o.cashier.name, email: o.cashier.email }, createdAt: o.createdAt.toISOString() }));
    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json({ error: "Gagal mengambil data." }, { status: 500 });
  }
}
