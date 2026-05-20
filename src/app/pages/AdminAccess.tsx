import React, { useState } from 'react';
import { ShieldCheck, Lock, User, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

interface AdminAccessProps {
  onLogin: () => void;
  onCancel: () => void;
}

const ADMIN_USER = 'admin';
const ADMIN_PASSWORD = 'auto2026';

export function AdminAccess({ onLogin, onCancel }: AdminAccessProps) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (usuario.trim() === ADMIN_USER && senha === ADMIN_PASSWORD) {
      setError('');
      onLogin();
      return;
    }

    setError('Usuario ou senha invalidos.');
  };

  return (
    <div className="min-h-[calc(100vh-180px)] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-[#FFD700] p-3 rounded-lg">
              <ShieldCheck size={28} className="text-black" />
            </div>
            <div>
              <CardTitle>Acesso Admin</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Entre para gerenciar os clientes</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Usuario"
              value={usuario}
              onChange={(event) => setUsuario(event.target.value)}
              placeholder="admin"
              autoComplete="username"
              required
            />
            <Input
              label="Senha"
              type="password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              placeholder="auto2026"
              autoComplete="current-password"
              required
              error={error}
            />
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button type="submit" className="flex-1">
                <Lock size={18} />
                Entrar
              </Button>
              <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
                <ArrowLeft size={18} />
                Voltar
              </Button>
            </div>
          </form>

          <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
            <div className="flex items-center gap-2 font-medium text-gray-800">
              <User size={16} />
              Credenciais do prototipo
            </div>
            <p className="mt-2">Usuario: admin</p>
            <p>Senha: auto2026</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
