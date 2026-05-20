import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Input, Select, TextArea } from '../components/Input';
import { Calendar, Plus, Clock, MapPin, User, X } from 'lucide-react';

interface Agendamento {
  id: number;
  cliente: string;
  data: string;
  horario: string;
  endereco: string;
  tipo: string;
  observacoes: string;
  status: 'agendado' | 'confirmado' | 'concluido' | 'cancelado';
}

const agendamentosIniciais: Agendamento[] = [
  {
    id: 1,
    cliente: 'João Silva',
    data: '2026-05-10',
    horario: '09:00',
    endereco: 'Rua das Flores, 123 - São Paulo, SP',
    tipo: 'Instalação',
    observacoes: 'Levar escada de 3 metros',
    status: 'confirmado'
  },
  {
    id: 2,
    cliente: 'Maria Santos',
    data: '2026-05-10',
    horario: '14:00',
    endereco: 'Av. Paulista, 1000 - São Paulo, SP',
    tipo: 'Manutenção',
    observacoes: 'Cliente solicitou ligar antes',
    status: 'agendado'
  },
  {
    id: 3,
    cliente: 'Carlos Oliveira',
    data: '2026-05-11',
    horario: '10:00',
    endereco: 'Rua Augusta, 500 - São Paulo, SP',
    tipo: 'Vistoria',
    observacoes: '',
    status: 'agendado'
  }
];

export function Agenda() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>(agendamentosIniciais);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    cliente: '',
    data: '',
    horario: '',
    endereco: '',
    tipo: 'Instalação',
    observacoes: ''
  });

  const hoje = new Date().toISOString().split('T')[0];
  const agendamentosHoje = agendamentos.filter(a => a.data === hoje);
  const proximosAgendamentos = agendamentos.filter(a => a.data > hoje).sort((a, b) =>
    new Date(a.data + ' ' + a.horario).getTime() - new Date(b.data + ' ' + b.horario).getTime()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const novoAgendamento: Agendamento = {
      id: Date.now(),
      ...formData,
      status: 'agendado'
    };
    setAgendamentos([...agendamentos, novoAgendamento]);
    resetForm();
  };

  const atualizarStatus = (id: number, status: Agendamento['status']) => {
    setAgendamentos(agendamentos.map(a => a.id === id ? { ...a, status } : a));
  };

  const resetForm = () => {
    setFormData({
      cliente: '',
      data: '',
      horario: '',
      endereco: '',
      tipo: 'Instalação',
      observacoes: ''
    });
    setShowModal(false);
  };

  const statusConfig = {
    agendado: { label: 'Agendado', color: 'bg-blue-100 text-blue-700' },
    confirmado: { label: 'Confirmado', color: 'bg-green-100 text-green-700' },
    concluido: { label: 'Concluído', color: 'bg-gray-100 text-gray-700' },
    cancelado: { label: 'Cancelado', color: 'bg-red-100 text-red-700' }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl text-gray-800 flex items-center gap-3">
            <Calendar className="text-[#FFD700]" size={32} />
            Agenda
          </h2>
          <p className="text-gray-600 mt-1">Organize suas visitas técnicas e atendimentos</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Novo Agendamento
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-[#FFD700]">
          <CardContent>
            <p className="text-sm text-gray-600">Hoje</p>
            <h3 className="text-3xl mt-2">{agendamentosHoje.length}</h3>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent>
            <p className="text-sm text-gray-600">Próximos</p>
            <h3 className="text-3xl mt-2">{proximosAgendamentos.length}</h3>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent>
            <p className="text-sm text-gray-600">Confirmados</p>
            <h3 className="text-3xl mt-2">{agendamentos.filter(a => a.status === 'confirmado').length}</h3>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-gray-500">
          <CardContent>
            <p className="text-sm text-gray-600">Concluídos</p>
            <h3 className="text-3xl mt-2">{agendamentos.filter(a => a.status === 'concluido').length}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Agendamentos de Hoje */}
      {agendamentosHoje.length > 0 && (
        <div>
          <h3 className="text-xl mb-4 flex items-center gap-2">
            <Calendar size={20} />
            Hoje - {new Date().toLocaleDateString('pt-BR')}
          </h3>
          <div className="space-y-3">
            {agendamentosHoje.map((agendamento) => (
              <Card key={agendamento.id} className="border-l-4 border-l-[#FFD700]">
                <CardContent>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg">{agendamento.cliente}</h4>
                        <span className={`px-3 py-1 rounded-full text-sm ${statusConfig[agendamento.status].color}`}>
                          {statusConfig[agendamento.status].label}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock size={16} />
                          {agendamento.horario}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} />
                          {agendamento.endereco}
                        </div>
                      </div>
                      <p className="text-sm">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          {agendamento.tipo}
                        </span>
                      </p>
                      {agendamento.observacoes && (
                        <p className="text-sm text-gray-600 italic">Obs: {agendamento.observacoes}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {agendamento.status === 'agendado' && (
                        <Button size="sm" onClick={() => atualizarStatus(agendamento.id, 'confirmado')}>
                          Confirmar
                        </Button>
                      )}
                      {agendamento.status === 'confirmado' && (
                        <Button size="sm" onClick={() => atualizarStatus(agendamento.id, 'concluido')}>
                          Concluir
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Próximos Agendamentos */}
      {proximosAgendamentos.length > 0 && (
        <div>
          <h3 className="text-xl mb-4 flex items-center gap-2">
            <Calendar size={20} />
            Próximos Agendamentos
          </h3>
          <div className="space-y-3">
            {proximosAgendamentos.map((agendamento) => (
              <Card key={agendamento.id}>
                <CardContent>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg">{agendamento.cliente}</h4>
                        <span className={`px-3 py-1 rounded-full text-sm ${statusConfig[agendamento.status].color}`}>
                          {statusConfig[agendamento.status].label}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          {new Date(agendamento.data).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} />
                          {agendamento.horario}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} />
                          {agendamento.tipo}
                        </div>
                      </div>
                      {agendamento.observacoes && (
                        <p className="text-sm text-gray-600 italic">Obs: {agendamento.observacoes}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {agendamento.status === 'agendado' && (
                        <Button size="sm" onClick={() => atualizarStatus(agendamento.id, 'confirmado')}>
                          Confirmar
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => atualizarStatus(agendamento.id, 'cancelado')}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Novo Agendamento</CardTitle>
                <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Select
                  label="Cliente"
                  required
                  value={formData.cliente}
                  onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                >
                  <option value="">-- Selecione --</option>
                  <option value="João Silva">João Silva</option>
                  <option value="Maria Santos">Maria Santos</option>
                  <option value="Carlos Oliveira">Carlos Oliveira</option>
                </Select>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Data"
                    type="date"
                    required
                    value={formData.data}
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  />
                  <Input
                    label="Horário"
                    type="time"
                    required
                    value={formData.horario}
                    onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                  />
                </div>
                <Input
                  label="Endereço"
                  type="text"
                  required
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  placeholder="Endereço completo"
                />
                <Select
                  label="Tipo de Serviço"
                  required
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                >
                  <option value="Instalação">Instalação</option>
                  <option value="Manutenção">Manutenção</option>
                  <option value="Vistoria">Vistoria</option>
                  <option value="Reparo">Reparo</option>
                  <option value="Orçamento">Orçamento</option>
                </Select>
                <TextArea
                  label="Observações"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  placeholder="Informações adicionais sobre o atendimento"
                  rows={3}
                />
                <div className="flex gap-3 justify-end pt-4">
                  <Button type="button" variant="ghost" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Agendar
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
