export type TransactionType = "depense" | "revenu";
export type Periodicite = "mensuel" | "annuel";

export type Transaction = {
  id: string;
  titre: string;
  categorie: string;
  montant: number;
  date: string;
  type: TransactionType;
  description?: string;
};

export type Subscription = {
  id: string;
  nom: string;
  categorie: string;
  montant: number;
  periodicite: Periodicite;
  prochainPaiement: string;
  actif: boolean;
};

export type RecurringPayment = {
  id: string;
  nom: string;
  categorie: string;
  montant: number;
  type: TransactionType;
  periodicite: Periodicite;
  prochainPaiement: string;
};

export type Settings = {
  soldeInitial: number;
  devise: string;
};

export type DashboardState = {
  soldeBanque: number;
};
