import { useMemo, useState } from "react";
import { Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar } from "recharts";
import { motion } from "framer-motion";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFinanceData } from "@/data/use-finance-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { categories } from "@/data/demo";

export function DashboardPage() {
  const {
    transactions,
    dashboard,
    setDashboard,
    totalDepenses,
    totalRevenus,
    soldeAttendu,
    difference,
  } = useFinanceData();
  const [soldeBanque, setSoldeBanque] = useState(dashboard.soldeBanque.toString());

  const depensesParCategorie = useMemo(() => {
    return categories.map((categorie) => {
      const total = transactions
        .filter((t) => t.type === "depense" && t.categorie === categorie)
        .reduce((acc, t) => acc + t.montant, 0);
      return { name: categorie, value: total };
    });
  }, [transactions]);

  const netMensuel = useMemo(() => {
    const mois = new Map<string, number>();
    transactions.forEach((t) => {
      const key = t.date.slice(0, 7);
      const current = mois.get(key) ?? 0;
      const delta = t.type === "revenu" ? t.montant : -t.montant;
      mois.set(key, current + delta);
    });
    return Array.from(mois.entries()).map(([mois, net]) => ({ mois, net }));
  }, [transactions]);

  const recentTransactions = [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  const handleBankBalance = () => {
    const value = Number(soldeBanque);
    if (!Number.isNaN(value)) {
      setDashboard({ soldeBanque: value });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Solde bancaire</CardDescription>
            <CardTitle className="text-3xl">{formatCurrency(dashboard.soldeBanque)}</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            <Input
              value={soldeBanque}
              onChange={(event) => setSoldeBanque(event.target.value)}
              onBlur={handleBankBalance}
              placeholder="Entrer le solde bancaire"
            />
            <p className="text-xs text-slate-500">Mis à jour manuellement.</p>
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Solde attendu</CardDescription>
            <CardTitle className="text-3xl">{formatCurrency(soldeAttendu)}</CardTitle>
          </CardHeader>
          <div className="space-y-2 text-sm text-slate-600">
            <p>Revenus : {formatCurrency(totalRevenus)}</p>
            <p>Dépenses : {formatCurrency(totalDepenses)}</p>
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Écart détecté</CardDescription>
            <CardTitle className={`text-3xl ${difference === 0 ? "text-emerald-500" : "text-rose-500"}`}>
              {formatCurrency(difference)}
            </CardTitle>
          </CardHeader>
          <p className="text-sm text-slate-500">
            {difference === 0
              ? "Aucun écart, tout est aligné."
              : "Un écart indique des dépenses manquantes ou inconnues."}
          </p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Net mensuel</CardTitle>
            <CardDescription>Revenus moins dépenses par mois.</CardDescription>
          </CardHeader>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={netMensuel}>
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="net" fill="#111827" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Dépenses par catégorie</CardTitle>
            <CardDescription>Vue synthétique des dépenses.</CardDescription>
          </CardHeader>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={depensesParCategorie} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80} fill="#0f172a" />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Transactions récentes</CardTitle>
            <CardDescription>Les dernières opérations enregistrées.</CardDescription>
          </CardHeader>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="glass-panel flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">{transaction.titre}</p>
                  <p className="text-xs text-slate-500">
                    {transaction.categorie} • {formatDate(transaction.date)}
                  </p>
                </div>
                <span className={transaction.type === "revenu" ? "text-emerald-500" : "text-rose-500"}>
                  {transaction.type === "revenu" ? "+" : "-"}
                  {formatCurrency(transaction.montant)}
                </span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>Ajoutez une entrée en un clic.</CardDescription>
          </CardHeader>
          <div className="space-y-3">
            <Button className="w-full">Ajouter une dépense</Button>
            <Button className="w-full" variant="outline">
              Ajouter un revenu
            </Button>
            <Button className="w-full" variant="ghost">
              Enregistrer un abonnement
            </Button>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-white/70 p-3 text-xs text-slate-500"
            >
              Les actions rapides ouvrent des formulaires dans les autres pages.
            </motion.div>
          </div>
        </Card>
      </div>
    </div>
  );
}
