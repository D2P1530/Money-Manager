import { useMemo } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { axisTick, chartColors, tooltipStyle } from "@/lib/chart";
import { useFinanceData } from "@/data/use-finance-data";
import { cn, formatCurrency } from "@/lib/utils";

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
                  strokeWidth={2}
                  fill={chartColors.positiveSoft}
                  dot={{ r: 4, strokeWidth: 0, fill: chartColors.positive }}
                />
                <Area
                  type="monotone"
                  dataKey="depense"
                  stroke={chartColors.negative}
                  strokeWidth={2}
                  fill={chartColors.negativeSoft}
                  dot={{ r: 4, strokeWidth: 0, fill: chartColors.negative }}
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
          {depensesParCategorie.length === 0 ? (
            <p className="text-sm text-ink-soft">Aucune dépense enregistrée.</p>
          ) : (
            <ol className="space-y-4">
              {depensesParCategorie.map((cat) => (
                <li key={cat.categorie}>
                  <div className="flex items-baseline justify-between gap-3 text-[13px]">
                    <span className="font-medium text-ink">{cat.categorie}</span>
                    <div className="flex items-baseline gap-2 shrink-0">
                      <span className="font-mono tabular-nums text-ink">
                        {formatCurrency(cat.total)}
                      </span>
                      {totalDepenses > 0 && (
                        <span className="w-8 text-right text-[11px] text-ink-faint">
                          {Math.round((cat.total / totalDepenses) * 100)} %
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-1.5 h-2 rounded-full bg-sunken">
                    <div
                      className="h-2 rounded-full bg-accent"
                      style={{
                        width: `${depensesParCategorie[0]?.total ? (cat.total / depensesParCategorie[0].total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>

      <section
        aria-label="Lecture rapide"
        className="grid overflow-hidden rounded-lg border border-line bg-ink sm:grid-cols-3"
      >
        <div className="border-b border-paper/10 p-6 sm:border-b-0 sm:border-r">
          <p className="text-[11px] font-medium text-paper/45">Catégorie la plus lourde</p>
          {topCategorie ? (
            <>
              <p className="mt-1.5 font-mono text-4xl font-semibold tabular-nums text-paper">
                {formatCurrency(topCategorie.total)}
              </p>
              <p className="mt-1 text-xs text-paper/50">
                {topCategorie.categorie}
                {totalDepenses > 0
                  ? ` · ${Math.round((topCategorie.total / totalDepenses) * 100)} %`
                  : ""}
              </p>
            </>
          ) : (
            <p className="mt-1.5 text-sm text-paper/50">Aucune dépense enregistrée.</p>
          )}
        </div>
        <div className="border-b border-paper/10 p-6 sm:border-b-0 sm:border-r">
          <p className="text-[11px] font-medium text-paper/45">Abonnements actifs</p>
          <p className="mt-1.5 font-mono text-4xl font-semibold tabular-nums text-paper">
            {abonnementsActifs.length}
          </p>
          <p className="mt-1 text-xs text-paper/50">
            {formatCurrency(chargeMensuelle)} de charge mensuelle
          </p>
        </div>
        <div className="p-6">
          <p className="text-[11px] font-medium text-paper/45">Net moyen mensuel</p>
          <p
            className={cn(
              "mt-1.5 font-mono text-4xl font-semibold tabular-nums",
              netMoyen >= 0 ? "text-positive-soft" : "text-negative-soft"
            )}
          >
            {netMoyen === 0
              ? formatCurrency(0)
              : `${netMoyen > 0 ? "+" : "−"}${formatCurrency(Math.abs(netMoyen))}`}
          </p>
          <p className="mt-1 text-xs text-paper/50">
            Moyenne sur {seriesMensuelle.length} mois enregistré
            {seriesMensuelle.length > 1 ? "s" : ""}
          </p>
        </div>
      </section>
    </div>
  );
}
