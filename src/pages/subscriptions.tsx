import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Field } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { categories } from "@/data/demo";
import { useFinanceData } from "@/data/use-finance-data";
import type { Subscription } from "@/data/types";
import { formatCurrency, formatDate } from "@/lib/utils";

const schema = z.object({
  nom: z.string().min(2, "Nom requis"),
  categorie: z.string().min(2, "Catégorie requise"),
  montant: z.coerce.number().positive("Montant requis"),
  periodicite: z.enum(["mensuel", "annuel"]),
  prochainPaiement: z.string().min(1, "Date requise"),
});

type FormValues = z.infer<typeof schema>;

export function SubscriptionsPage() {
  const { subscriptions, setSubscriptions } = useFinanceData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { periodicite: "mensuel" },
  });

  // Saisie rapide depuis le tableau de bord : ?ajouter=1
  useEffect(() => {
    if (searchParams.get("ajouter")) {
      setModalOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const actives = useMemo(() => subscriptions.filter((s) => s.actif), [subscriptions]);
  const inactives = useMemo(() => subscriptions.filter((s) => !s.actif), [subscriptions]);

  const totalMensuel = useMemo(
    () =>
      actives
        .filter((s) => s.periodicite === "mensuel")
        .reduce((acc, s) => acc + s.montant, 0),
    [actives]
  );
  const totalAnnuel = useMemo(
    () =>
      actives
        .filter((s) => s.periodicite === "annuel")
        .reduce((acc, s) => acc + s.montant, 0),
    [actives]
  );

  const onSubmit = (data: FormValues) => {
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
    reset({ periodicite: "mensuel" });
    setModalOpen(false);
  };

  const toggleSubscription = (id: string) => {
    setSubscriptions(
      subscriptions.map((s) => (s.id === id ? { ...s, actif: !s.actif } : s))
    );
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <dl className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
          <div className="flex items-baseline gap-2">
            <dt className="text-[13px] text-ink-soft">Actifs</dt>
            <dd className="font-mono text-sm font-medium tabular-nums text-ink">
              {actives.length}
            </dd>
          </div>
          <div className="flex items-baseline gap-2">
            <dt className="text-[13px] text-ink-soft">Charge mensuelle</dt>
            <dd className="font-mono text-sm font-medium tabular-nums text-ink">
              {formatCurrency(totalMensuel)}
            </dd>
          </div>
          {totalAnnuel > 0 && (
            <div className="flex items-baseline gap-2">
              <dt className="text-[13px] text-ink-soft">Charge annuelle</dt>
              <dd className="font-mono text-sm font-medium tabular-nums text-ink">
                {formatCurrency(totalAnnuel)}
              </dd>
            </div>
          )}
        </dl>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" aria-hidden />
          Ajouter un abonnement
        </Button>
      </div>
      <p className="text-[13px] text-ink-soft">
        Les paiements récurrents créent automatiquement des dépenses à chaque période.
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-0">
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
                  className="flex items-center justify-between gap-4 px-5 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{subscription.nom}</p>
                    <p className="text-xs text-ink-soft">
                      {subscription.categorie} · prochain paiement le{" "}
                      <span className="font-mono tabular-nums">
                        {formatDate(subscription.prochainPaiement)}
                      </span>
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <p className="text-right">
                      <span className="font-mono text-[13px] font-medium tabular-nums text-ink">
                        {formatCurrency(subscription.montant)}
                      </span>
                      <span className="block text-right text-[11px] text-ink-faint">
                        {subscription.periodicite === "mensuel" ? "/ mois" : "/ an"}
                      </span>
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
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

        <Card className="p-0">
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nouvel abonnement">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Field label="Nom" error={errors.nom?.message}>
            {(fieldProps) => (
              <Input {...fieldProps} placeholder="Ex. : Spotify" {...register("nom")} />
            )}
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Catégorie" error={errors.categorie?.message}>
              {(fieldProps) => (
                <Select {...fieldProps} {...register("categorie")}>
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
                <Select {...fieldProps} {...register("periodicite")}>
                  <option value="mensuel">Mensuel</option>
                  <option value="annuel">Annuel</option>
                </Select>
              )}
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Montant" error={errors.montant?.message}>
              {(fieldProps) => (
                <Input
                  {...fieldProps}
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  className="font-mono"
                  {...register("montant")}
                />
              )}
            </Field>
            <Field label="Prochain paiement" error={errors.prochainPaiement?.message}>
              {(fieldProps) => <Input {...fieldProps} type="date" {...register("prochainPaiement")} />}
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
