import { Instagram, MessageCircle, Mail, MapPin } from "lucide-react";
import { WHATSAPP_URL } from "./Navbar";

const Footer = () => (
  <footer className="bg-espresso px-6 py-14 text-cream">
    <div className="container mx-auto flex flex-col items-center text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/50 font-serif text-xl text-gold">
        FR
      </span>
      <p className="mt-4 font-serif text-lg tracking-[0.2em]">FERNANDA RABELO</p>
      <p className="text-[0.65rem] uppercase tracking-[0.3em] text-gold">Estética e Tricologia</p>

      <p className="mt-8 font-serif text-2xl text-cream/90">
        Vamos cuidar da saúde do seu cabelo juntos?
      </p>

      <div className="mt-6 flex items-center gap-4">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/25 transition-colors hover:border-gold hover:text-gold"
        >
          <MessageCircle className="h-4 w-4" />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/25 transition-colors hover:border-gold hover:text-gold"
        >
          <Instagram className="h-4 w-4" />
        </a>
        <a
          href="mailto:contato@fernandarabelo.com"
          aria-label="E-mail"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/25 transition-colors hover:border-gold hover:text-gold"
        >
          <Mail className="h-4 w-4" />
        </a>
      </div>

      <p className="mt-6 flex items-center gap-2 text-sm text-cream/70">
        <MapPin className="h-4 w-4" /> Fortaleza — CE
      </p>

      <p className="mt-8 max-w-xl text-[0.7rem] leading-relaxed text-cream/50">
        Conteúdo informativo e educativo. Não substitui avaliação individualizada nem
        atendimento médico quando indicado.
      </p>
      <p className="mt-4 text-[0.7rem] text-cream/40">
        © {new Date().getFullYear()} Fernanda Rabelo — Estética e Tricologia.
      </p>
    </div>
  </footer>
);

export default Footer;
