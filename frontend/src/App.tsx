import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { Layout } from './components/layout/Layout';

import { DashboardPage } from './pages/DashboardPage';
import { DigitalTwinPage } from './pages/DigitalTwinPage';
import { CashFlowCalendarPage } from './pages/CashFlowCalendarPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { BudgetsPage } from './pages/BudgetsPage';
import { GoalsPage } from './pages/GoalsPage';
import { EmergencyFundPage } from './pages/EmergencyFundPage';
import { DocumentIntelligencePage } from './pages/DocumentIntelligencePage';
import { LifePlannerPage } from './pages/LifePlannerPage';
import { SecurityPage } from './pages/SecurityPage';
import { SharedFinancePage } from './pages/SharedFinancePage';
import { TimelinePage } from './pages/TimelinePage';
import { SubscriptionsPage } from './pages/SubscriptionsPage';
import { NetWorthPage } from './pages/NetWorthPage';
import { InvestmentsPage } from './pages/InvestmentsPage';
import { EducationPage } from './pages/EducationPage';
import { AIMemoryPage } from './pages/AIMemoryPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="digital-twin" element={<DigitalTwinPage />} />
              <Route path="calendar" element={<CashFlowCalendarPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="budgets" element={<BudgetsPage />} />
              <Route path="goals" element={<GoalsPage />} />
              <Route path="emergency-fund" element={<EmergencyFundPage />} />
              <Route path="documents" element={<DocumentIntelligencePage />} />
              <Route path="life-planner" element={<LifePlannerPage />} />
              <Route path="security" element={<SecurityPage />} />
              <Route path="shared-finance" element={<SharedFinancePage />} />
              <Route path="timeline" element={<TimelinePage />} />
              <Route path="subscriptions" element={<SubscriptionsPage />} />
              <Route path="net-worth" element={<NetWorthPage />} />
              <Route path="investments" element={<InvestmentsPage />} />
              <Route path="education" element={<EducationPage />} />
              <Route path="memory" element={<AIMemoryPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CurrencyProvider>
    </AuthProvider>
  );
};

export default App;
