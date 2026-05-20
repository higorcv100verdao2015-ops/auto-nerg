import React from 'react';
import { Zap, Menu, User, LogOut, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  title: string;
  isAdmin: boolean;
  onAdminClick: () => void;
  onAdminLogout: () => void;
}

export function Header({ onMenuClick, title, isAdmin, onAdminClick, onAdminLogout }: HeaderProps) {
  return (
    <header className="bg-[#1a1a1a] text-white shadow-lg sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-[#2d2d2d] rounded-lg transition-colors"
            aria-label="Menu"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-3">
            <div className="bg-[#FFD700] p-2 rounded-lg">
              <Zap size={24} className="text-black" />
            </div>
            <div>
              <h1 className="font-bold text-xl">Auto&Nerg</h1>
              <p className="text-xs text-[#FFD700]">Eletrotécnica</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right">
            <p className="text-sm">{title}</p>
            <p className="text-xs text-gray-400">{isAdmin ? 'Admin conectado' : 'Acesso comum'}</p>
          </div>
          <button
            type="button"
            onClick={onAdminClick}
            className="bg-[#FFD700] p-2 rounded-full hover:bg-[#FFED4E] transition-colors"
            aria-label={isAdmin ? 'Abrir area de clientes' : 'Entrar como admin'}
            title={isAdmin ? 'Area de clientes' : 'Entrar como admin'}
          >
            {isAdmin ? (
              <ShieldCheck size={20} className="text-black" />
            ) : (
              <User size={20} className="text-black" />
            )}
          </button>
          {isAdmin && (
            <button
              type="button"
              onClick={onAdminLogout}
              className="p-2 hover:bg-[#2d2d2d] rounded-lg transition-colors"
              aria-label="Sair do admin"
              title="Sair do admin"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
