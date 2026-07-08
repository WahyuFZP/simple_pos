"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { LayoutGrid, History, BarChart3, LogOut, ChevronDown, Menu as MenuIcon, X } from "lucide-react";

interface HeaderProps { user: { name?: string | null; email?: string | null; role?: string }; }

const navItems = [
  { href: "/pos", label: "Menu", icon: LayoutGrid },
  { href: "/pos/history", label: "Riwayat", icon: History },
  { href: "/pos/dashboard", label: "Dashboard", icon: BarChart3 },
];

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E2DCD3]">
      <div className="flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-8">
          <Link href="/pos" className="font-display font-bold text-lg text-[#1A1A1A] tracking-tight">🍽️ POS</Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => { const Icon = item.icon; const isActive = pathname === item.href; return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${isActive ? "bg-[#F0EDE8] text-[#1A1A1A]" : "text-[#6B645C] hover:bg-[#F9F7F4] hover:text-[#1A1A1A]"}`}><Icon className="h-4 w-4" />{item.label}</Link>
            )})}
          </nav>
        </div>
        <button className="md:hidden p-2 rounded-lg text-[#6B645C] hover:bg-[#F0EDE8]" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}</button>
        <div className="hidden md:flex items-center gap-3">
          <div className="relative">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#1A1A1A] hover:bg-[#F0EDE8] transition cursor-pointer" onClick={() => setUserMenuOpen(!userMenuOpen)}>
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#F0EDE8] text-xs font-bold text-[#C73B2B]">{user.name?.charAt(0) ?? "?"}</div>
              <span className="max-w-[120px] truncate">{user.name ?? user.email}</span>
              <ChevronDown className="h-3.5 w-3.5 text-[#6B645C]" />
            </button>
            {userMenuOpen && (<>
              <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-[#E2DCD3] rounded-lg shadow-lg z-50 py-1">
                <div className="px-4 py-2 border-b border-[#E2DCD3]">
                  <p className="text-sm font-medium text-[#1A1A1A]">{user.name}</p>
                  <p className="text-xs text-[#6B645C]">{user.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-[#F0EDE8] text-[#6B645C] capitalize">{user.role ?? "kasir"}</span>
                </div>
                <button onClick={() => signOut({ callbackUrl: "/login" })} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition cursor-pointer"><LogOut className="h-4 w-4" />Keluar</button>
              </div>
            </>)}
          </div>
        </div>
      </div>
      {menuOpen && (
        <nav className="md:hidden border-t border-[#E2DCD3] bg-white px-4 py-2 flex flex-col gap-1">
          {navItems.map((item) => { const Icon = item.icon; const isActive = pathname === item.href; return (
            <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium ${isActive ? "bg-[#F0EDE8] text-[#1A1A1A]" : "text-[#6B645C]"}`}><Icon className="h-4 w-4" />{item.label}</Link>
          )})}
          <hr className="my-1 border-[#E2DCD3]" />
          <div className="flex items-center justify-between px-3 py-2">
            <div><p className="text-sm font-medium">{user.name}</p><p className="text-xs text-[#6B645C]">{user.email}</p></div>
            <button onClick={() => signOut({ callbackUrl: "/login" })} className="text-red-600 p-1.5 rounded-lg hover:bg-red-50 cursor-pointer"><LogOut className="h-4 w-4" /></button>
          </div>
        </nav>
      )}
    </header>
  );
}
