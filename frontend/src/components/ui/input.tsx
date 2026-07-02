import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-9 w-full rounded border border-line-strong bg-surface px-3 text-sm text-ink",
          "placeholder:text-ink-faint",
          "transition-colors duration-150 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent",
          "disabled:cursor-not-allowed disabled:bg-sunken disabled:text-ink-faint",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
