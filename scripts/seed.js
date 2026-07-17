#!/usr/bin/env node
/**
 * Seeds the local Money Manager API with ~2.5 years of realistic French/Swiss
 * financial data: salary, rent, health insurance, subscriptions, groceries,
 * transport, restaurants, occasional big expenses and irregular income.
 *
 * Usage:
 *   node scripts/seed.js
 *
 * Configuration (in order of precedence):
 *   1. API_BASE_URL / API_KEY environment variables
 *   2. scripts/.env
 *   3. backend/.env
 *   4. fallback: http://localhost:3000 / "changeme"
 */

const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf8");
  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile(path.join(__dirname, ".env"));
loadEnvFile(path.join(__dirname, "..", "backend", ".env"));

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";
const API_KEY = process.env.API_KEY || "changeme";
const MONTHS_BACK = 24; // 2 years of history
const DRY_RUN = process.env.DRY_RUN === "1";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, decimals = 2) {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(decimals));
}

function pick(arr) {
  return arr[randomInt(0, arr.length - 1)];
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function formatDate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function randomDateInMonth(year, monthIndex, dayMin, dayMax) {
  const maxDay = Math.min(dayMax, daysInMonth(year, monthIndex));
  const minDay = Math.min(dayMin, maxDay);
  return new Date(year, monthIndex, randomInt(minDay, maxDay));
}

// ---------------------------------------------------------------------------
// Data pools (French / Swiss flavour)
// ---------------------------------------------------------------------------

const GROCERY_VENDORS = [
  "Migros",
  "Coop",
  "Denner",
  "Aldi Suisse",
  "Lidl",
  "Manor Food",
];
const TRANSPORT_ITEMS = [
  { titre: "Billet CFF", min: 8, max: 45 },
  { titre: "Essence - Station Migrol", min: 45, max: 95 },
  { titre: "Parking centre-ville", min: 5, max: 18 },
  { titre: "Recharge carte TPG", min: 20, max: 45 },
  { titre: "Trajet Uber", min: 12, max: 35 },
];
const RESTAURANT_VENDORS = [
  "Restaurant Le Chat Noir",
  "McDonald's",
  "Kebab Istanbul",
  "Sushi Bar Genève",
  "Café de Paris",
  "Pizzeria Napoli",
  "Brasserie du Parc",
  "Boulangerie - pause déjeuner",
];
const CLOTHES_VENDORS = [
  "Zara",
  "H&M",
  "Uniqlo",
  "Manor",
  "Zalando",
  "Décathlon",
];
const GIFT_REASONS = [
  "Cadeau anniversaire pour Maman",
  "Cadeau anniversaire pour Léa",
  "Cadeau de Noël pour la famille",
  "Cadeau anniversaire pour Thomas",
  "Cadeau de mariage - Julien & Sophie",
  "Cadeau anniversaire pour Papa",
  "Cadeau de naissance pour Camille",
];
const VACATION_DESTINATIONS = [
  "Barcelone",
  "Lisbonne",
  "Rome",
  "Amsterdam",
  "Nice",
  "Berlin",
  "Athènes",
];
const ELECTRONICS_VENDORS = ["Digitec", "Interdiscount", "Apple Store"];
const SELLING_PLATFORMS = ["Anibis", "Ricardo", "Facebook Marketplace"];
const SOLD_ITEMS = [
  "vélo électrique",
  "ancienne console de jeux",
  "meuble IKEA",
  "appareil photo",
  "skis",
];

// ---------------------------------------------------------------------------
// Transaction generation
// ---------------------------------------------------------------------------

const transactions = [];

function addTransaction(date, titre, categorie, montant, type, description) {
  transactions.push({
    date,
    titre,
    categorie,
    montant: Number(montant.toFixed(2)),
    type,
    ...(description ? { description } : {}),
  });
}

const today = new Date();
const startDate = new Date(today);
startDate.setMonth(startDate.getMonth() - MONTHS_BACK);
startDate.setDate(1);

for (
  let cursor = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  cursor <= today;
  cursor.setMonth(cursor.getMonth() + 1)
) {
  const year = cursor.getFullYear();
  const monthIndex = cursor.getMonth();
  const isCurrentMonth =
    year === today.getFullYear() && monthIndex === today.getMonth();
  const maxDay = isCurrentMonth
    ? today.getDate()
    : daysInMonth(year, monthIndex);

  if (maxDay < 1) continue;

  // --- Salaire mensuel ------------------------------------------------
  addTransaction(
    randomDateInMonth(year, monthIndex, Math.min(25, maxDay), maxDay),
    "Salaire - Atelier Numérique SA",
    "Salaire",
    randomFloat(3400, 3600),
    "revenu",
  );

  // --- 13ème salaire (décembre) ---------------------------------------
  if (monthIndex === 11) {
    addTransaction(
      randomDateInMonth(year, monthIndex, Math.min(20, maxDay), maxDay),
      "13ème salaire - Atelier Numérique SA",
      "Salaire",
      randomFloat(3400, 3600),
      "revenu",
    );
  }

  // --- Loyer ------------------------------------------------------------
  addTransaction(
    randomDateInMonth(year, monthIndex, 1, Math.min(3, maxDay)),
    "Loyer appartement",
    "Logement",
    1250,
    "depense",
  );

  // --- Assurance maladie --------------------------------------------
  addTransaction(
    randomDateInMonth(year, monthIndex, 1, Math.min(5, maxDay)),
    "Assurance maladie (LaMal) - Assura",
    "Santé",
    randomFloat(340, 370),
    "depense",
  );

  // --- Abonnements récurrents -----------------------------------------
  if (maxDay >= 10) {
    addTransaction(
      randomDateInMonth(year, monthIndex, 8, 10),
      "Netflix",
      "Abonnements",
      15.9,
      "depense",
    );
  }
  if (maxDay >= 12) {
    addTransaction(
      randomDateInMonth(year, monthIndex, 11, 12),
      "Spotify Premium",
      "Abonnements",
      12.95,
      "depense",
    );
  }
  if (maxDay >= 5) {
    addTransaction(
      randomDateInMonth(year, monthIndex, 4, 5),
      "Abonnement mobile - Swisscom",
      "Abonnements",
      39.95,
      "depense",
    );
  }
  addTransaction(
    randomDateInMonth(year, monthIndex, 1, Math.min(3, maxDay)),
    "Abonnement salle de sport - Migros Fitness",
    "Abonnements",
    59.0,
    "depense",
  );

  // --- Courses (2 à 3 fois par mois) -----------------------------------
  const groceryCount = randomInt(2, 3);
  for (let i = 0; i < groceryCount; i++) {
    addTransaction(
      randomDateInMonth(year, monthIndex, 1, maxDay),
      `Courses - ${pick(GROCERY_VENDORS)}`,
      "Alimentation",
      randomFloat(18, 130),
      "depense",
    );
  }

  // --- Transport (1 à 2 fois par mois) ----------------------------------
  const transportCount = randomInt(1, 2);
  for (let i = 0; i < transportCount; i++) {
    const item = pick(TRANSPORT_ITEMS);
    addTransaction(
      randomDateInMonth(year, monthIndex, 1, maxDay),
      item.titre,
      "Transport",
      randomFloat(item.min, item.max),
      "depense",
    );
  }

  // --- Restaurants (0 à 2 fois par mois) --------------------------------
  const restaurantCount = randomInt(0, 2);
  for (let i = 0; i < restaurantCount; i++) {
    addTransaction(
      randomDateInMonth(year, monthIndex, 1, maxDay),
      pick(RESTAURANT_VENDORS),
      "Divertissement",
      randomFloat(15, 75),
      "depense",
    );
  }

  // --- Vêtements (environ un mois sur trois) -----------------------------
  if (Math.random() < 0.35) {
    addTransaction(
      randomDateInMonth(year, monthIndex, 1, maxDay),
      `Shopping vêtements - ${pick(CLOTHES_VENDORS)}`,
      "Vêtements",
      randomFloat(35, 220),
      "depense",
    );
  }

  // --- Cadeau d'anniversaire (environ un mois sur quatre) -----------------
  if (Math.random() < 0.25) {
    addTransaction(
      randomDateInMonth(year, monthIndex, 1, maxDay),
      pick(GIFT_REASONS),
      "Autres",
      randomFloat(30, 120),
      "depense",
    );
  }

  // --- Vente d'objets (revenu irrégulier, environ un mois sur cinq) -----
  if (Math.random() < 0.2) {
    addTransaction(
      randomDateInMonth(year, monthIndex, 1, maxDay),
      `Vente ${pick(SOLD_ITEMS)} sur ${pick(SELLING_PLATFORMS)}`,
      "Autres",
      randomFloat(50, 400),
      "revenu",
    );
  }
}

// --- Vacances (2 à 3 voyages sur toute la période) ---------------------
const vacationMonthsAgo = [
  randomInt(3, 8),
  randomInt(10, 16),
  randomInt(18, MONTHS_BACK - 2),
];
for (const monthsAgo of vacationMonthsAgo) {
  const vacationDate = new Date(today);
  vacationDate.setMonth(vacationDate.getMonth() - monthsAgo);
  if (vacationDate < startDate) continue;
  const destination = pick(VACATION_DESTINATIONS);
  const year = vacationDate.getFullYear();
  const monthIndex = vacationDate.getMonth();
  const maxDay = daysInMonth(year, monthIndex);
  addTransaction(
    randomDateInMonth(year, monthIndex, 1, maxDay),
    `Vol - ${destination}`,
    "Voyages",
    randomFloat(90, 320),
    "depense",
  );
  addTransaction(
    randomDateInMonth(year, monthIndex, 1, maxDay),
    `Hôtel - ${destination}`,
    "Voyages",
    randomFloat(250, 700),
    "depense",
  );
}

// --- Nouveau téléphone (1 à 2 fois sur toute la période) ----------------
const phoneMonthsAgo = [randomInt(4, 14), randomInt(16, MONTHS_BACK - 2)];
for (const monthsAgo of phoneMonthsAgo.slice(0, randomInt(1, 2))) {
  const phoneDate = new Date(today);
  phoneDate.setMonth(phoneDate.getMonth() - monthsAgo);
  if (phoneDate < startDate) continue;
  const year = phoneDate.getFullYear();
  const monthIndex = phoneDate.getMonth();
  const maxDay = daysInMonth(year, monthIndex);
  addTransaction(
    randomDateInMonth(year, monthIndex, 1, maxDay),
    `Nouveau smartphone - ${pick(ELECTRONICS_VENDORS)}`,
    "Autres",
    randomFloat(650, 1100),
    "depense",
  );
}

transactions.sort((a, b) => a.date - b.date);

// ---------------------------------------------------------------------------
// Optional: a handful of subscriptions / recurring payments records
// (populates the dedicated Subscriptions / Recurring Payments pages)
// ---------------------------------------------------------------------------

function nextMonthDate(day) {
  const d = new Date(today.getFullYear(), today.getMonth() + 1, day);
  return formatDate(d);
}

const subscriptions = [
  {
    nom: "Netflix",
    categorie: "Abonnements",
    montant: 15.9,
    periodicite: "mensuel",
    prochainPaiement: nextMonthDate(9),
    actif: true,
  },
  {
    nom: "Spotify Premium",
    categorie: "Abonnements",
    montant: 12.95,
    periodicite: "mensuel",
    prochainPaiement: nextMonthDate(12),
    actif: true,
  },
  {
    nom: "Abonnement mobile - Swisscom",
    categorie: "Abonnements",
    montant: 39.95,
    periodicite: "mensuel",
    prochainPaiement: nextMonthDate(5),
    actif: true,
  },
  {
    nom: "Abonnement salle de sport - Migros Fitness",
    categorie: "Abonnements",
    montant: 59.0,
    periodicite: "mensuel",
    prochainPaiement: nextMonthDate(2),
    actif: true,
  },
  {
    nom: "Disney+ (résilié)",
    categorie: "Abonnements",
    montant: 8.9,
    periodicite: "mensuel",
    prochainPaiement: nextMonthDate(15),
    actif: false,
  },
];

const recurringPayments = [
  {
    nom: "Salaire - Atelier Numérique SA",
    categorie: "Salaire",
    montant: 3500,
    type: "revenu",
    periodicite: "mensuel",
    prochainPaiement: nextMonthDate(25),
  },
  {
    nom: "Loyer appartement",
    categorie: "Logement",
    montant: 1250,
    type: "depense",
    periodicite: "mensuel",
    prochainPaiement: nextMonthDate(1),
  },
  {
    nom: "Assurance maladie (LaMal) - Assura",
    categorie: "Santé",
    montant: 355,
    type: "depense",
    periodicite: "mensuel",
    prochainPaiement: nextMonthDate(3),
  },
];

// ---------------------------------------------------------------------------
// API calls
// ---------------------------------------------------------------------------

async function postResource(endpoint, body) {
  if (DRY_RUN) return body;

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": API_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const error = new Error(`${res.status} ${res.statusText} - ${text}`);
    error.status = res.status;
    throw error;
  }

  return res.json();
}

async function main() {
  if (DRY_RUN) console.log("DRY RUN - no requests will be sent.\n");
  console.log(
    `Seeding ${API_BASE_URL} with ${transactions.length} transactions...`,
  );
  console.log(`Date range: ${formatDate(startDate)} -> ${formatDate(today)}\n`);

  let success = 0;
  let failed = 0;

  for (const [index, tx] of transactions.entries()) {
    const payload = {
      titre: tx.titre,
      categorie: tx.categorie,
      montant: tx.montant,
      date: formatDate(tx.date),
      type: tx.type,
      ...(tx.description ? { description: tx.description } : {}),
    };

    try {
      await postResource("/transactions", payload);
      success++;
    } catch (err) {
      failed++;
      if (err.status === 401) {
        console.error(
          "\nAuthentication failed (401). Check API_KEY in scripts/.env or backend/.env.",
        );
        process.exit(1);
      }
      console.error(
        `Failed to create transaction "${payload.titre}" (${payload.date}): ${err.message}`,
      );
    }

    if ((index + 1) % 25 === 0 || index === transactions.length - 1) {
      console.log(
        `  ${index + 1}/${transactions.length} processed (${success} ok, ${failed} failed)`,
      );
    }
  }

  console.log("\nSeeding subscriptions...");
  for (const sub of subscriptions) {
    try {
      await postResource("/subscriptions", sub);
      console.log(`  + subscription: ${sub.nom}`);
    } catch (err) {
      console.error(
        `  Failed to create subscription "${sub.nom}": ${err.message}`,
      );
    }
  }

  console.log("\nSeeding recurring payments...");
  for (const rp of recurringPayments) {
    try {
      await postResource("/recurring-payments", rp);
      console.log(`  + recurring payment: ${rp.nom}`);
    } catch (err) {
      console.error(
        `  Failed to create recurring payment "${rp.nom}": ${err.message}`,
      );
    }
  }

  console.log(`\nDone. ${success} transactions created, ${failed} failed.`);
}

main();
