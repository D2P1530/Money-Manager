import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

export function LoginPage() {
  const navigate = useNavigate();
  const { connexion } = useAuth();
  const [erreur, setErreur] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = () => {
    const ok = connexion(email, password);
    if (ok) {
      navigate("/dashboard");
    } else {
      setErreur("Identifiants incorrects. Essayez demo@journal.local / demo123.");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-between px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden max-w-xl space-y-4 lg:block"
        >
          <h1 className="text-4xl font-semibold text-balance">
            Journal financier privé, fluide et élégant.
          </h1>
          <p className="text-slate-600">
            Centralisez vos revenus, dépenses et abonnements avec une vue claire des écarts.
          </p>
          <div className="glass-card space-y-2 p-6">
            <p className="text-sm text-slate-500">Astuce de démonstration</p>
            <p className="text-sm font-semibold">demo@journal.local</p>
            <p className="text-sm font-semibold">mot de passe : demo123</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card w-full max-w-md space-y-6 p-8"
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Connexion</h2>
            <p className="text-sm text-slate-500">
              Accédez à votre espace financier confidentiel.
            </p>
          </div>
          <form className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Adresse email</label>
              <Input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.ch" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mot de passe</label>
              <Input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Votre mot de passe" />
            </div>
            {erreur && <p className="text-sm text-rose-500">{erreur}</p>}
            <Button onClick={onSubmit} className="w-full">
              Se connecter
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
