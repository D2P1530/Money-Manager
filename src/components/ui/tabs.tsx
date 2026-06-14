import { useRef } from "react";
import { cn } from "@/lib/utils";

type TabsProps = {
  tabs: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  "aria-label"?: string;
};

export function Tabs({ tabs, value, onChange, "aria-label": ariaLabel }: TabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent, currentIndex: number) => {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = tabs.length - 1;
    }
    if (nextIndex !== null) {
      event.preventDefault();
      onChange(tabs[nextIndex].value);
      containerRef.current
        ?.querySelectorAll<HTMLButtonElement>("button")
        ?.[nextIndex]?.focus();
    }
  };

  return (
    <div
      ref={containerRef}
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex h-9 items-center gap-0.5 rounded border border-line bg-sunken p-0.5"
    >
      {tabs.map((tab, index) => {
        const active = value === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              "h-full rounded-sm px-3 text-[13px] font-medium transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              active ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
