import { CalendarCheck, MessageCircle, HeartHandshake, Cpu, ShieldCheck } from "lucide-react";
import { WHATSAPP_URL } from "./Navbar";

const selos = [
  { icon: HeartHandshake, label: "Atendimento humanizado" },
  { icon: Cpu, label: "Tecnologia e conhecimento" },
  { icon: ShieldCheck, label: "Ética, segurança e cuidado real" },
];

const CtaFinal = () => (
  <section id="contato" className="section-padding bg-wine text-primary-foreground">
    <div className="container mx-auto grid items-center gap-10 lg:grid-cols-2">
      <div className="reveal">
        <h2 className="font-serif text-3xl leading-tight md:text-4xl">
          Sua queda capilar merece ser investigada com atenção.
        </h2>
        <p className="mt-4 max-w-md text-sm text-primary-foreground/80">
          Não existe protocolo padrão para todos. Existe um cuidado pensado para você.
        </p>
      </div>

      <div className="reveal space-y-4">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-cream px-7 py-4 text-sm font-medium text-wine transition-colors hover:bg-blush"
        >
          <CalendarCheck className="h-4 w-4" />
          Agendar avaliação
        </a>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-full border border-cream/60 px-7 py-4 text-sm font-medium text-cream transition-colors hover:bg-cream/10"
        >
          <MessageCircle className="h-4 w-4" />
          Falar pelo WhatsApp
        </a>

        <div className="grid grid-cols-3 gap-4 pt-4">
          {selos.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center text-center">
              <Icon className="h-5 w-5 text-primary-foreground/80" strokeWidth={1.4} />
              <span className="mt-2 text-[0.68rem] leading-snug text-primary-foreground/75">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default CtaFinal;
