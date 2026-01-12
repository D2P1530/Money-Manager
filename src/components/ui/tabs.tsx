import { cn } from "@/lib/utils";

type TabsProps = {
  tabs: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
};

export function Tabs({ tabs, value, onChange }: TabsProps) {
  return (
    <div className="flex flex-wrap gap-2 rounded-2xl border border-white/60 bg-white/60 p-2 shadow-glass">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "rounded-2xl px-4 py-2 text-sm font-semibold transition",
            value === tab.value ? "bg-slate-900 text-white" : "text-slate-600"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
