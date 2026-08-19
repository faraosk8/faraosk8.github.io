import { Zap, RefreshCcw, GitBranch, Clock, Droplet, CalendarClock } from "lucide-react";

const etapas = [
  {
    icon: Zap,
    title: "Gatilho",
    text: "Estresse, doença, febre, cirurgia, alterações nutricionais, medicamentos.",
  },
  {
    icon: RefreshCcw,
    title: "Alteração do ciclo",
    text: "O organismo modifica os sinais que regulam o funcionamento do folículo.",
  },
  {
    icon: GitBranch,
    title: "Transição folicular",
    text: "Mais fios deixam a fase de crescimento e entram precocemente em telógena.",
  },
  {
    icon: Clock,
    title: "Tempo",
    text: "Existe um intervalo entre o acontecimento e a queda perceptível.",
  },
  {
    icon: Droplet,
    title: "Queda",
    text: "O paciente começa a perceber mais fios no banho, na escova e no travesseiro.",
  },
];

const Cronologia = () => (
  <section className="section-padding bg-sand/60">
    <div className="container mx-auto">
      <div className="reveal mx-auto max-w-2xl text-center">
        <span className="eyebrow">Cronologia da queda</span>
        <h2 className="mt-3 font-serif text-3xl text-espresso md:text-4xl">
          A queda que você vê hoje pode ter começado muito antes
        </h2>
      </div>

      <ol className="reveal mt-12 grid gap-5 md:grid-cols-5">
        {etapas.map(({ icon: Icon, title, text }, i) => (
          <li key={title} className="soft-card">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blush text-wine">
                <Icon className="h-4 w-4" strokeWidth={1.5} />
              </span>
              <span className="text-xs uppercase tracking-[0.2em] text-gold">{i + 1}.</span>
            </div>
            <h3 className="mt-4 font-serif text-lg text-espresso">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-espresso/70">{text}</p>
          </li>
        ))}
      </ol>

      <div className="reveal mt-10 flex items-start gap-4 rounded-3xl border border-wine/15 bg-card px-6 py-6">
        <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-wine" strokeWidth={1.5} />
        <p className="text-sm text-espresso/80">
          Por isso, investigamos não apenas o que está acontecendo agora, mas o que aconteceu
          nos últimos meses.
        </p>
      </div>
    </div>
  </section>
);

export default Cronologia;
