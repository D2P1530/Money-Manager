import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
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
      setErreur("Identifiants incorrects. Utilisez les accès de démonstration ci-contre.");
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_minmax(0,28rem)]">
      <div className="hidden flex-col justify-between border-r border-line bg-sunken px-12 py-10 lg:flex">
        <div>
          <p className="text-[15px] font-semibold tracking-tight text-ink">Journal financier</p>
          <p className="font-mono text-[11px] text-ink-faint">privé · local · fr-CH</p>
        </div>
        <div className="max-w-md space-y-6">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-ink">
            Vos finances, au centime près.
          </h1>
          <p className="text-[15px] leading-relaxed text-ink-soft">
            Revenus, dépenses et abonnements dans un seul registre. Le solde attendu se
            confronte au relevé bancaire ; chaque écart se voit immédiatement.
          </p>
          <div className="max-w-xs rounded-md border border-line bg-surface">
            <p className="border-b border-line px-4 py-2 text-xs font-medium text-ink-soft">
              Accès de démonstration
            </p>
            <dl className="space-y-1 px-4 py-3 font-mono text-[13px] text-ink">
              <div className="flex justify-between gap-6">
                <dt className="text-ink-faint">email</dt>
                <dd>demo@journal.local</dd>
              </div>
              <div className="flex justify-between gap-6">
                <dt className="text-ink-faint">mot de passe</dt>
                <dd>demo123</dd>
              </div>
            </dl>
          </div>
        </div>
        <p className="font-mono text-[11px] text-ink-faint">
          Données stockées localement — aucun serveur.
        </p>
      </div>

      <div className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <p className="text-[15px] font-semibold tracking-tight text-ink">Journal financier</p>
            <p className="font-mono text-[11px] text-ink-faint">privé · local · fr-CH</p>
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-ink">Connexion</h2>
          <p className="mt-1 text-sm text-ink-soft">Accédez à votre registre confidentiel.</p>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Field label="Adresse email" error={errors.email?.message}>
              {(fieldProps) => (
                <Input
                  {...fieldProps}
                  type="email"
                  autoComplete="email"
                  placeholder="vous@exemple.ch"
                  {...register("email")}
                />
              )}
            </Field>
            <Field label="Mot de passe" error={errors.motDePasse?.message}>
              {(fieldProps) => (
                <Input
                  {...fieldProps}
                  type="password"
                  autoComplete="current-password"
                  {...register("motDePasse")}
                />
              )}
            </Field>
            {erreur && (
              <p
                role="alert"
                className="rounded border border-negative/30 bg-negative-soft px-3 py-2 text-[13px] text-negative"
              >
                {erreur}
              </p>
            )}
            <Button type="submit" className="w-full">
              Se connecter
            </Button>
          </form>
          <div className="mt-6 rounded-md border border-line bg-sunken px-4 py-3 lg:hidden">
            <p className="text-xs font-medium text-ink-soft">Accès de démonstration</p>
            <p className="mt-1 font-mono text-[13px] text-ink">
              demo@journal.local · demo123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
