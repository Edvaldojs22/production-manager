import { useState, useEffect } from "react";
import { materialService } from "../services/materialService";
import ConfirmModal from "../components/ConfirmModal";
import PageHeader from "../components/PageHeader";
import ActionCard from "../components/ActionCard";

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
      loadMaterials(currentPage);
    } catch (err) {
      console.log(err);
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
      alert("Please enter a valid value greater than zero");
      return;
    }

    const finalValue = isAdding ? value : value * -1;

    try {
      await materialService.updateStock(selectedMaterial.id, finalValue);
      setIsStockModalOpen(false);
      loadMaterials(currentPage);
    } catch (err) {
      console.log(err);
    }
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await materialService.deleteMaterial(selectedId);
      await loadMaterials(currentPage);
      setIsModalOpen(false);
    } catch (erro) {
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
                  badge="Material"
                  subtitle={`Code: ${m.code}`}
                  title={m.name}
                  value={m.stockQuantity}
                  unit={m.unit}
                  actions={
                    <>
                      <button
                        onClick={() => openStockModal(m)}
                        className="bg-slate-100 hover:bg-[#212529] text-[#212529] hover:text-white transition-all py-2 rounded-lg text-[10px] font-black uppercase"
                      >
                        Stock
                      </button>
                      <button
                        onClick={() => openDeleteModal(m.id)}
                        className="bg-red-50 hover:bg-[#E31E24] text-[#E31E24] hover:text-white transition-all py-2 rounded-lg text-[10px] font-black uppercase"
                      >
                        Delete
                      </button>
                    </>
                  }
                >
                  {/* Children para Material: Indicador de status */}
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
            "This action will permanently remove the material from the inventory. Do you wish to proceed?"
          }
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </div>
  );
}
