import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type TabsProps = {
  tabs: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  "aria-label"?: string;
};

export function Tabs({ tabs, value, onChange, "aria-label": ariaLabel }: TabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    const activeIndex = tabs.findIndex((t) => t.value === value);
    const btn = buttonRefs.current[activeIndex];
    const container = containerRef.current;
    if (!btn || !container) return;
    const btnRect = btn.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    setIndicator({
      left: btnRect.left - containerRect.left - 2,
      width: btnRect.width,
    });
  }, [value, tabs]);

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
      className="relative inline-flex h-9 items-center gap-0.5 rounded border border-line bg-sunken p-0.5"
    >
      {indicator && (
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0.5 top-0.5 rounded-sm bg-ink transition-[left,width] duration-200 ease-out-quart"
          style={{ left: indicator.left, width: indicator.width }}
        />
      )}
      {tabs.map((tab, index) => {
        const active = value === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            ref={(el) => { buttonRefs.current[index] = el; }}
            onClick={() => onChange(tab.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              "relative z-10 h-full rounded-sm px-3 text-[13px] font-medium transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              active ? "text-paper" : "text-ink-soft hover:text-ink"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
