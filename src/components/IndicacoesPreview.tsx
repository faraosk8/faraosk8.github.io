import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { ProdutoIndicado } from "@/lib/indicacoes";
import { useProductImages } from "@/hooks/use-product-images";
import ProductCard from "./ProductCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const IndicacoesPreview = () => {
  const [produtos, setProdutos] = useState<ProdutoIndicado[]>([]);
  const imagens = useProductImages(produtos);

  useEffect(() => {
    supabase
      .from("produtos_indicados")
      .select("*")
      .eq("ativo", true)
      .eq("destaque_home", true)
      .order("ordem", { ascending: true })
      .limit(6)
      .then(({ data }) => setProdutos(data ?? []));
  }, []);

  if (!produtos.length) return null;

  return (
    <section id="indicacoes" className="section-padding bg-blush/35">
      <div className="container mx-auto">
        <div className="reveal text-center">
          <span className="eyebrow">Cuidados escolhidos</span>
          <h2 className="mt-3 font-serif text-3xl text-espresso md:text-4xl">Indicações da Fernanda</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-espresso/70">Produtos que uso, conheço e indico no dia a dia da clínica.</p>
        </div>

        <div className="reveal mx-auto mt-10 max-w-[92rem] px-8 sm:px-10">
          <Carousel opts={{ align: "start", loop: produtos.length > 4 }}>
            <CarouselContent>
              {produtos.map((produto) => (
                <CarouselItem key={produto.id} className="basis-[82%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <ProductCard produto={produto} pagina="home" imagem={imagens[produto.id]} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-8 border-wine/20 bg-card text-wine hover:bg-blush sm:-left-10" />
            <CarouselNext className="-right-8 border-wine/20 bg-card text-wine hover:bg-blush sm:-right-10" />
          </Carousel>
        </div>

        <div className="reveal mt-10 text-center">
          <Link to="/indicacoes" className="btn-outline-wine">
            Ver todas as indicações <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default IndicacoesPreview;
