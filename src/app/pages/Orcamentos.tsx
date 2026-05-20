import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Input, Select, TextArea } from '../components/Input';
import {
  FileText,
  Plus,
  Trash2,
  Download,
  MessageCircle,
  Calculator,
  X
} from 'lucide-react';

interface ItemOrcamento {
  id: number;
  tipo: 'servico' | 'material';
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

interface Orcamento {
  id: number;
  cliente: string;
  data: string;
  itens: ItemOrcamento[];
  deslocamento: number;
  margemLucro: number;
  valorTotal: number;
  status: 'pendente' | 'aprovado' | 'recusado';
}

const orcamentosIniciais: Orcamento[] = [
  {
    id: 1,
    cliente: 'João Silva',
    data: '2026-05-05',
    itens: [
      { id: 1, tipo: 'servico', descricao: 'Instalação de tomadas', quantidade: 10, valorUnitario: 50, valorTotal: 500 },
      { id: 2, tipo: 'material', descricao: 'Tomadas 2P+T', quantidade: 10, valorUnitario: 15, valorTotal: 150 }
    ],
    deslocamento: 50,
    margemLucro: 20,
    valorTotal: 780,
    status: 'pendente'
  }
];

export function Orcamentos() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>(orcamentosIniciais);
  const [showModal, setShowModal] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState('');
  const [itens, setItens] = useState<ItemOrcamento[]>([]);
  const [deslocamento, setDeslocamento] = useState(0);
  const [margemLucro, setMargemLucro] = useState(20);
  const [novoItem, setNovoItem] = useState({
    tipo: 'servico' as 'servico' | 'material',
    descricao: '',
    quantidade: 1,
    valorUnitario: 0
  });

  const calcularTotal = () => {
    const subtotal = itens.reduce((acc, item) => acc + item.valorTotal, 0);
    const totalComDeslocamento = subtotal + deslocamento;
    const valorFinal = totalComDeslocamento * (1 + margemLucro / 100);
    return {
      subtotal,
      totalComDeslocamento,
      valorFinal
    };
  };

  const adicionarItem = () => {
    if (!novoItem.descricao || novoItem.valorUnitario <= 0) {
      alert('Preencha todos os campos do item');
      return;
    }

    const item: ItemOrcamento = {
      id: Date.now(),
      ...novoItem,
      valorTotal: novoItem.quantidade * novoItem.valorUnitario
    };

    setItens([...itens, item]);
    setNovoItem({
      tipo: 'servico',
      descricao: '',
      quantidade: 1,
      valorUnitario: 0
    });
  };

  const removerItem = (id: number) => {
    setItens(itens.filter(item => item.id !== id));
  };

  const criarOrcamento = () => {
    if (!clienteSelecionado) {
      alert('Selecione um cliente');
      return;
    }

    if (itens.length === 0) {
      alert('Adicione pelo menos um item ao orçamento');
      return;
    }

    const { valorFinal } = calcularTotal();

    const novoOrcamento: Orcamento = {
      id: Date.now(),
      cliente: clienteSelecionado,
      data: new Date().toISOString().split('T')[0],
      itens: [...itens],
      deslocamento,
      margemLucro,
      valorTotal: valorFinal,
      status: 'pendente'
    };

    setOrcamentos([novoOrcamento, ...orcamentos]);
    resetForm();
  };

  const resetForm = () => {
    setClienteSelecionado('');
    setItens([]);
    setDeslocamento(0);
    setMargemLucro(20);
    setNovoItem({
      tipo: 'servico',
      descricao: '',
      quantidade: 1,
      valorUnitario: 0
    });
    setShowModal(false);
  };

  const exportarPDF = (orcamento: Orcamento) => {
    alert('Funcionalidade de exportar PDF será implementada com biblioteca específica');
  };

  const enviarWhatsApp = (orcamento: Orcamento) => {
    const message = encodeURIComponent(
      `🔌 *Auto&Nerg - Eletrotécnica*\n\n` +
      `Olá! Segue o orçamento para seu projeto:\n\n` +
      `📋 Orçamento #${orcamento.id}\n` +
      `👤 Cliente: ${orcamento.cliente}\n` +
      `📅 Data: ${new Date(orcamento.data).toLocaleDateString('pt-BR')}\n\n` +
      `💰 Valor Total: R$ ${orcamento.valorTotal.toFixed(2)}\n\n` +
      `Aguardamos sua aprovação! ⚡`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const totais = calcularTotal();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl text-gray-800 flex items-center gap-3">
            <FileText className="text-[#FFD700]" size={32} />
            Orçamentos
          </h2>
          <p className="text-gray-600 mt-1">Crie orçamentos profissionais em menos de 1 minuto</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Novo Orçamento
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-[#FFD700]">
          <CardContent>
            <p className="text-sm text-gray-600">Total de Orçamentos</p>
            <h3 className="text-3xl mt-2">{orcamentos.length}</h3>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent>
            <p className="text-sm text-gray-600">Pendentes</p>
            <h3 className="text-3xl mt-2">{orcamentos.filter(o => o.status === 'pendente').length}</h3>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent>
            <p className="text-sm text-gray-600">Aprovados</p>
            <h3 className="text-3xl mt-2">{orcamentos.filter(o => o.status === 'aprovado').length}</h3>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent>
            <p className="text-sm text-gray-600">Recusados</p>
            <h3 className="text-3xl mt-2">{orcamentos.filter(o => o.status === 'recusado').length}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Orçamentos */}
      <div className="space-y-4">
        {orcamentos.map((orcamento) => (
          <Card key={orcamento.id}>
            <CardContent>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg">{orcamento.cliente}</h4>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        orcamento.status === 'aprovado'
                          ? 'bg-green-100 text-green-700'
                          : orcamento.status === 'pendente'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {orcamento.status === 'aprovado' ? 'Aprovado' : orcamento.status === 'pendente' ? 'Pendente' : 'Recusado'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
                    <div>
                      <span className="block text-xs text-gray-500">Orçamento</span>
                      <span>#{orcamento.id}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500">Data</span>
                      <span>{new Date(orcamento.data).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500">Itens</span>
                      <span>{orcamento.itens.length}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500">Valor Total</span>
                      <span className="text-lg text-[#FFD700]">R$ {orcamento.valorTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => exportarPDF(orcamento)}>
                    <Download size={16} />
                    PDF
                  </Button>
                  <Button size="sm" onClick={() => enviarWhatsApp(orcamento)}>
                    <MessageCircle size={16} />
                    WhatsApp
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="w-full max-w-4xl my-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calculator size={24} />
                  Criar Orçamento Rápido
                </CardTitle>
                <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Cliente */}
                <Select
                  label="Selecione o Cliente"
                  value={clienteSelecionado}
                  onChange={(e) => setClienteSelecionado(e.target.value)}
                  required
                >
                  <option value="">-- Selecione --</option>
                  <option value="João Silva">João Silva</option>
                  <option value="Maria Santos">Maria Santos</option>
                  <option value="Carlos Oliveira">Carlos Oliveira</option>
                </Select>

                {/* Adicionar Itens */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <h4 className="flex items-center gap-2">
                    <Plus size={18} />
                    Adicionar Item
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Tipo"
                      value={novoItem.tipo}
                      onChange={(e) => setNovoItem({ ...novoItem, tipo: e.target.value as 'servico' | 'material' })}
                    >
                      <option value="servico">Serviço</option>
                      <option value="material">Material</option>
                    </Select>
                    <Input
                      label="Descrição"
                      value={novoItem.descricao}
                      onChange={(e) => setNovoItem({ ...novoItem, descricao: e.target.value })}
                      placeholder={novoItem.tipo === 'servico' ? 'Ex: Instalação de tomadas' : 'Ex: Tomadas 2P+T'}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="Quantidade"
                      type="number"
                      min="1"
                      value={novoItem.quantidade}
                      onChange={(e) => setNovoItem({ ...novoItem, quantidade: Number(e.target.value) })}
                    />
                    <Input
                      label="Valor Unitário (R$)"
                      type="number"
                      min="0"
                      step="0.01"
                      value={novoItem.valorUnitario}
                      onChange={(e) => setNovoItem({ ...novoItem, valorUnitario: Number(e.target.value) })}
                    />
                    <div className="flex items-end">
                      <Button type="button" onClick={adicionarItem} className="w-full">
                        <Plus size={18} />
                        Adicionar
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Lista de Itens */}
                {itens.length > 0 && (
                  <div className="space-y-2">
                    <h4>Itens do Orçamento</h4>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="text-left py-2 px-3 text-sm">Tipo</th>
                            <th className="text-left py-2 px-3 text-sm">Descrição</th>
                            <th className="text-left py-2 px-3 text-sm">Qtd</th>
                            <th className="text-left py-2 px-3 text-sm">Valor Unit.</th>
                            <th className="text-left py-2 px-3 text-sm">Total</th>
                            <th className="py-2 px-3"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {itens.map((item) => (
                            <tr key={item.id} className="border-t">
                              <td className="py-2 px-3">
                                <span className={`px-2 py-1 rounded text-xs ${item.tipo === 'servico' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                  {item.tipo === 'servico' ? 'Serviço' : 'Material'}
                                </span>
                              </td>
                              <td className="py-2 px-3 text-sm">{item.descricao}</td>
                              <td className="py-2 px-3 text-sm">{item.quantidade}</td>
                              <td className="py-2 px-3 text-sm">R$ {item.valorUnitario.toFixed(2)}</td>
                              <td className="py-2 px-3 text-sm">R$ {item.valorTotal.toFixed(2)}</td>
                              <td className="py-2 px-3">
                                <button onClick={() => removerItem(item.id)} className="p-1 hover:bg-red-100 rounded">
                                  <Trash2 size={16} className="text-red-600" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Configurações */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Deslocamento (R$)"
                    type="number"
                    min="0"
                    step="0.01"
                    value={deslocamento}
                    onChange={(e) => setDeslocamento(Number(e.target.value))}
                  />
                  <Input
                    label="Margem de Lucro (%)"
                    type="number"
                    min="0"
                    step="1"
                    value={margemLucro}
                    onChange={(e) => setMargemLucro(Number(e.target.value))}
                  />
                </div>

                {/* Totais */}
                {itens.length > 0 && (
                  <div className="bg-[#FFD700] bg-opacity-10 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal (Itens):</span>
                      <span>R$ {totais.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Deslocamento:</span>
                      <span>R$ {deslocamento.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Margem de Lucro ({margemLucro}%):</span>
                      <span>R$ {(totais.valorFinal - totais.totalComDeslocamento).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl border-t-2 border-[#FFD700] pt-2">
                      <span>Total do Orçamento:</span>
                      <span className="text-[#FFD700]">R$ {totais.valorFinal.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {/* Botões */}
                <div className="flex gap-3 justify-end pt-4">
                  <Button type="button" variant="ghost" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button type="button" onClick={criarOrcamento} disabled={itens.length === 0 || !clienteSelecionado}>
                    Criar Orçamento
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
