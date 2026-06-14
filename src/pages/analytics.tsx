import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { axisTick, chartColors, formatAxisValue, formatMonthAxis, tooltipStyle } from "@/lib/chart";
import { useFinanceData } from "@/data/use-finance-data";
import { cn, formatCurrency } from "@/lib/utils";

type PeriodeFlux = "6" | "12" | "annee" | "tout";

export function AnalyticsPage() {
  const { transactions } = useFinanceData();
  const [periodeFlux, setPeriodeFlux] = useState<PeriodeFlux>("12");

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

  const netMoyen = useMemo(() => {
    if (seriesMensuelle.length === 0) return 0;
    const total = seriesMensuelle.reduce((acc, m) => acc + m.revenu - m.depense, 0);
    return total / seriesMensuelle.length;
  }, [seriesMensuelle]);

  const seriesMensuelleFiltree = useMemo(() => {
    if (periodeFlux === "tout") return seriesMensuelle;
    if (periodeFlux === "annee") {
      const annee = new Date().getFullYear().toString();
      return seriesMensuelle.filter((m) => m.mois.startsWith(annee));
    }
    return seriesMensuelle.slice(-Number(periodeFlux));
  }, [seriesMensuelle, periodeFlux]);

  const tendance = useMemo(() => {
    if (seriesMensuelle.length < 2) return null;
    const last = seriesMensuelle[seriesMensuelle.length - 1];
    const prev = seriesMensuelle[seriesMensuelle.length - 2];
    const lastNet = last.revenu - last.depense;
    const prevNet = prev.revenu - prev.depense;
    if (prevNet === 0) return null;
    return Math.round(((lastNet - prevNet) / Math.abs(prevNet)) * 100);
  }, [seriesMensuelle]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Orientation — top summary, read before the charts */}
      <section
        aria-label="Récapitulatif analytique"
        className={cn(
          "grid overflow-hidden rounded-lg border border-line bg-ink",
          tendance !== null ? "sm:grid-cols-3" : "sm:grid-cols-2"
        )}
      >
        <div className={cn("border-b border-paper/10 p-6 sm:border-b-0 sm:border-r")}>
          <p className="text-[11px] font-medium text-paper/50">Catégorie la plus lourde</p>
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

        <div className={cn("border-b border-paper/10 p-6 sm:border-b-0", tendance !== null && "sm:border-r")}>
          <p className="text-[11px] font-medium text-paper/50">Net moyen mensuel</p>
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

        {tendance !== null && (
          <div className="p-6">
            <p className="text-[11px] font-medium text-paper/50">Tendance — dernier mois</p>
            <p
              className={cn(
                "mt-1.5 font-mono text-4xl font-semibold tabular-nums",
                tendance >= 0 ? "text-positive-soft" : "text-negative-soft"
              )}
            >
              {tendance > 0 ? "+" : ""}{tendance} %
            </p>
            <p className="mt-1 text-xs text-paper/50">
              {tendance >= 0 ? "Hausse" : "Baisse"} du net vs mois précédent
            </p>
          </div>
        )}
      </section>

      {/* Charts — main analytical content */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="space-y-0.5">
              <CardTitle>Flux mensuels</CardTitle>
              <CardDescription>Revenus et dépenses sur la période sélectionnée.</CardDescription>
            </div>
            <label htmlFor="periode-flux" className="sr-only">Période du graphique</label>
            <Select
              id="periode-flux"
              className="w-36 shrink-0"
              value={periodeFlux}
              onChange={(e) => setPeriodeFlux(e.target.value as PeriodeFlux)}
            >
              <option value="6">6 mois</option>
              <option value="12">12 mois</option>
              <option value="annee">Cette année</option>
              <option value="tout">Tout</option>
            </Select>
          </div>
          <div>
            {seriesMensuelleFiltree.length === 0 ? (
              <div className="flex h-72 items-center justify-center text-sm text-ink-soft">
                Aucune donnée à afficher.
              </div>
            ) : (
              <>
                <div
                  className="h-72"
                  role="img"
                  aria-label="Graphique des flux mensuels : revenus (trait plein) et dépenses (trait pointillé) par mois"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={seriesMensuelleFiltree} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                      <XAxis
                        dataKey="mois"
                        tick={axisTick}
                        axisLine={{ stroke: chartColors.line }}
                        tickLine={false}
                        tickFormatter={formatMonthAxis}
                      />
                      <YAxis tick={axisTick} axisLine={false} tickLine={false} width={56} tickFormatter={formatAxisValue} />
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
                        strokeDasharray="5 3"
                        fill={chartColors.negativeSoft}
                        dot={{ r: 3, strokeWidth: 2, stroke: chartColors.negative, fill: "#fff" }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div
                  className="mt-3 flex items-center gap-5 font-mono text-[11px] text-ink-soft"
                  aria-hidden
                >
                  <span className="flex items-center gap-2">
                    <svg width="16" height="8" viewBox="0 0 16 8" fill="none">
                      <line x1="0" y1="4" x2="16" y2="4" stroke={chartColors.positive} strokeWidth="2" />
                    </svg>
                    Revenus
                  </span>
                  <span className="flex items-center gap-2">
                    <svg width="16" height="8" viewBox="0 0 16 8" fill="none">
                      <line x1="0" y1="4" x2="16" y2="4" stroke={chartColors.negative} strokeWidth="2" strokeDasharray="4 2" />
                    </svg>
                    Dépenses
                  </span>
                </div>
              </>
            )}
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
                    <div className="flex shrink-0 items-baseline gap-2">
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
                  <div className="mt-1.5 h-1.5 rounded-full bg-sunken">
                    <div
                      className="h-1.5 rounded-full bg-accent"
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
    </div>
  );
}
