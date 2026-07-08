import { cn } from "../../lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function Button({ variant = "primary", size = "md", loading, className, children, disabled, ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-[#C73B2B] text-white hover:bg-[#A83225] focus:ring-[#C73B2B]",
    secondary: "bg-[#F0EDE8] text-[#1A1A1A] hover:bg-[#E2DCD3] focus:ring-[#E2DCD3]",
    outline: "border border-[#E2DCD3] bg-white text-[#1A1A1A] hover:bg-[#F9F7F4] focus:ring-[#C73B2B]",
    ghost: "bg-transparent text-[#6B645C] hover:bg-[#F0EDE8] focus:ring-[#E2DCD3]",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };
  const sizes: Record<string, string> = { sm: "px-3 py-1.5 text-sm gap-1.5", md: "px-4 py-2.5 text-sm gap-2", lg: "px-6 py-3 text-base gap-2" };
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} disabled={disabled || loading} {...props}>
      {loading && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
      {children}
    </button>
  );
}
