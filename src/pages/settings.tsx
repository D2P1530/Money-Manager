import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Field } from "@/components/ui/field";
import { useAuth } from "@/contexts/auth-context";
import { useFinanceData } from "@/data/use-finance-data";
import { formatCurrency } from "@/lib/utils";

export function SettingsPage() {
  const navigate = useNavigate();
  const { deconnexion } = useAuth();
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

  const handleLogout = () => {
    deconnexion();
    navigate("/login");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuration de départ</CardTitle>
          <CardDescription>
            Le solde initial sert de point zéro au calcul du solde attendu.
          </CardDescription>
        </CardHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Solde initial"
            hint={`Solde attendu actuel : ${formatCurrency(soldeAttendu, devise)}`}
          >
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
        <div className="mt-4 flex items-center gap-3 border-t border-line pt-4">
          <Button onClick={handleSave}>Enregistrer</Button>
          <span
            role="status"
            className={`flex items-center gap-1.5 text-[13px] text-positive transition-opacity duration-150 ${
              enregistre ? "opacity-100" : "opacity-0"
            }`}
          >
            <Check className="h-4 w-4" aria-hidden />
            Modifications enregistrées
          </span>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session</CardTitle>
          <CardDescription>
            Les données restent stockées localement dans ce navigateur.
          </CardDescription>
        </CardHeader>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4" aria-hidden />
          Se déconnecter
        </Button>
      </Card>
    </div>
  );
}
