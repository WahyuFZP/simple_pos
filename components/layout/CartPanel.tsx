"use client";

import { useState, useRef } from "react";
import { ShoppingCart, Trash2, Printer, FileDown } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { CartItemRow } from "@/components/order/CartItem";
import { CheckoutForm } from "@/components/order/CheckoutForm";
import { Button } from "@/components/ui/Button";
import { useDownloadReceipt } from "@/components/receipt/useDownloadReceipt";
import type { CartItem, OrderItemSnapshot } from "@/types";

interface CartPanelProps {
  items: CartItem[];
  total: number;
  itemCount: number;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export function CartPanel({ items, total, itemCount, onUpdateQuantity, onRemoveItem, onClearCart }: CartPanelProps) {
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState<{ items: OrderItemSnapshot[]; total: number; payment: number; change: number; orderId: string; cashierName: string } | null>(null);
  const [error, setError] = useState("");
  const receiptRef = useRef<HTMLDivElement>(null);
  const { downloadReceipt } = useDownloadReceipt();

  const handleCheckout = async (paymentAmount: number) => {
    setLoading(true); setError("");
    try {
      const orderItems = items.map((i) => ({ menuId: i.menuItem.id, name: i.menuItem.name, quantity: i.quantity, price: i.menuItem.price }));
      const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: orderItems, total, paymentAmount, change: paymentAmount - total }) });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || "Gagal memproses pembayaran."); }
      const data = await res.json();
      setReceipt({ items: orderItems.map((item, idx) => ({ id: `item-${idx}`, name: item.name, quantity: item.quantity, price: item.price })), total, payment: paymentAmount, change: paymentAmount - total, orderId: data.orderId, cashierName: data.cashierName });
      onClearCart();
    } catch (err) { setError(err instanceof Error ? err.message : "Terjadi kesalahan."); }
    finally { setLoading(false); }
  };

  const handleNewOrder = () => { setReceipt(null); setError(""); };

  const handleDownloadPdf = async () => {
    if (!receipt) return;
    await downloadReceipt({
      storeName: "Simple POS",
      orderId: receipt.orderId,
      cashierName: receipt.cashierName,
      date: new Date().toLocaleString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      items: receipt.items,
      total: receipt.total,
      paymentAmount: receipt.payment,
      change: receipt.change,
    });
  };

  if (receipt) {
    return (
      <div className="flex flex-col h-full bg-white">
        <div ref={receiptRef} className="flex-1 flex flex-col items-center p-6 print-receipt">
          <div className="w-full max-w-75 text-center space-y-4">
            <div className="border-b-2 border-dashed border-[#E2DCD3] pb-4">
              <h2 className="font-display font-bold text-lg text-[#1A1A1A]">🍽️ Simple POS</h2>
              <p className="text-xs text-[#6B645C] mt-1">{new Date().toLocaleString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
              <p className="text-xs text-[#6B645C]">{receipt.orderId}</p>
            </div>
            <div className="space-y-2 text-sm">
              {receipt.items.map((item, i) => (<div key={i} className="flex justify-between"><span className="text-left">{item.name}<span className="text-[#6B645C] ml-1">x{item.quantity}</span></span><span className="font-utility text-right">Rp{formatNumber(item.price * item.quantity)}</span></div>))}
            </div>
            <div className="border-t border-dashed border-[#E2DCD3] pt-3 space-y-1 text-sm">
              <div className="flex justify-between font-medium"><span>Total</span><span className="font-utility">Rp{formatNumber(receipt.total)}</span></div>
              <div className="flex justify-between text-[#6B645C]"><span>Bayar</span><span className="font-utility">Rp{formatNumber(receipt.payment)}</span></div>
              <div className="flex justify-between font-bold"><span>Kembali</span><span className="font-utility text-[#2B7A4B]">Rp{formatNumber(receipt.change)}</span></div>
            </div>
            <div className="pt-4 text-xs text-[#6B645C]"><p>Terima kasih!</p><p>Simpan struk ini sebagai bukti pembayaran.</p></div>
          </div>
        </div>
        <div className="p-4 border-t border-[#E2DCD3] space-y-2">
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => window.print()}><Printer className="h-4 w-4" /> Cetak</Button>
            <Button variant="outline" className="flex-1" onClick={handleDownloadPdf}><FileDown className="h-4 w-4" /> PDF</Button>
          </div>
          <Button className="w-full" onClick={handleNewOrder}>Pesanan Baru</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2DCD3]">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-[#C73B2B]" />
          <h2 className="font-display font-bold text-[#1A1A1A]">Pesanan</h2>
          {itemCount > 0 && <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#C73B2B] text-white text-xs font-bold">{itemCount}</span>}
        </div>
        {items.length > 0 && <button onClick={onClearCart} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"><Trash2 className="h-3.5 w-3.5" /> Kosongkan</button>}
      </div>
      {error && <div className="mx-4 mt-3 px-3 py-2 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
      <div className="flex-1 overflow-y-auto px-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[#6B645C] gap-2"><ShoppingCart className="h-12 w-12 text-[#E2DCD3]" /><p className="font-medium">Keranjang kosong</p><p className="text-sm text-center">Klik menu untuk menambahkan pesanan</p></div>
        ) : items.map((item) => <CartItemRow key={item.menuItem.id} item={item} onUpdateQuantity={onUpdateQuantity} onRemove={onRemoveItem} />)}
      </div>
      {items.length > 0 && <div className="border-t border-[#E2DCD3] p-4"><CheckoutForm total={total} onSubmit={handleCheckout} loading={loading} /></div>}
    </div>
  );
}
