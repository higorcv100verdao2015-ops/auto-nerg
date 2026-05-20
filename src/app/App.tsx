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
import { PublicHome } from './pages/PublicHome';

const adminPages = ['dashboard', 'clientes', 'orcamentos', 'ordens', 'materiais', 'agenda', 'financeiro', 'configuracoes'];

export default function App() {
  const [currentPage, setCurrentPage] = useState('inicio');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('autoNergAdmin') === 'true');

  const handleNavigate = (page: string) => {
    if (adminPages.includes(page) && !isAdmin) {
      setCurrentPage('admin');
      return;
    }

    setCurrentPage(page);
  };

  const handleAdminLogin = () => {
    localStorage.setItem('autoNergAdmin', 'true');
    setIsAdmin(true);
    setCurrentPage('dashboard');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('autoNergAdmin');
    setIsAdmin(false);
    if (adminPages.includes(currentPage)) {
      setCurrentPage('inicio');
    }
  };

  const pageTitle = {
    inicio: 'Inicio',
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
      case 'inicio':
        return <PublicHome onAdminAccess={() => setCurrentPage('admin')} />;
      case 'dashboard':
        return isAdmin ? <Dashboard onNavigate={handleNavigate} isAdmin={isAdmin} /> : <AdminAccess onLogin={handleAdminLogin} onCancel={() => setCurrentPage('inicio')} />;
      case 'admin':
        return <AdminAccess onLogin={handleAdminLogin} onCancel={() => setCurrentPage('inicio')} />;
      case 'clientes':
        return isAdmin ? <Clientes /> : <AdminAccess onLogin={handleAdminLogin} onCancel={() => setCurrentPage('inicio')} />;
      case 'orcamentos':
        return isAdmin ? <Orcamentos /> : <AdminAccess onLogin={handleAdminLogin} onCancel={() => setCurrentPage('inicio')} />;
      case 'ordens':
        return isAdmin ? <OrdensServico /> : <AdminAccess onLogin={handleAdminLogin} onCancel={() => setCurrentPage('inicio')} />;
      case 'materiais':
        return isAdmin ? <Materiais /> : <AdminAccess onLogin={handleAdminLogin} onCancel={() => setCurrentPage('inicio')} />;
      case 'agenda':
        return isAdmin ? <Agenda /> : <AdminAccess onLogin={handleAdminLogin} onCancel={() => setCurrentPage('inicio')} />;
      case 'financeiro':
        return isAdmin ? <Financeiro /> : <AdminAccess onLogin={handleAdminLogin} onCancel={() => setCurrentPage('inicio')} />;
      case 'configuracoes':
        return isAdmin ? <Configuracoes /> : <AdminAccess onLogin={handleAdminLogin} onCancel={() => setCurrentPage('inicio')} />;
      default:
        return <PublicHome onAdminAccess={() => setCurrentPage('admin')} />;
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
          onHomeClick={() => setCurrentPage('inicio')}
          onAdminClick={() => setCurrentPage(isAdmin ? 'dashboard' : 'admin')}
          onAdminLogout={handleAdminLogout}
        />

        {/* Page Content */}
        <main className={currentPage === 'inicio' ? 'flex-1 overflow-y-auto' : 'flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto'}>
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
