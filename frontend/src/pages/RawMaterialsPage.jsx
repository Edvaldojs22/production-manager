import { useState, useEffect } from "react";
import { materialService } from "../services/materialService";
import ConfirmModal from "../components/ConfirmModal";

export default function RawMaterialsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    stockQuantity: 0,
  });

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    setLoading(true);
    try {
      const data = await materialService.getMaterials();
      setMaterials(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSubmit = {
      ...formData,
      stockQuantity: Number(formData.stockQuantity),
    };
    console.log(dataToSubmit);

    try {
      await materialService.createMaterial(dataToSubmit);
      setFormData({ name: "", code: "", stockQuantity: "" });
      loadMaterials();
    } catch (err) {
      console.log(err);
    }
  };

  const handleConfirmDelete = async () => {
    console.log(selectedId);
    setDeleting(true);
    try {
      await materialService.deleteMaterial(selectedId);
      await loadMaterials();
      setIsModalOpen(false);
    } catch (erro) {
      console.log(erro);
    } finally {
      setDeleting(false);
    }
  };
  const openDeleteModal = (id) => {
    setSelectedId(id); // 1. Guarda o ID do material que o usuário clicou
    setIsModalOpen(true); // 2. Abre o modal de confirmação
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <header className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-bold text-slate-800">
          📦 Matérias-Primas
        </h1>
        <span className="text-sm text-slate-500">
          {materials.length} itens cadastrados
        </span>
      </header>

      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-semibold mb-4 text-slate-700">
          Novo Material
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <input
            className="border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Nome (ex: Aço)"
            value={formData.name}
            type="text"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            className="border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Código (ex: MP001)"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          />
          <input
            className="border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            type="number"
            placeholder="Qtd. em Estoque"
            value={formData.stockQuantity}
            onChange={(e) =>
              setFormData({ ...formData, stockQuantity: e.target.value })
            }
            required
          />
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
            Cadastrar
          </button>
        </form>
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
            <tr>
              <th className="px-6 py-3 font-semibold">Código</th>
              <th className="px-6 py-3 font-semibold">Nome</th>
              <th className="px-6 py-3 font-semibold">Estoque</th>
              <th className="px-6 py-3 font-semibold text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-10 text-slate-400">
                  Carregando...
                </td>
              </tr>
            ) : (
              materials.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm">
                    {m.code || "---"}
                  </td>
                  <td className="px-6 py-4 text-slate-700 font-medium">
                    {m.name}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${m.stockQuantity > 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                    >
                      {m.stockQuantity} unidades
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openDeleteModal(m.id)}
                      className="text-red-500 hover:text-red-700 font-medium text-sm"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
      <ConfirmModal
        isOpen={isModalOpen}
        isLoading={deleting}
        title={"Delete Material"}
        message={
          "Are you sure? This action cannot be undone and may affect linked products."
        }
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
