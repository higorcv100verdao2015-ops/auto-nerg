import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Input, TextArea } from '../components/Input';
import { Settings, Building2, Upload, Save } from 'lucide-react';

export function Configuracoes() {
  const [configEmpresa, setConfigEmpresa] = useState({
    nomeEmpresa: 'Auto&Nerg - Eletrotécnica',
    cnpj: '00.000.000/0001-00',
    telefone: '(11) 98765-4321',
    email: 'contato@autonerg.com.br',
    endereco: 'Rua Exemplo, 123 - São Paulo, SP',
    margemLucroPadrao: 20,
    valorDeslocamentoPadrao: 50
  });

  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const handleSalvarEmpresa = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Configurações da empresa salvas com sucesso!');
  };

  const handleAlterarSenha = (e: React.FormEvent) => {
    e.preventDefault();
    if (novaSenha !== confirmarSenha) {
      alert('As senhas não coincidem');
      return;
    }
    alert('Senha alterada com sucesso!');
    setSenhaAtual('');
    setNovaSenha('');
    setConfirmarSenha('');
  };

  const handleUploadLogo = () => {
    alert('Funcionalidade de upload de logo será implementada');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl text-gray-800 flex items-center gap-3">
          <Settings className="text-[#FFD700]" size={32} />
          Configurações
        </h2>
        <p className="text-gray-600 mt-1">Gerencie as informações da sua empresa</p>
      </div>

      {/* Logo da Empresa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 size={20} />
            Logo da Empresa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 bg-[#1a1a1a] rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-[#FFD700] p-3 rounded-lg inline-block mb-2">
                    <Building2 size={32} className="text-black" />
                  </div>
                  <p className="text-white text-xs">Logo Atual</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-3">
                  Faça upload do logo da sua empresa para aparecer em orçamentos e documentos
                </p>
                <Button onClick={handleUploadLogo}>
                  <Upload size={18} />
                  Fazer Upload do Logo
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Formatos aceitos: PNG, JPG. Tamanho máximo: 2MB
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dados da Empresa */}
      <Card>
        <CardHeader>
          <CardTitle>Dados da Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSalvarEmpresa} className="space-y-4">
            <Input
              label="Nome da Empresa"
              type="text"
              required
              value={configEmpresa.nomeEmpresa}
              onChange={(e) => setConfigEmpresa({ ...configEmpresa, nomeEmpresa: e.target.value })}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="CNPJ"
                type="text"
                required
                value={configEmpresa.cnpj}
                onChange={(e) => setConfigEmpresa({ ...configEmpresa, cnpj: e.target.value })}
              />
              <Input
                label="Telefone"
                type="tel"
                required
                value={configEmpresa.telefone}
                onChange={(e) => setConfigEmpresa({ ...configEmpresa, telefone: e.target.value })}
              />
            </div>
            <Input
              label="E-mail"
              type="email"
              required
              value={configEmpresa.email}
              onChange={(e) => setConfigEmpresa({ ...configEmpresa, email: e.target.value })}
            />
            <Input
              label="Endereço Completo"
              type="text"
              required
              value={configEmpresa.endereco}
              onChange={(e) => setConfigEmpresa({ ...configEmpresa, endereco: e.target.value })}
            />
            <div className="flex justify-end">
              <Button type="submit">
                <Save size={18} />
                Salvar Informações
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Configurações de Orçamento */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Orçamento</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSalvarEmpresa} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Margem de Lucro Padrão (%)"
                type="number"
                min="0"
                step="1"
                required
                value={configEmpresa.margemLucroPadrao}
                onChange={(e) => setConfigEmpresa({ ...configEmpresa, margemLucroPadrao: Number(e.target.value) })}
              />
              <Input
                label="Valor de Deslocamento Padrão (R$)"
                type="number"
                min="0"
                step="0.01"
                required
                value={configEmpresa.valorDeslocamentoPadrao}
                onChange={(e) => setConfigEmpresa({ ...configEmpresa, valorDeslocamentoPadrao: Number(e.target.value) })}
              />
            </div>
            <p className="text-sm text-gray-600">
              Estes valores serão usados como padrão ao criar novos orçamentos
            </p>
            <div className="flex justify-end">
              <Button type="submit">
                <Save size={18} />
                Salvar Configurações
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Segurança */}
      <Card>
        <CardHeader>
          <CardTitle>Segurança</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAlterarSenha} className="space-y-4">
            <Input
              label="Senha Atual"
              type="password"
              required
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              placeholder="Digite sua senha atual"
            />
            <Input
              label="Nova Senha"
              type="password"
              required
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              placeholder="Digite a nova senha"
            />
            <Input
              label="Confirmar Nova Senha"
              type="password"
              required
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              placeholder="Confirme a nova senha"
            />
            <div className="flex justify-end">
              <Button type="submit">
                <Save size={18} />
                Alterar Senha
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Sobre o Sistema */}
      <Card>
        <CardHeader>
          <CardTitle>Sobre o Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Versão do Sistema:</span>
              <span>1.0.0</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Desenvolvido por:</span>
              <span>Auto&Nerg - Eletrotécnica</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Última Atualização:</span>
              <span>09/05/2026</span>
            </div>
            <div className="bg-[#FFD700] bg-opacity-10 p-4 rounded-lg mt-4">
              <h4 className="mb-2">Suporte</h4>
              <p className="text-sm text-gray-600">
                Para suporte técnico ou dúvidas, entre em contato através do e-mail:
                <br />
                <a href="mailto:suporte@autonerg.com.br" className="text-[#FFD700] hover:underline">
                  suporte@autonerg.com.br
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
