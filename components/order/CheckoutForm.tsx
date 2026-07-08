"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/utils";

interface CheckoutFormProps { total: number; onSubmit: (paymentAmount: number) => void; loading?: boolean; }

export function CheckoutForm({ total, onSubmit, loading }: CheckoutFormProps) {
  const [paymentStr, setPaymentStr] = useState("");
  const paymentAmount = parseInt(paymentStr.replace(/\D/g, "")) || 0;
  const change = paymentAmount - total;
  const isValid = paymentAmount >= total && paymentAmount > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between py-3 border-b border-[#E2DCD3]">
        <span className="text-sm font-medium text-[#6B645C]">Total</span>
        <span className="text-xl font-utility font-bold text-[#1A1A1A]">Rp{formatNumber(total)}</span>
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#1A1A1A]">Jumlah Bayar</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B645C] font-medium text-sm">Rp</span>
          <input type="text" inputMode="numeric" value={paymentStr} onChange={(e) => setPaymentStr(e.target.value.replace(/[^\d]/g, ""))} onKeyDown={(e) => { if (e.key === "Enter" && isValid && !loading) onSubmit(paymentAmount); }} placeholder="0" className="w-full pl-10 pr-4 py-2.5 border border-[#E2DCD3] rounded-lg bg-white font-utility text-lg font-medium text-[#1A1A1A] placeholder-[#E2DCD3] focus:outline-none focus:ring-2 focus:ring-[#C73B2B] focus:border-transparent transition" autoFocus />
        </div>
      </div>
      {paymentAmount > 0 && (
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-[#6B645C]">Kembalian</span>
          <span className={`text-lg font-utility font-bold ${change >= 0 ? "text-[#2B7A4B]" : "text-red-500"}`}>Rp{formatNumber(change >= 0 ? change : 0)}</span>
        </div>
      )}
      {change < 0 && paymentAmount > 0 && <p className="text-red-500 text-xs">Pembayaran kurang Rp{formatNumber(Math.abs(change))}</p>}
      <button onClick={() => onSubmit(paymentAmount)} disabled={!isValid || loading} className="w-full py-3 bg-[#2B7A4B] text-white rounded-xl font-bold text-base hover:bg-[#236840] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">{loading ? "Memproses..." : `💰 Bayar Rp${formatNumber(total)}`}</button>
    </div>
  );
}
