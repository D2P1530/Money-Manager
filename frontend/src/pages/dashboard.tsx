import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Repeat, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Amount } from "@/components/ui/amount";
import { TransactionFormModal } from "@/components/ui/transaction-form-modal";
import { axisTick, chartColors, formatAxisValue, formatMonthAxis, tooltipStyle } from "@/lib/chart";
import { useFinanceData } from "@/data/use-finance-data";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

export function DashboardPage() {
  const navigate = useNavigate();
  const {
    transactions,
    dashboard,
    updateDashboard,
    totalDepenses,
    totalRevenus,
    soldeAttendu,
    difference,
  } = useFinanceData();
  const [soldeBanque, setSoldeBanque] = useState(dashboard.soldeBanque.toString());
  const [balanceError, setBalanceError] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState<"depense" | "revenu">("depense");

  const depensesParCategorie = useMemo(() => {
    const totaux = new Map<string, number>();
    transactions
      .filter((t) => t.type === "depense")
      .forEach((t) => totaux.set(t.categorie, (totaux.get(t.categorie) ?? 0) + t.montant));
    return Array.from(totaux.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const maxCategorie = depensesParCategorie[0]?.value ?? 0;

  const netMensuel = useMemo(() => {
    const mois = new Map<string, number>();
    transactions.forEach((t) => {
      const key = t.date.slice(0, 7);
      const delta = t.type === "revenu" ? t.montant : -t.montant;
      mois.set(key, (mois.get(key) ?? 0) + delta);
    });
    return Array.from(mois.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([mois, net]) => ({ mois, net }));
  }, [transactions]);

  const recentTransactions = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);

  const handleBankBalance = () => {
    const normalized = soldeBanque.replace(/'/g, "").replace(/\s/g, "").replace(/,/g, ".");
    const value = Number(normalized);
    if (!Number.isNaN(value)) {
      updateDashboard(value);
      setSoldeBanque(value.toString());
      setBalanceError(false);
    } else {
      setBalanceError(true);
    }
  };

  const ecartEquilibre = difference === 0;
  const ecartPositif = difference > 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Rapprochement : la ligne de vérité du journal */}
      <section
        aria-label="Rapprochement bancaire"
        className="grid overflow-hidden rounded-lg border border-line sm:grid-cols-3"
      >
        <div className="border-b border-line bg-surface p-6 sm:border-b-0 sm:border-r">
          <p className="text-[11px] font-medium text-ink-faint">Solde bancaire</p>
          <p className="mt-1.5 font-mono text-4xl font-semibold tabular-nums tracking-tight text-ink">
            {formatCurrency(dashboard.soldeBanque)}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <label htmlFor="solde-banque" className="sr-only">
              Mettre à jour le solde bancaire
            </label>
            <Input
              id="solde-banque"
              inputMode="decimal"
              className="h-8 max-w-[10rem] font-mono text-[13px]"
              value={soldeBanque}
              onChange={(event) => {
                setSoldeBanque(event.target.value);
                if (balanceError) setBalanceError(false);
              }}
              onBlur={handleBankBalance}
              onKeyDown={(event) => {
                if (event.key === "Enter") (event.target as HTMLInputElement).blur();
              }}
            />
            <span className="text-xs text-ink-faint">saisi manuellement</span>
          </div>
          {balanceError && (
            <p className="mt-1 text-xs text-negative">
              Format invalide — utilisez 1234.56
            </p>
          )}
        </div>

        <div className="border-b border-line bg-surface p-6 sm:border-b-0 sm:border-r">
          <p className="text-[11px] font-medium text-ink-faint">Solde attendu</p>
          <p className="mt-1.5 font-mono text-4xl font-semibold tabular-nums tracking-tight text-ink">
            {formatCurrency(soldeAttendu)}
          </p>
          <dl className="mt-4 space-y-1 text-[13px]">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-ink-soft">Revenus</dt>
              <dd>
                <Amount value={totalRevenus} tone="revenu" className="text-[13px]" />
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-ink-soft">Dépenses</dt>
              <dd>
                <Amount value={totalDepenses} tone="depense" className="text-[13px]" />
              </dd>
            </div>
          </dl>
        </div>

        {/* Écart — focal point sombre : le signal le plus critique du journal */}
        <div className="bg-ink p-6">
          <p className="text-[11px] font-medium text-paper/50">Écart</p>
          <p
            className={cn(
              "mt-1.5 font-mono text-4xl font-semibold tabular-nums tracking-tight",
              ecartEquilibre || ecartPositif ? "text-positive-soft" : "text-negative-soft"
            )}
          >
            {ecartEquilibre
              ? formatCurrency(0)
              : `${ecartPositif ? "+" : "−"}${formatCurrency(Math.abs(difference))}`}
          </p>
          <p className="mt-4 text-xs leading-relaxed text-paper/50">
            {ecartEquilibre
              ? "Aucun écart : le journal correspond au relevé bancaire."
              : "Un écart signale des opérations manquantes ou inconnues."}
          </p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Net mensuel</CardTitle>
            <CardDescription>Revenus moins dépenses, par mois.</CardDescription>
          </CardHeader>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={netMensuel} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                <XAxis
                  dataKey="mois"
                  tick={axisTick}
                  axisLine={{ stroke: chartColors.line }}
                  tickLine={false}
                  tickFormatter={formatMonthAxis}
                />
                <YAxis tick={axisTick} axisLine={false} tickLine={false} width={56} tickFormatter={formatAxisValue} />
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value)), "Net"]}
                  contentStyle={tooltipStyle}
                  cursor={{ fill: "rgba(26, 29, 41, 0.04)" }}
                />
                <Bar dataKey="net" fill={chartColors.accent} radius={[2, 2, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Dépenses par catégorie</CardTitle>
            <CardDescription>Classées de la plus lourde à la plus légère.</CardDescription>
          </CardHeader>
          {depensesParCategorie.length === 0 ? (
            <p className="text-sm text-ink-soft">Aucune dépense enregistrée pour l'instant.</p>
          ) : (
            <ol className="space-y-3">
              {depensesParCategorie.slice(0, 6).map((categorie, index) => (
                <li key={categorie.name}>
                  <div className="flex items-baseline justify-between gap-3 text-[13px]">
                    <span className="text-ink">{categorie.name}</span>
                    <span className="font-mono tabular-nums text-ink">
                      {formatCurrency(categorie.value)}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-sunken">
                    <div
                      className="bar-animate h-1.5 rounded-full bg-accent"
                      style={{
                        width: `${maxCategorie ? (categorie.value / maxCategorie) * 100 : 0}%`,
                        "--bar-i": index,
                      } as React.CSSProperties}
                    />
                  </div>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="overflow-x-hidden p-0 lg:col-span-2">
          <CardHeader className="border-b border-line px-5 pb-4 pt-5">
            <CardTitle>Transactions récentes</CardTitle>
            <CardDescription>Les six dernières opérations enregistrées.</CardDescription>
          </CardHeader>
          {recentTransactions.length === 0 ? (
            <p className="px-5 pb-5 text-sm text-ink-soft">
              Le journal est vide. Ajoutez votre première opération depuis la page Transactions.
            </p>
          ) : (
            <table className="w-full text-sm">
              <caption className="sr-only">Transactions récentes</caption>
              <tbody>
                {recentTransactions.map((transaction, index) => (
                  <tr
                    key={transaction.id}
                    className={cn(
                      "border-b border-line last:border-b-0",
                      index % 2 === 1 && "bg-sunken/50"
                    )}
                  >
                    <td className="hidden whitespace-nowrap py-2.5 pl-5 pr-3 font-mono text-xs tabular-nums text-ink-faint sm:table-cell">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="py-2.5 pl-5 pr-3 font-medium text-ink sm:pl-3">
                      {transaction.titre}
                      <span className="mt-0.5 block font-mono text-[11px] tabular-nums text-ink-faint sm:hidden">
                        {formatDate(transaction.date)}
                      </span>
                    </td>
                    <td className="hidden px-3 py-2.5 text-[13px] text-ink-soft sm:table-cell">
                      {transaction.categorie}
                    </td>
                    <td className="py-2.5 pl-3 pr-5 text-right">
                      <Amount
                        value={transaction.montant}
                        tone={transaction.type === "revenu" ? "revenu" : "depense"}
                        className="text-[13px]"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Saisie rapide</CardTitle>
            <CardDescription>Ouvre le formulaire pré-rempli sur la bonne page.</CardDescription>
          </CardHeader>
          <div className="space-y-2">
            <Button
              className="w-full"
              onClick={() => { setQuickAddType("depense"); setQuickAddOpen(true); }}
            >
              <TrendingDown className="h-4 w-4" aria-hidden />
              Ajouter une dépense
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => { setQuickAddType("revenu"); setQuickAddOpen(true); }}
            >
              <TrendingUp className="h-4 w-4" aria-hidden />
              Ajouter un revenu
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/subscriptions?ajouter=1")}
            >
              <Repeat className="h-4 w-4" aria-hidden />
              Enregistrer un abonnement
            </Button>
          </div>
        </Card>
      </div>

      <TransactionFormModal
        open={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        defaultType={quickAddType}
      />
    </div>
  );
}
