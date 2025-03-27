
import { useState, useEffect, useRef } from "react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Cliente de Tratamento Facial",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=988&auto=format&fit=crop",
    quote: "O tratamento facial personalizado transformou minha pele. A atenção aos detalhes e o cuidado da equipe tornaram minha experiência excepcional.",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Cliente de Restauração Capilar",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=987&auto=format&fit=crop",
    quote: "Após seis meses de tratamentos de restauração capilar, vi resultados notáveis. A expertise da equipe e o suporte durante todo o processo foram inestimáveis.",
    rating: 5
  },
  {
    id: 3,
    name: "Emma Roberts",
    role: "Cliente de Rejuvenescimento da Pele",
    image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?q=80&w=987&auto=format&fit=crop",
    quote: "O programa de rejuvenescimento da pele me devolveu a confiança. Os resultados superaram minhas expectativas, e o processo foi confortável e profissional.",
    rating: 5
  },
  {
    id: 4,
    name: "David Wilson",
    role: "Cliente Regular",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=987&auto=format&fit=crop",
    quote: "Venho a esta clínica para vários tratamentos há mais de um ano. A qualidade e os resultados consistentes me fazem voltar sempre.",
    rating: 5
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="testimonials" ref={sectionRef} className="section-padding bg-clinic-cream relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-clinic-sage/10 blur-3xl"></div>
        <div className="absolute top-0 left-10 w-72 h-72 rounded-full bg-clinic-rose/10 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto animate-on-scroll opacity-0">
          <span className="text-sm uppercase tracking-wider mb-2 text-clinic-brown inline-block">Histórias de Clientes</span>
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Resultados Reais, Experiências Reais</h2>
          <p className="text-clinic-charcoal/80">
            Descubra o que nossos clientes têm a dizer sobre suas jornadas transformadoras com nossos tratamentos.
          </p>
        </div>
        
        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm flex flex-col md:flex-row items-center animate-on-scroll opacity-0">
                    <div className="mb-6 md:mb-0 md:mr-8">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-clinic-beige">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                          </svg>
                        ))}
                      </div>
                      <p className="italic text-clinic-charcoal/80 mb-4">"{testimonial.quote}"</p>
                      <h4 className="font-serif text-lg">{testimonial.name}</h4>
                      <p className="text-sm text-clinic-brown">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                aria-label={`Ir para depoimento ${i + 1}`}
                className={`w-3 h-3 rounded-full mx-1 transition-all duration-300 ${
                  i === activeIndex ? "bg-clinic-charcoal scale-125" : "bg-clinic-charcoal/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
