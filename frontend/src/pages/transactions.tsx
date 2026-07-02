import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AlignLeft, Pencil, Plus, Search, SlidersHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Tabs } from "@/components/ui/tabs";
import { Amount } from "@/components/ui/amount";
import { TransactionFormModal } from "@/components/ui/transaction-form-modal";
import { categories } from "@/data/demo";
import { useFinanceData } from "@/data/use-finance-data";
import type { Transaction } from "@/data/types";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

export function TransactionsPage() {
  const { transactions, setTransactions } = useFinanceData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [onglet, setOnglet] = useState<"toutes" | "depense" | "revenu">("toutes");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Transaction | null>(null);
  const [defaultType, setDefaultType] = useState<"depense" | "revenu">("depense");
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);
  const [descriptionTarget, setDescriptionTarget] = useState<Transaction | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    periode: "toutes",
    categorie: "",
    min: "",
    max: "",
  });

  // Saisie rapide depuis le tableau de bord : ?ajouter=depense|revenu
  useEffect(() => {
    const ajouter = searchParams.get("ajouter");
    if (ajouter === "depense" || ajouter === "revenu") {
      setDefaultType(ajouter);
      setEditTarget(null);
      setModalOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setTransactions(transactions.filter((t) => t.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const openAdd = () => {
    setEditTarget(null);
    setDefaultType("depense");
    setModalOpen(true);
  };

  const openEdit = (transaction: Transaction) => {
    setEditTarget(transaction);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditTarget(null);
  };

  const filtered = useMemo(() => {
    const now = new Date();
    const limite = new Date();
    limite.setDate(now.getDate() - Number(filters.periode));

    return transactions
      .filter((t) => {
        if (onglet !== "toutes" && t.type !== onglet) return false;
        if (
          searchQuery &&
          !t.titre.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !t.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
          return false;
        if (filters.categorie && t.categorie !== filters.categorie) return false;
        if (filters.min && t.montant < Number(filters.min)) return false;
        if (filters.max && t.montant > Number(filters.max)) return false;
        if (filters.periode !== "toutes" && new Date(t.date) < limite) return false;
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, filters, onglet, searchQuery]);

  const totalFiltre = useMemo(
    () =>
      filtered.reduce(
        (acc, t) => acc + (t.type === "revenu" ? t.montant : -t.montant),
        0
      ),
    [filtered]
  );

  const hasActiveFilters =
    searchQuery !== "" ||
    filters.categorie !== "" ||
    filters.min !== "" ||
    filters.max !== "" ||
    filters.periode !== "toutes";

  const resetFilters = () => {
    setFilters({ periode: "toutes", categorie: "", min: "", max: "" });
    setSearchQuery("");
  };

  const activeFilterCount = [
    filters.periode !== "toutes",
    filters.categorie !== "",
    filters.min !== "",
    filters.max !== "",
  ].filter(Boolean).length;

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
          {/* Search — always visible */}
          <div className="w-full sm:w-52">
            <label
              htmlFor="search-transactions"
              className="mb-1 block text-xs font-medium text-ink-soft"
            >
              Rechercher
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-faint"
                aria-hidden
              />
              <Input
                id="search-transactions"
                placeholder="Titre, description…"
                className="pl-8 text-[13px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Mobile-only: Filtres toggle + Ajouter side by side */}
          <div className="flex w-full items-center gap-3 sm:hidden">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setFiltersOpen((o) => !o)}
              aria-expanded={filtersOpen}
              aria-controls="filter-panel"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden />
              Filtres
              {activeFilterCount > 0 && (
                <span className="ml-1 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold leading-none text-paper">
                  {activeFilterCount}
                </span>
              )}
            </Button>
            <Button onClick={openAdd} className="flex-1">
              <Plus className="h-4 w-4" aria-hidden />
              Ajouter
            </Button>
          </div>

          {/* Filter fields: animated slide on mobile, always inline on sm+ */}
          <div
            id="filter-panel"
            className={cn("panel-grid w-full", filtersOpen && "open")}
          >
            <div className="panel-grid-inner flex flex-wrap gap-3 pb-0.5">
            <div className="w-full min-w-0 sm:w-36">
              <label
                htmlFor="filtre-periode"
                className="mb-1 block text-xs font-medium text-ink-soft"
              >
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
              <label
                htmlFor="filtre-categorie"
                className="mb-1 block text-xs font-medium text-ink-soft"
              >
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
              <label
                htmlFor="filtre-min"
                className="mb-1 block text-xs font-medium text-ink-soft"
              >
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
              <label
                htmlFor="filtre-max"
                className="mb-1 block text-xs font-medium text-ink-soft"
              >
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
            </div>
          </div>

          {/* Ajouter — desktop only (mobile has it in the toggle row above) */}
          <Button onClick={openAdd} className="hidden sm:inline-flex">
            <Plus className="h-4 w-4" aria-hidden />
            Ajouter
          </Button>
        </div>
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {filtered.length} opération{filtered.length !== 1 ? "s" : ""} affichée
        {filtered.length !== 1 ? "s" : ""}
      </p>

      <Card className="overflow-hidden p-0">
        <table className="w-full table-fixed text-left text-sm sm:table-auto">
          <caption className="sr-only">Liste des transactions filtrées</caption>
          <thead>
            <tr className="border-b border-line bg-sunken text-xs text-ink-soft">
              <th scope="col" className="hidden py-3 pl-5 pr-3 font-medium sm:table-cell">
                Date
              </th>
              <th scope="col" className="py-3 pl-3 pr-2 font-medium sm:pl-3 sm:pr-3">
                Titre
              </th>
              <th scope="col" className="hidden px-3 py-3 font-medium md:table-cell">
                Catégorie
              </th>
              <th
                scope="col"
                className="w-[124px] py-3 pl-2 pr-2 text-right font-medium sm:w-auto sm:px-3"
              >
                Montant
              </th>
              <th
                scope="col"
                className="w-[102px] py-3 pl-3 pr-3 text-right font-medium sm:w-auto sm:pr-5"
              >
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
                    <td className="py-2.5 pl-3 pr-2 sm:px-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          aria-hidden
                          className={cn(
                            "h-1.5 w-1.5 shrink-0 rounded-full",
                            transaction.type === "revenu" ? "bg-positive" : "bg-negative"
                          )}
                        />
                        <span className="truncate font-medium text-ink">{transaction.titre}</span>
                        {hasDescription && (
                          <button
                            type="button"
                            aria-label={`Voir la description de ${transaction.titre}`}
                            className="-m-1.5 shrink-0 rounded p-1.5 text-ink-faint transition-colors hover:text-ink-soft focus:outline-none focus-visible:ring-1 focus-visible:ring-accent"
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
                          className="h-11 w-11 p-0 md:hidden"
                          aria-label={`Modifier ${transaction.titre}`}
                          onClick={() => openEdit(transaction)}
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          className="h-11 w-11 p-0 md:hidden"
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
                <td
                  colSpan={3}
                  className="hidden py-3 pl-5 pr-3 text-paper/50 sm:table-cell"
                >
                  {filtered.length} opération{filtered.length > 1 ? "s" : ""} affichée
                  {filtered.length > 1 ? "s" : ""}
                </td>
                <td className="py-3 pl-4 pr-3 text-paper/50 sm:hidden">
                  {filtered.length} op.
                </td>
                <td className="px-2 py-3 text-right sm:px-3">
                  <span
                    className={cn(
                      "font-mono tabular-nums font-medium",
                      totalFiltre >= 0 ? "text-positive-soft" : "text-negative-soft"
                    )}
                  >
                    {totalFiltre >= 0 ? "+" : "−"}
                    {formatCurrency(Math.abs(totalFiltre))}
                  </span>
                </td>
                <td className="pl-3 pr-5" />
              </tr>
            </tfoot>
          )}
        </table>
      </Card>

      {/* Description viewer */}
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

      {/* Delete confirmation */}
      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Supprimer la transaction"
      >
        <p className="text-[13px] text-ink-soft">
          Supprimer cette transaction ? Cette opération est irréversible.
        </p>
        {deleteTarget && (
          <div className="mt-3 rounded border border-line bg-sunken px-4 py-3 text-[13px]">
            <p className="font-medium text-ink">{deleteTarget.titre}</p>
            <p className="mt-0.5 font-mono tabular-nums text-ink-soft">
              {formatCurrency(deleteTarget.montant)} · {formatDate(deleteTarget.date)}
            </p>
          </div>
        )}
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Supprimer
          </Button>
        </div>
      </Modal>

      {/* Add / Edit form */}
      <TransactionFormModal
        open={modalOpen}
        onClose={closeModal}
        editTarget={editTarget}
        defaultType={defaultType}
      />
    </div>
  );
}
