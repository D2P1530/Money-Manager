import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

const schema = z.object({
  email: z.string().email("Adresse email invalide"),
  motDePasse: z.string().min(4, "Mot de passe trop court"),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { connexion } = useAuth();
  const [erreur, setErreur] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormValues) => {
    const ok = connexion(data.email, data.motDePasse);
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
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label className="text-sm font-medium">Adresse email</label>
              <Input type="email" placeholder="vous@exemple.ch" {...register("email")} />
              {errors.email && <p className="text-xs text-rose-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mot de passe</label>
              <Input type="password" placeholder="Votre mot de passe" {...register("motDePasse")} />
              {errors.motDePasse && (
                <p className="text-xs text-rose-500">{errors.motDePasse.message}</p>
              )}
            </div>
            {erreur && <p className="text-sm text-rose-500">{erreur}</p>}
            <Button type="submit" className="w-full">
              Se connecter
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
