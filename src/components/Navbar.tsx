import { useEffect, useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";

const links = [
  { label: "Sinais", href: "#sinais" },
  { label: "Causas", href: "#causas" },
  { label: "Tricoscopia", href: "#tricoscopia" },
  { label: "Avaliação", href: "#avaliacao" },
  { label: "Sobre", href: "#sobre" },
];

export const WHATSAPP_URL =
  "https://wa.me/5585997734978?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o%20capilar";

export const INSTAGRAM_URL = "https://instagram.com/drafernandarabelotricologia";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-cream/95 backdrop-blur-md shadow-[var(--shadow-card)] py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6">
        <a href="#home" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/50 font-serif text-lg text-wine">
            FR
          </span>
          <span className="leading-none">
            <span className="block font-serif text-base tracking-[0.18em] text-espresso">FERNANDA RABELO</span>
            <span className="block text-[0.6rem] uppercase tracking-[0.3em] text-gold">Estética e Tricologia</span>
          </span>
        </a>

        <nav className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-espresso/80 transition-colors hover:text-wine"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Falar pelo WhatsApp"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/50 text-gold transition-colors hover:bg-blush"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
          <button
            className="lg:hidden p-2 text-espresso"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden mt-3 border-t border-border/60 bg-cream/98 px-6 py-4 backdrop-blur-md">
          <ul className="space-y-3">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block text-sm text-espresso/80"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#avaliacao" onClick={() => setOpen(false)} className="btn-wine w-full">
                Agendar avaliação
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
