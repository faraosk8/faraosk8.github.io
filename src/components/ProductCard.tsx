import { useState } from "react";
import { Check, Copy, ExternalLink, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import {
  cupomDisponivel,
  exibirPreco,
  formatarDataCurta,
  formatarPreco,
  nomeLoja,
  rotuloNecessidade,
  textoBotaoLoja,
  type PaginaClique,
  type ProdutoIndicado,
} from "@/lib/indicacoes";

type Props = {
  produto: ProdutoIndicado;
  pagina: PaginaClique;
  imagem?: string;
};

const ProductCard = ({ produto, pagina, imagem }: Props) => {
  const [copiado, setCopiado] = useState(false);
  const destino = `/ir/${encodeURIComponent(produto.slug)}?pagina=${pagina}`;
  const mostrarPreco = exibirPreco(produto);
  const mostrarCupom = cupomDisponivel(produto);

  const copiarCupom = async () => {
    if (!produto.cupom) return;
    try {
      await navigator.clipboard.writeText(produto.cupom);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2200);
    } catch {
      toast.error("Não foi possível copiar. Selecione o código manualmente.");
    }
  };

  const dadosEstruturados = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: produto.nome,
    description: produto.por_que_indico || undefined,
    image: imagem || undefined,
    category: produto.categoria,
    url: `${window.location.origin}${destino}`,
    ...(mostrarPreco
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "BRL",
            price: Number(produto.preco).toFixed(2),
            url: `${window.location.origin}${destino}`,
          },
        }
      : {}),
  };

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-card)]">
      <script type="application/ld+json">{JSON.stringify(dadosEstruturados)}</script>
      <div className="relative aspect-square overflow-hidden bg-sand/60">
        {imagem ? (
          <img src={imagem} alt={produto.nome} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        ) : (
          <div className="flex h-full items-center justify-center text-wine/35" aria-label="Imagem do produto em breve">
            <ImageIcon className="h-12 w-12" strokeWidth={1.2} />
          </div>
        )}
        <span className="absolute left-2 top-2 max-w-[70%] rounded-full border border-wine/10 bg-cream/95 px-2.5 py-1 text-[0.6rem] font-medium uppercase tracking-[0.1em] text-wine shadow-sm sm:left-3 sm:top-3 sm:text-[0.65rem]">
          {nomeLoja(produto)}
        </span>
        {produto.favorito && (
          <span className="absolute bottom-2 left-2 right-2 rounded-full bg-wine px-2 py-1 text-center text-[0.58rem] font-medium uppercase tracking-[0.08em] text-primary-foreground sm:bottom-3 sm:left-3 sm:right-auto sm:text-[0.62rem]">
            Indicação da Fernanda
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <h3 className="line-clamp-2 min-h-[2.7em] font-serif text-lg leading-[1.15] text-espresso sm:text-xl" title={produto.nome}>
          {produto.nome}
        </h3>
        {produto.necessidades.length > 0 && (
          <div className="mt-2 flex min-h-[1.6rem] flex-wrap gap-1">
            {produto.necessidades.slice(0, 3).map((item) => (
              <span key={item} className="rounded-full bg-blush px-2 py-1 text-[0.58rem] leading-none text-wine sm:text-[0.65rem]">
                {rotuloNecessidade(item)}
              </span>
            ))}
          </div>
        )}
        {produto.por_que_indico && (
          <div className="mt-3 border-l border-gold/50 pl-2.5 sm:mt-4 sm:pl-3">
            <p className="text-[0.6rem] font-medium uppercase tracking-[0.12em] text-gold sm:text-[0.65rem]">Por que eu indico</p>
            <p className="mt-1 text-xs leading-relaxed text-espresso/70 sm:text-sm">{produto.por_que_indico}</p>
          </div>
        )}

        <div className="mt-auto pt-4">
          {mostrarPreco ? (
            <div>
              {produto.preco_anterior !== null && (
                <p className="text-[0.68rem] text-espresso/45 line-through sm:text-xs">{formatarPreco(produto.preco_anterior)}</p>
              )}
              <p className="font-serif text-xl font-medium text-espresso sm:text-2xl">{formatarPreco(produto.preco!)}</p>
              {produto.preco_verificado_em && (
                <p className="mt-1 text-[0.58rem] leading-snug text-espresso/50 sm:text-[0.65rem]">
                  Preço verificado em {formatarDataCurta(produto.preco_verificado_em)}. Pode ter mudado na loja.
                </p>
              )}
            </div>
          ) : produto.loja === "amazon" ? (
            <p className="text-sm font-medium text-wine">Ver preço na Amazon</p>
          ) : null}

          {mostrarCupom && (
            <div className="mt-3 rounded-xl border border-dashed border-gold/60 bg-sand/60 p-2.5">
              <p className="text-[0.58rem] uppercase tracking-[0.12em] text-espresso/55">Cupom</p>
              <div className="mt-1 flex items-center justify-between gap-2">
                <code className="truncate text-xs font-semibold tracking-wide text-espresso">{produto.cupom}</code>
                <button type="button" onClick={copiarCupom} className="inline-flex shrink-0 items-center gap-1 text-[0.65rem] font-medium text-wine hover:text-wine-deep" aria-label={`Copiar cupom ${produto.cupom}`}>
                  {copiado ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiado ? "Copiado" : "Copiar cupom"}
                </button>
              </div>
            </div>
          )}

          <a href={destino} target="_blank" rel="sponsored nofollow noopener noreferrer" className="btn-wine mt-4 w-full !px-3 !py-3 text-xs sm:text-sm">
            {textoBotaoLoja(produto)}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
