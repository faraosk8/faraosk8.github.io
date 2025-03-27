
import { useEffect, useRef } from "react";

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = heroRef.current?.querySelectorAll(".animate-on-scroll");
    elements?.forEach((el) => observer.observe(el));

    return () => {
      elements?.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section 
      id="home" 
      ref={heroRef}
      className="min-h-screen flex items-center pt-16 section-padding relative overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-clinic-cream via-clinic-beige/30 to-clinic-cream opacity-80"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] rounded-full bg-clinic-sage/10 blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-clinic-rose/10 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto relative z-10 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 md:pr-12 mb-12 md:mb-0">
          <span className="inline-block text-sm uppercase tracking-wider mb-2 text-clinic-brown animate-on-scroll opacity-0">A Arte da Confiança</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium leading-tight mb-6 animate-on-scroll opacity-0">
            Beleza que fala <br />além da aparência
          </h1>
          <p className="text-lg text-clinic-charcoal/80 mb-8 max-w-lg animate-on-scroll opacity-0">
            Experimente tratamentos estéticos transformadores que realçam sua beleza natural com nossos especialistas e tecnologia de ponta.
          </p>
          <div className="flex flex-wrap gap-4 animate-on-scroll opacity-0">
            <a href="#services" className="btn-primary">Explorar Serviços</a>
            <a href="#contact" className="btn-secondary">Agendar Consulta</a>
          </div>
        </div>
        
        <div className="md:w-1/2">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-full h-full border-2 border-clinic-brown/30 rounded-lg"></div>
            <div className="image-wrapper animate-on-scroll opacity-0">
              <img 
                src="https://images.unsplash.com/photo-1603751901434-d1e77b227e4e?q=80&w=2070&auto=format&fit=crop" 
                alt="Mulher recebendo tratamento facial"
                className="w-full h-auto object-cover rounded-lg image-hover"
              />
            </div>
            <div className="glass-panel p-4 md:p-6 rounded-lg absolute -bottom-8 -right-8 max-w-xs animate-on-scroll opacity-0">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <p className="font-medium text-sm">Aceitando Novos Clientes</p>
              </div>
              <p className="text-sm text-clinic-charcoal/80">
                Agende sua consulta gratuita hoje e comece sua jornada para a autoconfiança.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19 12L12 19L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
