import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Select, TextArea } from '../components/Input';
import { ClipboardList, Download, Edit, CheckCircle, X } from 'lucide-react';

interface OrdemServico {
  id: number;
  numeroOS: string;
  cliente: string;
  data: string;
  descricao: string;
  valor: number;
  status: 'pendente' | 'aprovado' | 'em_andamento' | 'concluido' | 'cancelado';
}

const ordensIniciais: OrdemServico[] = [
  {
    id: 1,
    numeroOS: 'OS-2026-001',
    cliente: 'João Silva',
    data: '2026-05-09',
    descricao: 'Instalação elétrica residencial completa - 3 quartos',
    valor: 1500,
    status: 'concluido'
  },
  {
    id: 2,
    numeroOS: 'OS-2026-002',
    cliente: 'Maria Santos',
    data: '2026-05-08',
    descricao: 'Manutenção preventiva em quadro elétrico',
    valor: 800,
    status: 'em_andamento'
  },
  {
    id: 3,
    numeroOS: 'OS-2026-003',
    cliente: 'Carlos Oliveira',
    data: '2026-05-07',
    descricao: 'Reparo de curto-circuito e troca de disjuntores',
    valor: 650,
    status: 'pendente'
  }
];

export function OrdensServico() {
  const [ordens, setOrdens] = useState<OrdemServico[]>(ordensIniciais);
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');

  const ordensFiltradas = filtroStatus === 'todos'
    ? ordens
    : ordens.filter(o => o.status === filtroStatus);

  const statusConfig = {
    pendente: { label: 'Pendente', color: 'bg-orange-100 text-orange-700', icon: '⏳' },
    aprovado: { label: 'Aprovado', color: 'bg-blue-100 text-blue-700', icon: '✓' },
    em_andamento: { label: 'Em Andamento', color: 'bg-purple-100 text-purple-700', icon: '⚙️' },
    concluido: { label: 'Concluído', color: 'bg-green-100 text-green-700', icon: '✓✓' },
    cancelado: { label: 'Cancelado', color: 'bg-red-100 text-red-700', icon: '✗' }
  };

  const atualizarStatus = (id: number, novoStatus: OrdemServico['status']) => {
    setOrdens(ordens.map(o => o.id === id ? { ...o, status: novoStatus } : o));
  };

  const exportarPDF = (ordem: OrdemServico) => {
    alert(`Exportando OS ${ordem.numeroOS} para PDF`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl text-gray-800 flex items-center gap-3">
            <ClipboardList className="text-[#FFD700]" size={32} />
            Ordens de Serviço
          </h2>
          <p className="text-gray-600 mt-1">Gerencie e acompanhe suas ordens de serviço</p>
        </div>
        <Button onClick={() => alert('Criar OS a partir de orçamento')}>
          Criar Nova OS
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-orange-500">
          <CardContent>
            <p className="text-xs text-gray-600">Pendentes</p>
            <h3 className="text-2xl mt-1">{ordens.filter(o => o.status === 'pendente').length}</h3>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent>
            <p className="text-xs text-gray-600">Aprovadas</p>
            <h3 className="text-2xl mt-1">{ordens.filter(o => o.status === 'aprovado').length}</h3>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent>
            <p className="text-xs text-gray-600">Em Andamento</p>
            <h3 className="text-2xl mt-1">{ordens.filter(o => o.status === 'em_andamento').length}</h3>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent>
            <p className="text-xs text-gray-600">Concluídas</p>
            <h3 className="text-2xl mt-1">{ordens.filter(o => o.status === 'concluido').length}</h3>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent>
            <p className="text-xs text-gray-600">Canceladas</p>
            <h3 className="text-2xl mt-1">{ordens.filter(o => o.status === 'cancelado').length}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Filtro */}
      <Card>
        <CardContent>
          <Select
            label="Filtrar por Status"
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="pendente">Pendente</option>
            <option value="aprovado">Aprovado</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="concluido">Concluído</option>
            <option value="cancelado">Cancelado</option>
          </Select>
        </CardContent>
      </Card>

      {/* Lista de Ordens */}
      <div className="space-y-4">
        {ordensFiltradas.map((ordem) => (
          <Card key={ordem.id}>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl">{ordem.numeroOS}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm ${statusConfig[ordem.status].color}`}>
                        {statusConfig[ordem.status].icon} {statusConfig[ordem.status].label}
                      </span>
                    </div>
                    <p className="text-gray-600">{ordem.cliente}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Data: {new Date(ordem.data).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl text-[#FFD700]">R$ {ordem.valor.toFixed(2)}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Descrição do Serviço:</p>
                  <p className="text-gray-800">{ordem.descricao}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Select
                    value={ordem.status}
                    onChange={(e) => atualizarStatus(ordem.id, e.target.value as OrdemServico['status'])}
                    className="w-auto"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="aprovado">Aprovado</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="concluido">Concluído</option>
                    <option value="cancelado">Cancelado</option>
                  </Select>
                  <Button size="sm" variant="outline" onClick={() => exportarPDF(ordem)}>
                    <Download size={16} />
                    Exportar PDF
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit size={16} />
                    Editar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {ordensFiltradas.length === 0 && (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <ClipboardList size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl text-gray-600 mb-2">Nenhuma ordem de serviço encontrada</h3>
              <p className="text-gray-500">Ajuste o filtro ou crie uma nova OS</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
