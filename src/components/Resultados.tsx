import { Star } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const depoimentos = [
  {
    texto:
      "Já fui em outros profissionais, mas nenhum tinha tanto profissionalismo e amor pela o que faz. Ela cuida de você desde do fio de cabelo até uma palavra acolhedora.",
    autora: "VICTORIA PACHÊCO.",
  },
  {
    texto:
      "O atendimento é sempre muito especial.  A Fernanda é sempre muito comprometida com o estudo e atualização constante de procedimentos e práticas baseadas em evidência científica. São sempre muito atenciosas.  É um atendimento impecável. Faz bem para a alma!",
    autora: "VALÉCIA ARAÚJO.",
  },
  {
    texto:
      "Atendimento de excelência e resultados rápidos. Amo esse lugar. Fernanda, tu és uma profissional incrível.",
    autora: "DIALLA SUSAN.",
  },
];

const faq = [
  {
    q: "Queda de cabelo é sempre falta de vitamina?",
    a: "Não. Deficiências nutricionais são um dos fatores possíveis, mas a queda pode envolver inflamação, genética, hormônios e fatores ambientais. Por isso a investigação é individual.",
  },
  {
    q: "Estresse realmente pode fazer o cabelo cair?",
    a: "Estresses físicos e emocionais podem interferir no ciclo capilar. Em quadros como o eflúvio telógeno, a queda costuma ser percebida meses após o gatilho.",
  },
  {
    q: "Preciso realizar exames?",
    a: "Depende do que for identificado na avaliação. Quando necessário, orientamos e encaminhamos para avaliação médica complementar.",
  },
  {
    q: "A tricoscopia dói?",
    a: "Não. É um exame de imagem indolor, feito com um equipamento que amplia o couro cabeludo e os fios.",
  },
  {
    q: "Quanto tempo demora para o cabelo melhorar?",
    a: "O ciclo capilar é lento. Os primeiros sinais costumam aparecer ao longo de semanas a meses, com acompanhamento e ajustes contínuos.",
  },
];

const Resultados = () => (
  <section id="resultados" className="section-padding bg-sand/60">
    <div className="container mx-auto">
      <div className="reveal text-center">
        <span className="eyebrow">Resultados que transformam histórias</span>
        <h2 className="mt-3 font-serif text-3xl text-espresso md:text-4xl">
          Mais confiança, saúde e autoestima
        </h2>
      </div>

      <div className="reveal mt-12 grid gap-6 md:grid-cols-3">
        {depoimentos.map((d) => (
          <figure key={d.autora} className="soft-card flex h-full flex-col justify-between">
            <blockquote className="font-serif text-lg leading-relaxed text-espresso">
              “{d.texto}”
            </blockquote>
            <figcaption className="mt-5">
              <div className="flex gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <span className="mt-2 block text-xs uppercase tracking-[0.18em] text-espresso/60">
                {d.autora}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="reveal mx-auto mt-16 max-w-3xl">
        <h3 className="text-center font-serif text-2xl text-espresso md:text-3xl">
          Perguntas frequentes
        </h3>
        <Accordion type="single" collapsible className="mt-8 space-y-3">
          {faq.map((item, i) => (
            <AccordionItem
              key={item.q}
              value={`item-${i}`}
              className="rounded-2xl border border-border/70 bg-card px-5"
            >
              <AccordionTrigger className="text-left text-sm text-espresso hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-espresso/70">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  </section>
);

export default Resultados;
