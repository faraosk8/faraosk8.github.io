import { ShowerHead, Brush, AlignJustify, ScanFace, Sparkles, Flame, Scissors, AlertTriangle } from "lucide-react";

const sinais = [
  { icon: ShowerHead, label: "Queda excessiva no banho" },
  { icon: Brush, label: "Muitos fios na escova ou no travesseiro" },
  { icon: AlignJustify, label: "Diminuição do volume" },
  { icon: ScanFace, label: "Couro cabeludo mais aparente" },
  { icon: Sparkles, label: "Coceira, descamação ou sensibilidade" },
  { icon: Flame, label: "Ardência ou desconforto" },
  { icon: Scissors, label: "Fios que não crescem como antes" },
];

const Sinais = () => (
  <section id="sinais" className="section-padding bg-sand/60">
    <div className="container mx-auto">
      <h2 className="reveal text-center font-serif text-3xl text-espresso md:text-4xl">
        Você percebe algum desses sinais?
      </h2>

      <div className="reveal mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-7">
        {sinais.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-wine/20 bg-card text-wine shadow-[var(--shadow-card)]">
              <Icon className="h-6 w-6" strokeWidth={1.4} />
            </span>
            <p className="mt-3 text-xs leading-snug text-espresso/70">{label}</p>
          </div>
        ))}
      </div>

      <div className="reveal mt-12 flex items-start gap-4 rounded-3xl border border-wine/15 bg-blush px-6 py-6 md:justify-center">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-wine" strokeWidth={1.5} />
        <p className="text-sm text-espresso/80 md:text-center">
          A queda é o que você vê.{" "}
          <span className="text-wine">O que precisamos investigar é o que está acontecendo com o folículo.</span>
        </p>
      </div>
    </div>
  </section>
);

export default Sinais;
