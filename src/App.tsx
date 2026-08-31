import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { NotificationToast } from './components/common/NotificationToast';
import { MarketingPortal } from './components/marketing/MarketingPortal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { BusinessOwnerDashboard } from './components/business/BusinessOwnerDashboard';
import { MobileAppSimulator } from './components/mobile/MobileAppSimulator';
import { DatabaseSchemaViewer } from './components/database/DatabaseSchemaViewer';
import { RegisterPage } from './components/auth/RegisterPage';

const AppContent: React.FC = () => {
  const { viewMode } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header />
      <NotificationToast />

      <main className="flex-1">
        {viewMode === 'marketing' && <MarketingPortal />}
        {viewMode === 'business_portal' && <BusinessOwnerDashboard />}
        {viewMode === 'admin' && <AdminDashboard />}
        {viewMode === 'mobile' && <MobileAppSimulator />}
        {viewMode === 'database_arch' && <DatabaseSchemaViewer />}
        {viewMode === 'register' && <RegisterPage />}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
