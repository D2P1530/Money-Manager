import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { useFinanceData } from "@/data/use-finance-data";
import { formatCurrency } from "@/lib/utils";

export function SettingsPage() {
  const navigate = useNavigate();
  const { deconnexion } = useAuth();
  const { settings, setSettings, soldeAttendu } = useFinanceData();
  const [soldeInitial, setSoldeInitial] = useState(settings.soldeInitial.toString());
  const [devise, setDevise] = useState(settings.devise);

  const handleSave = () => {
    const valeur = Number(soldeInitial);
    if (!Number.isNaN(valeur)) {
      setSettings({ soldeInitial: valeur, devise });
    }
  };

  const handleLogout = () => {
    deconnexion();
    navigate("/login");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres</CardTitle>
          <CardDescription>Personnalisez votre configuration de départ.</CardDescription>
        </CardHeader>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Solde initial</label>
            <Input
              value={soldeInitial}
              onChange={(event) => setSoldeInitial(event.target.value)}
              onBlur={handleSave}
            />
            <p className="mt-1 text-xs text-slate-500">
              Solde attendu actuel: {formatCurrency(soldeAttendu, devise)}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium">Devise par défaut</label>
            <select
              value={devise}
              onChange={(event) => setDevise(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-white/70 bg-white/70 px-3 py-2 text-sm"
            >
              <option value="CHF">CHF - Franc suisse</option>
              <option value="EUR">EUR - Euro</option>
              <option value="USD">USD - Dollar</option>
            </select>
            <Button variant="outline" className="mt-3" onClick={handleSave}>
              Enregistrer
            </Button>
          </div>
        </div>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Session</CardTitle>
          <CardDescription>Gérez votre accès au journal privé.</CardDescription>
        </CardHeader>
        <Button onClick={handleLogout}>Se déconnecter</Button>
      </Card>
    </div>
  );
}
