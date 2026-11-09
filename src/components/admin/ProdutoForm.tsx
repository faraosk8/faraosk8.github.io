import { useMemo, useState } from "react";
import { ImagePlus, LoaderCircle, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useProductImages } from "@/hooks/use-product-images";
import {
  CATEGORIAS,
  LOJAS,
  NECESSIDADES,
  formularioParaProduto,
  formularioProdutoVazio,
  produtoFormSchema,
  produtoParaFormulario,
  slugify,
  type ProdutoForm as ProdutoFormData,
  type ProdutoIndicado,
} from "@/lib/indicacoes";
import ImageCropDialog from "./ImageCropDialog";

const inputClass = "w-full rounded-xl border border-border/70 bg-background px-4 py-3 text-sm text-espresso outline-none focus:border-wine";
const labelClass = "block text-sm font-medium text-espresso/80";

type Props = {
  produto?: ProdutoIndicado | null;
  ordemSugerida: number;
  onCancel: () => void;
  onSaved: () => void;
};

const ProdutoForm = ({ produto, ordemSugerida, onCancel, onSaved }: Props) => {
  const [form, setForm] = useState<ProdutoFormData>(() => produto ? produtoParaFormulario(produto) : { ...formularioProdutoVazio, ordem: ordemSugerida });
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState("");
  const produtosParaImagem = useMemo(() => produto ? [produto] : [], [produto]);
  const imagens = useProductImages(produtosParaImagem);
  const imagemAtual = preview || (produto ? imagens[produto.id] : "");

  const atualizar = <K extends keyof ProdutoFormData>(campo: K, valor: ProdutoFormData[K]) => {
    setForm((atual) => ({ ...atual, [campo]: valor }));
    setErro("");
  };

  const selecionarArquivo = (file?: File) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Use uma imagem JPG, PNG ou WebP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5 MB.");
      return;
    }
    setArquivo(file);
  };

  const concluirRecorte = async (blob: Blob) => {
    setUploading(true);
    const caminho = `${crypto.randomUUID()}.jpg`;
    const { error } = await supabase.storage.from("produtos").upload(caminho, blob, { contentType: "image/jpeg" });
    setUploading(false);
    if (error) {
      toast.error("Não foi possível enviar a imagem. Tente novamente.");
      return;
    }
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(blob));
    atualizar("imagem_url", caminho);
    setArquivo(null);
    toast.success("Imagem enviada com recorte quadrado.");
  };

  const salvar = async (event: React.FormEvent) => {
    event.preventDefault();
    const validacao = produtoFormSchema.safeParse(form);
    if (!validacao.success) {
      setErro(validacao.error.issues[0]?.message ?? "Revise os campos.");
      return;
    }
    setSaving(true);
    setErro("");
    const payload = formularioParaProduto(form);
    const { error } = produto
      ? await supabase.from("produtos_indicados").update(payload).eq("id", produto.id)
      : await supabase.from("produtos_indicados").insert(payload);
    setSaving(false);
    if (error) {
      setErro(error.code === "23505" ? "Já existe um produto com este endereço (slug)." : "Não foi possível salvar o produto. Revise os dados e tente novamente.");
      return;
    }
    toast.success(produto ? "Produto atualizado." : "Produto cadastrado.");
    onSaved();
  };

  return (
    <form onSubmit={(event) => void salvar(event)} className="mx-auto mt-8 max-w-4xl rounded-3xl border border-border/70 bg-card p-5 shadow-[var(--shadow-card)] sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-serif text-3xl text-espresso">{produto ? "Editar produto" : "Novo produto"}</h2>
        <button type="button" onClick={onCancel} aria-label="Fechar formulário" className="rounded-full border border-espresso/15 p-2 text-espresso/60 hover:border-wine hover:text-wine"><X className="h-4 w-4" /></button>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <label className="md:col-span-2">
          <span className={labelClass}>Nome do produto</span>
          <input required maxLength={160} value={form.nome} onChange={(event) => setForm((atual) => ({ ...atual, nome: event.target.value, slug: produto ? atual.slug : slugify(event.target.value) }))} className={`${inputClass} mt-2`} />
        </label>
        <label className="md:col-span-2">
          <span className={labelClass}>Endereço do produto (slug)</span>
          <input required value={form.slug} onChange={(event) => atualizar("slug", slugify(event.target.value))} className={`${inputClass} mt-2`} />
          <span className="mt-1 block text-xs text-espresso/45">Usado no link de acompanhamento /ir/{form.slug || "produto"}</span>
        </label>

        <div className="md:col-span-2">
          <span className={labelClass}>Foto quadrada</span>
          <div className="mt-2 flex flex-wrap items-center gap-4 rounded-2xl border border-dashed border-wine/25 bg-sand/35 p-4">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-background text-wine/35">
              {imagemAtual ? <img src={imagemAtual} alt="Prévia do produto" className="h-full w-full object-cover" /> : <ImagePlus className="h-8 w-8" />}
            </div>
            <div>
              <label className="btn-outline-wine cursor-pointer !py-2.5">
                {uploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                {form.imagem_url ? "Substituir imagem" : "Escolher e recortar imagem"}
                <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => selecionarArquivo(event.target.files?.[0])} />
              </label>
              <p className="mt-2 text-xs text-espresso/50">JPG, PNG ou WebP, até 5 MB.</p>
            </div>
          </div>
        </div>

        <label>
          <span className={labelClass}>Loja</span>
          <select value={form.loja} onChange={(event) => atualizar("loja", event.target.value as ProdutoFormData["loja"])} className={`${inputClass} mt-2`}>
            {LOJAS.map((loja) => <option key={loja.value} value={loja.value}>{loja.label}</option>)}
          </select>
        </label>
        {form.loja === "outra" && (
          <label>
            <span className={labelClass}>Nome da loja</span>
            <input required maxLength={80} value={form.loja_outra_nome} onChange={(event) => atualizar("loja_outra_nome", event.target.value)} className={`${inputClass} mt-2`} />
          </label>
        )}
        <label className="md:col-span-2">
          <span className={labelClass}>Link de afiliado</span>
          <input required type="url" value={form.link_afiliado} onChange={(event) => atualizar("link_afiliado", event.target.value)} placeholder="https://" className={`${inputClass} mt-2`} />
        </label>
        <label>
          <span className={labelClass}>Categoria</span>
          <select value={form.categoria} onChange={(event) => atualizar("categoria", event.target.value as ProdutoFormData["categoria"])} className={`${inputClass} mt-2`}>
            {CATEGORIAS.map((categoria) => <option key={categoria.value} value={categoria.value}>{categoria.label}</option>)}
          </select>
        </label>
        <label>
          <span className={labelClass}>Ordem de exibição</span>
          <input type="number" min={0} max={999999} value={form.ordem} onChange={(event) => atualizar("ordem", Number(event.target.value))} className={`${inputClass} mt-2`} />
        </label>

        <fieldset className="md:col-span-2">
          <legend className={labelClass}>Necessidades</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {NECESSIDADES.map((necessidade) => {
              const marcado = form.necessidades.includes(necessidade.value);
              return (
                <button key={necessidade.value} type="button" aria-pressed={marcado} onClick={() => atualizar("necessidades", marcado ? form.necessidades.filter((item) => item !== necessidade.value) : [...form.necessidades, necessidade.value])} className={`rounded-full border px-3 py-2 text-xs transition-colors ${marcado ? "border-wine bg-wine text-primary-foreground" : "border-wine/20 text-espresso/65 hover:border-wine"}`}>
                  {necessidade.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <label className="md:col-span-2">
          <span className={labelClass}>Por que eu indico</span>
          <textarea rows={3} maxLength={160} value={form.por_que_indico} onChange={(event) => atualizar("por_que_indico", event.target.value)} className={`${inputClass} mt-2 resize-none`} placeholder="Uma orientação curta, sem promessa de resultado." />
          <span className="mt-1 block text-right text-xs text-espresso/45">{form.por_que_indico.length}/160</span>
        </label>

        <label>
          <span className={labelClass}>Preço atual (opcional)</span>
          <input type="text" inputMode="decimal" value={form.preco} onChange={(event) => atualizar("preco", event.target.value)} placeholder="0,00" className={`${inputClass} mt-2`} />
        </label>
        <label>
          <span className={labelClass}>Preço anterior (opcional)</span>
          <input type="text" inputMode="decimal" value={form.preco_anterior} onChange={(event) => atualizar("preco_anterior", event.target.value)} placeholder="0,00" className={`${inputClass} mt-2`} />
        </label>
        <label>
          <span className={labelClass}>Preço verificado em</span>
          <input type="date" value={form.preco_verificado_em} onChange={(event) => atualizar("preco_verificado_em", event.target.value)} className={`${inputClass} mt-2`} />
        </label>
        <div className="flex items-end pb-3 text-xs leading-relaxed text-espresso/55">Produtos da Amazon sempre mostram somente “Ver preço na Amazon”.</div>

        <label>
          <span className={labelClass}>Cupom (opcional)</span>
          <input maxLength={80} value={form.cupom} onChange={(event) => atualizar("cupom", event.target.value)} className={`${inputClass} mt-2`} />
        </label>
        <label>
          <span className={labelClass}>Validade do cupom (opcional)</span>
          <input type="date" value={form.cupom_validade} onChange={(event) => atualizar("cupom_validade", event.target.value)} className={`${inputClass} mt-2`} />
        </label>

        <div className="flex flex-col gap-3 md:col-span-2 sm:flex-row sm:flex-wrap sm:gap-6">
          <label className="flex items-center gap-2 text-sm text-espresso/75"><input type="checkbox" checked={form.favorito} onChange={(event) => atualizar("favorito", event.target.checked)} className="h-4 w-4 accent-wine" /> Selo “Indicação da Fernanda”</label>
          <label className="flex items-center gap-2 text-sm text-espresso/75"><input type="checkbox" checked={form.destaque_home} onChange={(event) => atualizar("destaque_home", event.target.checked)} className="h-4 w-4 accent-wine" /> Mostrar na home</label>
          <label className="flex items-center gap-2 text-sm text-espresso/75"><input type="checkbox" checked={form.ativo} onChange={(event) => atualizar("ativo", event.target.checked)} className="h-4 w-4 accent-wine" /> Produto ativo</label>
        </div>
      </div>

      {erro && <p role="alert" className="mt-5 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{erro}</p>}
      <div className="mt-8 flex flex-wrap gap-3">
        <button type="submit" disabled={saving || uploading} className="btn-wine disabled:opacity-60">{saving ? "Salvando…" : "Salvar produto"}</button>
        <button type="button" onClick={onCancel} className="btn-outline-wine">Cancelar</button>
      </div>

      <ImageCropDialog arquivo={arquivo} onClose={() => setArquivo(null)} onComplete={concluirRecorte} />
    </form>
  );
};

export default ProdutoForm;
