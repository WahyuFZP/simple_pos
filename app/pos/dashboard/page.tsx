"use client";

import { useState, useEffect, useCallback } from "react";
import { formatRupiah } from "@/lib/utils";
import { BarChart3, ShoppingBag, Banknote, TrendingUp } from "lucide-react";
import type { DashboardStats } from "@/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try { const res = await fetch("/api/orders?type=stats"); if (res.ok) { const data = await res.json(); setStats(data); } } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-2 border-[#C73B2B] border-t-transparent rounded-full" /></div>;

  const cards = [
    { label: "Transaksi Hari Ini", value: stats?.totalTransactions ?? 0, icon: ShoppingBag, bg: "bg-amber-50", iconColor: "text-amber-600" },
    { label: "Pendapatan Hari Ini", value: formatRupiah(stats?.totalRevenue ?? 0), icon: Banknote, bg: "bg-emerald-50", iconColor: "text-emerald-600" },
    { label: "Item Terjual Hari Ini", value: stats?.totalItemsSold ?? 0, icon: TrendingUp, bg: "bg-sky-50", iconColor: "text-sky-600" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6"><BarChart3 className="h-6 w-6 text-[#C73B2B]" /><h1 className="font-display font-bold text-xl text-[#1A1A1A]">Dashboard</h1></div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card) => { const Icon = card.icon; return (
          <div key={card.label} className="bg-white border border-[#E2DCD3] rounded-xl p-5 flex items-start gap-4">
            <div className={`p-3 rounded-lg ${card.bg}`}><Icon className={`h-5 w-5 ${card.iconColor}`} /></div>
            <div><p className="text-sm text-[#6B645C]">{card.label}</p><p className="text-2xl font-utility font-bold text-[#1A1A1A] mt-0.5">{card.value}</p></div>
          </div>
        )})}
      </div>
    </div>
  );
}
