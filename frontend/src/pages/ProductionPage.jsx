import { useState } from "react";
import { productService } from "../services/productService";
import PageHeader from "../components/PageHeader";

export default function ProductionPage() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const data = await productService.getProductionSuggestion();
      console.log("Production data received:", data);
      setSuggestions(data);
      setHasCalculated(true);
    } catch (err) {
      console.error("Error fetching production suggestions:", err);
      alert("Error connecting to the workshop server.");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalRevenue = () => {
    return suggestions.reduce((acc, curr) => {
      return acc + (curr.totalValue || 0);
    }, 0);
  };

  return (
    <div className="min-h-screen  p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        <PageHeader
          title="Production"
          highlight="Optimizer"
          subtitle="Analyze assembly viability based on AutoFlex real-time stock levels."
        >
          <button
            onClick={handleCalculate}
            disabled={loading}
            className={`px-10 py-4 rounded-md font-bold text-white transition-all duration-300 shadow-lg ${
              loading
                ? "bg-slate-400 cursor-wait"
                : "bg-[#212529] hover:bg-[#c1191f] uppercase tracking-widest"
            }`}
          >
            {loading ? "Processing..." : "Simulate Production"}
          </button>
        </PageHeader>

        {hasCalculated && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {suggestions.length > 0 && (
              <div className="bg-[#212529] rounded-xl p-6 text-white flex flex-col md:flex-row justify-between items-center border-l-8 border-emerald-500 shadow-xl">
                <div>
                  <h3 className="text-emerald-500 font-black uppercase text-[10px] tracking-[0.2em]">
                    Estimated Gross Revenue
                  </h3>
                  <p className="text-slate-400 text-xs">
                    Based on all items that can be produced right now.
                  </p>
                </div>
                <div className="text-right mt-4 md:mt-0">
                  <span className="text-sm font-bold text-slate-400 mr-2">
                    R$
                  </span>
                  <span className="text-4xl font-black text-white">
                    {calculateTotalRevenue().toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            )}

            <h2 className="text-xl font-bold text-[#212529] flex items-center gap-2 uppercase">
              <span className="w-2 h-8 bg-[#E31E24] inline-block"></span>
              Suggested Items for Assembly
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestions.length > 0 ? (
                suggestions.map((item, index) => (
                  <div
                    key={index}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-200 flex flex-col relative overflow-hidden"
                  >
                    <div className="bg-[#212529] px-4 py-2 flex justify-between items-center">
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                        Suggestion
                      </span>
                      <span className="text-[#E31E24] text-xs font-black italic">
                        #{String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Product to produce
                          </p>
                          <h3 className="text-xl font-black text-[#212529] leading-tight uppercase group-hover:text-[#E31E24] transition-colors">
                            {item.productName}
                          </h3>
                        </div>

                        <div className="flex flex-col items-end">
                          <div className="text-4xl font-black text-[#212529] flex items-baseline gap-1">
                            {item.quantity}
                            <span className="text-[10px] text-slate-400 uppercase font-bold">
                              un
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-lg border-l-2 border-[#212529] space-y-3 mb-6">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">
                            Unit Price
                          </span>
                          <span className="font-mono text-sm font-bold text-slate-700">
                            R${" "}
                            {item.unitPrice.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-200/60">
                          <span className="text-[10px] text-[#212529] uppercase font-black tracking-tighter">
                            Subtotal
                          </span>
                          <span className="font-mono text-base font-black text-[#E31E24]">
                            R${" "}
                            {item.totalValue.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                            Ready for assembly
                          </span>
                        </div>

                        <div className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                          <span className="text-[#E31E24] text-lg">→</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full bg-white p-12 rounded-xl shadow-inner border-2 border-dashed border-slate-200 text-center">
                  <p className="text-slate-400 font-bold uppercase tracking-widest">
                    Critical Stock: Not enough materials for production.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <footer className="w-full mt-20 pb-10">
          <p className="text-2xl text-center font-black text-[#212529] opacity-20 uppercase tracking-widest">
            AutoFlex
          </p>
        </footer>
      </div>
    </div>
  );
}
