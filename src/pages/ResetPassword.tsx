import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type ResetStatus = "verificando" | "pronta" | "invalido" | "sucesso";

const inputClass =
  "w-full rounded-xl border border-border/70 bg-card px-4 py-3 text-sm text-espresso outline-none focus:border-wine";

const ResetPassword = () => {
  const [status, setStatus] = useState<ResetStatus>("verificando");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Redefinir senha | Fernanda Rabelo";

    let active = true;
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const hasRecoveryHash = hashParams.get("type") === "recovery";
    const recoveryAccessToken = hashParams.get("access_token");

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (active && event === "PASSWORD_RECOVERY" && session) {
        setStatus("pronta");
      }
    });

    if (!hasRecoveryHash) {
      setStatus("invalido");
    } else {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (active && session) setStatus("pronta");
      });
    }

    const timeout = window.setTimeout(() => {
      if (active) {
        setStatus((current) => (current === "verificando" ? "invalido" : current));
      }
    }, 10000);

    return () => {
      active = false;
      window.clearTimeout(timeout);
      subscription.unsubscribe();
      document.title = previousTitle;
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("A nova senha precisa ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirmation) {
      setError("As senhas não coincidem. Digite a mesma senha nos dois campos.");
      return;
    }

    setSaving(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setSaving(false);
      const message = updateError.message.toLowerCase();
      setError(
        updateError.code === "weak_password" || message.includes("weak")
          ? "Essa senha é muito comum ou já apareceu em vazamentos. Crie outra com pelo menos 8 caracteres, misturando letras maiúsculas, minúsculas, números e símbolo."
          : updateError.code === "same_password" || message.includes("different from the old")
            ? "A nova senha precisa ser diferente da senha anterior."
            : "Não foi possível redefinir a senha. O link pode ter expirado; solicite um novo."
      );
      return;
    }

    window.history.replaceState({}, document.title, window.location.pathname);
    await supabase.auth.signOut();
    setPassword("");
    setConfirmation("");
    setSaving(false);
    setStatus("sucesso");
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-background">
      <Navbar />
      <section className="section-padding pt-32">
        <div className="container mx-auto">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-sm text-espresso/60 transition-colors hover:text-wine"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar para o acesso
          </Link>
          <h1 className="mt-8 text-center font-serif text-3xl text-espresso md:text-4xl">
            Redefinir senha
          </h1>

          <div className="soft-card mx-auto mt-10 w-full max-w-sm">
            {status === "verificando" && (
              <p role="status" className="text-center text-sm text-espresso/60">
                Verificando o link de recuperação…
              </p>
            )}

            {status === "invalido" && (
              <div className="text-center">
                <h2 className="font-serif text-2xl text-espresso">Link inválido ou expirado</h2>
                <p className="mt-4 text-sm leading-relaxed text-espresso/70">
                  Solicite um novo link na tela de acesso. Por segurança, cada link de
                  recuperação pode ser usado por tempo limitado.
                </p>
                <Link to="/admin" className="btn-wine mt-6 w-full">
                  Solicitar novo link
                </Link>
              </div>
            )}

            {status === "pronta" && (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <p className="text-center text-sm leading-relaxed text-espresso/70">
                  Crie uma nova senha para acessar o painel.
                </p>
                <label className="sr-only" htmlFor="new-password">
                  Nova senha
                </label>
                <input
                  id="new-password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Nova senha (mín. 8 caracteres)"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  className={inputClass}
                />
                <label className="sr-only" htmlFor="confirm-password">
                  Repita a nova senha
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Repita a nova senha"
                  value={confirmation}
                  onChange={(event) => {
                    setConfirmation(event.target.value);
                    setError("");
                  }}
                  className={inputClass}
                />
                <p className="text-xs leading-relaxed text-espresso/60">
                  Combine letras maiúsculas e minúsculas, números e símbolo. Evite nomes,
                  datas e senhas já usadas.
                </p>
                {error && (
                  <p role="alert" className="text-sm leading-relaxed text-destructive">
                    {error}
                  </p>
                )}
                <button type="submit" disabled={saving} className="btn-wine w-full">
                  {saving ? "Salvando…" : "Salvar nova senha"}
                </button>
              </form>
            )}

            {status === "sucesso" && (
              <div className="text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-wine" aria-hidden="true" />
                <h2 className="mt-4 font-serif text-2xl text-espresso">Senha atualizada</h2>
                <p role="status" className="mt-4 text-sm leading-relaxed text-espresso/70">
                  Sua nova senha foi salva. Agora você já pode entrar no painel.
                </p>
                <Link to="/admin" className="btn-wine mt-6 w-full">
                  Entrar com a nova senha
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default ResetPassword;
