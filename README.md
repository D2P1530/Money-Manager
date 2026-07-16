# Money Manager

Un gestionnaire de finances personnelles privé, conçu pour suivre ses dépenses, revenus et abonnements, et comparer son solde bancaire réel avec le solde calculé.

Construit avec **React + Vite** (frontend) et **NestJS + Prisma + SQLite** (backend).

---

## Fonctionnalités

- **Tableau de bord** — vue d'ensemble avec solde bancaire, solde attendu et écart détecté
- **Transactions** — ajout, modification, suppression avec recherche et filtres
- **Paiements récurrents** — abonnements et revenus/dépenses récurrents
- **Analyses** — graphiques de flux mensuels et dépenses par catégorie
- **Paramètres** — solde initial et devise

---

## Prérequis

- [Node.js](https://nodejs.org/) v18 ou supérieur
- npm

---

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/D2P1530/Money-Manager.git
cd Money-Manager
```

### 2. Installer et lancer le backend

```bash
cd backend
npm install
```

Crée un fichier `.env` en copiant l'exemple :

```bash
cp .env.example .env
```

Lance les migrations Prisma pour créer la base de données :

```bash
npx prisma migrate dev
```

Lance le backend :

```bash
npm run start:dev
```

Le backend tourne sur `http://localhost:3000`.

### 3. Installer et lancer le frontend

Dans un nouveau terminal :

```bash
cd frontend
npm install
```

Crée un fichier `.env` en copiant l'exemple :

```bash
cp .env.example .env
```

Lance le frontend :

```bash
npm run dev
```

Le frontend tourne sur `http://localhost:5173`.

---

## Variables d'environnement

### Backend (`backend/.env`)

| Variable       | Description                           | Exemple                   |
| -------------- | ------------------------------------- | ------------------------- |
| `DATABASE_URL` | Chemin vers la base de données SQLite | `file:./money-manager.db` |

### Frontend (`frontend/.env`)

| Variable       | Description    | Exemple                 |
| -------------- | -------------- | ----------------------- |
| `VITE_API_URL` | URL du backend | `http://localhost:3000` |

---

## Stack technique

**Frontend**

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Recharts (graphiques)
- React Hook Form + Zod (formulaires)

**Backend**

- NestJS
- Prisma ORM
- SQLite

---

## Structure du projet

```
Money-Manager/
├── frontend/          # Application React
│   └── src/
│       ├── components/
│       ├── data/
│       ├── lib/
│       └── pages/
└── backend/           # API NestJS
    └── src/
        ├── transactions/
        ├── subscriptions/
        ├── recurring-payments/
        ├── settings/
        ├── dashboard/
        └── prisma/
```

---
