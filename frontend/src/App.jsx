import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import RawMaterialsPage from "./pages/RawMaterialsPage";
import ProductsPage from "./pages/ProductsPage";
import ProductionPage from "./pages/ProductionPage";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans">
        <nav className="bg-[#212529] border-b-4 border-[#E31E24] shadow-md">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
            <div className="flex items-center gap-3">
              <div className="bg-[#E31E24] text-white font-black italic px-2 py-0.5 rounded text-lg">
                AF
              </div>
              <span className="text-white font-black uppercase tracking-widest text-sm hidden sm:inline">
                Auto<span className="text-[#E31E24]">Flex</span>
              </span>
            </div>

            <div className="flex h-full gap-2">
              <Link
                to="/producao"
                className="flex items-center px-4 text-[11px] font-black uppercase tracking-widest text-slate-300 hover:text-white hover:bg-[#2d3238] transition-all border-b-2 border-transparent hover:border-[#E31E24]"
              >
                Produção
              </Link>
              <Link
                to="/materiais"
                className="flex items-center px-4 text-[11px] font-black uppercase tracking-widest text-slate-300 hover:text-white hover:bg-[#2d3238] transition-all border-b-2 border-transparent hover:border-[#E31E24]"
              >
                Materiais
              </Link>
              <Link
                to="/produtos"
                className="flex items-center px-4 text-[11px] font-black uppercase tracking-widest text-slate-300 hover:text-white hover:bg-[#2d3238] transition-all border-b-2 border-transparent hover:border-[#E31E24]"
              >
                Produtos
              </Link>
            </div>
          </div>
        </nav>

        <main className="py-10">
          <div className="animate-in fade-in duration-500">
            <Routes>
              <Route path="/" element={<ProductionPage />} />{" "}
              <Route path="/producao" element={<ProductionPage />} />
              <Route path="/materiais" element={<RawMaterialsPage />} />
              <Route path="/produtos" element={<ProductsPage />} />
            </Routes>
          </div>
        </main>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
