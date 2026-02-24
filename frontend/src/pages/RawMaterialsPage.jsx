import { useState, useEffect } from "react";
import { materialService } from "../services/materialService";
import ConfirmModal from "../components/ConfirmModal";

export default function RawMaterialsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    unit: "",
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
    setIsSubmitting(true);

    const dataToSubmit = {
      ...formData,
      stockQuantity: Number(formData.stockQuantity),
    };
    console.log(dataToSubmit);

    try {
      await materialService.createMaterial(dataToSubmit);
      setFormData({ name: "", code: "", unit: "", stockQuantity: "" });
      loadMaterials();
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmitting(false);
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
      if (erro.response?.status === 500) {
        console.log(
          "ERRO DE VÍNCULO: Este material faz parte da composição de um produto ativo e não pode ser removido.",
        );
      }
      console.log(erro);
    } finally {
      setDeleting(false);
    }
  };
  const openDeleteModal = (id) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border-t-4 border-[#E31E24]">
          <div>
            <h1 className="text-2xl font-black text-[#212529] uppercase tracking-tight">
              Gestão de <span className="text-[#E31E24]">Insumos</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Controle de matérias-primas e estoque base.
            </p>
          </div>
          <span className="bg-slate-100 text-slate-600 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
            {materials.length} itens no sistema
          </span>
        </header>

        <section className="bg-white p-8 rounded-xl shadow-md border border-slate-100">
          <h2 className="text-sm font-black mb-6 text-[#212529] uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#E31E24] inline-block"></span>
            Entrada de Novo Material
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end"
          >
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                Descrição
              </label>
              <input
                className="border border-slate-200 rounded-md p-3 bg-slate-50 focus:border-[#E31E24] outline-none transition-all text-sm"
                placeholder="Ex: Chapa de Aço"
                value={formData.name}
                type="text"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                Código SKU
              </label>
              <input
                className="border border-slate-200 rounded-md p-3 bg-slate-50 focus:border-[#E31E24] outline-none transition-all text-sm font-mono"
                placeholder="Ex: AF-100"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                Unidade
              </label>
              <select
                className="border border-slate-200 rounded-md p-3 bg-slate-50 focus:border-[#E31E24] outline-none transition-all text-sm h-[46px]"
                value={formData.unit}
                required
                onChange={(e) =>
                  setFormData({ ...formData, unit: e.target.value })
                }
              >
                <option value="">Selecione...</option>
                <option value="UN">Unidade (un)</option>
                <option value="KG">Quilo (kg)</option>
                <option value="L">Litro (L)</option>
                <option value="M">Metro (m)</option>
                <option value="M2">Metro Quadrado (m²)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                Qtd. Inicial
              </label>
              <input
                className="border border-slate-200 rounded-md p-3 bg-slate-50 focus:border-[#E31E24] outline-none transition-all text-sm font-bold text-[#212529]"
                type="number"
                placeholder="0"
                value={formData.stockQuantity}
                onChange={(e) =>
                  setFormData({ ...formData, stockQuantity: e.target.value })
                }
                required
              />
            </div>

            <div className="md:col-span-4 flex justify-end pt-2">
              <button
                disabled={isSubmitting}
                className={`font-black py-3 px-10 rounded-md transition-all shadow-lg uppercase tracking-widest text-xs ${
                  isSubmitting
                    ? "bg-slate-300 cursor-not-allowed text-slate-500"
                    : "bg-[#E31E24] hover:bg-[#c1191f] text-white active:scale-95 shadow-red-100"
                }`}
              >
                {isSubmitting ? "Sincronizando..." : "Registrar Material"}
              </button>
            </div>
          </form>
        </section>

        <section className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
          <div className="bg-[#212529] p-4">
            <h2 className="text-white text-xs font-black uppercase tracking-widest">
              Inventário de Fábrica
            </h2>
          </div>

          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">
                  Código
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">
                  Nome do Material
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-center">
                  Und.
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">
                  Status Estoque
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-right">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-16">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#E31E24]"></div>
                    <p className="mt-2 text-slate-400 font-bold uppercase text-[10px]">
                      Acessando Banco de Dados...
                    </p>
                  </td>
                </tr>
              ) : (
                materials.map((m) => (
                  <tr
                    key={m.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                      {m.code || "---"}
                    </td>
                    <td className="px-6 py-4 text-[#212529] font-bold uppercase">
                      {m.name}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-center font-bold">
                      {m.unit}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${m.stockQuantity > 5 ? "bg-emerald-500" : "bg-red-500 animate-pulse"}`}
                        ></div>
                        <span
                          className={`font-black ${m.stockQuantity > 5 ? "text-emerald-700" : "text-red-700"}`}
                        >
                          {m.stockQuantity}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openDeleteModal(m.id)}
                        className=" group-hover:opacity-100 transition-opacity bg-red-50 text-[#E31E24] text-[10px] font-black px-3 py-1.5 rounded uppercase"
                      >
                        Remover
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
          title={"CONFIRMAR EXCLUSÃO"}
          message={
            "Esta ação removerá o insumo do inventário permanentemente. Deseja prosseguir?"
          }
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </div>
  );
}
