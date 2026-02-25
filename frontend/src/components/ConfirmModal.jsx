const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-[#212529]/60 backdrop-blur-md"
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-xl shadow-2xl border-t-8 border-[#E31E24] w-full max-w-md z-10 overflow-hidden transform transition-all">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl text-[#E31E24]">⚠️</span>
            <h3 className="text-lg font-black text-[#212529] uppercase tracking-tighter">
              {title}
            </h3>
          </div>
          <p className="text-slate-500 font-medium leading-relaxed italic">
            "{message}"
          </p>
        </div>

        <div className="bg-[#F8F9FA] p-6 flex justify-end gap-4 border-t border-slate-100">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2 text-xs font-black text-slate-400 hover:text-[#212529] uppercase tracking-widest transition-colors disabled:opacity-30"
          >
            Abort
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-8 py-3 text-xs font-black rounded uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-lg
              ${
                isLoading
                  ? "bg-slate-300 cursor-not-allowed text-white shadow-none"
                  : "bg-[#E31E24] hover:bg-[#c1191f] text-white active:scale-95 shadow-red-100"
              }`}
          >
            {isLoading ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                Syncing...
              </>
            ) : (
              "Confirm Action"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
