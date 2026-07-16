import { useState, useEffect, useMemo } from "react";
import { api } from "@/lib/api";
import type {
  Transaction,
  Subscription,
  RecurringPayment,
  Settings,
  DashboardState,
} from "@/data/types";

export function useFinanceData() {
  // État local (vide au départ)
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [recurringPayments, setRecurringPayments] = useState<
    RecurringPayment[]
  >([]);
  const [settings, setSettings] = useState<Settings>({
    soldeInitial: 0,
    devise: "CHF",
  });
  const [dashboard, setDashboard] = useState<DashboardState>({
    soldeBanque: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Chargement initial depuis l'API
  useEffect(() => {
    Promise.all([
      api.transactions.getAll(),
      api.subscriptions.getAll(),
      api.recurringPayments.getAll(),
      api.settings.get(),
      api.dashboard.get(),
    ])
      .then(([t, s, rp, st, d]) => {
        setTransactions(t);
        setSubscriptions(s);
        setRecurringPayments(rp);
        if (st) setSettings(st);
        if (d) setDashboard(d);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Calculs dérivés (inchangés)
  const totalRevenus = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "revenu")
        .reduce((acc, t) => acc + t.montant, 0),
    [transactions],
  );
  const totalDepenses = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "depense")
        .reduce((acc, t) => acc + t.montant, 0),
    [transactions],
  );
  const soldeAttendu = settings.soldeInitial + totalRevenus - totalDepenses;
  const difference = dashboard.soldeBanque - soldeAttendu;

  // Transactions
  const addTransaction = async (data: Omit<Transaction, "id">) => {
    const created = await api.transactions.create(data);
    setTransactions((prev) => [created, ...prev]);
  };
  const updateTransaction = async (id: string, data: Partial<Transaction>) => {
    const updated = await api.transactions.update(id, data);
    setTransactions((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };
  const deleteTransaction = async (id: string) => {
    await api.transactions.delete(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Subscriptions
  const addSubscription = async (data: Omit<Subscription, "id">) => {
    const created = await api.subscriptions.create(data);
    setSubscriptions((prev) => [...prev, created]);
  };
  const updateSubscription = async (
    id: string,
    data: Partial<Subscription>,
  ) => {
    const updated = await api.subscriptions.update(id, data);
    setSubscriptions((prev) => prev.map((s) => (s.id === id ? updated : s)));
  };
  const deleteSubscription = async (id: string) => {
    await api.subscriptions.delete(id);
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  };

  // Recurring payments
  const addRecurringPayment = async (data: Omit<RecurringPayment, "id">) => {
    const created = await api.recurringPayments.create(data);
    setRecurringPayments((prev) => [...prev, created]);
  };
  const updateRecurringPayment = async (
    id: string,
    data: Partial<RecurringPayment>,
  ) => {
    const updated = await api.recurringPayments.update(id, data);
    setRecurringPayments((prev) =>
      prev.map((r) => (r.id === id ? updated : r)),
    );
  };
  const deleteRecurringPayment = async (id: string) => {
    await api.recurringPayments.delete(id);
    setRecurringPayments((prev) => prev.filter((r) => r.id !== id));
  };

  // Settings
  const updateSettings = async (data: Partial<Settings>) => {
    const updated = await api.settings.update(data);
    setSettings(updated);
  };

  // Dashboard
  const updateDashboard = async (soldeBanque: number) => {
    const updated = await api.dashboard.update(soldeBanque);
    setDashboard(updated);
  };

  return {
    isLoading,
    transactions,
    subscriptions,
    recurringPayments,
    settings,
    dashboard,
    totalRevenus,
    totalDepenses,
    soldeAttendu,
    difference,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    addRecurringPayment,
    updateRecurringPayment,
    deleteRecurringPayment,
    updateSettings,
    updateDashboard,
  };
}
