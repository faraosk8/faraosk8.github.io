DROP POLICY IF EXISTS "Imagens de produtos podem ser lidas" ON storage.objects;
CREATE POLICY "Imagens de produtos ativos podem ser lidas" ON storage.objects
FOR SELECT TO anon, authenticated
USING (
  bucket_id = 'produtos' AND EXISTS (
    SELECT 1 FROM public.produtos_indicados p
    WHERE p.imagem_url = storage.objects.name AND p.ativo = true
  )
);
CREATE POLICY "Administradores leem imagens de produtos" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'produtos' AND public.has_role(auth.uid(), 'admin'::public.app_role));