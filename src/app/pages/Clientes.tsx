import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  Edit,
  Trash2,
  MessageCircle,
  X,
  Database
} from 'lucide-react';

interface Cliente {
  id: number;
  nome: string;
  telefone: string;
  whatsapp: string;
  email: string;
  endereco: string;
  servicosRealizados: number;
}

interface ClienteRow {
  id: number;
  nome: string;
  telefone: string;
  whatsapp: string;
  email: string;
  endereco: string;
  servicos_realizados: number;
}

const clientesIniciais: Cliente[] = [
  {
    id: 1,
    nome: 'Joao Silva',
    telefone: '(11) 98765-4321',
    whatsapp: '5511987654321',
    email: 'joao.silva@email.com',
    endereco: 'Rua das Flores, 123 - Sao Paulo, SP',
    servicosRealizados: 5
  },
  {
    id: 2,
    nome: 'Maria Santos',
    telefone: '(11) 97654-3210',
    whatsapp: '5511976543210',
    email: 'maria.santos@email.com',
    endereco: 'Av. Paulista, 1000 - Sao Paulo, SP',
    servicosRealizados: 3
  },
  {
    id: 3,
    nome: 'Carlos Oliveira',
    telefone: '(11) 96543-2109',
    whatsapp: '5511965432109',
    email: 'carlos.oliveira@email.com',
    endereco: 'Rua Augusta, 500 - Sao Paulo, SP',
    servicosRealizados: 8
  }
];

const rowToCliente = (row: ClienteRow): Cliente => ({
  id: row.id,
  nome: row.nome,
  telefone: row.telefone,
  whatsapp: row.whatsapp,
  email: row.email,
  endereco: row.endereco,
  servicosRealizados: row.servicos_realizados
});

const clienteToRow = (cliente: Omit<Cliente, 'id' | 'servicosRealizados'>) => ({
  nome: cliente.nome,
  telefone: cliente.telefone,
  whatsapp: cliente.whatsapp,
  email: cliente.email,
  endereco: cliente.endereco
});

export function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>(clientesIniciais);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    whatsapp: '',
    email: '',
    endereco: ''
  });

  const loadClientes = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    const { data, error: supabaseError } = await supabase
      .from('clientes')
      .select('id,nome,telefone,whatsapp,email,endereco,servicos_realizados')
      .order('created_at', { ascending: false });

    if (supabaseError) {
      setError(`Nao foi possivel carregar clientes: ${supabaseError.message}`);
    } else {
      setClientes((data || []).map((row) => rowToCliente(row as ClienteRow)));
    }

    setLoading(false);
  };

  useEffect(() => {
    loadClientes();
  }, []);

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.telefone.includes(searchTerm) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenWhatsApp = (whatsapp: string, nome: string) => {
    const message = encodeURIComponent(
      `Ola ${nome}! Aqui e da Auto&Nerg - Eletrotecnica. Como posso ajuda-lo?`
    );
    window.open(`https://wa.me/${whatsapp}?text=${message}`, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (supabase) {
      if (editingClient) {
        const { error: supabaseError } = await supabase
          .from('clientes')
          .update(clienteToRow(formData))
          .eq('id', editingClient.id);

        if (supabaseError) {
          setError(`Nao foi possivel salvar: ${supabaseError.message}`);
          setSaving(false);
          return;
        }
      } else {
        const { error: supabaseError } = await supabase
          .from('clientes')
          .insert({ ...clienteToRow(formData), servicos_realizados: 0 });

        if (supabaseError) {
          setError(`Nao foi possivel cadastrar: ${supabaseError.message}`);
          setSaving(false);
          return;
        }
      }

      await loadClientes();
      setSaving(false);
      resetForm();
      return;
    }

    if (editingClient) {
      setClientes(clientes.map(c =>
        c.id === editingClient.id ? { ...editingClient, ...formData } : c
      ));
    } else {
      const newClient: Cliente = {
        id: Date.now(),
        ...formData,
        servicosRealizados: 0
      };
      setClientes([...clientes, newClient]);
    }

    setSaving(false);
    resetForm();
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingClient(cliente);
    setFormData({
      nome: cliente.nome,
      telefone: cliente.telefone,
      whatsapp: cliente.whatsapp,
      email: cliente.email,
      endereco: cliente.endereco
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir este cliente?')) {
      return;
    }

    setError('');

    if (supabase) {
      const { error: supabaseError } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);

      if (supabaseError) {
        setError(`Nao foi possivel excluir: ${supabaseError.message}`);
        return;
      }
    }

    setClientes(clientes.filter(c => c.id !== id));
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      telefone: '',
      whatsapp: '',
      email: '',
      endereco: ''
    });
    setEditingClient(null);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl text-gray-800 flex items-center gap-3">
            <Users className="text-[#FFD700]" size={32} />
            Clientes
          </h2>
          <p className="text-gray-600 mt-1">Gerencie seus clientes e historico de servicos</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Novo Cliente
        </Button>
      </div>

      <Card className={isSupabaseConfigured ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-orange-500'}>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-3">
              <Database size={22} className={isSupabaseConfigured ? 'text-green-600' : 'text-orange-600'} />
              <div>
                <p className="text-sm text-gray-800">
                  {isSupabaseConfigured ? 'Banco online conectado' : 'Banco online ainda nao configurado'}
                </p>
                <p className="text-xs text-gray-500">
                  {isSupabaseConfigured ? 'Dados sincronizados com Supabase.' : 'Preencha o arquivo .env para usar o Supabase.'}
                </p>
              </div>
            </div>
            {isSupabaseConfigured && (
              <Button size="sm" variant="ghost" onClick={loadClientes} disabled={loading}>
                Atualizar
              </Button>
            )}
          </div>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Buscar por nome, telefone ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-[#FFD700]">
          <CardContent>
            <p className="text-sm text-gray-600">Total de Clientes</p>
            <h3 className="text-3xl mt-2">{clientes.length}</h3>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent>
            <p className="text-sm text-gray-600">Clientes Ativos</p>
            <h3 className="text-3xl mt-2">{clientes.filter(c => c.servicosRealizados > 0).length}</h3>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent>
            <p className="text-sm text-gray-600">Origem dos Dados</p>
            <h3 className="text-xl mt-2">{isSupabaseConfigured ? 'Online' : 'Local'}</h3>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <Database size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl text-gray-600 mb-2">Carregando clientes...</h3>
              <p className="text-gray-500">Buscando dados no banco online</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredClientes.map((cliente) => (
            <Card key={cliente.id} className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{cliente.nome}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {cliente.servicosRealizados} servico(s) realizado(s)
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(cliente)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit size={18} className="text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(cliente.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} className="text-red-600" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone size={18} className="text-gray-400" />
                    <span>{cliente.telefone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Mail size={18} className="text-gray-400" />
                    <span className="text-sm">{cliente.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin size={18} className="text-gray-400" />
                    <span className="text-sm">{cliente.endereco}</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleOpenWhatsApp(cliente.whatsapp, cliente.nome)}
                    className="flex-1"
                  >
                    <MessageCircle size={16} />
                    WhatsApp
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Ver Historico
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredClientes.length === 0 && (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <Users size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl text-gray-600 mb-2">Nenhum cliente encontrado</h3>
              <p className="text-gray-500">Tente ajustar sua pesquisa ou adicione um novo cliente</p>
            </div>
          </CardContent>
        </Card>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{editingClient ? 'Editar Cliente' : 'Novo Cliente'}</CardTitle>
                <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Nome Completo"
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Digite o nome do cliente"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Telefone"
                    type="tel"
                    required
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    placeholder="(11) 98765-4321"
                  />
                  <Input
                    label="WhatsApp (com DDD e codigo do pais)"
                    type="text"
                    required
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="5511987654321"
                  />
                </div>
                <Input
                  label="E-mail"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="cliente@email.com"
                />
                <Input
                  label="Endereco Completo"
                  type="text"
                  required
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  placeholder="Rua, numero - Cidade, Estado"
                />
                <div className="flex gap-3 justify-end pt-4">
                  <Button type="button" variant="ghost" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Salvando...' : editingClient ? 'Salvar Alteracoes' : 'Cadastrar Cliente'}
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
