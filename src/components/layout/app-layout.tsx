import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

const navItems = [
  { label: "Tableau de bord", to: "/dashboard" },
  { label: "Transactions", to: "/transactions" },
  { label: "Abonnements", to: "/subscriptions" },
  { label: "Analyses", to: "/analytics" },
  { label: "Paramètres", to: "/settings" },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { deconnexion } = useAuth();

  const handleLogout = () => {
    deconnexion();
    navigate("/login");
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 lg:px-8">
        <aside className="hidden w-64 flex-col gap-6 lg:flex">
          <div className="glass-card p-6">
            <div className="text-lg font-semibold">Journal privé</div>
            <p className="mt-1 text-sm text-slate-500">
              Vue d'ensemble des finances personnelles.
            </p>
          </div>
          <nav className="glass-card p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        "block rounded-2xl px-4 py-3 text-sm font-medium transition",
                        isActive
                          ? "bg-slate-900 text-white"
                          : "text-slate-600 hover:bg-white/70"
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <button
            onClick={handleLogout}
            className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-sm font-semibold text-slate-700 shadow-glass transition hover:-translate-y-0.5"
          >
            Se déconnecter
          </button>
        </aside>
        <div className="flex-1 space-y-6">
          <header className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Gestionnaire de budget</h1>
              <p className="text-sm text-slate-500">
                Maîtrisez votre trésorerie avec une vue claire et sereine.
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="hidden rounded-full border border-white/70 bg-white/60 px-4 py-2 text-xs text-slate-600 shadow-glass md:flex"
            >
              Journal privé • Confidentiel
            </motion.div>
          </header>
          <main>{children}</main>
        </div>
      </div>
      <nav className="fixed bottom-4 left-1/2 z-50 flex w-[90%] max-w-md -translate-x-1/2 items-center justify-between rounded-full border border-white/70 bg-white/80 px-4 py-3 shadow-glass backdrop-blur-xl lg:hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "rounded-full px-3 py-2 text-xs font-medium",
                isActive ? "bg-slate-900 text-white" : "text-slate-600"
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
