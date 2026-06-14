import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Field } from "@/components/ui/field";
import { useFinanceData } from "@/data/use-finance-data";
import { formatCurrency } from "@/lib/utils";

export function SettingsPage() {
  const { settings, setSettings, soldeAttendu } = useFinanceData();
  const [soldeInitial, setSoldeInitial] = useState(settings.soldeInitial.toString());
  const [devise, setDevise] = useState(settings.devise);
  const [enregistre, setEnregistre] = useState(false);
  const timeoutRef = useRef<number>();

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  const handleSave = () => {
    const valeur = Number(soldeInitial);
    if (Number.isNaN(valeur)) return;
    setSettings({ soldeInitial: valeur, devise });
    setEnregistre(true);
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setEnregistre(false), 2500);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-8 border-b border-line pb-6">
        <h1 className="text-[22px] font-semibold tracking-tight text-ink">Paramètres</h1>
        <p className="mt-1 text-[13px] text-ink-soft">
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
          <Field label="Solde initial">
            {(fieldProps) => (
              <Input
                {...fieldProps}
                inputMode="decimal"
                className="font-mono"
                value={soldeInitial}
                onChange={(event) => setSoldeInitial(event.target.value)}
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
          <span
            role="status"
            className={`flex items-center gap-1.5 text-[13px] text-positive transition-opacity duration-200 ease-out-quart ${
              enregistre ? "opacity-100" : "opacity-0"
            }`}
          >
            <Check className="h-4 w-4" aria-hidden />
            Modifications enregistrées
          </span>
        </div>
      </div>
    </div>
  );
}
