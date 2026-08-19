import { Flame, Dna, Atom, Leaf, ArrowRight } from "lucide-react";

const causas = [
  {
    icon: Flame,
    title: "Inflamação",
    text: "Processos inflamatórios podem atingir o folículo diretamente ou ocorrer no couro cabeludo e afetá-lo secundariamente.",
  },
  {
    icon: Dna,
    title: "Genética",
    text: "A predisposição genética pode influenciar como seu folículo responde a determinados estímulos ao longo da vida.",
  },
  {
    icon: Atom,
    title: "Hormônios",
    text: "Alterações hormonais e a sensibilidade individual do folículo podem interferir no ciclo capilar.",
  },
  {
    icon: Leaf,
    title: "Ambiente",
    text: "Estresse, alimentação, doenças, febre, cirurgias, medicamentos e outras mudanças no organismo podem alterar o ciclo.",
  },
];

const Causas = () => (
  <section id="causas" className="section-padding bg-espresso text-cream">
    <div className="container mx-auto">
      <div className="reveal text-center">
        <h2 className="font-serif text-3xl md:text-4xl">Por que o cabelo cai?</h2>
        <p className="mt-3 text-sm text-cream/70">
          Distúrbios capilares podem envolver diferentes fatores
        </p>
      </div>

      <div className="reveal mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {causas.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="rounded-3xl border border-cream/15 bg-cream/[0.06] p-7 transition-colors duration-300 hover:border-gold/50"
          >
            <Icon className="h-7 w-7 text-gold" strokeWidth={1.3} />
            <h3 className="mt-5 text-sm uppercase tracking-[0.2em] text-cream">{title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-cream/70">{text}</p>
          </div>
        ))}
      </div>

      <div className="reveal mt-12 space-y-6 text-center">
        <p className="mx-auto max-w-md font-serif text-xl text-cream/90">
          Nem toda queda é igual. Por isso, o tratamento também não pode ser igual.
        </p>
        <a href="#tricoscopia" className="btn-wine">
          Entenda mais sobre as causas da queda
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  </section>
);

export default Causas;
