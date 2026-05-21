import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Input, Select, TextArea } from '../components/Input';
import { jsPDF } from 'jspdf';
import orcamentoLogo from '../../assets/web/orcamento-logo-0205.jpeg';
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

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

const formatCurrency = (value: number) => currencyFormatter.format(value);

const formatDate = (value: string) =>
  new Date(`${value}T00:00:00`).toLocaleDateString('pt-BR');

const formatDateTime = (value: string) => {
  const date = new Date(`${value}T00:00:00`);
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${date.toLocaleDateString('pt-BR')} ${hh}:${mm}`;
};

const carregarImagemComoBase64 = (src: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      const context = canvas.getContext('2d');

      if (!context) {
        reject(new Error('Nao foi possivel processar a logo.'));
        return;
      }

      context.drawImage(image, 0, 0);
      resolve(canvas.toDataURL('image/jpeg'));
    };

    image.onerror = () => reject(new Error('Falha ao carregar a logo.'));
    image.src = src;
  });

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

  const exportarPDF = async (orcamento: Orcamento) => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margem = 8;
    const conteudoLargura = pageWidth - margem * 2;
    const xDescricao = margem + 3;
    const xPreco = margem + 138;
    const xQtd = margem + 165;
    const xTotal = margem + 188;
    let y = margem + 2;

    const itensServico = orcamento.itens.filter((item) => item.tipo === 'servico');
    const itensMaterial = orcamento.itens.filter((item) => item.tipo === 'material');
    const subtotal = orcamento.itens.reduce((acc, item) => acc + item.valorTotal, 0);
    const totalComDeslocamento = subtotal + orcamento.deslocamento;
    const lucro = orcamento.valorTotal - totalComDeslocamento;
    const numeroDocumento = `${new Date(orcamento.data).getFullYear()}${String(orcamento.id).slice(-4)}-${orcamento.itens.length}`;

    const drawHeaderTabela = (startY: number, titulo: string) => {
      const alturaCabecalho = 8;
      const alturaLinha = 10;

      pdf.setDrawColor(20, 20, 20);
      pdf.setLineWidth(0.2);

      pdf.setFillColor(238, 238, 238);
      pdf.rect(margem, startY, 132, alturaCabecalho, 'FD');
      pdf.rect(xPreco - 5, startY, 27, alturaCabecalho, 'FD');
      pdf.rect(xQtd - 5, startY, 23, alturaCabecalho, 'FD');
      pdf.rect(xTotal - 5, startY, 14, alturaCabecalho, 'FD');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.text(titulo, margem + 2, startY + 5.5);
      pdf.text('Preco', xPreco, startY + 5.5);
      pdf.text('Quantidade', xQtd, startY + 5.5);
      pdf.text('V', xTotal, startY + 5.5);

      return { yLinha: startY + alturaCabecalho, alturaLinha };
    };

    const drawLinhaTabela = (startY: number, item: ItemOrcamento) => {
      const alturaLinha = 10;
      pdf.rect(margem, startY, 132, alturaLinha);
      pdf.rect(xPreco - 5, startY, 27, alturaLinha);
      pdf.rect(xQtd - 5, startY, 23, alturaLinha);
      pdf.rect(xTotal - 5, startY, 14, alturaLinha);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9.6);
      const descricao = pdf.splitTextToSize(item.descricao, 126);
      const descricaoVisivel = descricao[0] ?? '-';
      pdf.text(descricaoVisivel, margem + 2, startY + 6.2);
      pdf.text(formatCurrency(item.valorUnitario), xPreco, startY + 6.2);
      pdf.text(String(item.quantidade), xQtd, startY + 6.2);
      pdf.text(formatCurrency(item.valorTotal), xTotal, startY + 6.2);

      return startY + alturaLinha;
    };

    pdf.setDrawColor(15, 15, 15);
    pdf.setLineWidth(0.4);
    pdf.rect(margem, margem, conteudoLargura, pageHeight - margem * 2 - 56);

    try {
      const logoBase64 = await carregarImagemComoBase64(orcamentoLogo);
      pdf.addImage(logoBase64, 'JPEG', margem + 2, y, 28, 28);
    } catch (error) {
      console.error('Erro ao carregar logo no PDF:', error);
    }

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(22);
    pdf.text('Orcamento', pageWidth - margem - 3, y + 6, { align: 'right' });

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10.5);
    pdf.text('N do Documento', pageWidth - margem - 54, y + 14);
    pdf.text(numeroDocumento, pageWidth - margem - 3, y + 14, { align: 'right' });
    pdf.text('Data do Documento', pageWidth - margem - 54, y + 21);
    pdf.text(formatDateTime(orcamento.data), pageWidth - margem - 3, y + 21, { align: 'right' });

    y += 33;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10.8);
    pdf.text('Cliente:', pageWidth - margem - 54, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(orcamento.cliente, pageWidth - margem - 3, y, { align: 'right' });
    y += 7;
    pdf.setFont('helvetica', 'bold');
    pdf.text('Contato:', pageWidth - margem - 54, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Nao informado', pageWidth - margem - 3, y, { align: 'right' });

    y += 10;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text('Descricao de Atividades', xDescricao, y);
    y += 4;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.2);
    orcamento.itens.forEach((item, index) => {
      if (index > 9) {
        return;
      }

      const textoItem = `${index + 1}. ${item.descricao}`;
      const linhas = pdf.splitTextToSize(textoItem, conteudoLargura - 8);
      const linhaPrincipal = linhas[0] ?? textoItem;
      pdf.text(linhaPrincipal, xDescricao, y + 4.5);
      y += 7;
    });

    if (orcamento.itens.length > 10) {
      pdf.setFont('helvetica', 'italic');
      pdf.text(`...e mais ${orcamento.itens.length - 10} item(ns) no sistema.`, xDescricao, y + 2.5);
      pdf.setFont('helvetica', 'normal');
      y += 7;
    }

    y += 6;
    const servicoHeader = drawHeaderTabela(y, 'Servicos');
    y = servicoHeader.yLinha;

    if (itensServico.length === 0) {
      const itemVazio: ItemOrcamento = {
        id: -1,
        tipo: 'servico',
        descricao: '-',
        quantidade: 0,
        valorUnitario: 0,
        valorTotal: 0
      };
      y = drawLinhaTabela(y, itemVazio);
    } else {
      itensServico.forEach((item) => {
        y = drawLinhaTabela(y, item);
      });
    }

    y += 6;
    const materialHeader = drawHeaderTabela(y, 'Materiais');
    y = materialHeader.yLinha;

    if (itensMaterial.length === 0) {
      const itemVazio: ItemOrcamento = {
        id: -2,
        tipo: 'material',
        descricao: '-',
        quantidade: 0,
        valorUnitario: 0,
        valorTotal: 0
      };
      y = drawLinhaTabela(y, itemVazio);
    } else {
      itensMaterial.forEach((item) => {
        y = drawLinhaTabela(y, item);
      });
    }

    y += 6;
    pdf.setLineWidth(0.2);
    pdf.rect(margem + 95, y, 85, 8);
    pdf.rect(margem + 95, y + 8, 85, 8);
    pdf.rect(margem + 95, y + 16, 85, 10);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text('Subtotal', margem + 98, y + 5.5);
    pdf.text(formatCurrency(totalComDeslocamento), margem + 177, y + 5.5, { align: 'right' });
    pdf.text(`Margem de lucro (${orcamento.margemLucro}%)`, margem + 98, y + 13.5);
    pdf.text(formatCurrency(lucro), margem + 177, y + 13.5, { align: 'right' });

    pdf.setFont('helvetica', 'bold');
    pdf.text('Preco Final', margem + 98, y + 22.5);
    pdf.text(formatCurrency(orcamento.valorTotal), margem + 177, y + 22.5, { align: 'right' });

    y += 35;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('Garantia da mao de obra:', xDescricao, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text('90 dias', xDescricao + 42, y);

    y += 10;
    pdf.setFont('helvetica', 'bold');
    pdf.text('Observacoes', xDescricao, y);
    y += 5;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.2);
    const observacao = `Orcamento gerado automaticamente para ${orcamento.cliente}. Pagamento: PIX, dinheiro, cartao de credito ou boleto.`;
    const linhasObs = pdf.splitTextToSize(observacao, conteudoLargura - 8);
    pdf.text(linhasObs, xDescricao, y + 4);

    pdf.setFontSize(8.5);
    pdf.text('1/1', pageWidth - margem - 3, pageHeight - margem - 2, { align: 'right' });

    pdf.save(`orcamento-${orcamento.id}.pdf`);
  };

  const enviarWhatsApp = (orcamento: Orcamento) => {
    const message = encodeURIComponent(
      `🔌 *Aut&Nerg - Eletrotécnica*\n\n` +
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

