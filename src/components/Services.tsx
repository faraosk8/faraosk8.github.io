
import { useEffect, useRef } from "react";

const services = [
  {
    id: 1,
    title: "Facial Treatments",
    description: "Personalized facial therapies targeting specific skin concerns with premium products and advanced techniques.",
    image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070&auto=format&fit=crop",
    features: ["Deep Cleansing", "Anti-Aging", "Hydration", "Acne Treatment"]
  },
  {
    id: 2,
    title: "Hair Restoration",
    description: "Cutting-edge solutions for hair loss using the latest regenerative therapies and personalized care plans.",
    image: "https://images.unsplash.com/photo-1560750588-73207b1ef5b5?q=80&w=2070&auto=format&fit=crop",
    features: ["PRP Therapy", "Laser Treatment", "Microneedling", "Hair Transplant"]
  },
  {
    id: 3,
    title: "Skin Rejuvenation",
    description: "Non-invasive procedures that restore youthful appearance and improve skin texture and tone.",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop",
    features: ["Chemical Peels", "Microdermabrasion", "Laser Therapy", "LED Light Treatment"]
  }
];

const Services = () => {
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
    <section id="services" ref={sectionRef} className="section-padding bg-white relative">
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-clinic-cream to-transparent"></div>
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto animate-on-scroll opacity-0">
          <span className="text-sm uppercase tracking-wider mb-2 text-clinic-brown inline-block">Our Expertise</span>
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Personalized Aesthetic Treatments</h2>
          <p className="text-clinic-charcoal/80">
            We offer a comprehensive range of face and hair treatments using the latest medical technology and premium products.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={service.id} 
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 animate-on-scroll opacity-0"
              style={{ animationDelay: `${index * 0.1 + 0.1}s` }}
            >
              <div className="image-wrapper h-60">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover image-hover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-serif mb-3">{service.title}</h3>
                <p className="text-clinic-charcoal/80 mb-4 text-sm">{service.description}</p>
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature) => (
                      <span 
                        key={feature} 
                        className="text-xs bg-clinic-beige px-3 py-1 rounded-full text-clinic-charcoal"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <a href="#contact" className="text-clinic-charcoal font-medium text-sm inline-flex items-center group">
                  Learn More
                  <svg 
                    className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M5 12H19" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                    <path 
                      d="M12 5L19 12L12 19" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
