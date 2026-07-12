"use client";

import { useState, useEffect, useCallback } from "react";
import { formatRupiah, formatNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { History as HistoryIcon, ChevronDown, ChevronUp, FileDown } from "lucide-react";
import { useDownloadReceipt } from "@/components/receipt/useDownloadReceipt";
import type { OrderRecord } from "@/types";

export default function HistoryPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { downloadReceipt } = useDownloadReceipt();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try { const res = await fetch("/api/orders?type=history"); if (res.ok) { const data = await res.json(); setOrders(data); } } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleDownloadPdf = async (order: OrderRecord) => {
    await downloadReceipt({
      storeName: "Simple POS",
      orderId: order.id,
      cashierName: order.cashier.name,
      date: new Date(order.createdAt).toLocaleString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      items: order.items,
      total: order.total,
      paymentAmount: order.paymentAmount,
      change: order.change,
    });
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-2 border-[#C73B2B] border-t-transparent rounded-full" /></div>;

  if (orders.length === 0) return (
    <div className="flex flex-col items-center justify-center h-64 text-[#6B645C] gap-2">
      <HistoryIcon className="h-12 w-12 text-[#E2DCD3]" />
      <p className="font-medium">Belum ada transaksi</p>
      <p className="text-sm">Transaksi akan muncul di sini setelah checkout.</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <HistoryIcon className="h-6 w-6 text-[#C73B2B]" />
        <h1 className="font-display font-bold text-xl text-[#1A1A1A]">Riwayat Transaksi</h1>
      </div>
      <div className="space-y-2">
        {orders.map((order) => (
          <div key={order.id} className="border border-[#E2DCD3] rounded-lg overflow-hidden">
          <div 
              role="button"
              tabIndex={0}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#F9F7F4] transition cursor-pointer" 
              onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
              onKeyDown={(e) => {
                // Opsional: Memungkinkan user menekan Enter/Spasi untuk membuka accordion
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setExpandedId(expandedId === order.id ? null : order.id);
                }
              }}
            >

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleDownloadPdf(order); }}
                  className="p-1.5 rounded-lg hover:bg-[#F0EDE8] text-[#6B645C] hover:text-[#C73B2B] transition cursor-pointer"
                  title="Download PDF struk"
                >
                  <FileDown className="h-4 w-4" />
                </button>
                <span className="font-utility font-bold text-[#1A1A1A]">{formatRupiah(order.total)}</span>
                {expandedId === order.id ? <ChevronUp className="h-4 w-4 text-[#6B645C]" /> : <ChevronDown className="h-4 w-4 text-[#6B645C]" />}
              </div>
            

            {expandedId === order.id && (
              <div className="border-t border-[#E2DCD3] px-5 py-4 space-y-3 bg-[#F9F7F4]">
                <div className="space-y-2">
                  {order.items.map((item) => (<div key={item.id} className="flex justify-between text-sm"><span>{item.name}<span className="text-[#6B645C] ml-1">x{item.quantity}</span></span><span className="font-utility">Rp{formatNumber(item.price * item.quantity)}</span></div>))}
                </div>
                <div className="border-t border-[#E2DCD3] pt-3 space-y-1 text-sm">
                  <div className="flex justify-between text-[#6B645C]"><span>Kasir</span><span>{order.cashier.name}</span></div>
                  <div className="flex justify-between text-[#6B645C]"><span>Bayar</span><span className="font-utility">{formatRupiah(order.paymentAmount)}</span></div>
                  <div className="flex justify-between"><span>Kembali</span><span className="font-utility font-medium text-[#2B7A4B]">{formatRupiah(order.change)}</span></div>
                </div>
              </div>
            )}
          </div>
        
      </div>
      ))}
      </div>
    </div>
  );
}
