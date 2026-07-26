import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { useFinanceData } from "@/data/use-finance-data";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

const DELETE_CONFIRM_WORD = "SUPPRIMER";

export function SettingsPage() {
  const {
    settings,
    updateSettings,
    soldeAttendu,
    transactions,
    subscriptions,
    recurringPayments,
    deleteTransaction,
    deleteSubscription,
    deleteRecurringPayment,
  } = useFinanceData();
  const [soldeInitial, setSoldeInitial] = useState(settings.soldeInitial.toString());
  const [enregistre, setEnregistre] = useState(false);
  const [soldeError, setSoldeError] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [pendingSoldeInitial, setPendingSoldeInitial] = useState<number | null>(null);
  const timeoutRef = useRef<number>();

  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exported, setExported] = useState(false);
  const exportTimeoutRef = useRef<number>();

  const [deleteAllOpen, setDeleteAllOpen] = useState(false);
  const [deleteAllText, setDeleteAllText] = useState("");
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [deleteAllError, setDeleteAllError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      window.clearTimeout(timeoutRef.current);
      window.clearTimeout(exportTimeoutRef.current);
    };
  }, []);

  // Resynchronise les champs quand les paramètres arrivent depuis l'API (fetch async).
  useEffect(() => {
    setSoldeInitial(settings.soldeInitial.toString());
  }, [settings.soldeInitial]);

  const applySave = (valeur: number) => {
    updateSettings({ soldeInitial: valeur });
    setEnregistre(true);
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setEnregistre(false), 2500);
  };

  const handleSave = () => {
    const normalized = soldeInitial.replace(/'/g, "").replace(/\s/g, "").replace(/,/g, ".");
    const valeur = Number(normalized);
    if (Number.isNaN(valeur)) {
      setSoldeError(true);
      return;
    }
    setSoldeError(false);
    setSoldeInitial(valeur.toString());

    if (valeur !== settings.soldeInitial) {
      setPendingSoldeInitial(valeur);
      setConfirmText("");
      setConfirmOpen(true);
      return;
    }

    applySave(valeur);
  };

  const closeConfirmModal = useCallback(() => {
    setConfirmOpen(false);
    setConfirmText("");
    setPendingSoldeInitial(null);
  }, []);

  const currentSoldeInitialText = settings.soldeInitial.toString();
  const confirmMatches = confirmText === currentSoldeInitialText;

  const handleConfirmSave = () => {
    if (!confirmMatches || pendingSoldeInitial === null) return;
    applySave(pendingSoldeInitial);
    closeConfirmModal();
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportError(null);
    try {
      const [transactionsData, subscriptionsData, recurringPaymentsData, settingsData] =
        await Promise.all([
          api.transactions.getAll(),
          api.subscriptions.getAll(),
          api.recurringPayments.getAll(),
          api.settings.get(),
        ]);

      const exportData = {
        transactions: transactionsData,
        subscriptions: subscriptionsData,
        recurringPayments: recurringPaymentsData,
        settings: settingsData,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "money-manager-export.json";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);

      setExported(true);
      window.clearTimeout(exportTimeoutRef.current);
      exportTimeoutRef.current = window.setTimeout(() => setExported(false), 2500);
    } catch (error) {
      console.error("Failed to export data", error);
      setExportError("Échec de l'export. Vérifiez votre connexion et réessayez.");
    } finally {
      setIsExporting(false);
    }
  };

  const closeDeleteAllModal = useCallback(() => {
    if (isDeletingAll) return;
    setDeleteAllOpen(false);
    setDeleteAllText("");
    setDeleteAllError(null);
  }, [isDeletingAll]);

  const deleteAllMatches = deleteAllText === DELETE_CONFIRM_WORD;

  const handleDeleteAll = async () => {
    if (!deleteAllMatches) return;
    setIsDeletingAll(true);
    setDeleteAllError(null);
    try {
      for (const transaction of transactions) {
        await deleteTransaction(transaction.id);
      }
      for (const subscription of subscriptions) {
        await deleteSubscription(subscription.id);
      }
      for (const recurringPayment of recurringPayments) {
        await deleteRecurringPayment(recurringPayment.id);
      }
      setDeleteAllOpen(false);
      setDeleteAllText("");
    } catch (error) {
      console.error("Failed to delete all data", error);
      setDeleteAllError("Échec de la suppression. Certaines données peuvent subsister.");
    } finally {
      setIsDeletingAll(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-8 border-b border-line pb-6">
        <p className="text-[13px] text-ink-soft">
          Journal financier privé — configuration globale
        </p>
      </header>

      <div className="space-y-6">
        <section className="rounded-md border border-line bg-surface">
          <div className="flex items-start justify-between gap-6 border-b border-line px-5 py-4">
            <div>
              <h2 className="text-[14px] font-semibold text-ink">Point de départ</h2>
              <p className="mt-0.5 text-[12px] text-ink-soft">
                Base de calcul du solde attendu
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-mono text-[22px] font-semibold tabular-nums leading-none text-ink">
                {formatCurrency(soldeAttendu)}
              </p>
              <p className="mt-1 text-[12px] text-ink-faint">solde attendu actuel</p>
            </div>
          </div>

          <div className="p-5">
            <Field
              label="Solde initial"
              className="max-w-[240px]"
              error={soldeError ? "Format invalide — utilisez 1234.56" : undefined}
            >
              {(fieldProps) => (
                <Input
                  {...fieldProps}
                  inputMode="decimal"
                  className="font-mono"
                  value={soldeInitial}
                  onChange={(event) => {
                    setSoldeInitial(event.target.value);
                    if (soldeError) setSoldeError(false);
                  }}
                />
              )}
            </Field>
          </div>

          <div className="flex items-center gap-3 rounded-b-md border-t border-line bg-sunken px-5 py-3.5">
            <Button onClick={handleSave}>Enregistrer</Button>
            {/* Visual fade — aria-hidden so AT ignores the opacity trick */}
            <span
              aria-hidden
              className={`flex items-center gap-1.5 text-[13px] text-positive transition-opacity duration-200 ease-out-quart ${
                enregistre ? "opacity-100" : "opacity-0"
              }`}
            >
              <Check className="h-4 w-4" />
              Modifications enregistrées
            </span>
            {/* Live region: content changes trigger the screen-reader announcement */}
            <span role="status" aria-live="polite" aria-atomic="true" className="sr-only">
              {enregistre ? "Modifications enregistrées" : ""}
            </span>
          </div>
        </section>

        <section className="rounded-md border border-line bg-surface">
          <div className="border-b border-line px-5 py-4">
            <h2 className="text-[14px] font-semibold text-ink">Exporter les données</h2>
            <p className="mt-0.5 text-[12px] text-ink-soft">
              Télécharge un fichier JSON contenant les transactions, abonnements, paiements
              récurrents et paramètres.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-b-md px-5 py-3.5">
            <Button variant="outline" onClick={handleExport} disabled={isExporting}>
              <Download className="h-4 w-4" aria-hidden />
              {isExporting ? "Export en cours…" : "Exporter (JSON)"}
            </Button>
            <span
              aria-hidden
              className={`flex items-center gap-1.5 text-[13px] text-positive transition-opacity duration-200 ease-out-quart ${
                exported ? "opacity-100" : "opacity-0"
              }`}
            >
              <Check className="h-4 w-4" />
              Fichier téléchargé
            </span>
            <span role="status" aria-live="polite" aria-atomic="true" className="sr-only">
              {exported ? "Fichier téléchargé" : ""}
            </span>
            {exportError ? (
              <p role="alert" className="text-[13px] text-negative">
                {exportError}
              </p>
            ) : null}
          </div>
        </section>

        <section className="rounded-md border border-line bg-surface">
          <div className="border-b border-line px-5 py-4">
            <h2 className="text-[14px] font-semibold text-ink">Zone de danger</h2>
            <p className="mt-0.5 text-[12px] text-ink-soft">
              Supprime définitivement toutes les transactions, abonnements et paiements
              récurrents. Cette action est irréversible.
            </p>
          </div>

          <div className="rounded-b-md px-5 py-3.5">
            <Button variant="danger" onClick={() => setDeleteAllOpen(true)}>
              <Trash2 className="h-4 w-4" aria-hidden />
              Supprimer toutes les données
            </Button>
          </div>
        </section>
      </div>

      <Modal
        open={confirmOpen}
        onClose={closeConfirmModal}
        title="Confirmer la modification du solde initial"
      >
        <div className="rounded border border-negative/30 bg-negative/10 px-4 py-3 text-[13px] text-negative">
          Modifier le solde initial affecte tous les calculs et tout l'historique du solde
          attendu. Cette action ne peut pas être annulée automatiquement.
        </div>
        <p className="mt-3 text-[13px] text-ink-soft">
          Pour confirmer, tapez la valeur actuelle du solde initial :{" "}
          <span className="font-mono font-medium text-ink">{currentSoldeInitialText}</span>
        </p>
        <Field label="Solde initial actuel" className="mt-3">
          {(fieldProps) => (
            <Input
              {...fieldProps}
              inputMode="decimal"
              autoComplete="off"
              autoFocus
              className="font-mono"
              value={confirmText}
              onChange={(event) => setConfirmText(event.target.value)}
              placeholder={currentSoldeInitialText}
            />
          )}
        </Field>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={closeConfirmModal}>
            Annuler
          </Button>
          <Button variant="danger" disabled={!confirmMatches} onClick={handleConfirmSave}>
            Confirmer la modification
          </Button>
        </div>
      </Modal>

      <Modal
        open={deleteAllOpen}
        onClose={closeDeleteAllModal}
        title="Confirmer la suppression de toutes les données"
      >
        <div className="rounded border border-negative/30 bg-negative/10 px-4 py-3 text-[13px] text-negative">
          Cette action supprime définitivement toutes les transactions, tous les abonnements
          et tous les paiements récurrents. Elle ne peut pas être annulée.
        </div>
        <p className="mt-3 text-[13px] text-ink-soft">
          Pour confirmer, tapez{" "}
          <span className="font-mono font-medium text-ink">{DELETE_CONFIRM_WORD}</span>
        </p>
        <Field label="Confirmation" className="mt-3" error={deleteAllError ?? undefined}>
          {(fieldProps) => (
            <Input
              {...fieldProps}
              autoComplete="off"
              autoFocus
              value={deleteAllText}
              onChange={(event) => setDeleteAllText(event.target.value)}
              placeholder={DELETE_CONFIRM_WORD}
              disabled={isDeletingAll}
            />
          )}
        </Field>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={closeDeleteAllModal} disabled={isDeletingAll}>
            Annuler
          </Button>
          <Button
            variant="danger"
            disabled={!deleteAllMatches || isDeletingAll}
            onClick={handleDeleteAll}
          >
            {isDeletingAll ? "Suppression en cours…" : "Supprimer définitivement"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
