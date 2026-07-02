-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titre" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "montant" REAL NOT NULL,
    "date" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "compte" TEXT NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "montant" REAL NOT NULL,
    "periodicite" TEXT NOT NULL,
    "prochainPaiement" TEXT NOT NULL,
    "actif" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "RecurringPayment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "montant" REAL NOT NULL,
    "type" TEXT NOT NULL,
    "periodicite" TEXT NOT NULL,
    "prochainPaiement" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "soldeInitial" REAL NOT NULL,
    "devise" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "DashboardState" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "soldeBanque" REAL NOT NULL
);
