import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import {
  DollarSign,
  ClipboardCheck,
  Users,
  FileText,
  TrendingUp,
  Zap,
  ArrowRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Dados simulados
const monthlyRevenue = [
  { id: 'jan', month: 'Jan', value: 4500 },
  { id: 'fev', month: 'Fev', value: 5200 },
  { id: 'mar', month: 'Mar', value: 4800 },
  { id: 'abr', month: 'Abr', value: 6100 },
  { id: 'mai', month: 'Mai', value: 7300 },
  { id: 'jun', month: 'Jun', value: 6800 }
];

const serviceData = [
  { id: 'instalacoes', name: 'Instalações', value: 35, color: '#FFD700' },
  { id: 'manutencao', name: 'Manutenção', value: 40, color: '#2d2d2d' },
  { id: 'reparos', name: 'Reparos', value: 25, color: '#666666' }
];

const recentServices = [
  { id: 1, client: 'João Silva', service: 'Instalação elétrica residencial', value: 1500, status: 'Concluído' },
  { id: 2, client: 'Maria Santos', service: 'Manutenção preventiva', value: 800, status: 'Em andamento' },
  { id: 3, client: 'Carlos Oliveira', service: 'Reparo de quadro elétrico', value: 650, status: 'Pendente' }
];

interface DashboardProps {
  onNavigate: (page: string) => void;
  isAdmin: boolean;
}

export function Dashboard({ onNavigate, isAdmin }: DashboardProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] rounded-xl p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-[#FFD700] p-3 rounded-lg">
            <Zap size={32} className="text-black" />
          </div>
          <div>
            <h2 className="text-2xl">Bem-vindo à Aut&Nerg</h2>
            <p className="text-gray-300">Organize seus serviços eletrotécnicos com eficiência</p>
          </div>
        </div>
        <div className="flex gap-4 mt-6">
          <Button
            variant="primary"
            onClick={() => onNavigate('orcamentos')}
          >
            <FileText size={18} />
            Criar Orçamento Rápido
          </Button>
          <Button
            variant="outline"
            onClick={() => onNavigate('clientes')}
          >
            <Users size={18} />
            {isAdmin ? 'Ver Clientes' : 'Entrar como Admin'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-[#FFD700]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Faturamento Total</p>
              <h3 className="text-2xl mt-2">R$ 28.400</h3>
              <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp size={14} />
                +12% este mês
              </p>
            </div>
            <div className="bg-[#FFD700] bg-opacity-20 p-3 rounded-lg">
              <DollarSign size={28} className="text-[#FFD700]" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Serviços Realizados</p>
              <h3 className="text-2xl mt-2">47</h3>
              <p className="text-sm text-gray-500 mt-1">Últimos 30 dias</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <ClipboardCheck size={28} className="text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Clientes Cadastrados</p>
              <h3 className="text-2xl mt-2">128</h3>
              <p className="text-sm text-blue-600 mt-1">+8 novos</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users size={28} className="text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Orçamentos Pendentes</p>
              <h3 className="text-2xl mt-2">12</h3>
              <p className="text-sm text-orange-600 mt-1">Aguardando aprovação</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <FileText size={28} className="text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Faturamento Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e5e5' }}
                  formatter={(value) => `R$ ${value}`}
                />
                <Bar dataKey="value" fill="#FFD700" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Serviços</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {serviceData.map((entry) => (
                    <Cell key={entry.id} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Services */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Serviços Recentes</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('ordens')}
            >
              Ver todos
              <ArrowRight size={16} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Cliente</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Serviço</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Valor</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentServices.map((service) => (
                  <tr key={service.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{service.client}</td>
                    <td className="py-3 px-4 text-gray-600">{service.service}</td>
                    <td className="py-3 px-4">R$ {service.value.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          service.status === 'Concluído'
                            ? 'bg-green-100 text-green-700'
                            : service.status === 'Em andamento'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {service.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
