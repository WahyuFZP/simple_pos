import { cn } from "../../lib/utils";

interface BadgeProps { children: React.ReactNode; variant?: "default" | "makanan" | "minuman" | "snack"; size?: "sm" | "md"; }

const variantStyles: Record<string, string> = { default: "bg-[#F0EDE8] text-[#1A1A1A]", makanan: "bg-amber-50 text-amber-700", minuman: "bg-sky-50 text-sky-700", snack: "bg-purple-50 text-purple-700" };
const sizeStyles: Record<string, string> = { sm: "px-2 py-0.5 text-xs", md: "px-3 py-1 text-sm" };

export function Badge({ children, variant = "default", size = "sm" }: BadgeProps) {
  return <span className={cn("inline-flex items-center font-medium rounded-full", variantStyles[variant], sizeStyles[size])}>{children}</span>;
}
