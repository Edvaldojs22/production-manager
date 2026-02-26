const Footer = () => {
  return (
    // Removida a opacidade e adicionado o fundo vermelho sólido
    <footer className="w-full mt-5 bg-[#E31E24] py-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Lado Esquerdo: A Logo Completa (como no Header, mas adaptada) */}
        <div className="flex items-center gap-3 select-none">
          {/* Ícone AF (Invertido: Fundo Branco, Texto Vermelho) */}
          <div className="bg-white text-[#E31E24] font-black italic px-2.5 py-1 rounded text-xl shadow-inner">
            AF
          </div>

          {/* Texto AutoFlex (Todo Branco para contraste) */}
          <span className="text-white font-black uppercase tracking-[0.2em] text-lg">
            Auto<span className="opacity-70">Flex</span>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
