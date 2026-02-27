import { Eye } from "lucide-react";

export default function ActionCard({
  badge,
  title,
  subtitle,
  value,
  unit,
  onViewClick,
  children,
  actions,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden relative group">
      <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex justify-between items-center">
        <span className="text-[10px] bg-[#212529] text-white px-2 py-0.5 rounded font-black uppercase tracking-widest">
          {badge}
        </span>

        {onViewClick && (
          <button
            onClick={onViewClick}
            className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-[#E31E24] transition-all border border-transparent hover:border-slate-200"
            title="View Details"
          >
            <Eye size={14} />
          </button>
        )}
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-[#212529] font-black uppercase text-base">
              {title}
            </h3>
            <p className="font-mono text-[10px] text-slate-400 font-bold uppercase">
              {subtitle}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xl font-black text-[#212529] block">
              {value}
            </span>
            <span className="block text-[10px] font-black text-slate-300 uppercase">
              {unit}
            </span>
          </div>
        </div>

        <div className="mb-4">{children}</div>

        <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-50">
          {actions}
        </div>
      </div>
    </div>
  );
}
