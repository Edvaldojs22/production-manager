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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md z-10 overflow-hidden transform transition-all">
        <div className="p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
          <p className="text-slate-600">{message}</p>
        </div>

        <div className="bg-slate-50 p-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading} // Trava o cancelar também durante o processo
            className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 disabled:opacity-30 transition-colors"
          >
            Voltar
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading} // AQUI ESTÁ A TRAVA
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-2
              ${
                isLoading
                  ? "bg-red-300 cursor-not-allowed text-white"
                  : "bg-red-500 hover:bg-red-600 text-white shadow-md active:scale-95"
              }`}
          >
            {isLoading ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                Processando...
              </>
            ) : (
              "Confirmar Exclusão"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
