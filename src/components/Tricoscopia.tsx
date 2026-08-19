import { Check, ArrowRight, Brain, Thermometer, Stethoscope, Apple, Pill } from "lucide-react";
import tricoscopia from "@/assets/tricoscopia.jpg";

const itens = [
  "Avaliação do couro cabeludo e dos fios",
  "Identificação de alterações invisíveis a olho nu",
  "Acompanhamento da evolução do tratamento",
  "Mais precisão no planejamento do cuidado",
];

const gatilhos = [
  { icon: Brain, label: "Estresse físico ou emocional" },
  { icon: Thermometer, label: "Doenças e febre" },
  { icon: Stethoscope, label: "Cirurgias" },
  { icon: Apple, label: "Alterações nutricionais" },
  { icon: Pill, label: "Medicamentos e outros fatores" },
];

const Tricoscopia = () => (
  <section id="tricoscopia" className="section-padding bg-background">
    <div className="container mx-auto">
      <div className="reveal grid items-center gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-[2rem] shadow-[var(--shadow-soft)]">
          <img
            src={tricoscopia}
            alt="Tablet exibindo imagem ampliada do couro cabeludo durante tricoscopia"
            loading="lazy"
            width={1200}
            height={912}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <span className="eyebrow">O poder da tricoscopia</span>
          <h2 className="mt-3 font-serif text-3xl text-espresso md:text-4xl">
            O que os seus olhos não conseguem enxergar, a tricoscopia revela
          </h2>
          <ul className="mt-7 space-y-3">
            {itens.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-espresso/75">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blush text-wine">
                  <Check className="h-3 w-3" strokeWidth={2.5} />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <a href="#avaliacao" className="btn-outline-wine mt-8">
            Saiba mais
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="reveal mt-16 rounded-[2rem] border border-wine/15 bg-blush/70 p-8 md:p-10">
        <span className="eyebrow">Eflúvio telógeno</span>
        <h3 className="mt-2 font-serif text-2xl text-espresso md:text-3xl">
          Uma das causas mais comuns de queda <em className="not-italic text-wine">difusa</em>
        </h3>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-espresso/75">
          Ocorre quando mais folículos entram na fase de repouso (telógena) antes do tempo.
          A queda só aparece depois de semanas ou meses do fator desencadeante.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-5">
          {gatilhos.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-card text-wine shadow-[var(--shadow-card)]">
                <Icon className="h-5 w-5" strokeWidth={1.4} />
              </span>
              <p className="mt-2 text-xs leading-snug text-espresso/70">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Tricoscopia;
