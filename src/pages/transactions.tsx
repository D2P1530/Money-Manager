import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Tabs } from "@/components/ui/tabs";
import { categories } from "@/data/demo";
import { useFinanceData } from "@/data/use-finance-data";
import type { Transaction } from "@/data/types";
import { formatCurrency, formatDate } from "@/lib/utils";

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
  const [onglet, setOnglet] = useState<"toutes" | "depense" | "revenu">("toutes");
  const [modalOpen, setModalOpen] = useState(false);
  const [editionId, setEditionId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    periode: "30",
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
    reset();
    setModalOpen(false);
  };

  const filtered = useMemo(() => {
    const now = new Date();
    const limite = new Date();
    limite.setDate(now.getDate() - Number(filters.periode));

    return transactions.filter((t) => {
      if (onglet !== "toutes" && t.type !== onglet) return false;
      if (filters.categorie && t.categorie !== filters.categorie) return false;
      if (filters.min && t.montant < Number(filters.min)) return false;
      if (filters.max && t.montant > Number(filters.max)) return false;
      if (filters.periode !== "toutes" && new Date(t.date) < limite) return false;
      return true;
    });
  }, [transactions, filters, onglet]);

  const handleDelete = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const handleInlineSave = (id: string, montant: number) => {
    setTransactions(
      transactions.map((t) => (t.id === id ? { ...t, montant } : t))
    );
    setEditionId(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>Filtrez et ajustez vos mouvements financiers.</CardDescription>
        </CardHeader>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <Tabs
            tabs={[
              { value: "toutes", label: "Toutes" },
              { value: "depense", label: "Dépenses" },
              { value: "revenu", label: "Revenus" },
            ]}
            value={onglet}
            onChange={(value) => setOnglet(value as typeof onglet)}
          />
          <div className="grid flex-1 gap-4 md:grid-cols-4">
            <div>
              <label className="text-xs text-slate-500">Période</label>
              <select
                value={filters.periode}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, periode: event.target.value }))
                }
                className="mt-1 w-full rounded-2xl border border-white/70 bg-white/70 px-3 py-2 text-sm"
              >
                <option value="30">30 jours</option>
                <option value="90">90 jours</option>
                <option value="180">6 mois</option>
                <option value="365">12 mois</option>
                <option value="toutes">Toutes</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500">Catégorie</label>
              <select
                value={filters.categorie}
                onChange={(event) =>
                  setFilters((prev) => ({ ...prev, categorie: event.target.value }))
                }
                className="mt-1 w-full rounded-2xl border border-white/70 bg-white/70 px-3 py-2 text-sm"
              >
                <option value="">Toutes</option>
                {categories.map((categorie) => (
                  <option key={categorie} value={categorie}>
                    {categorie}
                  </option>
                ))}
              </select>
            </div>
            <Input
              placeholder="Montant min"
              value={filters.min}
              onChange={(event) => setFilters((prev) => ({ ...prev, min: event.target.value }))}
            />
            <Input
              placeholder="Montant max"
              value={filters.max}
              onChange={(event) => setFilters((prev) => ({ ...prev, max: event.target.value }))}
            />
          </div>
          <Button onClick={() => setModalOpen(true)}>Ajouter</Button>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-400">
              <tr>
                <th className="py-3">Titre</th>
                <th>Catégorie</th>
                <th>Date</th>
                <th>Type</th>
                <th>Montant</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/50">
              {filtered.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-white/40">
                  <td className="py-4 font-medium">{transaction.titre}</td>
                  <td>{transaction.categorie}</td>
                  <td>{formatDate(transaction.date)}</td>
                  <td>{transaction.type === "depense" ? "Dépense" : "Revenu"}</td>
                  <td>
                    {editionId === transaction.id ? (
                      <InlineEdit
                        valeur={transaction.montant}
                        onSave={(montant) => handleInlineSave(transaction.id, montant)}
                        onCancel={() => setEditionId(null)}
                      />
                    ) : (
                      <span
                        className={
                          transaction.type === "revenu" ? "text-emerald-500" : "text-rose-500"
                        }
                      >
                        {transaction.type === "revenu" ? "+" : "-"}
                        {formatCurrency(transaction.montant)}
                      </span>
                    )}
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" onClick={() => setEditionId(transaction.id)}>
                        Modifier
                      </Button>
                      <Button variant="ghost" onClick={() => handleDelete(transaction.id)}>
                        Supprimer
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Ajouter une transaction">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="text-sm font-medium">Titre</label>
            <Input placeholder="Ex: Facture électricité" {...register("titre")} />
            {errors.titre && <p className="text-xs text-rose-500">{errors.titre.message}</p>}
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
            <label className="text-sm font-medium">Date</label>
            <Input type="date" {...register("date")} />
            {errors.date && <p className="text-xs text-rose-500">{errors.date.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Type</label>
            <select
              className="mt-1 w-full rounded-2xl border border-white/70 bg-white/70 px-3 py-2 text-sm"
              {...register("type")}
            >
              <option value="depense">Dépense</option>
              <option value="revenu">Revenu</option>
            </select>
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
    <div className="flex items-center gap-2">
      <Input
        value={montant}
        onChange={(event) => setMontant(event.target.value)}
        className="w-28"
      />
      <Button
        variant="outline"
        onClick={() => onSave(Number(montant))}
      >
        OK
      </Button>
      <Button variant="ghost" onClick={onCancel}>
        Annuler
      </Button>
    </div>
  );
}
