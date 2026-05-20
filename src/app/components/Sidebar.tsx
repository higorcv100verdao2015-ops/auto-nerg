import React from 'react';
import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardList,
  Package,
  Calendar,
  DollarSign,
  Settings,
  Home,
  ShieldCheck,
  X,
  Zap
} from 'lucide-react';
import { cn } from '../utils/cn';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
  isAdmin: boolean;
}

const menuItems = [
  { id: 'inicio', label: 'Inicio', icon: Home },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'clientes', label: 'Clientes', icon: Users },
  { id: 'orcamentos', label: 'Orçamentos', icon: FileText },
  { id: 'ordens', label: 'Ordens de Serviço', icon: ClipboardList },
  { id: 'materiais', label: 'Materiais', icon: Package },
  { id: 'agenda', label: 'Agenda', icon: Calendar },
  { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
  { id: 'configuracoes', label: 'Configurações', icon: Settings },
];

export function Sidebar({ isOpen, onClose, currentPage, onNavigate, isAdmin }: SidebarProps) {
  const visibleMenuItems = isAdmin
    ? menuItems
    : [
        menuItems[0],
        { id: 'admin', label: 'Acesso Admin', icon: ShieldCheck },
      ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#1a1a1a] text-white transition-transform duration-300 ease-in-out',
          'flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-[#2d2d2d]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#FFD700] p-2 rounded-lg">
                <Zap size={28} className="text-black" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Auto&Nerg</h2>
                <p className="text-xs text-[#FFD700]">Eletrotécnica</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-[#2d2d2d] rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-[#FFD700] text-black shadow-lg'
                    : 'text-gray-300 hover:bg-[#2d2d2d] hover:text-white'
                )}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#2d2d2d]">
          <div className="bg-[#2d2d2d] p-4 rounded-lg">
            <p className="text-sm text-gray-400">Versão 1.0.0</p>
            <p className="text-xs text-gray-500 mt-1">© 2026 Auto&Nerg</p>
          </div>
        </div>
      </aside>
    </>
  );
}
