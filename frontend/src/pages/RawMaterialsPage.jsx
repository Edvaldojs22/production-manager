import { useState, useEffect } from "react";
import { materialService } from "../services/materialService";
import ConfirmModal from "../components/ConfirmModal";
import PageHeader from "../components/PageHeader";

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
      const data = await materialService.getMaterials(searchCode);
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

  const handleSearch = async () => {
    if (!searchCode.trim()) {
      loadMaterials();
      return;
    }

    setLoading(true);
    try {
      const data = await materialService.getMaterialByCode(searchCode);
      setMaterials(data ? [data] : []);
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
      loadMaterials();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Unexpected error updating stock.";
      alert(errorMessage);
    }
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await materialService.deleteMaterial(selectedId);
      await loadMaterials();
      setIsModalOpen(false);
    } catch (erro) {
      if (erro.response?.status === 500) {
        console.log(
          "LINK ERROR: This material is part of an active product composition and cannot be removed.",
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
        <PageHeader
          title="Raw Material"
          highlight="Management"
          subtitle="Control of raw materials and base stock."
        >
          <span className="bg-slate-100 text-slate-600 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
            {materials.length} items in system
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
                SKU Code
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
                loadMaterials();
              }}
              className="text-slate-400 hover:text-[#E31E24] text-[10px] font-bold uppercase"
            >
              Clear
            </button>
          )}
        </section>

        {/* INVENTORY SECTION - CARD LAYOUT */}
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
            ) : (
              materials.map((m) => (
                <div
                  key={m.id}
                  className="bg-white rounded-xl shadow-sm border border-slate-100 hover:border-[#212529]/20 transition-all group overflow-hidden"
                >
                  <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                    <span className="font-mono text-[10px] text-slate-400 font-bold uppercase">
                      SKU: {m.code || "N/A"}
                    </span>
                    <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-black">
                      Stock
                    </span>
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-[#212529] font-black uppercase tracking-tight text-sm mb-1">
                          {m.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${m.stockQuantity > 5 ? "bg-emerald-500" : "bg-red-500 animate-pulse"}`}
                          />
                          <span
                            className={`text-xs font-bold uppercase ${m.stockQuantity > 5 ? "text-emerald-600" : "text-red-600"}`}
                          >
                            {m.stockQuantity > 5
                              ? "Stable Stock"
                              : "Critical / Low"}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`text-2xl font-black ${m.stockQuantity > 5 ? "text-[#212529]" : "text-red-600"}`}
                        >
                          {m.stockQuantity}
                        </span>
                        <span className="block text-[10px] font-black text-slate-300 uppercase leading-none">
                          {m.unit}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-50">
                      <button
                        onClick={() => openStockModal(m)}
                        className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-[#212529] text-[#212529] hover:text-white transition-all py-2 rounded-lg text-[10px] font-black uppercase tracking-wider"
                      >
                        Stock
                      </button>
                      <button
                        onClick={() => openDeleteModal(m.id)}
                        className="flex items-center justify-center gap-2 bg-red-50 hover:bg-[#E31E24] text-[#E31E24] hover:text-white transition-all py-2 rounded-lg text-[10px] font-black uppercase tracking-wider"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {isStockModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border-t-4 border-[#212529]">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-black text-[#212529] uppercase tracking-tight">
                      Movement Adjustment
                    </h3>
                    <p className="text-xs text-slate-500 font-bold uppercase mt-1">
                      {selectedMaterial?.name} —{" "}
                      <span className="font-mono text-[#E31E24]">
                        {selectedMaterial?.code}
                      </span>
                    </p>
                  </div>
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
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                      Operation Quantity
                    </label>
                    <input
                      type="number"
                      className="w-full border-2 border-slate-100 rounded-md p-4 text-xl font-black outline-none focus:border-[#212529] transition-all"
                      placeholder="0.00"
                      value={stockValue}
                      onChange={(e) => setStockValue(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <button
                      onClick={() => handleUpdateStock(false)}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-black py-4 rounded-md uppercase tracking-widest text-xs shadow-lg active:scale-95 transition-all"
                    >
                      Withdraw (-)
                    </button>
                    <button
                      onClick={() => handleUpdateStock(true)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-md uppercase tracking-widest text-xs shadow-lg active:scale-95 transition-all"
                    >
                      Add (+)
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 text-center">
                <button
                  onClick={() => setIsStockModalOpen(false)}
                  className="text-[10px] font-black text-slate-400 uppercase hover:text-slate-600"
                >
                  Cancel and Return
                </button>
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
