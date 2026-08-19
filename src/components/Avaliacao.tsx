import { Check, CalendarCheck, MessageCircle, ClipboardList, Microscope, LineChart, Sparkles } from "lucide-react";
import { WHATSAPP_URL } from "./Navbar";
import cabelo from "@/assets/cabelo-saudavel.jpg";

const etapas = [
  "História capilar completa",
  "Análise do couro cabeludo e dos fios",
  "Tricoscopia (ampliação)",
  "Planejamento individualizado",
  "Acompanhamento da evolução",
  "Encaminhamento quando necessário",
];

const fluxo = [
  { icon: ClipboardList, title: "1. Avaliação", text: "Entendemos seu histórico e rotina" },
  { icon: Microscope, title: "2. Plano", text: "Definimos os cuidados e protocolos" },
  { icon: LineChart, title: "3. Acompanhamento", text: "Reavaliamos a evolução" },
  { icon: Sparkles, title: "4. Ajustes", text: "O plano é ajustado conforme necessário" },
];

const Avaliacao = () => (
  <section id="avaliacao" className="section-padding bg-background">
    <div className="container mx-auto">
      <div className="reveal grid items-center gap-10 lg:grid-cols-2">
        <div>
          <span className="eyebrow">Avaliação capilar</span>
          <h2 className="mt-3 font-serif text-3xl text-espresso md:text-4xl">
            O primeiro passo para entender e cuidar do seu cabelo
          </h2>
          <ul className="mt-7 space-y-3">
            {etapas.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-espresso/75">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blush text-wine">
                  <Check className="h-3 w-3" strokeWidth={2.5} />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-wine">
              <CalendarCheck className="h-4 w-4" />
              Quero agendar minha avaliação
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-outline-wine">
              <MessageCircle className="h-4 w-4" />
              Falar pelo WhatsApp
            </a>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] shadow-[var(--shadow-soft)]">
          <img
            src={cabelo}
            alt="Mulher com cabelos saudáveis e brilhantes"
            loading="lazy"
            width={1200}
            height={912}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="reveal mt-16">
        <h3 className="text-center font-serif text-2xl text-espresso md:text-3xl">
          Como funciona o acompanhamento
        </h3>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {fluxo.map(({ icon: Icon, title, text }) => (
            <div key={title} className="soft-card text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blush text-wine">
                <Icon className="h-5 w-5" strokeWidth={1.4} />
              </span>
              <h4 className="mt-4 text-xs uppercase tracking-[0.18em] text-espresso">{title}</h4>
              <p className="mt-2 text-sm text-espresso/70">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Avaliacao;
