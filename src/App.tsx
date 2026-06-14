import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/layout/app-layout";

const DashboardPage = lazy(() =>
  import("@/pages/dashboard").then((m) => ({ default: m.DashboardPage }))
);
const TransactionsPage = lazy(() =>
  import("@/pages/transactions").then((m) => ({ default: m.TransactionsPage }))
);
const SubscriptionsPage = lazy(() =>
  import("@/pages/subscriptions").then((m) => ({ default: m.SubscriptionsPage }))
);
const AnalyticsPage = lazy(() =>
  import("@/pages/analytics").then((m) => ({ default: m.AnalyticsPage }))
);
const SettingsPage = lazy(() =>
  import("@/pages/settings").then((m) => ({ default: m.SettingsPage }))
);

export function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          }
        />
        <Route
          path="/transactions"
          element={
            <AppLayout>
              <TransactionsPage />
            </AppLayout>
          }
        />
        <Route
          path="/subscriptions"
          element={
            <AppLayout>
              <SubscriptionsPage />
            </AppLayout>
          }
        />
        <Route
          path="/analytics"
          element={
            <AppLayout>
              <AnalyticsPage />
            </AppLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <AppLayout>
              <SettingsPage />
            </AppLayout>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
