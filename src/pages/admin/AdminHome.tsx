import { useEffect, useState } from "react";
import { useHeroContent, useSaveHero, uploadMedia, type HeroContent } from "@/hooks/useAdminData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Upload, Save, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const empty: HeroContent = {
  badge: "",
  title: "",
  subtitle: "",
  primary_button_label: "",
  primary_button_target: "cursos",
  secondary_button_label: "",
  secondary_button_target: "beneficios",
  background_image_url: "",
  overlay_enabled: true,
  extra_image_urls: [],
};

const AdminHome = () => {
  useEffect(() => { document.title = "Página inicial | Admin"; }, []);
  const { data, isLoading } = useHeroContent();
  const save = useSaveHero();
  const [form, setForm] = useState<HeroContent>(empty);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const onUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadMedia(file, "hero");
      setForm((f) => ({ ...f, background_image_url: url }));
      toast.success("Imagem enviada");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  };

  const onUploadExtra = async (file: File, idx: number) => {
    try {
      const url = await uploadMedia(file, "hero");
      setForm((f) => {
        const extras = [...(f.extra_image_urls ?? [])];
        extras[idx] = url;
        return { ...f, extra_image_urls: extras };
      });
      toast.success("Imagem enviada");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const addExtra = () =>
    setForm((f) => ({ ...f, extra_image_urls: [...(f.extra_image_urls ?? []), ""] }));

  const removeExtra = (idx: number) =>
    setForm((f) => ({
      ...f,
      extra_image_urls: (f.extra_image_urls ?? []).filter((_, i) => i !== idx),
    }));

  const updateExtra = (idx: number, url: string) =>
    setForm((f) => {
      const extras = [...(f.extra_image_urls ?? [])];
      extras[idx] = url;
      return { ...f, extra_image_urls: extras };
    });


  const onSave = async () => {
    try {
      await save.mutateAsync(form);
      toast.success("Página inicial atualizada");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  if (isLoading) return <Loader2 className="h-5 w-5 animate-spin" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Página inicial</h1>
        <p className="text-sm text-muted-foreground">Edite os textos, botões e imagem de fundo da hero.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hero</CardTitle>
          <CardDescription>Use &lt;highlight&gt;texto&lt;/highlight&gt; para destacar parte do título.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Selo (badge)</Label>
            <Input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <Label>Título</Label>
            <Textarea rows={2} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <Label>Subtítulo</Label>
            <Textarea rows={3} value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
          </div>
          <div>
            <Label>Botão primário (texto)</Label>
            <Input value={form.primary_button_label} onChange={(e) => setForm({ ...form, primary_button_label: e.target.value })} />
          </div>
          <div>
            <Label>Botão primário (id da seção)</Label>
            <Input value={form.primary_button_target} onChange={(e) => setForm({ ...form, primary_button_target: e.target.value })} />
          </div>
          <div>
            <Label>Botão secundário (texto)</Label>
            <Input value={form.secondary_button_label} onChange={(e) => setForm({ ...form, secondary_button_label: e.target.value })} />
          </div>
          <div>
            <Label>Botão secundário (id da seção)</Label>
            <Input value={form.secondary_button_target} onChange={(e) => setForm({ ...form, secondary_button_target: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <Label>Imagem de fundo</Label>
            <div className="flex items-center gap-3">
              <div className="h-20 w-32 overflow-hidden rounded bg-muted">
                {form.background_image_url && (
                  <img src={form.background_image_url} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
                />
                <span className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm hover:bg-muted">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  Enviar imagem
                </span>
              </label>
              <Input
                className="flex-1"
                placeholder="ou cole uma URL (deixe em branco para usar padrão)"
                value={form.background_image_url}
                onChange={(e) => setForm({ ...form, background_image_url: e.target.value })}
              />
            </div>
          </div>

          <div className="sm:col-span-2 flex items-center gap-3">
            <Switch
              id="overlay-toggle"
              checked={form.overlay_enabled !== false}
              onCheckedChange={(checked) => setForm({ ...form, overlay_enabled: checked })}
            />
            <Label htmlFor="overlay-toggle" className="cursor-pointer">
              Aplicar sombra escura sobre a imagem
            </Label>
          </div>

          <div className="sm:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label>Imagens adicionais (carrossel)</Label>
                <p className="text-xs text-muted-foreground">
                  Estes slides aparecem alternando após o principal e mostram apenas a imagem.
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addExtra}>
                <Plus className="h-4 w-4 mr-1" /> Adicionar
              </Button>
            </div>
            {(form.extra_image_urls ?? []).map((url, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="h-20 w-32 overflow-hidden rounded bg-muted">
                  {url && <img src={url} alt="" className="h-full w-full object-cover" />}
                </div>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && onUploadExtra(e.target.files[0], idx)}
                  />
                  <span className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm hover:bg-muted">
                    <Upload className="h-4 w-4" /> Enviar
                  </span>
                </label>
                <Input
                  className="flex-1"
                  placeholder="ou cole uma URL"
                  value={url}
                  onChange={(e) => updateExtra(idx, e.target.value)}
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeExtra(idx)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={onSave} disabled={save.isPending} size="lg">
          {save.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Salvar alterações
        </Button>
      </div>
    </div>
  );
};

export default AdminHome;
