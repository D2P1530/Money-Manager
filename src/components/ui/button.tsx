import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
};

export function Button({ className, variant = "default", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-2xl px-4 py-2 text-sm font-semibold transition",
        variant === "default" &&
          "bg-slate-900 text-white shadow-glass hover:-translate-y-0.5",
        variant === "outline" &&
          "border border-white/70 bg-white/70 text-slate-700 shadow-glass hover:bg-white",
        variant === "ghost" && "text-slate-600 hover:bg-white/60",
        className
      )}
      {...props}
    />
  );
}
