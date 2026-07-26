import { useCallback, useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Field } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { useFinanceData } from "@/data/use-finance-data";
import { formatCurrency } from "@/lib/utils";

export function SettingsPage() {
  const { settings, updateSettings, soldeAttendu } = useFinanceData();
  const [soldeInitial, setSoldeInitial] = useState(settings.soldeInitial.toString());
  const [devise, setDevise] = useState(settings.devise);
  const [enregistre, setEnregistre] = useState(false);
  const [soldeError, setSoldeError] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [pendingSoldeInitial, setPendingSoldeInitial] = useState<number | null>(null);
  const timeoutRef = useRef<number>();

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  // Resynchronise les champs quand les paramètres arrivent depuis l'API (fetch async).
  useEffect(() => {
    setSoldeInitial(settings.soldeInitial.toString());
    setDevise(settings.devise);
  }, [settings.soldeInitial, settings.devise]);

  const applySave = (valeur: number) => {
    updateSettings({ soldeInitial: valeur, devise });
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

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-8 border-b border-line pb-6">
        <p className="text-[13px] text-ink-soft">
          Journal financier privé — configuration globale
        </p>
      </header>

      <div className="rounded-md border border-line bg-surface">
        <div className="flex items-start justify-between gap-6 border-b border-line px-5 py-4">
          <div>
            <h2 className="text-[14px] font-semibold text-ink">Point de départ</h2>
            <p className="mt-0.5 text-[12px] text-ink-soft">
              Base de calcul du solde attendu
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-mono text-[22px] font-semibold tabular-nums leading-none text-ink">
              {formatCurrency(soldeAttendu, devise)}
            </p>
            <p className="mt-1 text-[12px] text-ink-faint">solde attendu actuel</p>
          </div>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <Field label="Solde initial" error={soldeError ? "Format invalide — utilisez 1234.56" : undefined}>
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
          <Field label="Devise par défaut">
            {(fieldProps) => (
              <Select
                {...fieldProps}
                value={devise}
                onChange={(event) => setDevise(event.target.value)}
              >
                <option value="CHF">CHF — franc suisse</option>
                <option value="EUR">EUR — euro</option>
                <option value="USD">USD — dollar américain</option>
              </Select>
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
    </div>
  );
}
