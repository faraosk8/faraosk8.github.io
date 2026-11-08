import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3.23.8";

const BodySchema = z
  .object({
    nome: z.string().trim().min(3).max(120),
    idade: z.number().int().min(1).max(120),
    telefone: z.string().refine((value) => value.replace(/\D/g, "").length === 11),
    email: z.union([z.literal(""), z.string().trim().email().max(255)]),
    bairro: z.string().trim().min(2).max(100),
    cidade: z.string().trim().min(2).max(100),
    motivo: z.string().trim().min(1).max(600),
    nome_responsavel: z.string().trim().max(120),
    telefone_responsavel: z.string(),
    autorizacao_responsavel: z.boolean(),
    consentimento_lgpd: z.literal(true),
    sessao_id: z.string().uuid(),
    website: z.string().max(200).optional(),
  })
  .superRefine((data, context) => {
    if (data.idade >= 18) return;
    if (data.nome_responsavel.length < 3) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["nome_responsavel"], message: "Responsável obrigatório" });
    }
    if (data.telefone_responsavel.replace(/\D/g, "").length !== 11) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["telefone_responsavel"], message: "Telefone do responsável obrigatório" });
    }
    if (!data.autorizacao_responsavel) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["autorizacao_responsavel"], message: "Autorização obrigatória" });
    }
  });

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const hash = async (value: string) => {
  const salt = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "olhar-cuidado";
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${salt}:${value}`));
  return Array.from(new Uint8Array(bytes)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
};

const escapeHtml = (value: string | number) =>
  String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Método não permitido." }, 405);

  const raw = await req.json().catch(() => null);
  if (!raw || typeof raw !== "object") return json({ error: "Dados inválidos." }, 400);

  // Bots que preenchem o campo oculto recebem uma resposta neutra, sem gravar dados.
  if (typeof (raw as Record<string, unknown>).website === "string" && (raw as Record<string, string>).website.trim()) {
    return json({ ok: true });
  }

  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) {
    return json({ error: "Revise os campos da inscrição.", fields: parsed.error.flatten().fieldErrors }, 400);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const ip = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "desconhecido";
  const chaves = await Promise.all([hash(`ip:${ip}`), hash(`sessao:${parsed.data.sessao_id}`)]);

  for (const chave of chaves) {
    const { data: permitido, error } = await supabase.rpc("consumir_limite_olhar_cuidado", {
      p_chave_hash: chave,
      p_limite: 3,
    });
    if (error) {
      console.error("Falha ao verificar limite de envios:", error.message);
      return json({ error: "Não foi possível enviar agora. Tente novamente em instantes." }, 500);
    }
    if (!permitido) return json({ error: "Limite de envios atingido. Tente novamente em uma hora." }, 429);
  }

  const { sessao_id: _sessao, website: _website, ...inscricao } = parsed.data;
  const { data: saved, error: insertError } = await supabase
    .from("inscricoes_olhar_cuidado")
    .insert({ ...inscricao, email: inscricao.email || null })
    .select("id, created_at")
    .single();

  if (insertError) {
    console.error("Falha ao salvar inscrição:", insertError.message);
    return json({ error: "Não foi possível salvar sua inscrição. Tente novamente." }, 500);
  }

  try {
    const resendKey = Deno.env.get("RESEND_API_KEY");
    const recipients = (Deno.env.get("NOTIFY_EMAIL") ?? "")
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean);

    if (!resendKey || recipients.length === 0) {
      console.warn(`Aviso por e-mail não configurado para a inscrição ${saved.id}.`);
    } else {
      const dataHora = new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "long",
        timeStyle: "short",
        timeZone: "America/Fortaleza",
      }).format(new Date(saved.created_at));
      const menor = inscricao.idade < 18;
      const detalheMenor = menor
        ? '<p style="margin:12px 0;color:#4E3B33"><strong>Menor de idade – com autorização do responsável</strong></p>'
        : "";
      const html = `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:28px;background:#F7F0E9;color:#4E3B33">
          <h1 style="color:#A8664A;font-size:26px">Nova inscrição recebida</h1>
          <p><strong>Nome:</strong> ${escapeHtml(inscricao.nome)}</p>
          <p><strong>Idade:</strong> ${inscricao.idade}</p>
          <p><strong>Bairro:</strong> ${escapeHtml(inscricao.bairro)}</p>
          <p><strong>Cidade:</strong> ${escapeHtml(inscricao.cidade)}</p>
          <p><strong>Telefone:</strong> ${escapeHtml(inscricao.telefone)}</p>
          <p><strong>Data e hora:</strong> ${escapeHtml(dataHora)}</p>
          ${detalheMenor}
          <a href="https://fernandarabelo.com.br/admin/inscricoes" style="display:inline-block;margin-top:18px;padding:13px 22px;border-radius:24px;background:#A8664A;color:#ffffff;text-decoration:none">Ver no painel</a>
        </div>`;

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: Deno.env.get("RESEND_FROM_EMAIL") ?? "Um Olhar de Cuidado <onboarding@resend.dev>",
          to: recipients,
          subject: `Nova inscrição – Um Olhar de Cuidado: ${inscricao.nome}`,
          html,
        }),
      });
      if (!response.ok) {
        console.error(`Falha no aviso Resend para ${saved.id}: ${response.status} ${await response.text()}`);
      } else {
        await response.text();
      }
    }
  } catch (emailError) {
    // A inscrição já está salva; falha de notificação nunca deve afetar o participante.
    console.error(`Erro no aviso por e-mail da inscrição ${saved.id}:`, emailError);
  }

  return json({ ok: true, id: saved.id });
});
