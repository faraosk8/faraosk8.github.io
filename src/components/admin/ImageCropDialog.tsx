import { useCallback, useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const criarImagemRecortada = async (url: string, area: Area) => {
  const imagem = new Image();
  imagem.src = url;
  await imagem.decode();
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 800;
  const contexto = canvas.getContext("2d");
  if (!contexto) throw new Error("Canvas indisponível");
  contexto.drawImage(imagem, area.x, area.y, area.width, area.height, 0, 0, 800, 800);
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Falha ao gerar imagem")), "image/jpeg", 0.88);
  });
};

type Props = {
  arquivo: File | null;
  onClose: () => void;
  onComplete: (blob: Blob) => Promise<void>;
};

const ImageCropDialog = ({ arquivo, onClose, onComplete }: Props) => {
  const [url, setUrl] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [processando, setProcessando] = useState(false);

  useEffect(() => {
    if (!arquivo) return;
    const objetoUrl = URL.createObjectURL(arquivo);
    setUrl(objetoUrl);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setArea(null);
    return () => URL.revokeObjectURL(objetoUrl);
  }, [arquivo]);

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => setArea(areaPixels), []);

  const confirmar = async () => {
    if (!url || !area) return;
    setProcessando(true);
    try {
      const blob = await criarImagemRecortada(url, area);
      await onComplete(blob);
    } finally {
      setProcessando(false);
    }
  };

  return (
    <Dialog open={Boolean(arquivo)} onOpenChange={(aberto) => !aberto && onClose()}>
      <DialogContent className="max-w-xl border-border bg-background text-espresso">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl font-normal">Recortar foto do produto</DialogTitle>
          <DialogDescription className="text-espresso/60">Centralize a imagem e ajuste o zoom. O recorte será salvo em formato quadrado.</DialogDescription>
        </DialogHeader>
        <div className="relative h-[340px] w-full overflow-hidden rounded-xl bg-muted">
          {url && (
            <Cropper
              image={url}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          )}
        </div>
        <label className="block text-sm text-espresso/75">
          Zoom
          <input type="range" min={1} max={3} step={0.05} value={zoom} onChange={(event) => setZoom(Number(event.target.value))} className="mt-2 w-full accent-wine" />
        </label>
        <DialogFooter className="gap-3">
          <button type="button" onClick={onClose} className="btn-outline-wine">Cancelar</button>
          <button type="button" disabled={!area || processando} onClick={() => void confirmar()} className="btn-wine disabled:opacity-60">
            {processando ? "Processando…" : "Usar este recorte"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropDialog;
