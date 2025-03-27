
import { useEffect, useRef } from "react";

const benefits = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Consulta Especializada",
    description: "Avaliação personalizada e plano de tratamento adaptado às suas necessidades específicas e objetivos estéticos."
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Tecnologia Avançada",
    description: "Equipamentos e técnicas de ponta que oferecem resultados superiores com tempo mínimo de recuperação."
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Produtos Premium",
    description: "Produtos para cuidados com a pele de grau médico e tratamentos usando apenas ingredientes e soluções da mais alta qualidade."
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 9H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15 9H15.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Satisfação do Cliente",
    description: "Nossa prioridade é seu conforto e felicidade com resultados naturais e bonitos que você vai amar."
  }
];

const Benefits = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

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

    const elements = sectionRef.current?.querySelectorAll(".animate-on-scroll");
    elements?.forEach((el) => observer.observe(el));

    return () => {
      elements?.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section id="about" ref={sectionRef} className="section-padding bg-white relative">
      <div className="container mx-auto">
        <div className="text-center mb-16 max-w-2xl mx-auto animate-on-scroll opacity-0">
          <span className="text-sm uppercase tracking-wider mb-2 text-clinic-brown inline-block">Por Que Nos Escolher</span>
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Os Benefícios da Nossa Abordagem</h2>
          <p className="text-clinic-charcoal/80">
            Nossa filosofia combina expertise médica com arte estética para proporcionar resultados excepcionais e de aparência natural.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="flex items-start p-6 bg-clinic-cream/50 rounded-lg animate-on-scroll opacity-0 hover:shadow-md transition-all duration-300"
              style={{ animationDelay: `${index * 0.1 + 0.1}s` }}
            >
              <div className="text-clinic-brown mr-4 flex-shrink-0">{benefit.icon}</div>
              <div>
                <h3 className="text-lg font-serif mb-2">{benefit.title}</h3>
                <p className="text-clinic-charcoal/80 text-sm">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 flex flex-col md:flex-row items-center gap-8 animate-on-scroll opacity-0">
          <div className="md:w-1/2">
            <div className="relative">
              <div className="image-wrapper h-80">
                <img 
                  src="https://images.unsplash.com/photo-1629909615184-74f495363b67?q=80&w=2069&auto=format&fit=crop" 
                  alt="Interior da nossa clínica"
                  className="w-full h-full object-cover image-hover"
                />
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <h3 className="text-2xl font-serif mb-4">Nosso Compromisso com a Excelência</h3>
            <p className="text-clinic-charcoal/80 mb-4">
              Em nossa clínica, acreditamos que os tratamentos estéticos devem realçar sua beleza natural e aumentar sua confiança. Nossa equipe de profissionais certificados está comprometida em oferecer atendimento personalizado com resultados excepcionais.
            </p>
            <p className="text-clinic-charcoal/80 mb-6">
              Estamos na vanguarda das inovações estéticas, investindo em educação contínua e nas mais recentes tecnologias para oferecer as soluções mais eficazes.
            </p>
            <a href="#contact" className="btn-primary">Agendar uma Consulta</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
