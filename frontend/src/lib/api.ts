import type {
  Transaction,
  Subscription,
  RecurringPayment,
  Settings,
} from "@/data/types";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const authHeaders = { "X-API-Key": API_KEY };

export const api = {
  transactions: {
    getAll: () =>
      fetch(`${BASE_URL}/transactions`, { headers: authHeaders }).then((r) =>
        r.json(),
      ),
    create: (data: Omit<Transaction, "id">) =>
      fetch(`${BASE_URL}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    update: (id: string, data: Partial<Transaction>) =>
      fetch(`${BASE_URL}/transactions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    delete: (id: string) =>
      fetch(`${BASE_URL}/transactions/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      }).then((r) => r.json()),
  },
  subscriptions: {
    getAll: () =>
      fetch(`${BASE_URL}/subscriptions`, { headers: authHeaders }).then((r) =>
        r.json(),
      ),
    create: (data: Omit<Subscription, "id">) =>
      fetch(`${BASE_URL}/subscriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    update: (id: string, data: Partial<Subscription>) =>
      fetch(`${BASE_URL}/subscriptions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    delete: (id: string) =>
      fetch(`${BASE_URL}/subscriptions/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      }).then((r) => r.json()),
  },
  recurringPayments: {
    getAll: () =>
      fetch(`${BASE_URL}/recurring-payments`, { headers: authHeaders }).then(
        (r) => r.json(),
      ),
    create: (data: Omit<RecurringPayment, "id">) =>
      fetch(`${BASE_URL}/recurring-payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    update: (id: string, data: Partial<RecurringPayment>) =>
      fetch(`${BASE_URL}/recurring-payments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    delete: (id: string) =>
      fetch(`${BASE_URL}/recurring-payments/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      }).then((r) => r.json()),
  },
  settings: {
    get: () =>
      fetch(`${BASE_URL}/settings`, { headers: authHeaders }).then((r) =>
        r.ok ? r.json() : null,
      ),
    update: (data: Partial<Settings>) =>
      fetch(`${BASE_URL}/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
  },
  dashboard: {
    get: () =>
      fetch(`${BASE_URL}/dashboard`, { headers: authHeaders }).then((r) =>
        r.ok ? r.json() : null,
      ),
    update: (soldeBanque: number) =>
      fetch(`${BASE_URL}/dashboard`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({ soldeBanque }),
      }).then((r) => r.json()),
  },
};
