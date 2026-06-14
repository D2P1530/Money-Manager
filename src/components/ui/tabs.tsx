import { cn } from "@/lib/utils";

type TabsProps = {
  tabs: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  "aria-label"?: string;
};

export function Tabs({ tabs, value, onChange, "aria-label": ariaLabel }: TabsProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="inline-flex h-9 items-center gap-0.5 rounded border border-line bg-sunken p-0.5"
    >
      {tabs.map((tab) => {
        const active = value === tab.value;
        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={cn(
              "h-full rounded-sm px-3 text-[13px] font-medium transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              active
                ? "bg-ink text-paper"
                : "text-ink-soft hover:text-ink"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
