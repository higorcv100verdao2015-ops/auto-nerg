import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Clientes } from './pages/Clientes';
import { Orcamentos } from './pages/Orcamentos';
import { OrdensServico } from './pages/OrdensServico';
import { Materiais } from './pages/Materiais';
import { Agenda } from './pages/Agenda';
import { Financeiro } from './pages/Financeiro';
import { Configuracoes } from './pages/Configuracoes';
import { AdminAccess } from './pages/AdminAccess';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('autoNergAdmin') === 'true');

  const handleNavigate = (page: string) => {
    if (page === 'clientes' && !isAdmin) {
      setCurrentPage('admin');
      return;
    }

    setCurrentPage(page);
  };

  const handleAdminLogin = () => {
    localStorage.setItem('autoNergAdmin', 'true');
    setIsAdmin(true);
    setCurrentPage('clientes');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('autoNergAdmin');
    setIsAdmin(false);
    if (currentPage === 'clientes') {
      setCurrentPage('dashboard');
    }
  };

  const pageTitle = {
    dashboard: 'Dashboard',
    admin: 'Acesso Admin',
    clientes: 'Clientes',
    orcamentos: 'Orçamentos',
    ordens: 'Ordens de Serviço',
    materiais: 'Materiais',
    agenda: 'Agenda',
    financeiro: 'Financeiro',
    configuracoes: 'Configurações'
  }[currentPage] || 'Dashboard';

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} isAdmin={isAdmin} />;
      case 'admin':
        return <AdminAccess onLogin={handleAdminLogin} onCancel={() => setCurrentPage('dashboard')} />;
      case 'clientes':
        return isAdmin ? <Clientes /> : <AdminAccess onLogin={handleAdminLogin} onCancel={() => setCurrentPage('dashboard')} />;
      case 'orcamentos':
        return <Orcamentos />;
      case 'ordens':
        return <OrdensServico />;
      case 'materiais':
        return <Materiais />;
      case 'agenda':
        return <Agenda />;
      case 'financeiro':
        return <Financeiro />;
      case 'configuracoes':
        return <Configuracoes />;
      default:
        return <Dashboard onNavigate={handleNavigate} isAdmin={isAdmin} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isAdmin={isAdmin}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          title={pageTitle}
          isAdmin={isAdmin}
          onAdminClick={() => setCurrentPage(isAdmin ? 'clientes' : 'admin')}
          onAdminLogout={handleAdminLogout}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {renderPage()}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-sm text-gray-600">
              © 2026 Auto&Nerg - Eletrotécnica. Todos os direitos reservados.
            </p>
            <p className="text-sm text-gray-500">
              Sistema de Gestão v1.0.0
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
