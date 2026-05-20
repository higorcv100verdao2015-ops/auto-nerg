import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Package, Plus, Edit, Trash2, Search, X } from 'lucide-react';

interface Material {
  id: number;
  nome: string;
  quantidade: number;
  precoCompra: number;
  fornecedor: string;
  unidade: string;
}

const materiaisIniciais: Material[] = [
  { id: 1, nome: 'Tomada 2P+T 10A', quantidade: 50, precoCompra: 12.50, fornecedor: 'Elétrica Central', unidade: 'un' },
  { id: 2, nome: 'Disjuntor 20A', quantidade: 30, precoCompra: 25.00, fornecedor: 'Distribuidora São Paulo', unidade: 'un' },
  { id: 3, nome: 'Fio 2,5mm² (metro)', quantidade: 500, precoCompra: 3.80, fornecedor: 'Elétrica Central', unidade: 'm' },
  { id: 4, nome: 'Interruptor Simples', quantidade: 40, precoCompra: 8.90, fornecedor: 'Casa do Eletricista', unidade: 'un' },
  { id: 5, nome: 'Lâmpada LED 12W', quantidade: 100, precoCompra: 15.00, fornecedor: 'Distribuidora São Paulo', unidade: 'un' }
];

export function Materiais() {
  const [materiais, setMateriais] = useState<Material[]>(materiaisIniciais);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    quantidade: 0,
    precoCompra: 0,
    fornecedor: '',
    unidade: 'un'
  });

  const materiaisFiltrados = materiais.filter(m =>
    m.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.fornecedor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const valorTotalEstoque = materiais.reduce((acc, m) => acc + (m.quantidade * m.precoCompra), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMaterial) {
      setMateriais(materiais.map(m =>
        m.id === editingMaterial.id ? { ...editingMaterial, ...formData } : m
      ));
    } else {
      const newMaterial: Material = {
        id: Date.now(),
        ...formData
      };
      setMateriais([...materiais, newMaterial]);
    }
    resetForm();
  };

  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    setFormData({
      nome: material.nome,
      quantidade: material.quantidade,
      precoCompra: material.precoCompra,
      fornecedor: material.fornecedor,
      unidade: material.unidade
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Deseja realmente excluir este material?')) {
      setMateriais(materiais.filter(m => m.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      quantidade: 0,
      precoCompra: 0,
      fornecedor: '',
      unidade: 'un'
    });
    setEditingMaterial(null);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl text-gray-800 flex items-center gap-3">
            <Package className="text-[#FFD700]" size={32} />
            Materiais
          </h2>
          <p className="text-gray-600 mt-1">Controle seu estoque e preços de materiais</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Novo Material
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-[#FFD700]">
          <CardContent>
            <p className="text-sm text-gray-600">Total de Itens</p>
            <h3 className="text-3xl mt-2">{materiais.length}</h3>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent>
            <p className="text-sm text-gray-600">Valor Total em Estoque</p>
            <h3 className="text-3xl mt-2">R$ {valorTotalEstoque.toFixed(2)}</h3>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent>
            <p className="text-sm text-gray-600">Estoque Baixo</p>
            <h3 className="text-3xl mt-2">{materiais.filter(m => m.quantidade < 10).length}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Buscar materiais..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Materiais */}
      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Material</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Quantidade</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Preço Compra</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Fornecedor</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-600">Total</th>
                  <th className="text-right py-3 px-4 text-sm text-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody>
                {materiaisFiltrados.map((material) => (
                  <tr key={material.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{material.nome}</td>
                    <td className="py-3 px-4">
                      <span className={material.quantidade < 10 ? 'text-orange-600 font-semibold' : ''}>
                        {material.quantidade} {material.unidade}
                      </span>
                    </td>
                    <td className="py-3 px-4">R$ {material.precoCompra.toFixed(2)}</td>
                    <td className="py-3 px-4 text-gray-600">{material.fornecedor}</td>
                    <td className="py-3 px-4">R$ {(material.quantidade * material.precoCompra).toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleEdit(material)}
                          className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Edit size={16} className="text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(material.id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
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
                <CardTitle>{editingMaterial ? 'Editar Material' : 'Novo Material'}</CardTitle>
                <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Nome do Material"
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Tomada 2P+T 10A"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Quantidade"
                    type="number"
                    required
                    min="0"
                    value={formData.quantidade}
                    onChange={(e) => setFormData({ ...formData, quantidade: Number(e.target.value) })}
                  />
                  <Input
                    label="Unidade"
                    type="text"
                    required
                    value={formData.unidade}
                    onChange={(e) => setFormData({ ...formData, unidade: e.target.value })}
                    placeholder="un, m, kg"
                  />
                </div>
                <Input
                  label="Preço de Compra (R$)"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.precoCompra}
                  onChange={(e) => setFormData({ ...formData, precoCompra: Number(e.target.value) })}
                />
                <Input
                  label="Fornecedor"
                  type="text"
                  required
                  value={formData.fornecedor}
                  onChange={(e) => setFormData({ ...formData, fornecedor: e.target.value })}
                  placeholder="Nome do fornecedor"
                />
                <div className="flex gap-3 justify-end pt-4">
                  <Button type="button" variant="ghost" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingMaterial ? 'Salvar Alterações' : 'Cadastrar Material'}
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
