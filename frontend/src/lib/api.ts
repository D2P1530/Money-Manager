import type {
  Transaction,
  Subscription,
  RecurringPayment,
  Settings,
} from "@/data/types";

const BASE_URL = "http://localhost:3000";

export const api = {
  transactions: {
    getAll: () => fetch(`${BASE_URL}/transactions`).then((r) => r.json()),
    create: (data: Omit<Transaction, "id">) =>
      fetch(`${BASE_URL}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    update: (id: string, data: Partial<Transaction>) =>
      fetch(`${BASE_URL}/transactions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    delete: (id: string) =>
      fetch(`${BASE_URL}/transactions/${id}`, {
        method: "DELETE",
      }).then((r) => r.json()),
  },
  subscriptions: {
    getAll: () => fetch(`${BASE_URL}/subscriptions`).then((r) => r.json()),
    create: (data: Omit<Subscription, "id">) =>
      fetch(`${BASE_URL}/subscriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    update: (id: string, data: Partial<Subscription>) =>
      fetch(`${BASE_URL}/subscriptions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    delete: (id: string) =>
      fetch(`${BASE_URL}/subscriptions/${id}`, {
        method: "DELETE",
      }).then((r) => r.json()),
  },
  recurringPayments: {
    getAll: () => fetch(`${BASE_URL}/recurring-payments`).then((r) => r.json()),
    create: (data: Omit<RecurringPayment, "id">) =>
      fetch(`${BASE_URL}/recurring-payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    update: (id: string, data: Partial<RecurringPayment>) =>
      fetch(`${BASE_URL}/recurring-payments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    delete: (id: string) =>
      fetch(`${BASE_URL}/recurring-payments/${id}`, {
        method: "DELETE",
      }).then((r) => r.json()),
  },
  settings: {
    get: () => fetch(`${BASE_URL}/settings`).then((r) => r.json()),
    update: (data: Partial<Settings>) =>
      fetch(`${BASE_URL}/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
  },
  dashboard: {
    get: () => fetch(`${BASE_URL}/dashboard`).then((r) => r.json()),
    update: (soldeBanque: number) =>
      fetch(`${BASE_URL}/dashboard`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ soldeBanque }),
      }).then((r) => r.json()),
  },
};
