const PageHeader = ({ title, highlight, subtitle, children }) => {
  return (
    <header className="flex flex-col md:flex-row justify-between items-center bg-white p-6 md:p-8 rounded-xl shadow-sm border-t-4 border-[#E31E24] gap-4">
      <div className="space-y-1 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-black text-[#212529] uppercase tracking-tight">
          {title} <span className="text-[#E31E24]">{highlight}</span>
        </h1>
        {subtitle && (
          <p className="text-slate-500 text-sm md:text-base font-medium max-w-md">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center">{children}</div>
    </header>
  );
};

export default PageHeader;
