import { Microscope, ShieldCheck, HeartHandshake } from "lucide-react";
import retrato from "@/assets/sobre-livro-cabelo.png.asset.json";

const pilares = [
  { icon: Microscope, label: "Ciência" },
  { icon: ShieldCheck, label: "Responsabilidade" },
  { icon: HeartHandshake, label: "Cuidado" },
];

const Sobre = () => (
  <section id="sobre" className="section-padding bg-background">
    <div className="container mx-auto grid items-center gap-10 lg:grid-cols-2">
      <div className="reveal overflow-hidden rounded-[2rem] shadow-[var(--shadow-soft)]">
        <img
          src={retrato.url}
          alt="Fernanda Rabelo, especialista em estética e tricologia, segurando o livro Dr. Cabelo"
          loading="lazy"
          width={1163}
          height={1200}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="reveal">
        <span className="eyebrow">Quem cuida de você</span>
        <h2 className="mt-3 font-serif text-3xl text-espresso md:text-4xl">Fernanda Rabelo</h2>
        <p className="mt-1 text-xs uppercase tracking-[0.24em] text-gold">Estética e Tricologia</p>
        <p className="mt-6 text-sm leading-relaxed text-espresso/75">
          Atuação focada na saúde capilar com conhecimento, tecnologia e cuidado para cada
          paciente, respeitando os limites de atuação profissional. Cada plano nasce de uma
          escuta atenta e de uma avaliação criteriosa do couro cabeludo e dos fios.
        </p>

        <div className="mt-8 flex gap-8">
          {pilares.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-wine/20 text-wine">
                <Icon className="h-5 w-5" strokeWidth={1.4} />
              </span>
              <span className="mt-2 text-[0.7rem] uppercase tracking-[0.18em] text-espresso/70">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Sobre;
