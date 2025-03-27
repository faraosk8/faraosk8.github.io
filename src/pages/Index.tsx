
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Services from "../components/Services";
import Testimonials from "../components/Testimonials";
import Benefits from "../components/Benefits";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";

const Index = () => {
  useEffect(() => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href')?.substring(1);
        if (!targetId) return;
        
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;
        
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Offset for navbar
          behavior: 'smooth'
        });
      });
    });
  }, []);

  return (
    <main className="min-h-screen w-full bg-clinic-cream overflow-x-hidden">
      <Navbar />
      <Hero />
      <Services />
      <Benefits />
      <Testimonials />
      <ContactForm />
      <Footer />
    </main>
  );
};

export default Index;
