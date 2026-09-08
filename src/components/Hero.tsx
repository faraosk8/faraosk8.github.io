import { CalendarCheck, MessageCircle, UserRound, Search, FileText } from "lucide-react";
import heroAsset from "@/assets/hero-fernanda.png.asset.json";
import { WHATSAPP_URL } from "./Navbar";

const highlights = [
  { icon: UserRound, label: "Avaliação individualizada" },
  { icon: Search, label: "Tricoscopia avançada" },
  { icon: FileText, label: "Protocolos personalizados" },
];

const Hero = () => {
  return (
    <section id="home" className="relative overflow-hidden pt-28 pb-10 md:pt-32">
      <div className="absolute inset-0 -z-10" style={{ backgroundImage: "var(--gradient-blush)" }} />
      <div className="container mx-auto grid items-center gap-10 px-6 lg:grid-cols-2">
        <div className="reveal">
          <h1 className="font-serif text-4xl leading-[1.1] text-espresso md:text-5xl lg:text-6xl">
            Seu cabelo está <em className="not-italic text-wine">caindo</em> mais do que o normal?
          </h1>
          <p className="mt-6 max-w-md text-base text-espresso/70">
            A queda é um sinal. Entender o que está acontecendo é o primeiro passo para cuidar
            da saúde capilar.
          </p>

          <ul className="mt-8 space-y-3">
            {highlights.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-[0.78rem] uppercase tracking-[0.16em] text-gold">
                <Icon className="h-4 w-4" />
                {label}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#avaliacao" className="btn-wine">
              <CalendarCheck className="h-4 w-4" />
              Agendar avaliação capilar
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-outline-wine">
              <MessageCircle className="h-4 w-4" />
              Falar pelo WhatsApp
            </a>
          </div>
        </div>

        <div className="reveal relative">
          <div className="overflow-hidden rounded-[2rem] shadow-[var(--shadow-soft)]">
            <img
              src={heroAsset.url}
              alt="Fernanda Rabelo realizando tricoscopia no couro cabeludo de uma cliente"
              width={919}
              height={1633}
              className="h-[380px] w-full object-cover md:h-[540px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
