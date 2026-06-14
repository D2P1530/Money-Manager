import { useMemo } from "react";
import { demoDashboard, demoRecurringPayments, demoSettings, demoSubscriptions, demoTransactions } from "@/data/demo";
import type { DashboardState, RecurringPayment, Settings, Subscription, Transaction } from "@/data/types";
import { useLocalStorage } from "@/lib/storage";

const TRANSACTIONS_KEY = "mm-transactions";
const SUBSCRIPTIONS_KEY = "mm-subscriptions";
const RECURRING_PAYMENTS_KEY = "mm-recurring-payments";
const SETTINGS_KEY = "mm-settings";
const DASHBOARD_KEY = "mm-dashboard";

export function useFinanceData() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(
    TRANSACTIONS_KEY,
    demoTransactions
  );
  const [subscriptions, setSubscriptions] = useLocalStorage<Subscription[]>(
    SUBSCRIPTIONS_KEY,
    demoSubscriptions
  );
  const [recurringPayments, setRecurringPayments] = useLocalStorage<RecurringPayment[]>(
    RECURRING_PAYMENTS_KEY,
    demoRecurringPayments
  );
  const [settings, setSettings] = useLocalStorage<Settings>(SETTINGS_KEY, demoSettings);
  const [dashboard, setDashboard] = useLocalStorage<DashboardState>(
    DASHBOARD_KEY,
    demoDashboard
  );

  const totalRevenus = useMemo(
    () => transactions.filter((t) => t.type === "revenu").reduce((acc, t) => acc + t.montant, 0),
    [transactions]
  );
  const totalDepenses = useMemo(
    () => transactions.filter((t) => t.type === "depense").reduce((acc, t) => acc + t.montant, 0),
    [transactions]
  );

  const soldeAttendu = settings.soldeInitial + totalRevenus - totalDepenses;
  const difference = dashboard.soldeBanque - soldeAttendu;

  return {
    transactions,
    setTransactions,
    subscriptions,
    setSubscriptions,
    recurringPayments,
    setRecurringPayments,
    settings,
    setSettings,
    dashboard,
    setDashboard,
    totalRevenus,
    totalDepenses,
    soldeAttendu,
    difference,
  };
}
