import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Sinais from "@/components/Sinais";
import Causas from "@/components/Causas";
import Tricoscopia from "@/components/Tricoscopia";
import Cronologia from "@/components/Cronologia";
import Avaliacao from "@/components/Avaliacao";
import Resultados from "@/components/Resultados";
import Sobre from "@/components/Sobre";
import BlogPreview from "@/components/BlogPreview";
import CtaFinal from "@/components/CtaFinal";
import Footer from "@/components/Footer";
import { useReveal } from "@/hooks/use-reveal";

const Index = () => {
  useReveal();

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-background">
      <Navbar />
      <Hero />
      <Sinais />
      <Causas />
      <Tricoscopia />
      <Cronologia />
      <Avaliacao />
      <Resultados />
      <Sobre />
      <BlogPreview />
      <CtaFinal />
      <Footer />
    </main>
  );
};

export default Index;
