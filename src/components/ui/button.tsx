import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost" | "danger";
  size?: "md" | "sm";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 rounded font-medium transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-paper",
          "disabled:pointer-events-none disabled:opacity-50",
          size === "md" && "h-9 px-4 text-sm",
          size === "sm" && "h-7 px-2.5 text-xs",
          variant === "default" && "bg-ink text-paper hover:bg-ink/85 active:bg-ink",
          variant === "outline" &&
            "border border-line-strong bg-surface text-ink hover:bg-sunken active:bg-line/60",
          variant === "ghost" && "text-ink-soft hover:bg-sunken hover:text-ink active:bg-line/60",
          variant === "danger" &&
            "text-negative hover:bg-negative-soft active:bg-negative-soft/80",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
