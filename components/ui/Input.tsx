import { cn } from "../../lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, icon, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B645C]">{icon}</div>}
        <input className={cn("w-full px-4 py-2.5 border rounded-lg bg-[#F9F7F4] text-[#1A1A1A] placeholder-[#6B645C] focus:outline-none focus:ring-2 focus:ring-[#C73B2B] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed", icon ? "pl-10" : undefined, error ? "border-red-500 focus:ring-red-500" : "border-[#E2DCD3]", className)} {...props} />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
