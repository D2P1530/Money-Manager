import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pencil, Plus, Trash2 } from "lucide-react";
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
import { formatDate } from "@/lib/utils";

const schema = z.object({
  titre: z.string().min(2, "Titre requis"),
  categorie: z.string().min(2, "Catégorie requise"),
  montant: z.coerce.number().positive("Montant positif requis"),
  date: z.string().min(1, "Date requise"),
  type: z.enum(["depense", "revenu"]),
});

type FormValues = z.infer<typeof schema>;

export function TransactionsPage() {
  const { transactions, setTransactions } = useFinanceData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [onglet, setOnglet] = useState<"toutes" | "depense" | "revenu">("toutes");
  const [modalOpen, setModalOpen] = useState(false);
  const [editionId, setEditionId] = useState<string | null>(null);
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
    defaultValues: { type: "depense" },
  });

  // Saisie rapide depuis le tableau de bord : ?ajouter=depense|revenu
  useEffect(() => {
    const ajouter = searchParams.get("ajouter");
    if (ajouter === "depense" || ajouter === "revenu") {
      reset({ type: ajouter });
      setModalOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams, reset]);

  const onSubmit = (data: FormValues) => {
    const nouvelle: Transaction = {
      id: crypto.randomUUID(),
      titre: data.titre,
      categorie: data.categorie,
      montant: data.montant,
      date: data.date,
      type: data.type,
      compte: "Carte principale",
    };
    setTransactions([nouvelle, ...transactions]);
    reset({ type: "depense" });
    setModalOpen(false);
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

  const handleDelete = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const handleInlineSave = (id: string, montant: number) => {
    if (Number.isNaN(montant) || montant <= 0) {
      setEditionId(null);
      return;
    }
    setTransactions(transactions.map((t) => (t.id === id ? { ...t, montant } : t)));
    setEditionId(null);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
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
          <Button onClick={() => setModalOpen(true)}>
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
              <tr className="border-b border-line text-xs text-ink-faint">
                <th scope="col" className="hidden py-2.5 pl-5 pr-3 font-medium sm:table-cell">
                  Date
                </th>
                <th scope="col" className="py-2.5 pl-4 pr-3 font-medium sm:pl-3">Titre</th>
                <th scope="col" className="hidden px-3 py-2.5 font-medium md:table-cell">
                  Catégorie
                </th>
                <th scope="col" className="px-3 py-2.5 text-right font-medium">Montant</th>
                <th scope="col" className="py-2.5 pl-3 pr-5 text-right font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-ink-soft">
                    Aucune opération ne correspond à ces filtres.
                    <br />
                    <span className="text-xs text-ink-faint">
                      Élargissez la période ou réinitialisez la catégorie.
                    </span>
                  </td>
                </tr>
              ) : (
                filtered.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="group border-b border-line transition-colors duration-150 last:border-b-0 hover:bg-sunken/60"
                  >
                    <td className="hidden whitespace-nowrap py-2.5 pl-5 pr-3 font-mono text-xs tabular-nums text-ink-faint sm:table-cell">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="py-2.5 pl-4 pr-3 font-medium text-ink sm:px-3">
                      {transaction.titre}
                      <span className="block font-mono text-[11px] font-normal tabular-nums text-ink-faint sm:hidden">
                        {formatDate(transaction.date)}
                      </span>
                    </td>
                    <td className="hidden px-3 py-2.5 text-[13px] text-ink-soft md:table-cell">
                      {transaction.categorie}
                    </td>
                    <td className="px-2 py-2.5 text-right sm:px-3">
                      {editionId === transaction.id ? (
                        <InlineEdit
                          valeur={transaction.montant}
                          onSave={(montant) => handleInlineSave(transaction.id, montant)}
                          onCancel={() => setEditionId(null)}
                        />
                      ) : (
                        <Amount
                          value={transaction.montant}
                          tone={transaction.type === "revenu" ? "revenu" : "depense"}
                          className="text-[13px]"
                        />
                      )}
                    </td>
                    <td className="py-2.5 pl-1 pr-2 text-right sm:pl-3 sm:pr-5">
                      <div className="flex justify-end gap-0.5 sm:gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hidden md:inline-flex"
                          onClick={() => setEditionId(transaction.id)}
                        >
                          Modifier
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          className="hidden md:inline-flex"
                          onClick={() => handleDelete(transaction.id)}
                        >
                          Supprimer
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-7 p-0 md:hidden"
                          aria-label={`Modifier ${transaction.titre}`}
                          onClick={() => setEditionId(transaction.id)}
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          className="w-7 p-0 md:hidden"
                          aria-label={`Supprimer ${transaction.titre}`}
                          onClick={() => handleDelete(transaction.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {filtered.length > 0 && (
              <tfoot>
                <tr className="bg-sunken/50 text-[13px]">
                  <td colSpan={3} className="hidden py-2.5 pl-5 pr-3 text-ink-soft sm:table-cell">
                    {filtered.length} opération{filtered.length > 1 ? "s" : ""} affichée
                    {filtered.length > 1 ? "s" : ""}
                  </td>
                  <td className="py-2.5 pl-4 pr-3 text-ink-soft sm:hidden">
                    {filtered.length} op.
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <Amount value={totalFiltre} tone="signed" className="text-[13px] font-medium" />
                  </td>
                  <td className="pl-3 pr-5" />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Ajouter une transaction">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Field label="Titre" error={errors.titre?.message}>
            {(fieldProps) => (
              <Input {...fieldProps} placeholder="Ex. : facture d'électricité" {...register("titre")} />
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
          <Button type="submit" className="w-full">
            Ajouter la transaction
          </Button>
        </form>
      </Modal>
    </div>
  );
}

function InlineEdit({
  valeur,
  onSave,
  onCancel,
}: {
  valeur: number;
  onSave: (value: number) => void;
  onCancel: () => void;
}) {
  const [montant, setMontant] = useState(valeur.toString());

  return (
    <div className="flex items-center justify-end gap-1.5">
      <label htmlFor="edition-montant" className="sr-only">
        Nouveau montant
      </label>
      <Input
        id="edition-montant"
        autoFocus
        inputMode="decimal"
        value={montant}
        onChange={(event) => setMontant(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") onSave(Number(montant));
          if (event.key === "Escape") onCancel();
        }}
        className="h-7 w-24 font-mono text-xs"
      />
      <Button variant="outline" size="sm" onClick={() => onSave(Number(montant))}>
        OK
      </Button>
      <Button variant="ghost" size="sm" onClick={onCancel}>
        Annuler
      </Button>
    </div>
  );
}
