// lib/utils.ts

export function cn(...classes: (string | undefined | false | null | 0 | 0n | "")[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatRupiah(amount: number): string {
  return `Rp${amount.toLocaleString("id-ID")}`;
}

export function formatNumber(amount: number): string {
  return amount.toLocaleString("id-ID");
}
