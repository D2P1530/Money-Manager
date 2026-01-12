import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-2 text-sm text-slate-800 shadow-glass outline-none transition focus:border-slate-300",
        className
      )}
      {...props}
    />
  );
}
