import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

  const actives = useMemo(() => subscriptions.filter((s) => s.actif), [subscriptions]);
  const inactives = useMemo(() => subscriptions.filter((s) => !s.actif), [subscriptions]);

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
    reset();
    setModalOpen(false);
  };

  const toggleSubscription = (id: string) => {
    setSubscriptions(
      subscriptions.map((s) => (s.id === id ? { ...s, actif: !s.actif } : s))
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Abonnements</CardTitle>
          <CardDescription>
            Les paiements récurrents créent automatiquement des dépenses à chaque période.
          </CardDescription>
        </CardHeader>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-slate-500">
            Total actif: {actives.length} abonnements • Dépense mensuelle estimée: {" "}
            {formatCurrency(
              actives
                .filter((s) => s.periodicite === "mensuel")
                .reduce((acc, s) => acc + s.montant, 0)
            )}
          </p>
          <Button onClick={() => setModalOpen(true)}>Ajouter un abonnement</Button>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Actifs</CardTitle>
            <CardDescription>Suivis en temps réel.</CardDescription>
          </CardHeader>
          <div className="space-y-3">
            {actives.map((subscription) => (
              <div key={subscription.id} className="glass-panel flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">{subscription.nom}</p>
                  <p className="text-xs text-slate-500">
                    {subscription.categorie} • {subscription.periodicite} • {" "}
                    Prochain paiement {formatDate(subscription.prochainPaiement)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-rose-500">{formatCurrency(subscription.montant)}</p>
                  <Button variant="ghost" onClick={() => toggleSubscription(subscription.id)}>
                    Annuler
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inactifs</CardTitle>
            <CardDescription>Abonnements suspendus.</CardDescription>
          </CardHeader>
          <div className="space-y-3">
            {inactives.map((subscription) => (
              <div key={subscription.id} className="glass-panel flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">{subscription.nom}</p>
                  <p className="text-xs text-slate-500">
                    Dernier paiement {formatDate(subscription.prochainPaiement)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-500">
                    {formatCurrency(subscription.montant)}
                  </p>
                  <Button variant="ghost" onClick={() => toggleSubscription(subscription.id)}>
                    Réactiver
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nouvel abonnement">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="text-sm font-medium">Nom</label>
            <Input placeholder="Ex: Spotify" {...register("nom")} />
            {errors.nom && <p className="text-xs text-rose-500">{errors.nom.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Catégorie</label>
            <select
              className="mt-1 w-full rounded-2xl border border-white/70 bg-white/70 px-3 py-2 text-sm"
              {...register("categorie")}
            >
              {categories.map((categorie) => (
                <option key={categorie} value={categorie}>
                  {categorie}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Montant</label>
            <Input type="number" step="0.01" {...register("montant")} />
            {errors.montant && <p className="text-xs text-rose-500">{errors.montant.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Périodicité</label>
            <select
              className="mt-1 w-full rounded-2xl border border-white/70 bg-white/70 px-3 py-2 text-sm"
              {...register("periodicite")}
            >
              <option value="mensuel">Mensuel</option>
              <option value="annuel">Annuel</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Prochain paiement</label>
            <Input type="date" {...register("prochainPaiement")} />
            {errors.prochainPaiement && (
              <p className="text-xs text-rose-500">{errors.prochainPaiement.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full">
            Enregistrer l'abonnement
          </Button>
        </form>
      </Modal>
    </div>
  );
}
