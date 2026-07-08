"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result?.error) { setError("Email atau password salah."); return; }
    router.push("/pos");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F7F4]">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">🍽️ Simple POS</h1>
          <p className="text-[#6B645C] mt-2">Masuk ke akun Anda</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-[#E2DCD3] p-6 space-y-5">
          {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Email</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className="w-full px-4 py-2.5 border border-[#E2DCD3] rounded-lg bg-[#F9F7F4] text-[#1A1A1A] placeholder-[#6B645C] focus:outline-none focus:ring-2 focus:ring-[#C73B2B] focus:border-transparent transition" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#1A1A1A] mb-1.5">Password</label>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-2.5 border border-[#E2DCD3] rounded-lg bg-[#F9F7F4] text-[#1A1A1A] placeholder-[#6B645C] focus:outline-none focus:ring-2 focus:ring-[#C73B2B] focus:border-transparent transition" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2.5 bg-[#C73B2B] text-white rounded-lg font-semibold hover:bg-[#A83225] transition disabled:opacity-50 cursor-pointer">{loading ? "Masuk..." : "Masuk"}</button>
          <p className="text-center text-sm text-[#6B645C]">Belum punya akun? <Link href="/register" className="text-[#C73B2B] font-medium hover:underline">Daftar</Link></p>
        </form>
      </div>
    </div>
  );
}
