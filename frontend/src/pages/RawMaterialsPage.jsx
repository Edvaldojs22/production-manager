import { useState, useEffect } from "react";
import { materialService } from "../services/materialService";
import ConfirmModal from "../components/ConfirmModal";
import PageHeader from "../components/PageHeader";
import ActionCard from "../components/ActionCard";
import DetailDrawer from "../components/DetailDrawer";
import { formatDate } from "../utils/fomateData";
import { Clock, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

export default function RawMaterialsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchCode, setSearchCode] = useState("");

  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [stockValue, setStockValue] = useState("");

  const [materials, setMaterials] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    unit: "",
    stockQuantity: 0,
  });

  useEffect(() => {
    loadMaterials(0);
  }, []);

  const openDetails = (item) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  const loadMaterials = async (page = 0) => {
    setLoading(true);
    try {
      const data = await materialService.getMaterials(page);

      setMaterials(data.content || []);
      setTotalPages(data.page?.totalPages || 0);
      setTotalElements(data.page?.totalElements || 0);
      setCurrentPage(data.page?.number || 0);
    } catch (err) {
      console.log("Error loading materials:", err);
      toast.error("Error loading materials");
      setMaterials([]);
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

    try {
      await materialService.createMaterial(dataToSubmit);
      setFormData({ name: "", code: "", unit: "", stockQuantity: "" });
      toast.success("Raw material created");
      loadMaterials(currentPage);
    } catch (err) {
      console.log("Error in creation: " + err);
      toast.error("Error in creation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = async () => {
    if (!searchCode.trim()) {
      loadMaterials(0);
      return;
    }

    setLoading(true);
    try {
      const data = await materialService.getMaterialByCode(searchCode);
      setMaterials(data ? [data] : []);
      setTotalPages(1);
    } catch (err) {
      console.error("Material not found", err);
      toast.info("Material not found!");
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  const openStockModal = (material) => {
    setSelectedMaterial(material);
    setIsStockModalOpen(true);
    setStockValue("");
  };

  const handleUpdateStock = async (isAdding) => {
    const value = Number(stockValue);
    if (!value || value <= 0) {
      toast.info("Please enter a valid value greater than zero");
      return;
    }

    const finalValue = isAdding ? value : value * -1;

    try {
      await materialService.updateStock(selectedMaterial.id, finalValue);
      toast.success("Stock update completed");
      setIsStockModalOpen(false);
      loadMaterials(currentPage);
    } catch (err) {
      const erro = err.response?.data?.message || "Error updating stock";
      toast.info(erro);
    }
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);

    try {
      await materialService.deleteMaterial(selectedId);
      toast.success("Raw material excluded");
      await loadMaterials(currentPage);
      setIsModalOpen(false);
    } catch (err) {
      const erro =
        err.response?.data?.message || "Error when deleting raw material";
      toast.error(erro);
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
        <PageHeader
          title="Raw Material"
          highlight="Management"
          subtitle="Control of raw materials and base stock."
        >
          <span className="bg-slate-100 text-slate-600 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
            {totalElements} total items
          </span>
        </PageHeader>

        <section className="bg-white p-8 rounded-xl shadow-md border border-slate-100">
          <h2 className="text-sm font-black mb-6 text-[#212529] uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#E31E24] inline-block"></span>
            New Material Entry
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end"
          >
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                Description
              </label>
              <input
                className="border border-slate-200 rounded-md p-3 bg-slate-50 focus:border-[#E31E24] outline-none transition-all text-sm"
                placeholder="Ex: Steel Plate"
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
                Code material
              </label>
              <input
                className="border border-slate-200 uppercase rounded-md p-3 bg-slate-50 focus:border-[#E31E24] outline-none transition-all text-sm font-mono"
                placeholder="Ex: AF-100"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                Unit
              </label>
              <select
                className="border border-slate-200 rounded-md p-3 bg-slate-50 focus:border-[#E31E24] outline-none transition-all text-sm h-[46px]"
                value={formData.unit}
                required
                onChange={(e) =>
                  setFormData({ ...formData, unit: e.target.value })
                }
              >
                <option value="">Select...</option>
                <option value="UN">Unit (un)</option>
                <option value="KG">Kilogram (kg)</option>
                <option value="L">Liter (L)</option>
                <option value="M">Meter (m)</option>
                <option value="M2">Square Meter (m²)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                Initial Qty.
              </label>
              <input
                className="border border-slate-200 rounded-md p-3 bg-slate-50 focus:border-[#E31E24] outline-none transition-all text-sm font-bold text-[#212529]"
                type="number"
                placeholder="0"
                min={0}
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
                {isSubmitting ? "Syncing..." : "Register Material"}
              </button>
            </div>
          </form>
        </section>

        <section className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Code: MT42"
              className="w-full border uppercase border-slate-200 rounded-md p-2.5 bg-slate-50 focus:border-[#212529] outline-none text-xs font-mono"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-[#212529] hover:bg-slate-800 text-white text-[10px] font-black px-6 py-2.5 rounded uppercase tracking-widest transition-all active:scale-95"
          >
            Search
          </button>
          {searchCode && (
            <button
              onClick={() => {
                setSearchCode("");
                loadMaterials(0);
              }}
              className="text-slate-400 hover:text-[#E31E24] text-[10px] font-bold uppercase"
            >
              Clear
            </button>
          )}
        </section>

        <section className="space-y-4">
          <div className="bg-[#212529] p-4 rounded-xl shadow-md border-b-4 border-[#E31E24]">
            <h2 className="text-white text-xs font-black uppercase tracking-widest text-center">
              Factory Inventory
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              <div className="col-span-full bg-white p-16 rounded-xl border border-slate-100 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#E31E24]"></div>
                <p className="mt-4 text-slate-400 font-bold uppercase text-[10px]">
                  Accessing Database...
                </p>
              </div>
            ) : materials.length > 0 ? (
              materials.map((m) => (
                <ActionCard
                  key={m.id}
                  badge="Raw Material"
                  title={m.name}
                  subtitle={m.code}
                  value={m.stockQuantity}
                  unit={m.unit}
                  onViewClick={() => openDetails(m)}
                  actions={
                    <>
                      <button
                        onClick={() => openStockModal(m)}
                        className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-[#212529] text-[#212529] hover:text-white transition-all py-2.5 rounded-xl text-[10px] font-black uppercase border border-slate-200"
                      >
                        Stock
                      </button>
                      <button
                        onClick={() => openDeleteModal(m.id)}
                        className="flex items-center justify-center gap-2 bg-red-50 hover:bg-[#E31E24] text-[#E31E24] hover:text-white transition-all py-2.5 rounded-xl text-[10px] font-black uppercase border border-red-100"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </>
                  }
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${m.stockQuantity > 5 ? "bg-emerald-500" : "bg-red-500 animate-pulse"}`}
                    />
                    <span
                      className={`text-[10px] font-bold uppercase ${m.stockQuantity > 5 ? "text-emerald-600" : "text-red-600"}`}
                    >
                      {m.stockQuantity > 5 ? "Stable Stock" : "Critical Stock"}
                    </span>
                  </div>
                </ActionCard>
              ))
            ) : (
              <div className="col-span-full bg-white p-12 rounded-xl text-center border-2 border-dashed border-slate-200 text-slate-400 font-bold uppercase text-xs">
                No materials found in this section.
              </div>
            )}
          </div>
          <DetailDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            title={selectedItem?.name}
            // Se tiver 'code', é material. Se não, usamos o ID do produto.
            subtitle={
              selectedItem?.code
                ? `SKU: ${selectedItem.code}`
                : `Product ID: #${selectedItem?.id}`
            }
          >
            {/* CONTEÚDO DINÂMICO BASEADO NO TIPO DE DADO */}
            <div className="space-y-6">
              {/* Se for PRODUTO (tem lista de materiais) */}
              {selectedItem?.materials && (
                <div className="space-y-4">
                  <div className="bg-[#212529] p-5 rounded-3xl text-white">
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      Market Price
                    </p>
                    <p className="text-2xl font-black text-[#E31E24]">
                      R${" "}
                      {selectedItem?.price?.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase">
                      Technical Composition
                    </p>
                    {selectedItem.materials.map((m) => (
                      <div
                        key={m.id}
                        className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-100"
                      >
                        <span className="text-xs font-bold text-slate-600">
                          {m.rawMaterial.name}
                        </span>
                        <span className="text-xs font-black text-[#212529]">
                          {m.requiredQuantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Se for MATERIAL (tem stockQuantity) */}
              {selectedItem?.stockQuantity !== undefined && (
                <div className="space-y-4">
                  <div className="bg-[#212529] p-5 rounded-3xl text-white">
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      Current Stock
                    </p>
                    <p className="text-3xl font-black">
                      {selectedItem.stockQuantity}{" "}
                      <span className="text-sm text-[#E31E24]">
                        {selectedItem.unit}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {/* TIMESTAMPS (Comum a ambos - vindo das suas classes Java) */}
              <div className="pt-6 border-t border-slate-100 space-y-3">
                <h4 className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2">
                  <Clock size={12} /> System Logs
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Created:
                    </span>
                    {/* Note o 'createDAt' para material e 'createdAt' para produto conforme seu Java */}
                    <span className="text-[11px] font-black text-slate-600">
                      {formatDate(
                        selectedItem?.createdAt || selectedItem?.createDAt,
                      )}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Last Update:
                    </span>
                    <span className="text-[11px] font-black text-slate-600">
                      {formatDate(selectedItem?.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </DetailDrawer>

          {totalPages > 1 && (
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm mt-6">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Showing page {currentPage + 1} of {totalPages}
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 0}
                  onClick={() => loadMaterials(currentPage - 1)}
                  className="px-4 py-2 bg-white border border-slate-200 text-[#212529] rounded-md text-[10px] font-black uppercase hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>

                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${i === currentPage ? "bg-[#E31E24]" : "bg-slate-200"}`}
                    />
                  ))}
                </div>

                <button
                  disabled={currentPage + 1 >= totalPages}
                  onClick={() => loadMaterials(currentPage + 1)}
                  className="px-4 py-2 bg-[#212529] text-white rounded-md text-[10px] font-black uppercase hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>

        {isStockModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border-t-4 border-[#212529]">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-black text-[#212529] uppercase tracking-tight">
                    Movement Adjustment
                  </h3>
                  <button
                    onClick={() => setIsStockModalOpen(false)}
                    className="text-slate-400 hover:text-black"
                  >
                    ✕
                  </button>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg mb-6 border border-slate-100 text-center">
                  <span className="block text-[10px] font-black text-slate-400 uppercase mb-1">
                    Current store inventory
                  </span>
                  <span className="text-3xl font-black text-[#212529]">
                    {selectedMaterial?.stockQuantity} {selectedMaterial?.unit}
                  </span>
                </div>
                <div className="space-y-4">
                  <input
                    type="number"
                    className="w-full border-2 border-slate-100 rounded-md p-4 text-xl font-black outline-none focus:border-[#212529]"
                    placeholder="0.00"
                    value={stockValue}
                    onChange={(e) => setStockValue(e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleUpdateStock(false)}
                      className="bg-amber-500 text-white font-black py-4 rounded-md uppercase text-xs"
                    >
                      Withdraw (-)
                    </button>
                    <button
                      onClick={() => handleUpdateStock(true)}
                      className="bg-emerald-500 text-white font-black py-4 rounded-md uppercase text-xs"
                    >
                      Add (+)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <ConfirmModal
          isOpen={isModalOpen}
          isLoading={deleting}
          title={"CONFIRM DELETION"}
          message={
            "It will only be possible to delete this material if it is not linked to a product. This action will permanently remove the material from inventory. Do you want to continue?"
          }
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </div>
  );
}
