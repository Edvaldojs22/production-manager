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
    <div className="min-h-screen bg-[#F8F9FA] p-6 font-sans">
      {/* Header Estilo AutoFlex */}
      <header className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-[#E31E24]">
        <h1 className="text-2xl font-black text-[#212529] uppercase tracking-tight">
          Cadastro de <span className="text-[#E31E24]">Produtos</span>
        </h1>
        <p className="text-slate-500 text-sm font-medium">
          Gerencie o catálogo e a composição técnica de montagem.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulário de Cadastro */}
        <section className="bg-white p-6 rounded-xl shadow-md border border-slate-100 h-fit">
          <h2 className="text-sm font-black mb-6 text-[#212529] uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#E31E24] inline-block"></span>
            Novo Item de Produção
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                Nome do Produto
              </label>
              <input
                className="w-full border border-slate-200 rounded-md p-3 outline-none focus:border-[#E31E24] transition-colors bg-slate-50"
                placeholder="Ex: Amortecedor Rebaixado"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                Preço de Venda (R$)
              </label>
              <input
                className="w-full border border-slate-200 rounded-md p-3 outline-none focus:border-[#E31E24] transition-colors bg-slate-50 font-bold text-[#212529]"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                required
              />
            </div>

            {/* RF007: Área de Associação */}
            <div className="p-5 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <p className="text-[11px] font-black text-[#212529] mb-3 uppercase tracking-wider">
                Composição Técnica (Insumos)
              </p>

              <div className="flex gap-2">
                <select
                  className="flex-1 border border-slate-200 rounded-md p-2.5 bg-white text-sm outline-none focus:border-[#E31E24]"
                  value={currentMaterialId}
                  onChange={(e) => setCurrentMaterialId(e.target.value)}
                >
                  <option value="">Selecionar Material...</option>
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} | {m.stockQuantity} {m.unit}
                    </option>
                  ))}
                </select>
                <input
                  className="w-20 border border-slate-200 rounded-md p-2 bg-white text-center outline-none focus:border-[#E31E24]"
                  type="number"
                  placeholder="Qtd"
                  value={currentQuantity}
                  onChange={(e) => setCurrentQuantity(e.target.value)}
                />
                <button
                  type="button"
                  onClick={addMaterialToRecipe}
                  className="bg-[#212529] text-white px-5 rounded-md hover:bg-black transition-colors font-bold"
                >
                  +
                </button>
              </div>

              {/* Lista Temporária */}
              <div className="mt-4 space-y-2">
                {selectedMaterials.map((item) => (
                  <div
                    key={item.materialId}
                    className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100 shadow-sm animate-in fade-in zoom-in duration-200"
                  >
                    <span className="text-xs font-bold text-slate-600">
                      {item.name}{" "}
                      <span className="text-[#E31E24] ml-2 font-black">
                        x {item.quantity}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => removeMaterialFromRecipe(item.materialId)}
                      className="text-slate-300 hover:text-[#E31E24] transition-colors"
                    >
                      <span className="text-[10px] font-black uppercase">
                        Remover
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#E31E24] text-white font-black py-4 rounded-md hover:bg-[#c1191f] shadow-lg shadow-red-200 disabled:opacity-50 transition-all uppercase tracking-widest text-sm"
            >
              {isSubmitting ? "Gravando no Sistema..." : "Finalizar Cadastro"}
            </button>
          </form>
        </section>

        {/* Listagem de Produtos */}
        <section className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden h-fit">
          <div className="bg-[#212529] p-4">
            <h2 className="text-white text-xs font-black uppercase tracking-widest">
              Catálogo de Itens
            </h2>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase">
                  Produto
                </th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase">
                  Preço
                </th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase text-right">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-slate-50 transition-colors group"
                >
                  <td className="px-4 py-4">
                    <p className="font-bold text-[#212529] text-sm uppercase">
                      {p.name}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {p.materials?.map((item) => (
                        <span
                          key={item.id}
                          className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold uppercase"
                        >
                          {item.rawMaterial?.name}: {item.requiredQuantity}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 font-black text-[#E31E24] text-sm">
                    R${" "}
                    {p.price.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => openDeleteModal(p.id)}
                      className="opacity-0 group-hover:opacity-100 bg-red-50 text-[#E31E24] text-[10px] font-black px-3 py-1.5 rounded uppercase transition-all"
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
        title="EXCLUIR REGISTRO"
        message="Confirma a remoção permanente deste produto e sua composição técnica?"
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
