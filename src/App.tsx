import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardPage } from "@/pages/dashboard";
import { TransactionsPage } from "@/pages/transactions";
import { SubscriptionsPage } from "@/pages/subscriptions";
import { AnalyticsPage } from "@/pages/analytics";
import { SettingsPage } from "@/pages/settings";
import { AppLayout } from "@/components/layout/app-layout";

export function App() {
  return (
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
  );
}
