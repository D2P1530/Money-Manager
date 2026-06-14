export type TransactionType = "depense" | "revenu";

export type Transaction = {
  id: string;
  titre: string;
  categorie: string;
  montant: number;
  date: string;
  type: TransactionType;
  compte: string;
  description?: string;
};

export type Subscription = {
  id: string;
  nom: string;
  categorie: string;
  montant: number;
  periodicite: "mensuel" | "annuel";
  prochainPaiement: string;
  actif: boolean;
};

export type RecurringPayment = {
  id: string;
  nom: string;
  categorie: string;
  montant: number;
  type: TransactionType;
  periodicite: "mensuel" | "annuel";
  prochainPaiement: string;
};

export type Settings = {
  soldeInitial: number;
  devise: string;
};

export type DashboardState = {
  soldeBanque: number;
};
