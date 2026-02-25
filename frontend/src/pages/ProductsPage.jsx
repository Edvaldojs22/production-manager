import { useState, useEffect } from "react";

import ConfirmModal from "../components/ConfirmModal";
import { productService } from "../services/productService";
import { materialService } from "../services/materialService";
import PageHeader from "../components/PageHeader";

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
    console.log(`Material with ID ${id} removed from temporary recipe`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedMaterials.length === 0) {
      alert("Please add at least one raw material to the product!");
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

    console.log("Submitting final product payload:", finalProduct);

    try {
      await productService.create(finalProduct);
      console.log("Product successfully created in database");
      setProductName("");
      setProductPrice("");
      setSelectedMaterials([]);
    } catch (err) {
      console.error("Error creating product:", err);
      const serverMsg = err.response?.data?.message || "Internal Server Error";
      alert(`Error: ${serverMsg}`);
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
      await productService.delete(selectedId);
      console.log(`Product with ID ${selectedId} deleted`);

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 font-sans">
      <div className="max-w-6xl m-auto space-y-8">
        <PageHeader
          title={"Product"}
          highlight={"Management"}
          subtitle="Manage catalog and technical assembly composition."
        />
        <section className="bg-white p-6 rounded-xl shadow-md border border-slate-100 h-fit">
          <h2 className="text-sm font-black mb-6 text-[#212529] uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#E31E24] inline-block"></span>
            New Production Item
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                Product Name
              </label>
              <input
                className="w-full border border-slate-200 rounded-md p-3 outline-none focus:border-[#E31E24] transition-colors bg-slate-50"
                placeholder="Ex: Heavy Duty Damper"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                Selling Price (R$)
              </label>
              <input
                className="w-full border border-slate-200 rounded-md p-3 outline-none focus:border-[#E31E24] transition-colors bg-slate-50 font-bold text-[#212529]"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                required
              />
            </div>

            <div className="p-5 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <p className="text-[11px] font-black text-[#212529] mb-3 uppercase tracking-wider">
                Technical Composition (Raw Materials)
              </p>

              <div className="flex flex-wrap gap-2">
                <select
                  className="flex-1 border border-slate-200 rounded-md p-2.5 bg-white text-sm outline-none focus:border-[#E31E24]"
                  value={currentMaterialId}
                  onChange={(e) => setCurrentMaterialId(e.target.value)}
                >
                  <option value="">Select Material...</option>
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} | Stock: {m.stockQuantity} {m.unit}
                    </option>
                  ))}
                </select>
                <input
                  className="w-20 border border-slate-200 rounded-md p-2 bg-white text-center outline-none focus:border-[#E31E24]"
                  type="number"
                  placeholder="Qty"
                  value={currentQuantity}
                  onChange={(e) => setCurrentQuantity(e.target.value)}
                />
                <button
                  type="button"
                  onClick={addMaterialToRecipe}
                  className="bg-[#212529] text-white py-2 px-5 rounded-md hover:bg-black transition-colors font-bold"
                >
                  +
                </button>
              </div>

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
                        Remove
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
              {isSubmitting ? "Saving to System..." : "Finish Registration"}
            </button>
          </form>
        </section>

        <section className="bg-transparent space-y-4 h-fit">
          <div className="bg-[#212529] p-4 rounded-xl shadow-md border-b-4 border-[#E31E24] mb-6">
            <h2 className="text-white text-xs font-black uppercase tracking-widest text-center">
              Item Catalog
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {loading ? (
              <div className="bg-white p-10 rounded-xl border border-slate-100 text-center shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase animate-pulse">
                  Loading Catalog...
                </span>
              </div>
            ) : (
              products.map((p) => (
                <div
                  key={p.id}
                  className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:border-[#E31E24]/30 transition-all group relative overflow-hidden"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#E31E24] opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] bg-[#212529] text-white px-2 py-0.5 rounded font-black uppercase">
                          Product
                        </span>
                        <p className="font-black text-[#212529] text-base uppercase tracking-tight">
                          {p.name}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {p.materials?.map((item) => (
                          <span
                            key={item.id}
                            className="text-[9px] bg-slate-50 text-slate-500 px-2 py-1 rounded-md font-bold uppercase border border-slate-200"
                          >
                            {item.rawMaterial?.name}:{" "}
                            <span className="text-[#212529]">
                              {item.requiredQuantity}
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center gap-2 pt-4 sm:pt-0 border-t border-slate-50 sm:border-0">
                      <div className="">
                        <p className="text-[9px] font-bold text-slate-400 uppercase leading-none">
                          Price
                        </p>
                        <p className="font-black text-[#E31E24] text-lg">
                          R${" "}
                          {p.price.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                      </div>

                      <button
                        onClick={() => openDeleteModal(p.id)}
                        className="bg-red-50 text-[#E31E24] text-[10px] font-black px-4 py-2 rounded-lg uppercase transition-all hover:bg-[#E31E24] hover:text-white border border-red-100 hover:shadow-lg hover:shadow-red-200"
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
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        isLoading={isDeleting}
        title="DELETE RECORD"
        message="Are you sure you want to permanently remove this product and its technical composition?"
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
