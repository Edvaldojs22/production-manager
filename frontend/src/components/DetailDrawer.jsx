import { Eye } from "lucide-react"; // Certifique-se de ter lucide-react instalado

const DetailDrawer = ({ isOpen, onClose, title, subtitle, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-center p-4">
      <div
        className="fixed inset-0 bg-[#212529]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative flex flex-col z-10 w-full max-w-lg bg-white shadow-2xl animate-in zoom-in-95 duration-300 rounded-[2rem] overflow-hidden border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-100">
              <Eye size={18} className="text-[#E31E24]" />
            </div>
            <div>
              <span className="text-[10px] font-black text-[#E31E24] uppercase tracking-widest">
                Data Inspection
              </span>
              <h2 className="text-lg font-black text-[#212529] uppercase tracking-tight">
                {title}
              </h2>
              {subtitle && (
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 text-slate-400 text-xl transition-colors font-bold"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-white">{children}</div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
            Autoflex Production System v1.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default DetailDrawer;
