import { useState, useEffect } from "react";

import ConfirmModal from "../components/ConfirmModal";
import { productService } from "../services/productService";
import { materialService } from "../services/materialService";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  const [currentMaterialId, setCurrentMaterialId] = useState("");
  const [currentQuantity, setCurrentQuantity] = useState("");

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [prodData, matData] = await Promise.all([
        productService.getAll(),
        materialService.getMaterials(),
      ]);

      setProducts(prodData);
      setMaterials(matData);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const addMaterialToRecipe = () => {
    if (!currentMaterialId || !currentQuantity) return;

    const materialObj = materials.find(
      (m) => m.id === parseInt(currentMaterialId),
    );

    if (selectedMaterials.find((item) => item.materialId === materialObj.id)) {
      alert("Este material já está na receita!");
      return;
    }

    const newItem = {
      materialId: materialObj.id,
      name: materialObj.name,
      quantity: Number(currentQuantity),
    };

    setSelectedMaterials([...selectedMaterials, newItem]);
    console.log(newItem);
    setCurrentMaterialId("");
    setCurrentQuantity("");
  };

  const removeMaterialFromRecipe = (id) => {
    setSelectedMaterials(
      selectedMaterials.filter((item) => item.materialId !== id),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedMaterials.length === 0) {
      alert("Adicione pelo menos uma matéria-prima ao produto!");
      return;
    }

    setIsSubmitting(true);
    const finalProduct = {
      name: productName,
      price: Number(productPrice),
      materials: selectedMaterials.map((item) => ({
        rawMaterial: { id: item.materialId },
        requiredQuantity: Number(item.quantity),
      })),
    };
    console.log(finalProduct);
    try {
      await productService.create(finalProduct);
      setProductName("");
      setProductPrice("");
      setSelectedMaterials([]);
      loadInitialData();
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteModal = (id) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await productService.delete(selectedId); // Certifique-se que existe no seu service
      loadInitialData(); // Recarrega a lista
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <header className="border-b pb-4">
        <h1 className="text-2xl font-bold text-slate-800">
          Cadastro de Produtos
        </h1>
        <p className="text-slate-500 text-sm">
          Defina os produtos e suas composições
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulário de Cadastro */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
          <h2 className="text-lg font-semibold mb-4 text-slate-700">
            Novo Produto
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="w-full border border-slate-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Nome do Produto (ex: Cadeira de Aço)"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
            <input
              className="w-full border border-slate-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-500"
              type="number"
              step="0.01"
              placeholder="Preço de Venda (R$)"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              required
            />

            {/* RF007: Área de Associação de Matéria-Prima */}
            <div className="p-4 bg-slate-50 rounded-lg border border-dashed border-slate-300">
              <p className="text-sm font-bold text-slate-600 mb-2">
                Adicionar Matéria-Prima
              </p>
              <div className="flex gap-2">
                <select
                  className="flex-1 border border-slate-300 rounded-lg p-2 bg-white"
                  value={currentMaterialId}
                  onChange={(e) => setCurrentMaterialId(e.target.value)}
                >
                  <option value="">Selecione o Material...</option>
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} | Estoque: {m.stockQuantity} {m.unit}
                    </option>
                  ))}
                </select>
                <input
                  className="w-20 border border-slate-300 rounded-lg p-2 bg-white"
                  type="number"
                  placeholder="Qtd"
                  value={currentQuantity}
                  onChange={(e) => setCurrentQuantity(e.target.value)}
                />
                <button
                  type="button"
                  onClick={addMaterialToRecipe}
                  className="bg-slate-800 text-white px-4 rounded-lg hover:bg-slate-700"
                >
                  +
                </button>
              </div>

              {/* Lista Temporária de Materiais (A Receita) */}
              <div className="mt-4 space-y-2">
                {selectedMaterials.map((item) => (
                  <div
                    key={item.materialId}
                    className="flex justify-between items-center bg-white p-2 rounded border text-sm"
                  >
                    <span>
                      {item.name} x <strong>{item.quantity}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => removeMaterialFromRecipe(item.materialId)}
                      className="text-red-500 hover:font-bold"
                    >
                      remover
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? "Salvando..." : "Salvar Produto Completo"}
            </button>
          </form>
        </section>

        {/* Listagem de Produtos */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-fit">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-slate-600 font-semibold">
                  Produto
                </th>
                <th className="px-4 py-3 text-slate-600 font-semibold">
                  Preço
                </th>
                <th className="px-4 py-3 text-slate-600 font-semibold">
                  Composição
                </th>
                <th className="px-4 py-3 text-slate-600 font-semibold text-right">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4 font-medium text-slate-700">
                    {p.name}
                  </td>

                  <td className="px-4 py-4 text-emerald-600 font-bold">
                    R${" "}
                    {p.price.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      {p.materials?.map((item) => (
                        <span
                          key={item.id}
                          className="inline-flex items-center bg-indigo-50 text-indigo-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-indigo-100"
                        >
                          {/* Navegando até o nome dentro de rawMaterial */}
                          {item.rawMaterial?.name}: {item.requiredQuantity}
                        </span>
                      ))}
                      {(!p.materials || p.materials.length === 0) && (
                        <span className="text-slate-400 text-xs italic">
                          Sem materiais
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => openDeleteModal(p.id)}
                      className="text-red-500 hover:text-red-700 font-medium text-sm p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        isLoading={isDeleting}
        title="Excluir Produto"
        message="Tem certeza que deseja excluir este produto? A composição associada também será removida."
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
