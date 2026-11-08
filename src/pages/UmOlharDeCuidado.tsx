import { useState } from "react";
import { FunctionsHttpError } from "@supabase/supabase-js";
import {
  ArrowDown,
  Baby,
  Check,
  FileText,
  Flower2,
  Heart,
  HeartHandshake,
  ImagePlus,
  Info,
  Send,
  UserRound,
  Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useReveal } from "@/hooks/use-reveal";
import {
  formatTelefone,
  getSessionId,
  inscricaoInicial,
  inscricaoSchema,
  type InscricaoFormState,
} from "@/lib/olhar-cuidado";

const PhotoPlaceholder = ({ label, className = "" }: { label: string; className?: string }) => (
  <div
    className={`flex min-h-72 items-center justify-center rounded-[2rem] border border-dashed border-terracotta/35 bg-project-beige/45 p-8 text-center ${className}`}
    role="img"
    aria-label={label}
  >
    <div>
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-project-beige text-terracotta">
        <ImagePlus className="h-7 w-7" strokeWidth={1.2} />
      </span>
      <p className="mt-4 font-serif text-xl text-terracotta">Espaço reservado para foto</p>
      <p className="mt-1 text-xs text-cocoa/55">{label}</p>
    </div>
  </div>
);

const OrganicLine = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 300 90"
    className="pointer-events-none absolute -right-8 top-0 h-24 w-72 text-terracotta/20"
    fill="none"
  >
    <path d="M4 80C74 82 56 8 142 14C225 20 205 75 296 4" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const valores = [
  { icon: Flower2, label: "Autoestima" },
  { icon: Heart, label: "Acolhimento" },
  { icon: Users, label: "Dignidade" },
];

const publicos = [
  { icon: UserRound, text: "Mulheres em situação de vulnerabilidade social." },
  { icon: HeartHandshake, text: "Mães que enfrentam dificuldades financeiras." },
  { icon: Baby, text: "Adolescentes que não têm acesso a cuidados estéticos." },
];

const passos = [
  "As inscrições são feitas por um formulário.",
  "Preencha seus dados e aguarde o contato da nossa equipe.",
  "As vagas são limitadas e os atendimentos são organizados conforme os critérios do projeto.",
];

type FormErrors = Partial<Record<keyof InscricaoFormState, string>>;

const UmOlharDeCuidado = () => {
  useReveal();
  const [form, setForm] = useState<InscricaoFormState>({ ...inscricaoInicial });
  const [errors, setErrors] = useState<FormErrors>({});
  const [website, setWebsite] = useState("");
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const menorDeIdade = form.idade !== "" && Number(form.idade) < 18;

  const update = <K extends keyof InscricaoFormState>(field: K, value: InscricaoFormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitted(false);
    setSubmitError("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(false);
    setSubmitError("");

    const result = inscricaoSchema.safeParse(form);
    if (!result.success) {
      const nextErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof InscricaoFormState;
        if (!nextErrors[field]) nextErrors[field] = issue.message;
      });
      setErrors(nextErrors);
      document.getElementById("inscricao")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    setErrors({});
    setSending(true);
    const { error } = await supabase.functions.invoke("inscricao-olhar-cuidado", {
      body: { ...result.data, email: result.data.email, sessao_id: getSessionId(), website },
    });
    setSending(false);

    if (error) {
      let message = "Não foi possível enviar sua inscrição. Tente novamente em instantes.";
      if (error instanceof FunctionsHttpError) {
        const body = await error.context.json().catch(() => null) as { error?: string } | null;
        if (body?.error) message = body.error;
      }
      setSubmitError(message);
      return;
    }

    setForm({ ...inscricaoInicial });
    setWebsite("");
    setSubmitted(true);
  };

  const errorText = (field: keyof InscricaoFormState) =>
    errors[field] ? <p className="mt-1.5 text-xs text-destructive" role="alert">{errors[field]}</p> : null;

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-project-cream text-cocoa">
      <Navbar />

      <section className="section-padding relative pt-32 md:pt-40">
        <OrganicLine />
        <div className="container mx-auto grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <PhotoPlaceholder
            label="Foto de mulher adulta para a abertura do projeto"
            className="reveal order-first min-h-[26rem] lg:order-last"
          />
          <div className="reveal">
            <p className="eyebrow text-terracotta">Projeto</p>
            <h1 className="mt-3 font-serif text-5xl leading-[0.95] text-terracotta md:text-7xl">
              Um Olhar<br />de Cuidado
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-cocoa/80">
              Beleza, acolhimento e dignidade ao alcance de todos.
            </p>
            <p className="mt-6 font-handwritten text-4xl leading-tight text-terracotta">
              “Porque cuidar também é uma forma de acolher.”
            </p>
            <a href="#inscricao" className="btn-terracotta mt-8">
              Quero me inscrever <ArrowDown className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="section-padding pt-4">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="reveal">
            <p className="eyebrow text-terracotta">Sobre a iniciativa</p>
            <h2 className="mt-3 font-serif text-4xl text-terracotta md:text-5xl">O que é o projeto?</h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-cocoa/80 md:text-lg">
              É uma iniciativa social que oferece atendimento gratuito de estética facial para quem não tem condições financeiras de pagar por esse cuidado.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {valores.map(({ icon: Icon, label }) => (
              <div key={label} className="reveal flex flex-col items-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-project-beige text-terracotta">
                  <Icon className="h-9 w-9" strokeWidth={1.2} />
                </span>
                <span className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-cocoa/75">{label}</span>
              </div>
            ))}
          </div>
          <p className="reveal mt-10 font-handwritten text-4xl text-terracotta">
            “Porque cuidar também transforma vidas.”
          </p>
        </div>
      </section>

      <section className="section-padding bg-project-beige/25">
        <div className="container mx-auto grid items-center gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <div className="reveal">
              <p className="eyebrow text-terracotta">Quem pode participar</p>
              <h2 className="mt-3 font-serif text-4xl text-terracotta md:text-5xl">Para quem é?</h2>
            </div>
            <div className="mt-8 grid gap-4">
              {publicos.map(({ icon: Icon, text }) => (
                <article key={text} className="project-card reveal flex items-center gap-5">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-project-beige text-terracotta">
                    <Icon className="h-7 w-7" strokeWidth={1.2} />
                  </span>
                  <p className="text-base leading-relaxed text-cocoa/85">{text}</p>
                </article>
              ))}
            </div>
            <div className="reveal mt-5 flex items-start gap-3 rounded-2xl border border-terracotta/20 bg-card/50 p-5">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-terracotta" strokeWidth={1.4} />
              <p className="text-sm leading-relaxed text-cocoa/80">
                Para adolescentes, é necessária a autorização do responsável.
              </p>
            </div>
          </div>
          <PhotoPlaceholder
            label="Uma foto de mulher adulta para esta seção"
            className="reveal hidden min-h-[34rem] lg:flex"
          />
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto max-w-5xl">
          <div className="reveal text-center">
            <p className="eyebrow text-terracotta">Passo a passo</p>
            <h2 className="mt-3 font-serif text-4xl text-terracotta md:text-5xl">Como participar?</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {passos.map((passo, index) => (
              <article key={passo} className="reveal relative rounded-3xl border border-terracotta/15 bg-card/45 p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-terracotta font-serif text-xl text-primary-foreground">
                  {index + 1}
                </span>
                <p className="mt-5 text-sm leading-relaxed text-cocoa/80">{passo}</p>
              </article>
            ))}
          </div>
          <p className="reveal mt-10 text-center font-handwritten text-4xl text-terracotta">“Cuidar também é incluir.”</p>
        </div>
      </section>

      <section id="inscricao" className="section-padding scroll-mt-20 bg-project-beige/30">
        <div className="container mx-auto max-w-3xl">
          <div className="reveal text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-project-beige text-terracotta">
              <FileText className="h-6 w-6" strokeWidth={1.3} />
            </span>
            <p className="eyebrow mt-5 text-terracotta">Formulário de inscrição</p>
            <h2 className="mt-3 font-serif text-4xl text-terracotta md:text-5xl">Quero participar</h2>
            <p className="mt-4 text-sm leading-relaxed text-cocoa/70">
              Preencha os dados abaixo. Nossa equipe entrará em contato pelo telefone informado.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="reveal mt-10 space-y-5 rounded-3xl border border-terracotta/15 bg-card/60 p-6 md:p-9" noValidate>
            <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor="website">Não preencha este campo</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
            </div>

            <div>
              <label htmlFor="nome" className="mb-2 block text-sm font-medium">Nome completo *</label>
              <input id="nome" className="project-input" autoComplete="name" maxLength={120} value={form.nome} onChange={(event) => update("nome", event.target.value)} />
              {errorText("nome")}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="idade" className="mb-2 block text-sm font-medium">Idade *</label>
                <input id="idade" className="project-input" type="number" inputMode="numeric" min={1} max={120} step={1} value={form.idade} onChange={(event) => update("idade", event.target.value)} />
                {errorText("idade")}
              </div>
              <div>
                <label htmlFor="telefone" className="mb-2 block text-sm font-medium">Telefone / WhatsApp *</label>
                <input id="telefone" className="project-input" type="tel" inputMode="tel" autoComplete="tel" placeholder="(85) 9 9999-9999" value={form.telefone} onChange={(event) => update("telefone", formatTelefone(event.target.value))} />
                {errorText("telefone")}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">E-mail <span className="font-normal text-cocoa/50">(opcional)</span></label>
              <input id="email" className="project-input" type="email" autoComplete="email" maxLength={255} value={form.email} onChange={(event) => update("email", event.target.value)} />
              {errorText("email")}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="bairro" className="mb-2 block text-sm font-medium">Bairro *</label>
                <input id="bairro" className="project-input" autoComplete="address-level3" maxLength={100} value={form.bairro} onChange={(event) => update("bairro", event.target.value)} />
                {errorText("bairro")}
              </div>
              <div>
                <label htmlFor="cidade" className="mb-2 block text-sm font-medium">Cidade *</label>
                <input id="cidade" className="project-input" autoComplete="address-level2" maxLength={100} value={form.cidade} onChange={(event) => update("cidade", event.target.value)} />
                {errorText("cidade")}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label htmlFor="motivo" className="block text-sm font-medium">Por que gostaria de participar? *</label>
                <span className="text-xs text-cocoa/50">{form.motivo.length}/600</span>
              </div>
              <textarea id="motivo" className="project-input min-h-32 resize-y" rows={5} maxLength={600} value={form.motivo} onChange={(event) => update("motivo", event.target.value)} />
              {errorText("motivo")}
            </div>

            {menorDeIdade && (
              <fieldset className="space-y-5 rounded-2xl border border-terracotta/20 bg-project-beige/40 p-5">
                <legend className="px-2 font-serif text-xl text-terracotta">Autorização do responsável</legend>
                <div>
                  <label htmlFor="nome_responsavel" className="mb-2 block text-sm font-medium">Nome do responsável *</label>
                  <input id="nome_responsavel" className="project-input" autoComplete="off" maxLength={120} value={form.nome_responsavel} onChange={(event) => update("nome_responsavel", event.target.value)} />
                  {errorText("nome_responsavel")}
                </div>
                <div>
                  <label htmlFor="telefone_responsavel" className="mb-2 block text-sm font-medium">Telefone do responsável *</label>
                  <input id="telefone_responsavel" className="project-input" type="tel" inputMode="tel" placeholder="(85) 9 9999-9999" value={form.telefone_responsavel} onChange={(event) => update("telefone_responsavel", formatTelefone(event.target.value))} />
                  {errorText("telefone_responsavel")}
                </div>
                <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
                  <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-terracotta" checked={form.autorizacao_responsavel} onChange={(event) => update("autorizacao_responsavel", event.target.checked)} />
                  <span>Sou o responsável legal e autorizo a participação.</span>
                </label>
                {errorText("autorizacao_responsavel")}
              </fieldset>
            )}

            <div>
              <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-cocoa/80">
                <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-terracotta" checked={form.consentimento_lgpd} onChange={(event) => update("consentimento_lgpd", event.target.checked)} />
                <span>Concordo que meus dados sejam usados apenas para contato sobre o projeto Um Olhar de Cuidado, conforme a LGPD.</span>
              </label>
              {errorText("consentimento_lgpd")}
            </div>

            {submitError && <p className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive" role="alert">{submitError}</p>}
            {submitted && (
              <div className="flex items-start gap-3 rounded-xl border border-terracotta/20 bg-project-beige/50 p-4 text-sm leading-relaxed text-cocoa" role="status">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-terracotta" />
                <p>Recebemos sua inscrição. Nossa equipe vai entrar em contato pelo telefone informado.</p>
              </div>
            )}

            <button type="submit" className="btn-terracotta w-full" disabled={sending}>
              {sending ? "Enviando inscrição…" : "Enviar inscrição"}
              {!sending && <Send className="h-4 w-4" />}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default UmOlharDeCuidado;
