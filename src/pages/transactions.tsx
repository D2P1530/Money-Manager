import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlignLeft, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Field } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { Tabs } from "@/components/ui/tabs";
import { Amount } from "@/components/ui/amount";
import { categories } from "@/data/demo";
import { useFinanceData } from "@/data/use-finance-data";
import type { Transaction } from "@/data/types";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

const today = () => new Date().toISOString().slice(0, 10);

const schema = z.object({
  titre: z.string().min(2, "Titre requis"),
  categorie: z.string().min(2, "Catégorie requise"),
  montant: z.coerce.number().positive("Montant positif requis"),
  date: z.string().min(1, "Date requise"),
  type: z.enum(["depense", "revenu"]),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function TransactionsPage() {
  const { transactions, setTransactions } = useFinanceData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [onglet, setOnglet] = useState<"toutes" | "depense" | "revenu">("toutes");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Transaction | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);
  const [descriptionTarget, setDescriptionTarget] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState({
    periode: "toutes",
    categorie: "",
    min: "",
    max: "",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: "depense", date: today() },
  });

  // Saisie rapide depuis le tableau de bord : ?ajouter=depense|revenu
  useEffect(() => {
    const ajouter = searchParams.get("ajouter");
    if (ajouter === "depense" || ajouter === "revenu") {
      reset({ type: ajouter, date: today() });
      setEditTarget(null);
      setModalOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams, reset]);

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setTransactions(transactions.filter((t) => t.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const openAdd = () => {
    setEditTarget(null);
    reset({ type: "depense", date: today() });
    setModalOpen(true);
  };

  const openEdit = (transaction: Transaction) => {
    setEditTarget(transaction);
    reset({
      titre: transaction.titre,
      categorie: transaction.categorie,
      montant: transaction.montant,
      date: transaction.date,
      type: transaction.type,
      description: transaction.description ?? "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditTarget(null);
    reset({ type: "depense", date: today() });
  };

  const onSubmit = (data: FormValues) => {
    const desc = data.description?.trim() || undefined;
    if (editTarget) {
      setTransactions(
        transactions.map((t) =>
          t.id === editTarget.id
            ? { ...t, titre: data.titre, categorie: data.categorie, montant: data.montant, date: data.date, type: data.type, description: desc }
            : t
        )
      );
    } else {
      const nouvelle: Transaction = {
        id: crypto.randomUUID(),
        titre: data.titre,
        categorie: data.categorie,
        montant: data.montant,
        date: data.date,
        type: data.type,
        compte: "Carte principale",
        description: desc,
      };
      setTransactions([nouvelle, ...transactions]);
    }
    closeModal();
  };

  const filtered = useMemo(() => {
    const now = new Date();
    const limite = new Date();
    limite.setDate(now.getDate() - Number(filters.periode));

    return transactions
      .filter((t) => {
        if (onglet !== "toutes" && t.type !== onglet) return false;
        if (filters.categorie && t.categorie !== filters.categorie) return false;
        if (filters.min && t.montant < Number(filters.min)) return false;
        if (filters.max && t.montant > Number(filters.max)) return false;
        if (filters.periode !== "toutes" && new Date(t.date) < limite) return false;
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, filters, onglet]);

  const totalFiltre = useMemo(
    () =>
      filtered.reduce(
        (acc, t) => acc + (t.type === "revenu" ? t.montant : -t.montant),
        0
      ),
    [filtered]
  );

  const hasActiveFilters =
    filters.categorie !== "" || filters.min !== "" || filters.max !== "" || filters.periode !== "toutes";

  const resetFilters = () => setFilters({ periode: "toutes", categorie: "", min: "", max: "" });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-center gap-3">
          <Tabs
            aria-label="Filtrer par type"
            tabs={[
              { value: "toutes", label: "Toutes" },
              { value: "depense", label: "Dépenses" },
              { value: "revenu", label: "Revenus" },
            ]}
            value={onglet}
            onChange={(value) => setOnglet(value as typeof onglet)}
          />
          {hasActiveFilters && (
            <button
              className="text-xs text-ink-soft underline underline-offset-2 hover:text-ink"
              onClick={resetFilters}
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
        <div className="flex flex-1 flex-wrap items-end gap-3 lg:justify-end">
          <div className="w-full min-w-0 sm:w-36">
            <label htmlFor="filtre-periode" className="mb-1 block text-xs font-medium text-ink-soft">
              Période
            </label>
            <Select
              id="filtre-periode"
              value={filters.periode}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, periode: event.target.value }))
              }
            >
              <option value="30">30 jours</option>
              <option value="90">90 jours</option>
              <option value="180">6 mois</option>
              <option value="365">12 mois</option>
              <option value="toutes">Toutes</option>
            </Select>
          </div>
          <div className="w-full min-w-0 sm:w-44">
            <label htmlFor="filtre-categorie" className="mb-1 block text-xs font-medium text-ink-soft">
              Catégorie
            </label>
            <Select
              id="filtre-categorie"
              value={filters.categorie}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, categorie: event.target.value }))
              }
            >
              <option value="">Toutes</option>
              {categories.map((categorie) => (
                <option key={categorie} value={categorie}>
                  {categorie}
                </option>
              ))}
            </Select>
          </div>
          <div className="w-[7.5rem]">
            <label htmlFor="filtre-min" className="mb-1 block text-xs font-medium text-ink-soft">
              Montant min
            </label>
            <Input
              id="filtre-min"
              inputMode="decimal"
              className="font-mono text-[13px]"
              value={filters.min}
              onChange={(event) => setFilters((prev) => ({ ...prev, min: event.target.value }))}
            />
          </div>
          <div className="w-[7.5rem]">
            <label htmlFor="filtre-max" className="mb-1 block text-xs font-medium text-ink-soft">
              Montant max
            </label>
            <Input
              id="filtre-max"
              inputMode="decimal"
              className="font-mono text-[13px]"
              value={filters.max}
              onChange={(event) => setFilters((prev) => ({ ...prev, max: event.target.value }))}
            />
          </div>
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4" aria-hidden />
            Ajouter
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Liste des transactions filtrées</caption>
            <thead>
              <tr className="border-b border-line bg-sunken text-xs text-ink-soft">
                <th scope="col" className="hidden py-3 pl-5 pr-3 font-medium sm:table-cell">
                  Date
                </th>
                <th scope="col" className="py-3 pl-4 pr-3 font-medium sm:pl-3">Titre</th>
                <th scope="col" className="hidden px-3 py-3 font-medium md:table-cell">
                  Catégorie
                </th>
                <th scope="col" className="px-3 py-3 text-right font-medium">Montant</th>
                <th scope="col" className="py-3 pl-3 pr-5 text-right font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-ink-soft">
                    Aucune opération ne correspond à ces filtres.
                    {hasActiveFilters && (
                      <>
                        <br />
                        <button
                          className="mt-2 text-xs text-accent underline underline-offset-2 hover:opacity-80"
                          onClick={resetFilters}
                        >
                          Réinitialiser les filtres
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map((transaction) => {
                  const hasDescription = Boolean(transaction.description);
                  return (
                    <tr
                      key={transaction.id}
                      className="group border-b border-line last:border-b-0 transition-colors duration-150 hover:bg-sunken/60"
                    >
                      <td className="hidden whitespace-nowrap py-2.5 pl-5 pr-3 font-mono text-xs tabular-nums text-ink-faint sm:table-cell">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="py-2.5 pl-4 pr-3 sm:px-3">
                        <div className="flex items-center gap-2">
                          <span
                            aria-hidden
                            className={cn(
                              "h-1.5 w-1.5 shrink-0 rounded-full",
                              transaction.type === "revenu" ? "bg-positive" : "bg-negative"
                            )}
                          />
                          <span className="font-medium text-ink">{transaction.titre}</span>
                          {hasDescription && (
                            <button
                              type="button"
                              aria-label={`Voir la description de ${transaction.titre}`}
                              className="shrink-0 rounded text-ink-faint transition-colors hover:text-ink-soft focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                              onClick={() => setDescriptionTarget(transaction)}
                            >
                              <AlignLeft className="h-3.5 w-3.5" aria-hidden />
                            </button>
                          )}
                        </div>
                        <span className="ml-3.5 block font-mono text-[11px] tabular-nums text-ink-faint sm:hidden">
                          {formatDate(transaction.date)}
                        </span>
                      </td>
                      <td className="hidden px-3 py-2.5 md:table-cell">
                        <span className="rounded-sm bg-sunken px-1.5 py-0.5 text-[11px] font-medium text-ink-soft">
                          {transaction.categorie}
                        </span>
                      </td>
                      <td className="px-2 py-2.5 text-right sm:px-3">
                        <Amount
                          value={transaction.montant}
                          tone={transaction.type === "revenu" ? "revenu" : "depense"}
                          className="text-sm font-medium"
                        />
                      </td>
                      <td className="py-2.5 pl-1 pr-2 text-right sm:pl-3 sm:pr-5">
                        <div className="flex justify-end gap-0.5 sm:gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hidden md:inline-flex"
                            onClick={() => openEdit(transaction)}
                          >
                            Modifier
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            className="hidden md:inline-flex"
                            onClick={() => setDeleteTarget(transaction)}
                          >
                            Supprimer
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-9 p-0 md:hidden"
                            aria-label={`Modifier ${transaction.titre}`}
                            onClick={() => openEdit(transaction)}
                          >
                            <Pencil className="h-3.5 w-3.5" aria-hidden />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            className="w-9 p-0 md:hidden"
                            aria-label={`Supprimer ${transaction.titre}`}
                            onClick={() => setDeleteTarget(transaction)}
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {filtered.length > 0 && (
              <tfoot>
                <tr className="bg-ink text-[13px]">
                  <td colSpan={3} className="hidden py-3 pl-5 pr-3 text-paper/45 sm:table-cell">
                    {filtered.length} opération{filtered.length > 1 ? "s" : ""} affichée
                    {filtered.length > 1 ? "s" : ""}
                  </td>
                  <td className="py-3 pl-4 pr-3 text-paper/45 sm:hidden">
                    {filtered.length} op.
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span
                      className={cn(
                        "font-mono tabular-nums font-medium",
                        totalFiltre >= 0 ? "text-positive-soft" : "text-negative-soft"
                      )}
                    >
                      {totalFiltre >= 0 ? "+" : "−"}{formatCurrency(Math.abs(totalFiltre))}
                    </span>
                  </td>
                  <td className="pl-3 pr-5" />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </Card>

      <Modal
        open={descriptionTarget !== null}
        onClose={() => setDescriptionTarget(null)}
        title={descriptionTarget?.titre ?? ""}
      >
        <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-ink-soft">
          {descriptionTarget?.description}
        </p>
        <div className="mt-5 flex justify-end">
          <Button variant="outline" onClick={() => setDescriptionTarget(null)}>
            Fermer
          </Button>
        </div>
      </Modal>

      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Supprimer la transaction"
      >
        <p className="text-[13px] text-ink-soft">
          Supprimer{" "}
          <span className="font-medium text-ink">{deleteTarget?.titre}</span>
          {" "}? Cette opération est irréversible.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Supprimer
          </Button>
        </div>
      </Modal>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editTarget ? "Modifier la transaction" : "Ajouter une transaction"}
      >
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Field label="Titre" error={errors.titre?.message}>
            {(fieldProps) => (
              <Input
                {...fieldProps}
                autoFocus
                placeholder="Ex. : facture d'électricité"
                {...register("titre")}
              />
            )}
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Type">
              {(fieldProps) => (
                <Select {...fieldProps} {...register("type")}>
                  <option value="depense">Dépense</option>
                  <option value="revenu">Revenu</option>
                </Select>
              )}
            </Field>
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
            <Field label="Date" error={errors.date?.message}>
              {(fieldProps) => <Input {...fieldProps} type="date" {...register("date")} />}
            </Field>
          </div>
          <Field label="Description" hint="Optionnel — notes ou justificatif">
            {(fieldProps) => (
              <textarea
                {...fieldProps}
                rows={2}
                placeholder="Ex. : abonnement annuel, reçu #1042…"
                className="w-full resize-none rounded border border-line-strong bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-faint transition-colors duration-150 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                {...register("description")}
              />
            )}
          </Field>
          <Button type="submit" className="w-full">
            {editTarget ? "Enregistrer les modifications" : "Ajouter la transaction"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
