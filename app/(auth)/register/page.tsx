"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Gagal mendaftar."); setLoading(false); return; }
      router.push("/login");
    } catch { setError("Terjadi kesalahan. Coba lagi."); setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F7F4]">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">🍽️ Simple POS</h1>
          <p className="text-[#6B645C] mt-2">Buat akun baru</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-[#E2DCD3] p-6 space-y-5">
          {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Nama</label>
            <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama lengkap" className="w-full px-4 py-2.5 border border-[#E2DCD3] rounded-lg bg-[#F9F7F4] text-[#1A1A1A] placeholder-[#6B645C] focus:outline-none focus:ring-2 focus:ring-[#C73B2B] focus:border-transparent transition" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Email</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className="w-full px-4 py-2.5 border border-[#E2DCD3] rounded-lg bg-[#F9F7F4] text-[#1A1A1A] placeholder-[#6B645C] focus:outline-none focus:ring-2 focus:ring-[#C73B2B] focus:border-transparent transition" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Password</label>
            <input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimal 6 karakter" className="w-full px-4 py-2.5 border border-[#E2DCD3] rounded-lg bg-[#F9F7F4] text-[#1A1A1A] placeholder-[#6B645C] focus:outline-none focus:ring-2 focus:ring-[#C73B2B] focus:border-transparent transition" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2.5 bg-[#C73B2B] text-white rounded-lg font-semibold hover:bg-[#A83225] transition disabled:opacity-50 cursor-pointer">{loading ? "Mendaftar..." : "Daftar"}</button>
          <p className="text-center text-sm text-[#6B645C]">Sudah punya akun? <Link href="/login" className="text-[#C73B2B] font-medium hover:underline">Masuk</Link></p>
        </form>
      </div>
    </div>
  );
}
