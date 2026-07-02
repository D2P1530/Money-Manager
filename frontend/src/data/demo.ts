import type {
  DashboardState,
  RecurringPayment,
  Settings,
  Subscription,
  Transaction,
} from "./types";

export const categories = [
  "Alimentation",
  "Transport",
  "Abonnements",
  "Shopping",
  "Santé",
  "Divertissement",
  "Factures",
  "Autres",
];

export const demoTransactions: Transaction[] = [
  {
    id: "t1",
    titre: "Courses hebdomadaires",
    categorie: "Alimentation",
    montant: 124.5,
    date: "2024-08-12",
    type: "depense",
  },
  {
    id: "t2",
    titre: "Salaire",
    categorie: "Autres",
    montant: 4200,
    date: "2024-08-05",
    type: "revenu",
  },
  {
    id: "t3",
    titre: "Tram mensuel",
    categorie: "Transport",
    montant: 85,
    date: "2024-08-03",
    type: "depense",
  },
  {
    id: "t4",
    titre: "Cinéma",
    categorie: "Divertissement",
    montant: 26,
    date: "2024-08-09",
    type: "depense",
  },
  {
    id: "t5",
    titre: "Remboursement santé",
    categorie: "Santé",
    montant: 180,
    date: "2024-08-07",
    type: "revenu",
  },
];

export const demoSubscriptions: Subscription[] = [
  {
    id: "s1",
    nom: "Netflix",
    categorie: "Abonnements",
    montant: 18.9,
    periodicite: "mensuel",
    prochainPaiement: "2024-09-02",
    actif: true,
  },
  {
    id: "s2",
    nom: "Fitness Club",
    categorie: "Santé",
    montant: 59,
    periodicite: "mensuel",
    prochainPaiement: "2024-09-10",
    actif: true,
  },
  {
    id: "s3",
    nom: "Assurance habitation",
    categorie: "Factures",
    montant: 320,
    periodicite: "annuel",
    prochainPaiement: "2025-01-15",
    actif: false,
  },
];

export const demoRecurringPayments: RecurringPayment[] = [
  {
    id: "r1",
    nom: "Salaire",
    categorie: "Autres",
    montant: 4200,
    type: "revenu",
    periodicite: "mensuel",
    prochainPaiement: "2026-07-05",
  },
  {
    id: "r2",
    nom: "Loyer",
    categorie: "Factures",
    montant: 1250,
    type: "depense",
    periodicite: "mensuel",
    prochainPaiement: "2026-07-01",
  },
  {
    id: "r3",
    nom: "Bonus annuel",
    categorie: "Autres",
    montant: 3000,
    type: "revenu",
    periodicite: "annuel",
    prochainPaiement: "2026-12-20",
  },
];

export const demoSettings: Settings = {
  soldeInitial: 2500,
  devise: "CHF",
};

export const demoDashboard: DashboardState = {
  soldeBanque: 3380,
};
