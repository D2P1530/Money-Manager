import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Field } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { Amount } from "@/components/ui/amount";
import { categories } from "@/data/demo";
import { useFinanceData } from "@/data/use-finance-data";
import type { RecurringPayment, Subscription } from "@/data/types";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

const today = () => new Date().toISOString().slice(0, 10);

const subSchema = z.object({
  nom: z.string().min(2, "Nom requis"),
  categorie: z.string().min(2, "Catégorie requise"),
  montant: z.coerce.number().positive("Montant requis"),
  periodicite: z.enum(["mensuel", "annuel"]),
  prochainPaiement: z.string().min(1, "Date requise"),
});

const recurringSchema = z.object({
  nom: z.string().min(2, "Nom requis"),
  categorie: z.string().min(2, "Catégorie requise"),
  montant: z.coerce.number().positive("Montant requis"),
  type: z.enum(["revenu", "depense"]),
  periodicite: z.enum(["mensuel", "annuel"]),
  prochainPaiement: z.string().min(1, "Date requise"),
});

type SubFormValues = z.infer<typeof subSchema>;
type RecurringFormValues = z.infer<typeof recurringSchema>;

export function SubscriptionsPage() {
  const { subscriptions, setSubscriptions, recurringPayments, setRecurringPayments } =
    useFinanceData();
  const [searchParams, setSearchParams] = useSearchParams();

  const [subModalOpen, setSubModalOpen] = useState(false);
  const [recurringModalOpen, setRecurringModalOpen] = useState(false);
  const [deleteRecurringTarget, setDeleteRecurringTarget] = useState<RecurringPayment | null>(null);

  const subForm = useForm<SubFormValues>({
    resolver: zodResolver(subSchema),
    defaultValues: { periodicite: "mensuel" },
  });

  const recurringForm = useForm<RecurringFormValues>({
    resolver: zodResolver(recurringSchema),
    defaultValues: { type: "depense", periodicite: "mensuel", prochainPaiement: today() },
  });

  // Quick action from dashboard: ?ajouter=1
  useEffect(() => {
    if (searchParams.get("ajouter")) {
      setSubModalOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // ── Subscriptions ──────────────────────────────────────────────────────
  const actives = useMemo(() => subscriptions.filter((s) => s.actif), [subscriptions]);
  const inactives = useMemo(() => subscriptions.filter((s) => !s.actif), [subscriptions]);

  const totalMensuel = useMemo(
    () => actives.filter((s) => s.periodicite === "mensuel").reduce((acc, s) => acc + s.montant, 0),
    [actives]
  );
  const totalAnnuel = useMemo(
    () => actives.filter((s) => s.periodicite === "annuel").reduce((acc, s) => acc + s.montant, 0),
    [actives]
  );

  const onSubSubmit = (data: SubFormValues) => {
    const nouvelle: Subscription = {
      id: crypto.randomUUID(),
      nom: data.nom,
      categorie: data.categorie,
      montant: data.montant,
      periodicite: data.periodicite,
      prochainPaiement: data.prochainPaiement,
      actif: true,
    };
    setSubscriptions([nouvelle, ...subscriptions]);
    subForm.reset({ periodicite: "mensuel" });
    setSubModalOpen(false);
  };

  const toggleSubscription = (id: string) => {
    setSubscriptions(subscriptions.map((s) => (s.id === id ? { ...s, actif: !s.actif } : s)));
  };

  // ── Recurring payments ─────────────────────────────────────────────────
  const revenusMensuels = useMemo(
    () =>
      recurringPayments
        .filter((p) => p.type === "revenu" && p.periodicite === "mensuel")
        .reduce((acc, p) => acc + p.montant, 0),
    [recurringPayments]
  );
  const depensesMensuelles = useMemo(
    () =>
      recurringPayments
        .filter((p) => p.type === "depense" && p.periodicite === "mensuel")
        .reduce((acc, p) => acc + p.montant, 0),
    [recurringPayments]
  );
  const netMensuel = revenusMensuels - depensesMensuelles;

  const netAnnuel = useMemo(
    () =>
      recurringPayments
        .filter((p) => p.periodicite === "annuel")
        .reduce((acc, p) => acc + (p.type === "revenu" ? p.montant : -p.montant), 0),
    [recurringPayments]
  );
  const hasAnnuel = recurringPayments.some((p) => p.periodicite === "annuel");

  const onRecurringSubmit = (data: RecurringFormValues) => {
    const nouveau: RecurringPayment = {
      id: crypto.randomUUID(),
      nom: data.nom,
      categorie: data.categorie,
      montant: data.montant,
      type: data.type,
      periodicite: data.periodicite,
      prochainPaiement: data.prochainPaiement,
    };
    setRecurringPayments([nouveau, ...recurringPayments]);
    recurringForm.reset({ type: "depense", periodicite: "mensuel", prochainPaiement: today() });
    setRecurringModalOpen(false);
  };

  const confirmDeleteRecurring = () => {
    if (!deleteRecurringTarget) return;
    setRecurringPayments(recurringPayments.filter((p) => p.id !== deleteRecurringTarget.id));
    setDeleteRecurringTarget(null);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-12">

      {/* ── Section 1 : Abonnements ───────────────────────────────────── */}
      <section aria-labelledby="heading-abonnements">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2
              id="heading-abonnements"
              className="text-[15px] font-semibold tracking-tight text-ink"
            >
              Abonnements
            </h2>
            <p className="mt-0.5 text-[13px] text-ink-soft">
              Services et plateformes facturés automatiquement.
            </p>
          </div>
          <Button onClick={() => setSubModalOpen(true)} className="shrink-0 self-start">
            <Plus className="h-4 w-4" aria-hidden />
            Ajouter un abonnement
          </Button>
        </div>

        <section
          aria-label="Récapitulatif des abonnements"
          className={cn(
            "mb-5 grid overflow-hidden rounded-lg border border-line bg-ink",
            totalAnnuel > 0 ? "sm:grid-cols-3" : "sm:grid-cols-2"
          )}
        >
          <div className="border-b border-paper/10 p-6 sm:border-b-0 sm:border-r">
            <p className="text-[11px] font-medium text-paper/50">Abonnements actifs</p>
            <p className="mt-1.5 font-mono text-4xl font-semibold tabular-nums text-paper">
              {actives.length}
            </p>
          </div>
          <div
            className={cn(
              "p-6",
              totalAnnuel > 0 && "border-b border-paper/10 sm:border-b-0 sm:border-r"
            )}
          >
            <p className="text-[11px] font-medium text-paper/50">Charge mensuelle</p>
            <p className="mt-1.5 font-mono text-4xl font-semibold tabular-nums text-paper">
              {formatCurrency(totalMensuel)}
            </p>
          </div>
          {totalAnnuel > 0 && (
            <div className="p-6">
              <p className="text-[11px] font-medium text-paper/50">Charge annuelle</p>
              <p className="mt-1.5 font-mono text-4xl font-semibold tabular-nums text-paper">
                {formatCurrency(totalAnnuel)}
              </p>
            </div>
          )}
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="overflow-hidden p-0">
            <CardHeader className="border-b border-line px-5 pb-4 pt-5">
              <CardTitle>Actifs</CardTitle>
              <CardDescription>Prélevés à chaque échéance.</CardDescription>
            </CardHeader>
            {actives.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-ink-soft">
                Aucun abonnement actif. Ajoutez-en un pour suivre vos charges récurrentes.
              </p>
            ) : (
              <ul className="divide-y divide-line">
                {actives.map((subscription) => (
                  <li
                    key={subscription.id}
                    className="flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{subscription.nom}</p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-ink-soft">
                        <span className="rounded-sm bg-sunken px-1.5 py-0.5 font-medium">
                          {subscription.categorie}
                        </span>
                        <span className="whitespace-nowrap font-mono tabular-nums">
                          {formatDate(subscription.prochainPaiement)}
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <div className="text-right">
                        <span className="font-mono text-base font-semibold tabular-nums text-ink">
                          {formatCurrency(subscription.montant)}
                        </span>
                        <span className="ml-1.5 text-[11px] text-ink-faint">
                          {subscription.periodicite === "mensuel" ? "/ mois" : "/ an"}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-pressed={subscription.actif}
                        onClick={() => toggleSubscription(subscription.id)}
                      >
                        Suspendre
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="overflow-hidden p-0">
            <CardHeader className="border-b border-line px-5 pb-4 pt-5">
              <CardTitle>Suspendus</CardTitle>
              <CardDescription>Conservés pour mémoire, sans dépense générée.</CardDescription>
            </CardHeader>
            {inactives.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-ink-soft">
                Aucun abonnement suspendu.
              </p>
            ) : (
              <ul className="divide-y divide-line">
                {inactives.map((subscription) => (
                  <li
                    key={subscription.id}
                    className="flex items-center justify-between gap-4 px-5 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink-soft">
                        {subscription.nom}
                      </p>
                      <p className="text-xs text-ink-faint">
                        Dernier paiement le{" "}
                        <span className="font-mono tabular-nums">
                          {formatDate(subscription.prochainPaiement)}
                        </span>
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="font-mono text-[13px] tabular-nums text-ink-faint">
                        {formatCurrency(subscription.montant)}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleSubscription(subscription.id)}
                      >
                        Réactiver
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </section>

      {/* ── Section 2 : Autres paiements récurrents ───────────────────── */}
      <section aria-labelledby="heading-recurrents">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2
              id="heading-recurrents"
              className="text-[15px] font-semibold tracking-tight text-ink"
            >
              Autres paiements récurrents
            </h2>
            <p className="mt-0.5 text-[13px] text-ink-soft">
              Loyer, salaire, remboursements — revenus et charges à périodicité fixe.
            </p>
          </div>
          <Button
            onClick={() => setRecurringModalOpen(true)}
            variant="outline"
            className="shrink-0 self-start"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Ajouter
          </Button>
        </div>

        {recurringPayments.length > 0 && (
          <div
            className={cn(
              "mb-5 grid overflow-hidden rounded-lg border border-line",
              hasAnnuel ? "sm:grid-cols-3" : "sm:grid-cols-2"
            )}
          >
            <div className="border-b border-line bg-surface p-5 sm:border-b-0 sm:border-r">
              <p className="text-[11px] font-medium text-ink-faint">Flux enregistrés</p>
              <p className="mt-1.5 font-mono text-3xl font-semibold tabular-nums text-ink">
                {recurringPayments.length}
              </p>
            </div>
            <div
              className={cn(
                "bg-surface p-5",
                hasAnnuel && "border-b border-line sm:border-b-0 sm:border-r"
              )}
            >
              <p className="text-[11px] font-medium text-ink-faint">Net mensuel</p>
              <p
                className={cn(
                  "mt-1.5 font-mono text-3xl font-semibold tabular-nums",
                  netMensuel >= 0 ? "text-positive" : "text-negative"
                )}
              >
                {netMensuel === 0
                  ? formatCurrency(0)
                  : `${netMensuel > 0 ? "+" : "−"}${formatCurrency(Math.abs(netMensuel))}`}
              </p>
              <p className="mt-0.5 text-[11px] text-ink-faint">revenus − dépenses / mois</p>
            </div>
            {hasAnnuel && (
              <div className="bg-surface p-5">
                <p className="text-[11px] font-medium text-ink-faint">Net annuel</p>
                <p
                  className={cn(
                    "mt-1.5 font-mono text-3xl font-semibold tabular-nums",
                    netAnnuel >= 0 ? "text-positive" : "text-negative"
                  )}
                >
                  {netAnnuel === 0
                    ? formatCurrency(0)
                    : `${netAnnuel > 0 ? "+" : "−"}${formatCurrency(Math.abs(netAnnuel))}`}
                </p>
                <p className="mt-0.5 text-[11px] text-ink-faint">flux à periodicité annuelle</p>
              </div>
            )}
          </div>
        )}

        <Card className="overflow-hidden p-0">
          {recurringPayments.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="text-sm text-ink-soft">Aucun paiement récurrent enregistré.</p>
              <button
                className="mt-2 text-xs text-accent underline underline-offset-2 hover:opacity-80"
                onClick={() => setRecurringModalOpen(true)}
              >
                Ajouter le premier
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {recurringPayments.map((payment) => (
                <li
                  key={payment.id}
                  className="flex items-center justify-between gap-4 px-5 py-4"
                >
                  <div className="min-w-0 flex items-start gap-2.5">
                    <span
                      aria-hidden
                      className={cn(
                        "mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full",
                        payment.type === "revenu" ? "bg-positive" : "bg-negative"
                      )}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{payment.nom}</p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-ink-soft">
                        <span className="rounded-sm bg-sunken px-1.5 py-0.5 font-medium">
                          {payment.categorie}
                        </span>
                        <span className="whitespace-nowrap font-mono tabular-nums">
                          {formatDate(payment.prochainPaiement)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <div className="text-right">
                      <Amount
                        value={payment.montant}
                        tone={payment.type === "revenu" ? "revenu" : "depense"}
                        className="text-base font-semibold"
                      />
                      <span className="ml-1.5 text-[11px] text-ink-faint">
                        {payment.periodicite === "mensuel" ? "/ mois" : "/ an"}
                      </span>
                    </div>
                    <button
                      type="button"
                      aria-label={`Supprimer ${payment.nom}`}
                      className="flex h-11 w-11 items-center justify-center rounded text-ink-faint transition-colors hover:bg-negative/10 hover:text-negative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      onClick={() => setDeleteRecurringTarget(payment)}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      {/* ── Modals ────────────────────────────────────────────────────── */}

      {/* Delete recurring payment */}
      <Modal
        open={deleteRecurringTarget !== null}
        onClose={() => setDeleteRecurringTarget(null)}
        title="Supprimer le paiement récurrent"
      >
        <p className="text-[13px] text-ink-soft">
          Supprimer ce paiement récurrent ? Cette opération est irréversible.
        </p>
        {deleteRecurringTarget && (
          <div className="mt-3 rounded border border-line bg-sunken px-4 py-3 text-[13px]">
            <p className="font-medium text-ink">{deleteRecurringTarget.nom}</p>
            <p className="mt-0.5 font-mono tabular-nums text-ink-soft">
              {formatCurrency(deleteRecurringTarget.montant)}
              {" · "}
              {deleteRecurringTarget.periodicite === "mensuel" ? "/ mois" : "/ an"}
              {" · "}
              {formatDate(deleteRecurringTarget.prochainPaiement)}
            </p>
          </div>
        )}
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDeleteRecurringTarget(null)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={confirmDeleteRecurring}>
            Supprimer
          </Button>
        </div>
      </Modal>

      {/* New recurring payment */}
      <Modal
        open={recurringModalOpen}
        onClose={() => setRecurringModalOpen(false)}
        title="Nouveau paiement récurrent"
      >
        <form className="space-y-4" onSubmit={recurringForm.handleSubmit(onRecurringSubmit)}>
          <Field label="Nom" error={recurringForm.formState.errors.nom?.message}>
            {(fieldProps) => (
              <Input
                {...fieldProps}
                autoFocus
                placeholder="Ex. : Loyer, Salaire…"
                {...recurringForm.register("nom")}
              />
            )}
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Type">
              {(fieldProps) => (
                <Select {...fieldProps} {...recurringForm.register("type")}>
                  <option value="depense">Dépense</option>
                  <option value="revenu">Revenu</option>
                </Select>
              )}
            </Field>
            <Field label="Catégorie" error={recurringForm.formState.errors.categorie?.message}>
              {(fieldProps) => (
                <Select {...fieldProps} {...recurringForm.register("categorie")}>
                  {categories.map((categorie) => (
                    <option key={categorie} value={categorie}>
                      {categorie}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Montant" error={recurringForm.formState.errors.montant?.message}>
              {(fieldProps) => (
                <Input
                  {...fieldProps}
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  className="font-mono"
                  {...recurringForm.register("montant")}
                />
              )}
            </Field>
            <Field label="Périodicité">
              {(fieldProps) => (
                <Select {...fieldProps} {...recurringForm.register("periodicite")}>
                  <option value="mensuel">Mensuel</option>
                  <option value="annuel">Annuel</option>
                </Select>
              )}
            </Field>
          </div>
          <Field
            label="Prochain paiement"
            error={recurringForm.formState.errors.prochainPaiement?.message}
          >
            {(fieldProps) => (
              <Input {...fieldProps} type="date" {...recurringForm.register("prochainPaiement")} />
            )}
          </Field>
          <Button type="submit" className="w-full">
            Enregistrer
          </Button>
        </form>
      </Modal>

      {/* New subscription */}
      <Modal
        open={subModalOpen}
        onClose={() => setSubModalOpen(false)}
        title="Nouvel abonnement"
      >
        <form className="space-y-4" onSubmit={subForm.handleSubmit(onSubSubmit)}>
          <Field label="Nom" error={subForm.formState.errors.nom?.message}>
            {(fieldProps) => (
              <Input
                {...fieldProps}
                autoFocus
                placeholder="Ex. : Spotify"
                {...subForm.register("nom")}
              />
            )}
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Catégorie" error={subForm.formState.errors.categorie?.message}>
              {(fieldProps) => (
                <Select {...fieldProps} {...subForm.register("categorie")}>
                  {categories.map((categorie) => (
                    <option key={categorie} value={categorie}>
                      {categorie}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
            <Field label="Périodicité">
              {(fieldProps) => (
                <Select {...fieldProps} {...subForm.register("periodicite")}>
                  <option value="mensuel">Mensuel</option>
                  <option value="annuel">Annuel</option>
                </Select>
              )}
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Montant" error={subForm.formState.errors.montant?.message}>
              {(fieldProps) => (
                <Input
                  {...fieldProps}
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  className="font-mono"
                  {...subForm.register("montant")}
                />
              )}
            </Field>
            <Field label="Prochain paiement" error={subForm.formState.errors.prochainPaiement?.message}>
              {(fieldProps) => (
                <Input {...fieldProps} type="date" {...subForm.register("prochainPaiement")} />
              )}
            </Field>
          </div>
          <Button type="submit" className="w-full">
            Enregistrer l'abonnement
          </Button>
        </form>
      </Modal>
    </div>
  );
}
