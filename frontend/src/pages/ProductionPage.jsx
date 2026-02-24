import { useState } from "react";
import { productService } from "../services/productService";

export default function ProductionPage() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const data = await productService.getProductionSuggestion();
      setSuggestions(data);
      setHasCalculated(true);
    } catch (err) {
      alert("Erro ao acessar o servidor da oficina.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-xl shadow-sm border-t-4 border-[#E31E24]">
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-[#212529] uppercase tracking-tight">
              Otimizador de <span className="text-[#E31E24]">Produção</span>
            </h1>
            <p className="text-slate-500 max-w-md">
              Analise a viabilidade de montagem com base no estoque real de
              insumos da AutoFlex.
            </p>
          </div>

          <button
            onClick={handleCalculate}
            disabled={loading}
            className={`
              px-10 py-4 rounded-md font-bold text-white transition-all duration-300 shadow-lg
              ${
                loading
                  ? "bg-slate-400 cursor-wait"
                  : "bg-[#E31E24] hover:bg-[#c1191f] hover:-translate-y-1 active:scale-95 uppercase tracking-widest"
              }
            `}
          >
            {loading ? "Processando..." : "Simular Produção"}
          </button>
        </header>

        {hasCalculated && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#212529] flex items-center gap-2">
              <span className="w-2 h-8 bg-[#E31E24] inline-block"></span>
              PRODUTOS SUGERIDOS PARA MONTAGEM
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestions.length > 0 ? (
                suggestions.map((text, index) => {
                  const parts = text
                    .replace("Suggestion: Produce ", "")
                    .split("x ");

                  return (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-md overflow-hidden border border-slate-100 flex flex-col"
                    >
                      <div className="bg-[#212529] p-3 text-white text-xs font-bold uppercase tracking-widest text-center">
                        Sugestão #{index + 1}
                      </div>

                      <div className="p-6 flex-1 flex flex-col items-center text-center space-y-4">
                        <div className="text-5xl font-black text-[#E31E24]">
                          {parts[0]}
                          <span className="text-sm text-slate-400 ml-1">
                            UN
                          </span>
                        </div>

                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase">
                            Item a produzir
                          </p>
                          <h3 className="text-lg font-bold text-[#212529] leading-tight">
                            {parts[1]}
                          </h3>
                        </div>

                        <div className="w-full pt-4 border-t border-slate-50">
                          <span className="inline-block bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-200 uppercase">
                            ✓ Insumos Disponíveis
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full bg-white p-12 rounded-xl shadow-inner border-2 border-dashed border-slate-200 text-center">
                  <p className="text-slate-400 font-bold uppercase tracking-widest">
                    Estoque Crítico: Não há materiais suficientes para produção.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <footer className=" w-full mt-30 ">
          <p className="text-2xl  text-center font-black text-[#212529]">
            AutoFlex
          </p>
        </footer>
      </div>
    </div>
  );
}
