import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Input, Select } from '../components/Input';
import { DollarSign, TrendingUp, TrendingDown, Plus, X } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Transacao {
  id: number;
  tipo: 'entrada' | 'saida';
  descricao: string;
  valor: number;
  data: string;
  categoria: string;
}

const transacoesIniciais: Transacao[] = [
  { id: 1, tipo: 'entrada', descricao: 'Serviço - João Silva', valor: 1500, data: '2026-05-05', categoria: 'Serviço' },
  { id: 2, tipo: 'saida', descricao: 'Compra de materiais', valor: 450, data: '2026-05-04', categoria: 'Material' },
  { id: 3, tipo: 'entrada', descricao: 'Serviço - Maria Santos', valor: 800, data: '2026-05-03', categoria: 'Serviço' },
  { id: 4, tipo: 'saida', descricao: 'Combustível', valor: 200, data: '2026-05-02', categoria: 'Despesa' },
  { id: 5, tipo: 'entrada', descricao: 'Serviço - Carlos Oliveira', valor: 650, data: '2026-05-01', categoria: 'Serviço' }
];

const dadosMensais = [
  { id: 'jan', mes: 'Jan', entradas: 4500, saidas: 2200 },
  { id: 'fev', mes: 'Fev', entradas: 5200, saidas: 2800 },
  { id: 'mar', mes: 'Mar', entradas: 4800, saidas: 2400 },
  { id: 'abr', mes: 'Abr', entradas: 6100, saidas: 3100 },
  { id: 'mai', mes: 'Mai', entradas: 7300, saidas: 3500 }
];

export function Financeiro() {
  const [transacoes, setTransacoes] = useState<Transacao[]>(transacoesIniciais);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    tipo: 'entrada' as 'entrada' | 'saida',
    descricao: '',
    valor: 0,
    data: '',
    categoria: 'Serviço'
  });

  const totalEntradas = transacoes.filter(t => t.tipo === 'entrada').reduce((acc, t) => acc + t.valor, 0);
  const totalSaidas = transacoes.filter(t => t.tipo === 'saida').reduce((acc, t) => acc + t.valor, 0);
  const saldo = totalEntradas - totalSaidas;
  const lucro = ((totalEntradas - totalSaidas) / totalEntradas * 100) || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const novaTransacao: Transacao = {
      id: Date.now(),
      ...formData
    };
    setTransacoes([novaTransacao, ...transacoes]);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      tipo: 'entrada',
      descricao: '',
      valor: 0,
      data: '',
      categoria: 'Serviço'
    });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl text-gray-800 flex items-center gap-3">
            <DollarSign className="text-[#FFD700]" size={32} />
            Controle Financeiro
          </h2>
          <p className="text-gray-600 mt-1">Acompanhe suas entradas, saídas e lucratividade</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Nova Transação
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Entradas</p>
                <h3 className="text-2xl mt-2">R$ {totalEntradas.toFixed(2)}</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp size={24} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Saídas</p>
                <h3 className="text-2xl mt-2">R$ {totalSaidas.toFixed(2)}</h3>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <TrendingDown size={24} className="text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-[#FFD700]">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Saldo</p>
                <h3 className="text-2xl mt-2">R$ {saldo.toFixed(2)}</h3>
              </div>
              <div className="bg-[#FFD700] bg-opacity-20 p-3 rounded-lg">
                <DollarSign size={24} className="text-[#FFD700]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent>
            <div>
              <p className="text-sm text-gray-600">Margem de Lucro</p>
              <h3 className="text-2xl mt-2">{lucro.toFixed(1)}%</h3>
              <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp size={14} />
                +5% vs mês anterior
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Entradas vs Saídas (Mensal)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosMensais}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="mes" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e5e5' }} />
                <Bar dataKey="entradas" fill="#10b981" name="Entradas" radius={[8, 8, 0, 0]} />
                <Bar dataKey="saidas" fill="#ef4444" name="Saídas" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evolução do Saldo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dadosMensais.map(d => ({ id: d.id, mes: d.mes, saldo: d.entradas - d.saidas }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="mes" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e5e5' }} />
                <Line type="monotone" dataKey="saldo" stroke="#FFD700" strokeWidth={3} dot={{ fill: '#FFD700', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Transações Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Data</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Descrição</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Categoria</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Tipo</th>
                  <th className="text-right py-3 px-4 text-sm text-gray-600">Valor</th>
                </tr>
              </thead>
              <tbody>
                {transacoes.map((transacao) => (
                  <tr key={transacao.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{new Date(transacao.data).toLocaleDateString('pt-BR')}</td>
                    <td className="py-3 px-4">{transacao.descricao}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{transacao.categoria}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          transacao.tipo === 'entrada'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {transacao.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                      </span>
                    </td>
                    <td className={`py-3 px-4 text-right ${transacao.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                      {transacao.tipo === 'entrada' ? '+' : '-'} R$ {transacao.valor.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Nova Transação</CardTitle>
                <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Select
                  label="Tipo de Transação"
                  required
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'entrada' | 'saida' })}
                >
                  <option value="entrada">Entrada</option>
                  <option value="saida">Saída</option>
                </Select>
                <Input
                  label="Descrição"
                  type="text"
                  required
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Ex: Pagamento de serviço - Cliente X"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Valor (R$)"
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.valor}
                    onChange={(e) => setFormData({ ...formData, valor: Number(e.target.value) })}
                  />
                  <Input
                    label="Data"
                    type="date"
                    required
                    value={formData.data}
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  />
                </div>
                <Select
                  label="Categoria"
                  required
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                >
                  <option value="Serviço">Serviço</option>
                  <option value="Material">Material</option>
                  <option value="Despesa">Despesa</option>
                  <option value="Equipamento">Equipamento</option>
                  <option value="Combustível">Combustível</option>
                  <option value="Outros">Outros</option>
                </Select>
                <div className="flex gap-3 justify-end pt-4">
                  <Button type="button" variant="ghost" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Adicionar Transação
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
