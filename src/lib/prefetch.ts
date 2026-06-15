const prefetched = new Set<string>();

const factories: Record<string, () => Promise<unknown>> = {
  "/dashboard": () => import("@/pages/dashboard"),
  "/transactions": () => import("@/pages/transactions"),
  "/subscriptions": () => import("@/pages/subscriptions"),
  "/analytics": () => import("@/pages/analytics"),
  "/settings": () => import("@/pages/settings"),
};

export function prefetchRoute(path: string): void {
  if (prefetched.has(path)) return;
  prefetched.add(path);
  factories[path]?.();
}

export function prefetchAllRoutes(): void {
  Object.keys(factories).forEach(prefetchRoute);
}
