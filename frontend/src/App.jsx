import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import RawMaterialsPage from "./pages/RawMaterialsPage";
import ProductsPage from "./pages/ProductsPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-slate-900 font-sans">
        <nav className="bg-white border-b border-slate-200 p-4">
          <div className="max-w-6xl mx-auto flex gap-8">
            <Link to="/materiais" className="hover:text-indigo-600 transition">
              Materiais
            </Link>
            <Link to="/produtos" className="hover:text-indigo-600 transition">
              Produtos
            </Link>
          </div>
        </nav>

        <main className="py-8">
          <Routes>
            <Route path="/materiais" element={<RawMaterialsPage />} />
            <Route path="/produtos" element={<ProductsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
