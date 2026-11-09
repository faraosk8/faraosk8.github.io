import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

  try {
    if (req.method !== "POST") return json({ error: "Método não permitido" }, 405);
    const body = await req.json().catch(() => null);
    const ids = Array.isArray(body?.ids) ? body.ids.filter((id: unknown) => typeof id === "string" && UUID.test(id)).slice(0, 100) : [];
    if (!ids.length) return json({ imagens: {} });

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: produtos, error } = await admin
      .from("produtos_indicados")
      .select("id, imagem_url")
      .in("id", ids)
      .eq("ativo", true)
      .not("imagem_url", "is", null);
    if (error) throw error;

    const imagens: Record<string, string> = {};
    await Promise.all(
      (produtos ?? []).map(async (p) => {
        if (!p.imagem_url || /^https?:\/\//.test(p.imagem_url)) return;
        const { data } = await admin.storage.from("produtos").createSignedUrl(p.imagem_url, 3600);
        if (data?.signedUrl) imagens[p.id] = data.signedUrl;
      }),
    );
    return json({ imagens });
  } catch (e) {
    console.error("imagens-produtos", e);
    return json({ error: "Não foi possível carregar as imagens" }, 500);
  }
});
