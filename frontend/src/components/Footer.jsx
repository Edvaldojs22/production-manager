const Footer = () => {
  return (
    <footer className="w-full mt-5 bg-[#E31E24] py-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className=" flex justify-center items-center gap-2">
        <div className="bg-white  text-[#E31E24] font-black italic px-2.5 py-1 rounded text-xl shadow-inner">
          AF
        </div>

        <span className="text-white font-black uppercase tracking-[0.2em] text-lg">
          Auto<span className="opacity-70">Flex</span>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
