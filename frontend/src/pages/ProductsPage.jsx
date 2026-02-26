import { useState, useEffect } from "react";

import ConfirmModal from "../components/ConfirmModal";
import { productService } from "../services/productService";
import { materialService } from "../services/materialService";
import PageHeader from "../components/PageHeader";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [currentQuantity, setCurrentQuantity] = useState("");
  const [searchMatCode, setSearchMatCode] = useState("");
  const [searchingMat, setSearchingMat] = useState(false);
  const [foundMaterial, setFoundMaterial] = useState(null);

  const handleFindMaterial = async () => {
    if (!searchMatCode.trim()) return;
    setSearchingMat(true);
    try {
      const data = await materialService.getMaterialByCode(
        searchMatCode.toUpperCase(),
      );
      if (data) {
        setFoundMaterial(data); // Guardamos o objeto todo aqui
      } else {
        alert("Material not found.");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setSearchingMat(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const prodData = await productService.getAll();

      setProducts(prodData);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const addMaterialToRecipe = () => {
    if (!foundMaterial || !currentQuantity) return;

    if (
      selectedMaterials.find((item) => item.materialId === foundMaterial.id)
    ) {
      alert("This material is already in the recipe!");
      return;
    }

    const newItem = {
      materialId: foundMaterial.id,
      name: foundMaterial.name,
      quantity: Number(currentQuantity),
    };

    setSelectedMaterials([...selectedMaterials, newItem]);

    setFoundMaterial(null);

    setCurrentQuantity("");
    setSearchMatCode("");
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

              <div className="p-5 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <p className="text-[11px] font-black text-[#212529] mb-3 uppercase tracking-wider">
                  Technical Composition (Add Materials)
                </p>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      className="flex-1 border border-slate-200 rounded-md p-2.5 bg-white text-xs outline-none focus:border-[#E31E24] font-mono uppercase"
                      placeholder="Enter SKU Code (ex: AF-101)"
                      value={searchMatCode}
                      onChange={(e) => setSearchMatCode(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={handleFindMaterial}
                      className="bg-[#212529] text-white px-6 rounded-md text-[10px] font-black hover:bg-black transition-all uppercase tracking-widest"
                    >
                      {searchingMat ? "Searching..." : "Find"}
                    </button>
                  </div>

                  {foundMaterial && (
                    <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-emerald-100 animate-in slide-in-from-top-2 duration-300">
                      <div className="flex-1">
                        <p className="text-[9px] font-black text-emerald-500 uppercase">
                          Material Found
                        </p>
                        <p className="text-sm font-bold text-slate-700">
                          {/* Pegamos o nome direto do objeto encontrado */}
                          {foundMaterial.name}
                          <span className="ml-2 text-[10px] text-slate-400 font-mono">
                            ({foundMaterial.code})
                          </span>
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Available: {foundMaterial.stockQuantity}{" "}
                          {foundMaterial.unit}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          className="w-24 border-2 border-slate-100 rounded-md p-2 bg-slate-50 text-center outline-none focus:border-[#E31E24] font-bold text-sm"
                          type="number"
                          placeholder="Qty"
                          value={currentQuantity}
                          onChange={(e) => setCurrentQuantity(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={addMaterialToRecipe}
                          className="bg-[#E31E24] text-white h-10 w-10 rounded-md hover:bg-[#c1191f] transition-all font-black text-xl shadow-md flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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
