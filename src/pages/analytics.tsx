import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Amount } from "@/components/ui/amount";
import { axisTick, chartColors, tooltipStyle } from "@/lib/chart";
import { useFinanceData } from "@/data/use-finance-data";
import { formatCurrency } from "@/lib/utils";

export function AnalyticsPage() {
  const { transactions, subscriptions } = useFinanceData();

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

    return Array.from(mois.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([mois, values]) => ({ mois, ...values }));
  }, [transactions]);

  const depensesParCategorie = useMemo(() => {
    const totaux = new Map<string, number>();
    transactions
      .filter((t) => t.type === "depense")
      .forEach((t) => totaux.set(t.categorie, (totaux.get(t.categorie) ?? 0) + t.montant));
    return Array.from(totaux.entries())
      .map(([categorie, total]) => ({ categorie, total }))
      .sort((a, b) => b.total - a.total);
  }, [transactions]);

  const totalDepenses = useMemo(
    () => depensesParCategorie.reduce((acc, c) => acc + c.total, 0),
    [depensesParCategorie]
  );
  const topCategorie = depensesParCategorie[0];

  const abonnementsActifs = useMemo(() => subscriptions.filter((s) => s.actif), [subscriptions]);
  const chargeMensuelle = useMemo(
    () =>
      abonnementsActifs
        .filter((s) => s.periodicite === "mensuel")
        .reduce((acc, s) => acc + s.montant, 0),
    [abonnementsActifs]
  );

  const netMoyen = useMemo(() => {
    if (seriesMensuelle.length === 0) return 0;
    const total = seriesMensuelle.reduce((acc, m) => acc + m.revenu - m.depense, 0);
    return total / seriesMensuelle.length;
  }, [seriesMensuelle]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Flux mensuels</CardTitle>
            <CardDescription>Revenus et dépenses sur la période.</CardDescription>
          </CardHeader>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={seriesMensuelle} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                <XAxis
                  dataKey="mois"
                  tick={axisTick}
                  axisLine={{ stroke: chartColors.line }}
                  tickLine={false}
                />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} width={56} />
                <Tooltip
                  formatter={(value, name) => [
                    formatCurrency(Number(value)),
                    name === "revenu" ? "Revenus" : "Dépenses",
                  ]}
                  contentStyle={tooltipStyle}
                />
                <Area
                  type="monotone"
                  dataKey="revenu"
                  stroke={chartColors.positive}
                  strokeWidth={1.5}
                  fill={chartColors.positiveSoft}
                  dot={{ r: 3, strokeWidth: 0, fill: chartColors.positive }}
                />
                <Area
                  type="monotone"
                  dataKey="depense"
                  stroke={chartColors.negative}
                  strokeWidth={1.5}
                  fill={chartColors.negativeSoft}
                  dot={{ r: 3, strokeWidth: 0, fill: chartColors.negative }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Dépenses par catégorie</CardTitle>
            <CardDescription>Classement sur la période complète.</CardDescription>
          </CardHeader>
          <div className="h-72">
            {depensesParCategorie.length === 0 ? (
              <p className="text-sm text-ink-soft">Aucune dépense enregistrée.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={depensesParCategorie}
                  layout="vertical"
                  margin={{ top: 0, right: 8, bottom: 0, left: 8 }}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="categorie"
                    width={110}
                    tick={{ ...axisTick, fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value) => [formatCurrency(Number(value)), "Total"]}
                    contentStyle={tooltipStyle}
                    cursor={{ fill: "rgba(26, 29, 41, 0.04)" }}
                  />
                  <Bar dataKey="total" fill={chartColors.ink} radius={[0, 2, 2, 0]} maxBarSize={18} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      <section
        aria-label="Lecture rapide"
        className="grid divide-y divide-line rounded-md border border-line bg-surface sm:grid-cols-3 sm:divide-x sm:divide-y-0"
      >
        <div className="p-5">
          <p className="text-[13px] text-ink-soft">Catégorie la plus lourde</p>
          {topCategorie ? (
            <>
              <p className="mt-1 text-sm font-medium text-ink">{topCategorie.categorie}</p>
              <p className="font-mono text-lg font-semibold tabular-nums text-ink">
                {formatCurrency(topCategorie.total)}
              </p>
              <p className="mt-1 text-xs text-ink-faint">
                {totalDepenses > 0
                  ? `${Math.round((topCategorie.total / totalDepenses) * 100)} % des dépenses totales`
                  : ""}
              </p>
            </>
          ) : (
            <p className="mt-1 text-sm text-ink-soft">Aucune dépense enregistrée.</p>
          )}
        </div>
        <div className="p-5">
          <p className="text-[13px] text-ink-soft">Abonnements actifs</p>
          <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-ink">
            {abonnementsActifs.length}
          </p>
          <p className="mt-1 text-xs text-ink-faint">
            {formatCurrency(chargeMensuelle)} de charge mensuelle récurrente
          </p>
        </div>
        <div className="p-5">
          <p className="text-[13px] text-ink-soft">Net moyen mensuel</p>
          <p className="mt-1 font-mono text-lg font-semibold tabular-nums">
            <Amount value={netMoyen} tone="signed" className="text-lg" />
          </p>
          <p className="mt-1 text-xs text-ink-faint">
            Moyenne sur {seriesMensuelle.length} mois enregistré
            {seriesMensuelle.length > 1 ? "s" : ""}
          </p>
        </div>
      </section>
    </div>
  );
}
