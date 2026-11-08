import { ArrowRight, HeartHandshake } from "lucide-react";
import { Link } from "react-router-dom";

const ProjetoSocialBanner = () => (
  <section aria-labelledby="projeto-social-chamada" className="px-6 py-10 md:px-8">
    <div className="container mx-auto">
      <div className="reveal flex flex-col items-start gap-6 rounded-3xl border border-terracotta/15 bg-project-beige/60 p-7 md:flex-row md:items-center md:justify-between md:p-9">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-project-beige text-terracotta">
            <HeartHandshake className="h-6 w-6" strokeWidth={1.4} />
          </span>
          <div>
            <p className="eyebrow text-terracotta">Projeto social</p>
            <h2 id="projeto-social-chamada" className="mt-1 font-serif text-3xl text-cocoa">
              Um Olhar de Cuidado
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-cocoa/75">
              Beleza, acolhimento e dignidade ao alcance de todos.
            </p>
          </div>
        </div>
        <Link to="/um-olhar-de-cuidado" className="btn-terracotta shrink-0">
          Conhecer o projeto <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  </section>
);

export default ProjetoSocialBanner;
