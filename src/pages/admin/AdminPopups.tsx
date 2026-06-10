import { useEffect, useState } from "react";
import { usePopupsContent, useSavePopups, type Popup } from "@/hooks/usePopups";
import { uploadMedia } from "@/hooks/useAdminData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

const makeEmpty = (): Popup => ({
  id: crypto.randomUUID(),
  title: "",
  content: "",
  image_url: "",
  cta_label: "",
  cta_url: "",
  active: true,
  image_size: "md",
});

const AdminPopups = () => {
  useEffect(() => {
    document.title = "Pop-ups | Admin";
  }, []);
  const { data, isLoading } = usePopupsContent();
  const save = useSavePopups();
  const [items, setItems] = useState<Popup[]>([]);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  useEffect(() => {
    if (data?.items) setItems(data.items);
  }, [data]);

  const update = (i: number, patch: Partial<Popup>) =>
    setItems((prev) => prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));

  const remove = (i: number) => setItems((prev) => prev.filter((_, idx) => idx !== i));
  const add = () => setItems((prev) => [...prev, makeEmpty()]);

  const onUpload = async (i: number, file: File) => {
    try {
      setUploadingIdx(i);
      const url = await uploadMedia(file, "popups");
      update(i, { image_url: url });
      toast.success("Imagem enviada");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setUploadingIdx(null);
    }
  };

  const onSave = async () => {
    try {
      await save.mutateAsync({ items });
      toast.success("Pop-ups salvos");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  if (isLoading) return <Loader2 className="h-5 w-5 animate-spin" />;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Pop-ups</h1>
          <p className="text-sm text-muted-foreground">
            Crie pop-ups que aparecem quando o visitante abre o site. Apenas os ativos serão exibidos.
          </p>
        </div>
        <Button variant="outline" onClick={add}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar pop-up
        </Button>
      </div>

      <div className="grid gap-4">
        {items.map((p, i) => (
          <Card key={p.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Pop-up {i + 1}</CardTitle>
                <CardDescription>{p.title || "Sem título"}</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Label htmlFor={`active-${p.id}`} className="text-xs">Ativo</Label>
                  <Switch
                    id={`active-${p.id}`}
                    checked={p.active}
                    onCheckedChange={(v) => update(i, { active: v })}
                  />
                </div>
                <Button variant="ghost" size="icon" onClick={() => remove(i)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label>Título</Label>
                <Input value={p.title} onChange={(e) => update(i, { title: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Label>Conteúdo</Label>
                <Textarea
                  rows={4}
                  value={p.content}
                  onChange={(e) => update(i, { content: e.target.value })}
                />
              </div>
              <div>
                <Label>Texto do botão (opcional)</Label>
                <Input
                  value={p.cta_label ?? ""}
                  onChange={(e) => update(i, { cta_label: e.target.value })}
                />
              </div>
              <div>
                <Label>Link do botão (opcional)</Label>
                <Input
                  value={p.cta_url ?? ""}
                  onChange={(e) => update(i, { cta_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="sm:col-span-2">
                <Label>Imagem (opcional)</Label>
                <div className="flex items-center gap-3">
                  <Input
                    value={p.image_url ?? ""}
                    onChange={(e) => update(i, { image_url: e.target.value })}
                    placeholder="URL da imagem"
                  />
                  <label className="inline-flex">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) onUpload(i, f);
                      }}
                    />
                    <Button type="button" variant="outline" asChild>
                      <span>
                        {uploadingIdx === i ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="mr-2 h-4 w-4" />
                        )}
                        Enviar
                      </span>
                    </Button>
                  </label>
                </div>
                {p.image_url && (
                  <img
                    src={p.image_url}
                    alt="Pré-visualização"
                    className="mt-2 h-32 w-auto border object-cover"
                  />
                )}
              </div>
              <div className="sm:col-span-2">
                <Label>Tamanho da imagem no pop-up</Label>
                <Select
                  value={p.image_size ?? "md"}
                  onValueChange={(v) => update(i, { image_size: v as Popup["image_size"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sm">Pequena</SelectItem>
                    <SelectItem value="md">Média</SelectItem>
                    <SelectItem value="lg">Grande</SelectItem>
                    <SelectItem value="full">Tela cheia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nenhum pop-up criado. Clique em "Adicionar pop-up".
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={onSave} disabled={save.isPending} size="lg">
          {save.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Salvar alterações
        </Button>
      </div>
    </div>
  );
};

export default AdminPopups;
