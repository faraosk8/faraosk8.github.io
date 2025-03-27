
import { useState, useEffect } from "react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
    }`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <a href="#" className="text-2xl font-serif font-semibold text-clinic-charcoal">AURA</a>
        
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            {[
              { en: "Home", pt: "Início" }, 
              { en: "Services", pt: "Serviços" }, 
              { en: "About", pt: "Sobre" }, 
              { en: "Testimonials", pt: "Depoimentos" }, 
              { en: "Contact", pt: "Contato" }
            ].map((item) => (
              <li key={item.pt}>
                <a 
                  href={`#${item.en.toLowerCase()}`} 
                  className="text-sm font-medium text-clinic-charcoal hover:text-clinic-brown transition-colors"
                >
                  {item.pt}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        
        <a href="#contact" className="btn-secondary text-sm hidden md:inline-block">
          Agendar Consulta
        </a>
        
        <button className="md:hidden p-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
