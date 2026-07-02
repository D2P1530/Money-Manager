# Guide — Migration localStorage → API REST

## Money Manager | NestJS + Prisma + SQLite

---

## Comprendre ce qu'on fait

Actuellement les données vivent dans le **navigateur** (localStorage).
On va les déplacer dans une **vraie base de données** (SQLite) sur ton Raspberry Pi,
accessible via une **API REST** (NestJS).

```
AVANT :
[Page React] → useFinanceData() → localStorage (navigateur)

APRÈS :
[Page React] → useFinanceData() → fetch() → API NestJS → Prisma → SQLite
```

### Les 5 ressources à migrer

| Ressource          | Endpoints à créer                   |
| ------------------ | ----------------------------------- |
| transactions       | GET / POST / PUT /:id / DELETE /:id |
| subscriptions      | GET / POST / PUT /:id / DELETE /:id |
| recurring-payments | GET / POST / PUT /:id / DELETE /:id |
| settings           | GET / PUT                           |
| dashboard          | GET / PUT (juste le solde bancaire) |

---

## PARTIE 1 — BACKEND (NestJS)

> Tu fais cette partie en entier avant de toucher au frontend.
> Une fois l'API qui tourne et répond correctement, tu migres le frontend.

---

### Étape 1 — Vérifier que le backend démarre

```bash
cd backend
npm run start:dev
```

Ouvre `http://localhost:3000` → tu dois voir "Hello World!".
Si c'est bon, continue.

---

### Étape 2 — Importer PrismaModule dans AppModule

Ouvre `src/app.module.ts` et ajoute `PrismaModule` dans les imports :

```typescript
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule],
})
```

Sans ça, `PrismaService` ne sera pas disponible dans les autres modules.

---

### Étape 3 — Créer les ressources avec le CLI

Lance ces commandes une par une dans `backend/` :

```bash
nest g resource transactions
nest g resource subscriptions
nest g resource recurring-payments
nest g resource settings
nest g resource dashboard
```

Pour chaque commande :

- Choisis **REST API**
- Choisis **Yes** pour générer les CRUD entry points

Chaque commande crée un dossier avec module + controller + service.

---

### Étape 4 — Importer PrismaModule dans chaque module de ressource

Pour que chaque service puisse parler à la base de données, il faut importer
`PrismaModule` dans chaque module. Exemple pour `transactions.module.ts` :

```typescript
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
```

Fais la même chose pour chaque module (subscriptions, recurring-payments, etc.).

---

### Étape 5 — Créer les DTOs (Data Transfer Objects)

Un DTO c'est un objet qui définit la structure des données reçues dans une requête.
C'est la validation de ce que le frontend envoie.

Pour chaque ressource, tu auras deux DTOs :

- `create-xxx.dto.ts` → pour la création (POST)
- `update-xxx.dto.ts` → pour la modification (PUT)

Installe d'abord les librairies de validation :

```bash
npm install class-validator class-transformer
```

Exemple pour `create-transaction.dto.ts` :

```typescript
import { IsString, IsNumber, IsEnum, IsOptional } from "class-validator";

export class CreateTransactionDto {
  @IsString()
  titre: string;

  @IsString()
  categorie: string;

  @IsNumber()
  montant: number;

  @IsString()
  date: string;

  @IsEnum(["depense", "revenu"])
  type: "depense" | "revenu";

  @IsString()
  compte: string;

  @IsString()
  @IsOptional()
  description?: string;
}
```

Active la validation globale dans `main.ts` :

```typescript
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
```

---

### Étape 6 — Coder les services (la logique base de données)

C'est ici que tu utilises Prisma pour lire/écrire en base.
Injecte `PrismaService` dans chaque service.

Exemple complet pour `transactions.service.ts` :

```typescript
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  // GET /transactions → retourne toutes les transactions
  findAll() {
    return this.prisma.transaction.findMany({
      orderBy: { date: "desc" },
    });
  }

  // POST /transactions → crée une transaction
  create(dto: CreateTransactionDto) {
    return this.prisma.transaction.create({
      data: dto,
    });
  }

  // PUT /transactions/:id → modifie une transaction
  update(id: string, dto: UpdateTransactionDto) {
    return this.prisma.transaction.update({
      where: { id },
      data: dto,
    });
  }

  // DELETE /transactions/:id → supprime une transaction
  remove(id: string) {
    return this.prisma.transaction.delete({
      where: { id },
    });
  }
}
```

Fais la même chose pour chaque ressource en adaptant les noms.

---

### Étape 7 — Vérifier les controllers

Les controllers générés par NestJS sont déjà câblés aux bonnes routes.
Vérifie juste que chaque méthode appelle bien le bon service.

Exemple pour `transactions.controller.ts` :

```typescript
@Get()
findAll() {
  return this.transactionsService.findAll();
}

@Post()
create(@Body() createTransactionDto: CreateTransactionDto) {
  return this.transactionsService.create(createTransactionDto);
}

@Put(':id')
update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
  return this.transactionsService.update(id, updateTransactionDto);
}

@Delete(':id')
remove(@Param('id') id: string) {
  return this.transactionsService.remove(id);
}
```

---

### Étape 8 — Activer CORS

Le frontend (port 5173) va appeler le backend (port 3000).
Par sécurité, les navigateurs bloquent ça par défaut — c'est CORS.
Active-le dans `main.ts` :

```typescript
app.enableCors({
  origin: "http://localhost:5173",
});
```

---

### Étape 9 — Tester l'API avec un outil REST

Avant de toucher au frontend, teste que chaque endpoint fonctionne.
Utilise **Insomnia** (gratuit) ou l'extension **Thunder Client** dans VSCode.

Teste dans l'ordre :

```
GET    http://localhost:3000/transactions       → doit retourner []
POST   http://localhost:3000/transactions       → envoie un JSON, doit retourner l'objet créé
GET    http://localhost:3000/transactions       → doit retourner [l'objet créé]
PUT    http://localhost:3000/transactions/:id   → modifie, doit retourner l'objet modifié
DELETE http://localhost:3000/transactions/:id   → supprime, doit retourner l'objet supprimé
GET    http://localhost:3000/transactions       → doit retourner []
```

Fais ça pour chaque ressource. Ne passe à la partie frontend que quand tout répond correctement.

---

## PARTIE 2 — FRONTEND (connecter au backend)

> Ne commence cette partie que quand ton API tourne et répond correctement.

---

### Étape 10 — Créer le fichier api.ts

Dans `frontend/src/lib/`, crée un fichier `api.ts`.
Ce fichier va centraliser tous les appels fetch vers ton API.

```typescript
const BASE_URL = "http://localhost:3000";

// Transactions
export const api = {
  transactions: {
    getAll: () => fetch(`${BASE_URL}/transactions`).then((r) => r.json()),
    create: (data) =>
      fetch(`${BASE_URL}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    update: (id, data) =>
      fetch(`${BASE_URL}/transactions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    delete: (id) =>
      fetch(`${BASE_URL}/transactions/${id}`, {
        method: "DELETE",
      }).then((r) => r.json()),
  },
  // Même structure pour subscriptions, recurringPayments, settings, dashboard
};
```

---

### Étape 11 — Réécrire use-finance-data.ts

C'est le changement le plus important côté frontend.
`useLocalStorage` disparaît. À la place : `useState` + `useEffect` avec fetch.

Nouveau pattern pour les transactions :

```typescript
const [transactions, setTransactions] = useState<Transaction[]>([]);
const [isLoading, setIsLoading] = useState(true);

// Chargement initial
useEffect(() => {
  api.transactions
    .getAll()
    .then((data) => setTransactions(data))
    .finally(() => setIsLoading(false));
}, []);

// Ajout
const addTransaction = async (data: CreateTransactionDto) => {
  const newTransaction = await api.transactions.create(data);
  setTransactions((prev) => [newTransaction, ...prev]);
};

// Modification
const updateTransaction = async (id: string, data: UpdateTransactionDto) => {
  const updated = await api.transactions.update(id, data);
  setTransactions((prev) => prev.map((t) => (t.id === id ? updated : t)));
};

// Suppression
const deleteTransaction = async (id: string) => {
  await api.transactions.delete(id);
  setTransactions((prev) => prev.filter((t) => t.id !== id));
};
```

---

### Étape 12 — Adapter les pages

Les pages utilisent actuellement des setters directs comme `setTransactions([...])`.
Il faut les remplacer par les nouvelles fonctions async.

Exemple dans `transactions.tsx` :

```typescript
// AVANT
setTransactions(transactions.filter((t) => t.id !== deleteTarget.id));

// APRÈS
await deleteTransaction(deleteTarget.id);
```

Les pages à modifier :

- `transactions.tsx` → utilise addTransaction, updateTransaction, deleteTransaction
- `subscriptions.tsx` → utilise les fonctions subscriptions + recurringPayments
- `dashboard.tsx` → utilise updateDashboard
- `settings.tsx` → utilise updateSettings

---

### Étape 13 — Supprimer storage.ts et demo.ts

Une fois que tout fonctionne avec l'API :

- Supprime `src/lib/storage.ts` (plus de localStorage)
- Supprime `src/data/demo.ts` (le backend est la source de vérité)

---

### Ce qui NE change PAS côté frontend

- `src/data/types.ts` → aucun changement
- Toutes les pages visuellement → aucun changement
- Les composants UI → aucun changement
- La logique de filtrage/tri → aucun changement

---

## PARTIE 3 — DÉPLOIEMENT (Raspberry Pi)

> À faire une fois que tout fonctionne en local.

---

### Étape 14 — Dockeriser le backend

Crée un `Dockerfile` à la racine de `backend/` :

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npx prisma generate
CMD ["node", "dist/main.js"]
```

Crée un `docker-compose.yml` à la racine du projet :

```yaml
services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    volumes:
      - ./backend/prisma:/app/prisma
    environment:
      DATABASE_URL: file:./prisma/money-manager.db
```

---

### Étape 15 — Déployer sur le Raspberry Pi

```bash
# Sur le Pi
git pull
docker compose up -d --build
```

Ensuite configure ton tunnel Cloudflare pour pointer vers le port 3000.
Mets à jour `BASE_URL` dans `api.ts` avec ton domaine `d2p153.ch`.

---

## Ordre de travail recommandé

```
[ ] Étape 1  — Vérifier que le backend démarre
[ ] Étape 2  — Importer PrismaModule dans AppModule
[ ] Étape 3  — Créer les 5 ressources avec nest g resource
[ ] Étape 4  — Importer PrismaModule dans chaque module
[ ] Étape 5  — Créer les DTOs + activer ValidationPipe
[ ] Étape 6  — Coder les services (Prisma)
[ ] Étape 7  — Vérifier les controllers
[ ] Étape 8  — Activer CORS
[ ] Étape 9  — Tester chaque endpoint avec Insomnia/Thunder Client
[ ] Étape 10 — Créer api.ts dans le frontend
[ ] Étape 11 — Réécrire use-finance-data.ts
[ ] Étape 12 — Adapter les pages
[ ] Étape 13 — Supprimer storage.ts et demo.ts
[ ] Étape 14 — Dockeriser le backend
[ ] Étape 15 — Déployer sur le Raspberry Pi
```
