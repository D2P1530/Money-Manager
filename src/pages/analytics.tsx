import { useMemo } from "react";
import { ResponsiveContainer, AreaChart, Area, Tooltip, XAxis, YAxis, BarChart, Bar } from "recharts";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { categories } from "@/data/demo";
import { useFinanceData } from "@/data/use-finance-data";
import { formatCurrency } from "@/lib/utils";

export function AnalyticsPage() {
  const { transactions } = useFinanceData();

  const seriesMensuelle = useMemo(() => {
    const mois = new Map<string, { revenu: number; depense: number }>();
    transactions.forEach((t) => {
      const key = t.date.slice(0, 7);
      const current = mois.get(key) ?? { revenu: 0, depense: 0 };
      if (t.type === "revenu") {
        current.revenu += t.montant;
      } else {
        current.depense += t.montant;
      }
      mois.set(key, current);
    });

    return Array.from(mois.entries()).map(([mois, values]) => ({
      mois,
      ...values,
    }));
  }, [transactions]);

  const depensesParCategorie = useMemo(() => {
    return categories.map((categorie) => {
      const total = transactions
        .filter((t) => t.type === "depense" && t.categorie === categorie)
        .reduce((acc, t) => acc + t.montant, 0);
      return { categorie, total };
    });
  }, [transactions]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Flux mensuels</CardTitle>
            <CardDescription>Revenus et dépenses sur la période.</CardDescription>
          </CardHeader>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={seriesMensuelle}>
                <XAxis dataKey="mois" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Area type="monotone" dataKey="revenu" stroke="#10b981" fill="#a7f3d0" />
                <Area type="monotone" dataKey="depense" stroke="#f43f5e" fill="#fecdd3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Dépenses par catégorie</CardTitle>
            <CardDescription>Quelles catégories pèsent le plus.</CardDescription>
          </CardHeader>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={depensesParCategorie}>
                <XAxis dataKey="categorie" hide />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="total" fill="#0f172a" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lecture rapide</CardTitle>
          <CardDescription>Interprétation simplifiée pour un suivi quotidien.</CardDescription>
        </CardHeader>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="glass-panel p-4 text-sm text-slate-600">
            Les revenus restent stables, surveillez les catégories en hausse.
          </div>
          <div className="glass-panel p-4 text-sm text-slate-600">
            Les pics mensuels indiquent des abonnements ou dépenses exceptionnelles.
          </div>
          <div className="glass-panel p-4 text-sm text-slate-600">
            Ajustez vos plafonds de catégorie pour éviter les écarts.
          </div>
        </div>
      </Card>
    </div>
  );
}
