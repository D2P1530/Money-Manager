import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeftRight,
  ChartLine,
  LayoutDashboard,
  LogOut,
  Repeat,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

const navItems = [
  { label: "Tableau de bord", to: "/dashboard", icon: LayoutDashboard },
  { label: "Transactions", to: "/transactions", icon: ArrowLeftRight },
  { label: "Abonnements", to: "/subscriptions", icon: Repeat },
  { label: "Analyses", to: "/analytics", icon: ChartLine },
  { label: "Paramètres", to: "/settings", icon: Settings },
];

const shortLabels: Record<string, string> = {
  "/dashboard": "Tableau",
  "/transactions": "Transactions",
  "/subscriptions": "Abonnements",
  "/analytics": "Analyses",
  "/settings": "Paramètres",
};

export function AppLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { deconnexion } = useAuth();

  const pageTitle =
    navItems.find((item) => location.pathname.startsWith(item.to))?.label ?? "Journal";
  const today = new Intl.DateTimeFormat("fr-CH", { dateStyle: "long" }).format(new Date());

  const handleLogout = () => {
    deconnexion();
    navigate("/login");
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[230px_1fr]">
      <aside className="hidden border-r border-line bg-sunken lg:flex lg:flex-col">
        <div className="sticky top-0 flex h-screen flex-col px-4 py-6">
          <div className="px-3">
            <p className="text-[15px] font-semibold tracking-tight text-ink">Journal financier</p>
            <p className="font-mono text-[11px] text-ink-faint">privé · local · fr-CH</p>
          </div>
          <nav aria-label="Navigation principale" className="mt-8 flex-1">
            <ul className="space-y-0.5">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2.5 rounded border px-3 py-2 text-sm transition-colors duration-150",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                        isActive
                          ? "border-line bg-surface font-medium text-ink"
                          : "border-transparent text-ink-soft hover:bg-surface/60 hover:text-ink"
                      )
                    }
                  >
                    <item.icon className="h-4 w-4 shrink-0 text-ink-faint" aria-hidden />
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 rounded border border-transparent px-3 py-2 text-sm text-ink-soft transition-colors duration-150 hover:bg-surface/60 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <LogOut className="h-4 w-4 text-ink-faint" aria-hidden />
            Se déconnecter
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="border-b border-line bg-surface">
          <div className="flex items-center justify-between px-4 py-4 lg:px-8">
            <div>
              <p className="text-[13px] font-semibold tracking-tight text-ink lg:hidden">
                Journal financier
              </p>
              <h1 className="text-lg font-semibold tracking-tight text-ink">{pageTitle}</h1>
            </div>
            <p className="hidden font-mono text-xs text-ink-faint sm:block">{today}</p>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 pb-24 lg:px-8 lg:pb-8">{children}</main>
      </div>

      <nav
        aria-label="Navigation principale"
        className="fixed inset-x-0 bottom-0 z-sticky border-t border-line bg-surface lg:hidden"
      >
        <ul className="flex">
          {navItems.map((item) => (
            <li key={item.to} className="flex-1">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center gap-1 px-1 pb-2.5 pt-2 text-[10px] font-medium transition-colors duration-150",
                    isActive ? "text-ink" : "text-ink-faint"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={cn("h-5 w-5", isActive ? "text-accent" : "text-ink-faint")}
                      aria-hidden
                    />
                    {shortLabels[item.to]}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
