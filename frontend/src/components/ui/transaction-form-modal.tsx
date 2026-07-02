import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Field } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { categories } from "@/data/demo";
import { useFinanceData } from "@/data/use-finance-data";
import type { Transaction } from "@/data/types";

const today = () => new Date().toISOString().slice(0, 10);

const schema = z.object({
  titre: z.string().min(2, "Titre requis"),
  categorie: z.string().min(2, "Catégorie requise"),
  montant: z.coerce.number().positive("Montant positif requis"),
  date: z.string().min(1, "Date requise"),
  type: z.enum(["depense", "revenu"]),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onClose: () => void;
  editTarget?: Transaction | null;
  defaultType?: "depense" | "revenu";
};

export function TransactionFormModal({
  open,
  onClose,
  editTarget = null,
  defaultType = "depense",
}: Props) {
  const { transactions, setTransactions } = useFinanceData();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: defaultType, date: today() },
  });

  useEffect(() => {
    if (!open) return;
    if (editTarget) {
      reset({
        titre: editTarget.titre,
        categorie: editTarget.categorie,
        montant: editTarget.montant,
        date: editTarget.date,
        type: editTarget.type,
        description: editTarget.description ?? "",
      });
    } else {
      reset({ type: defaultType, date: today() });
    }
  }, [open, editTarget, defaultType, reset]);

  const onSubmit = (data: FormValues) => {
    const desc = data.description?.trim() || undefined;
    if (editTarget) {
      setTransactions(
        transactions.map((t) =>
          t.id === editTarget.id
            ? {
                ...t,
                titre: data.titre,
                categorie: data.categorie,
                montant: data.montant,
                date: data.date,
                type: data.type,
                description: desc,
              }
            : t
        )
      );
    } else {
      setTransactions([
        {
          id: crypto.randomUUID(),
          titre: data.titre,
          categorie: data.categorie,
          montant: data.montant,
          date: data.date,
          type: data.type,
          description: desc,
        },
        ...transactions,
      ]);
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editTarget ? "Modifier la transaction" : "Ajouter une transaction"}
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Field label="Titre" error={errors.titre?.message}>
          {(fieldProps) => (
            <Input
              {...fieldProps}
              autoFocus
              placeholder="Ex. : facture d'électricité"
              {...register("titre")}
            />
          )}
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Type">
            {(fieldProps) => (
              <Select {...fieldProps} {...register("type")}>
                <option value="depense">Dépense</option>
                <option value="revenu">Revenu</option>
              </Select>
            )}
          </Field>
          <Field label="Catégorie" error={errors.categorie?.message}>
            {(fieldProps) => (
              <Select {...fieldProps} {...register("categorie")}>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Select>
            )}
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Montant" error={errors.montant?.message}>
            {(fieldProps) => (
              <Input
                {...fieldProps}
                type="number"
                step="0.01"
                inputMode="decimal"
                className="font-mono"
                {...register("montant")}
              />
            )}
          </Field>
          <Field label="Date" error={errors.date?.message}>
            {(fieldProps) => <Input {...fieldProps} type="date" {...register("date")} />}
          </Field>
        </div>
        <Field label="Description" hint="Optionnel — notes ou justificatif">
          {(fieldProps) => (
            <textarea
              {...fieldProps}
              rows={2}
              placeholder="Ex. : abonnement annuel, reçu #1042…"
              className="w-full resize-none rounded border border-line-strong bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-faint transition-colors duration-150 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              {...register("description")}
            />
          )}
        </Field>
        <Button type="submit" className="w-full">
          {editTarget ? "Enregistrer les modifications" : "Ajouter la transaction"}
        </Button>
      </form>
    </Modal>
  );
}
