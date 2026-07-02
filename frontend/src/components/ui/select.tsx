import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className={cn("relative", className)}>
        <select
          ref={ref}
          className={cn(
            "h-9 w-full appearance-none rounded border border-line-strong bg-surface pl-3 pr-8 text-sm text-ink",
            "transition-colors duration-150 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent",
            "disabled:cursor-not-allowed disabled:bg-sunken disabled:text-ink-faint"
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
        />
      </div>
    );
  }
);

Select.displayName = "Select";
