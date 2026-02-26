const ActionCard = ({
  badge,
  title,
  subtitle,
  value,
  unit,
  children,
  actions,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border cursor-pointer border-slate-100 hover:border-red-200 transition-all group overflow-hidden relative">
      <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex justify-between items-center">
        <span className="text-[10px] bg-[#212529] text-white px-2 py-0.5 rounded font-black uppercase tracking-wider">
          {badge}
        </span>
        {subtitle && (
          <span className="font-mono text-[10px] text-slate-400 font-bold uppercase">
            {subtitle}
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-[#212529] font-black uppercase tracking-tight text-base mb-2 group-hover:text-[#E31E24] transition-colors">
              {title}
            </h3>

            <div className="flex flex-wrap gap-1.5">{children}</div>
          </div>

          <div className="text-right ml-4">
            <p className="text-[9px] font-bold text-slate-400 uppercase leading-none mb-1">
              Value / Qty
            </p>
            <span className="text-xl font-black text-[#212529] block">
              {value}
            </span>
            {unit && (
              <span className="block text-[10px] font-black text-slate-300 uppercase leading-none">
                {unit}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-50">
          {actions}
        </div>
      </div>
    </div>
  );
};

export default ActionCard;
