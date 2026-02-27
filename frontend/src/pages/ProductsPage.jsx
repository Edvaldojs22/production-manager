import { useState, useEffect } from "react";

import ConfirmModal from "../components/ConfirmModal";
import { productService } from "../services/productService";
import { materialService } from "../services/materialService";
import PageHeader from "../components/PageHeader";
import ActionCard from "../components/ActionCard";
import DetailDrawer from "../components/DetailDrawer";
import { Calendar, Edit3, Eye, Save, Trash2 } from "lucide-react";
import { formatDate } from "../utils/fomateData";
import { toast } from "react-toastify";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [ui, setUi] = useState({
    loading: false,
    submitting: false,
    deleting: false,
  });

  const [form, setForm] = useState({
    name: "",
    price: "",
    materials: [],
    searchCode: "",
    foundMaterial: null,
    quantity: "",
  });

  const [edit, setEdit] = useState({
    isOpen: false,
    product: null,
    materials: [],
    searchCode: "",
    foundMaterial: null,
    quantity: "",
  });

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  const loadInitialData = async () => {
    setUi((prev) => ({ ...prev, loading: true }));
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setUi((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleFindMaterial = async (mode) => {
    const isEdit = mode === "edit";
    const code = isEdit ? edit.searchCode : form.searchCode;

    if (!code.trim()) return;
    setUi((prev) => ({ ...prev, submitting: true }));

    try {
      const data = await materialService.getMaterialByCode(code.toUpperCase());
      if (data) {
        isEdit
          ? setEdit((prev) => ({ ...prev, foundMaterial: data }))
          : setForm((prev) => ({ ...prev, foundMaterial: data }));
      } else {
        toast.info("Material not found.");
      }
    } catch (err) {
      const erro = err.response.data?.message || "Material not found";
      toast.info(erro);
    } finally {
      setUi((prev) => ({ ...prev, submitting: false }));
    }
  };

  const addMaterial = (mode) => {
    const isEdit = mode === "edit";
    const target = isEdit ? edit : form;

    if (!target.foundMaterial || !target.quantity) return;

    if (
      target.materials.some((m) => m.materialId === target.foundMaterial.id)
    ) {
      toast.info("Material already in recipe!");
      return;
    }

    toast.success("Added raw material");
    const newItem = {
      materialId: target.foundMaterial.id,
      name: target.foundMaterial.name,
      quantity: Number(target.quantity),
      code: target.foundMaterial.code,
      unit: target.foundMaterial.unit,
    };

    if (isEdit) {
      setEdit((prev) => ({
        ...prev,
        materials: [...prev.materials, newItem],
        foundMaterial: null,
        searchCode: "",
        quantity: "",
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        materials: [...prev.materials, newItem],
        foundMaterial: null,
        searchCode: "",
        quantity: "",
      }));
    }
  };

  const removeMaterial = (id, mode) => {
    if (mode === "edit") {
      setEdit((prev) => ({
        ...prev,
        materials: prev.materials.filter((m) => m.materialId !== id),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        materials: prev.materials.filter((m) => m.materialId !== id),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.materials.length === 0)
      return toast.info("Add at least one material!");

    setUi((prev) => ({ ...prev, submitting: true }));
    const payload = {
      name: form.name,
      price: Number(form.price),
      materials: form.materials.map((m) => ({
        rawMaterial: { id: m.materialId },
        requiredQuantity: m.quantity,
      })),
    };

    try {
      await productService.create(payload);
      setForm({
        name: "",
        price: "",
        materials: [],
        searchCode: "",
        foundMaterial: null,
        quantity: "",
      });
      toast.success("Product created successfully");
      loadInitialData();
    } catch (err) {
      toast.error("Error creating product.");
      console.log(err.response?.data);
    } finally {
      setUi((prev) => ({ ...prev, submitting: false }));
    }
  };

  const handleUpdate = async () => {
    if (edit.materials.length === 0)
      return toast.info("Recipe cannot be empty!");
    setUi((prev) => ({ ...prev, submitting: true }));

    const payload = edit.materials.map((m) => ({
      rawMaterial: { id: m.materialId },
      requiredQuantity: m.quantity,
    }));

    try {
      await productService.upadateMaterials(edit.product.id, payload);
      setEdit((prev) => ({ ...prev, isOpen: false }));
      toast.success("Product updated successfully");
      loadInitialData();
    } catch (err) {
      toast.error("Error updating recipe.");
      console.log(err);
    } finally {
      setUi((prev) => ({ ...prev, submitting: false }));
    }
  };

  const openDetails = (product) => {
    setEdit({
      isOpen: true,
      product: product,
      materials: product.materials.map((m) => ({
        materialId: m.rawMaterial.id,
        name: m.rawMaterial.name,
        quantity: m.requiredQuantity,
        code: m.rawMaterial.code,
        unit: m.rawMaterial.unit,
      })),
      searchCode: "",
      foundMaterial: null,
      quantity: "",
    });
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
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>

            <div>
              <div className="p-5 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <p className="text-[11px] font-black text-[#212529] mb-3 uppercase tracking-wider">
                  Technical Composition (Add Materials)
                </p>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      className="flex-1 border border-slate-200 rounded-md p-2.5 bg-white text-xs outline-none focus:border-[#E31E24] font-mono uppercase"
                      placeholder="Enter SKU Code (ex: AF-101)"
                      value={form.searchCode}
                      onChange={(e) =>
                        setForm({ ...form, searchCode: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => handleFindMaterial("create")}
                      className="bg-[#212529] text-white px-6 rounded-md text-[10px] font-black hover:bg-black transition-all uppercase tracking-widest"
                    >
                      {ui.submitting ? "Searching..." : "Find"}
                    </button>
                  </div>

                  {form.foundMaterial && (
                    <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-emerald-100 animate-in slide-in-from-top-2 duration-300">
                      <div className="flex-1">
                        <p className="text-[9px] font-black text-emerald-500 uppercase">
                          Material Found
                        </p>
                        <p className="text-sm font-bold text-slate-700">
                          {form.foundMaterial.name}
                          <span className="ml-2 text-[10px] text-slate-400 font-mono">
                            ({form.foundMaterial.code})
                          </span>
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Available: {form.foundMaterial.stockQuantity}{" "}
                          {form.foundMaterial.unit}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          className="w-24 border-2 border-slate-100 rounded-md p-2 bg-slate-50 text-center outline-none focus:border-[#E31E24] font-bold text-sm"
                          type="number"
                          placeholder="Qty"
                          value={form.currentQuantity}
                          onChange={(e) =>
                            setForm({ ...form, quantity: e.target.value })
                          }
                        />
                        <button
                          type="button"
                          onClick={() => addMaterial("create")}
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
                {form.materials.map((m) => (
                  <div
                    key={m.materialId}
                    className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100 shadow-sm animate-in fade-in zoom-in duration-200"
                  >
                    <span className="text-xs font-bold text-slate-600">
                      {m.name}{" "}
                      <span className="text-[#E31E24] ml-2 font-black">
                        x {m.quantity}
                      </span>
                    </span>

                    <button
                      type="button"
                      onClick={() => removeMaterial(m.materialId, "create")}
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
              disabled={ui.submitting}
              className="w-full bg-[#E31E24] text-white font-black py-4 rounded-md hover:bg-[#c1191f] shadow-lg shadow-red-200 disabled:opacity-50 transition-all uppercase tracking-widest text-sm"
            >
              {ui.submitting ? "Saving..." : "Finish Registration"}
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
            {ui.loading ? (
              <div className="bg-white p-10 rounded-xl border border-slate-100 text-center shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase animate-pulse">
                  Loading Catalog...
                </span>
              </div>
            ) : (
              products.map((p) => (
                <ActionCard
                  key={p.id}
                  badge="Product"
                  title={p.name}
                  value={`R$ ${p.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                  actions={
                    <>
                      <button
                        onClick={() => openDetails(p)}
                        className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-[#212529] text-[#212529] hover:text-white transition-all py-2.5 rounded-xl text-[10px] font-black uppercase border border-slate-200 hover:border-[#212529]"
                      >
                        <Eye size={14} /> Info
                      </button>

                      <button
                        onClick={() =>
                          setDeleteModal({ isOpen: true, id: p.id })
                        }
                        className="flex items-center justify-center gap-2 bg-red-50 hover:bg-[#E31E24] text-[#E31E24] hover:text-white transition-all py-2.5 rounded-xl text-[10px] font-black uppercase border border-red-100 hover:border-[#E31E24]"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </>
                  }
                >
                  <div className="mt-2 flex flex-col gap-1">
                    <div className="flex flex-wrap items-end gap-1">
                      {p.materials?.slice(0, 3).map((m, index) => (
                        <span
                          key={index}
                          className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 font-medium"
                        >
                          {m.rawMaterial.name}
                        </span>
                      ))}

                      {p.materials?.length > 3 && (
                        <span className="text-[9px] text-slate-400 font-black ml-1">
                          . . .
                        </span>
                      )}
                    </div>
                  </div>
                </ActionCard>
              ))
            )}
          </div>
          <DetailDrawer
            isOpen={edit.isOpen}
            onClose={() => setEdit({ ...edit, isOpen: false })}
            title={edit.product?.name}
          >
            <div className="space-y-6">
              <div>
                <h4 className="text-[11px] font-black uppercase text-[#212529] mb-3 flex items-center gap-2">
                  <Edit3 size={12} className="text-[#E31E24]" />
                  Technical Recipe Management
                </h4>

                <div className="bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-300 mb-4">
                  <div className="flex gap-2 mb-3">
                    <input
                      className="flex-1 border border-slate-200 rounded-lg p-2 text-xs outline-none focus:border-[#E31E24] font-mono uppercase"
                      placeholder="Search SKU Code (ex: AF-101)"
                      value={edit.searchCode}
                      onChange={(e) =>
                        setEdit({ ...edit, searchCode: e.target.value })
                      }
                    />
                    <button
                      onClick={() => handleFindMaterial("edit")}
                      className="bg-black text-white px-3 rounded"
                    >
                      Find
                    </button>
                  </div>

                  {edit.foundMaterial && (
                    <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-emerald-100 animate-in slide-in-from-top-2 duration-300">
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-700">
                          {edit.foundMaterial.name}
                        </p>

                        <p className="text-[9px] text-slate-400">
                          Stock: {edit.foundMaterial.stockQuantity}{" "}
                          {edit.foundMaterial.unit}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <input
                          className="w-16 border border-slate-200 rounded p-1.5 text-center font-bold text-xs outline-none focus:border-[#E31E24]"
                          type="number"
                          placeholder="Qty"
                          value={edit.quantity}
                          onChange={(e) =>
                            setEdit({ ...edit, quantity: e.target.value })
                          }
                        />
                        <button
                          onClick={() => addMaterial("edit")}
                          className="bg-[#E31E24] text-white h-8 w-8 rounded hover:bg-[#c1191f] transition-all font-black text-lg flex items-center justify-center shadow-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {edit.materials.length > 0 ? (
                    edit.materials.map((m) => (
                      <div
                        key={m.materialId}
                        className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100 shadow-sm group"
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-600">
                            {m.name}
                          </span>
                          <span className="text-[9px] font-mono text-slate-400">
                            {m.code}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black bg-slate-100 text-[#212529] px-2 py-1 rounded border border-slate-200">
                            {m.quantity} {m.unit}
                          </span>
                          <button
                            onClick={() => removeMaterial(m.materialId, "edit")}
                            className="text-slate-300 hover:text-[#E31E24] transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-4 text-[10px] font-bold text-slate-300 uppercase italic">
                      No materials in recipe
                    </p>
                  )}
                </div>

                <button
                  onClick={handleUpdate}
                  className="w-full mt-4 bg-[#212529] text-white py-3 rounded-xl text-[10px] font-black uppercase hover:bg-black transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Save size={18} className="text-[#E31E24]" />
                  Save Recipe Changes
                </button>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <h4 className="text-[11px] font-black uppercase text-[#212529] mb-3 flex items-center gap-2">
                  <Calendar size={12} className="text-[#E31E24]" /> System
                  Timeline
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase">
                      Created At
                    </p>
                    <p className="text-[11px] font-black text-slate-600">
                      {formatDate(edit.product?.createdAt)}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase">
                      Last Update
                    </p>
                    <p className="text-[11px] font-black text-slate-600">
                      {formatDate(edit.product?.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </DetailDrawer>
        </section>
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        isLoading={ui.deleting}
        title="DELETE RECORD"
        message="Are you sure you want to permanently remove this product and its technical composition?"
        onConfirm={async () => {
          setUi({ ...ui, deleting: true });
          await productService.delete(deleteModal.id);
          setDeleteModal({ isOpen: false, id: null });
          toast.success("product deleted");
          loadInitialData();
          setUi({ ...ui, deleting: false });
        }}
      />
    </div>
  );
}
