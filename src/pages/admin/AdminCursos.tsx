import { useEffect, useMemo, useState } from "react";
import {
  useCategories,
  useCourses,
  useDeleteCourse,
  useUpsertCourse,
  uploadMedia,
  type DbCourse,
} from "@/hooks/useAdminData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2, Upload, Search, Star } from "lucide-react";
import { toast } from "sonner";

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

type Form = Partial<DbCourse> & { slug: string; name: string; category_slug: string };

const empty = (): Form => ({
  slug: "",
  name: "",
  description: "",
  price: null,
  duration: "",
  workload: "",
  area: "",
  category_slug: "cursos-tecnicos",
  image_url: "",
  highlight: false,
  sort_order: 0,
  curriculum: "",
});

const AdminCursos = () => {
  useEffect(() => {
    document.title = "Cursos | Admin";
  }, []);
  const { data: courses, isLoading } = useCourses();
  const { data: cats } = useCategories();
  const upsert = useUpsertCourse();
  const del = useDeleteCourse();

  const [q, setQ] = useState("");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(empty());
  const [uploading, setUploading] = useState(false);

  const filtered = useMemo(() => {
    let list = courses ?? [];
    if (catFilter !== "all") list = list.filter((c) => c.category_slug === catFilter);
    if (q) {
      const lq = q.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(lq) || c.slug.toLowerCase().includes(lq));
    }
    return list.slice(0, 500);
  }, [courses, q, catFilter]);

  const openNew = () => {
    setForm(empty());
    setOpen(true);
  };
  const openEdit = (c: DbCourse) => {
    setForm({ ...c });
    setOpen(true);
  };

  const onUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadMedia(file, "courses");
      setForm((f) => ({ ...f, image_url: url }));
      toast.success("Imagem enviada");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  };

  const onSave = async () => {
    if (!form.name.trim()) return toast.error("Nome obrigatório");
    if (!form.category_slug) return toast.error("Categoria obrigatória");
    const slug = form.slug?.trim() || slugify(form.name);
    try {
      await upsert.mutateAsync({ ...form, slug });
      toast.success("Curso salvo");
      setOpen(false);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Excluir este curso?")) return;
    try {
      await del.mutateAsync(id);
      toast.success("Curso excluído");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Cursos</h1>
          <p className="text-sm text-muted-foreground">{courses?.length ?? 0} cursos no banco</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" /> Novo curso
        </Button>
      </div>

      <Card>
        <CardHeader className="space-y-3">
          <CardTitle>Lista</CardTitle>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" placeholder="Buscar por nome ou slug..." value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <Select value={catFilter} onValueChange={setCatFilter}>
              <SelectTrigger className="sm:w-64"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {(cats ?? []).map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <div className="divide-y">
              {filtered.map((c) => (
                <div key={c.id} className="flex items-center gap-3 py-3">
                  <div className="h-12 w-16 shrink-0 overflow-hidden rounded bg-muted">
                    {c.image_url && <img src={c.image_url} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium">{c.name}</span>
                      {c.highlight && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <Badge variant="secondary">{c.category_slug}</Badge>
                      {c.duration && <span>· {c.duration}</span>}
                      {c.price != null && <span>· R$ {Number(c.price).toFixed(2)}</span>}
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => openEdit(c)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onDelete(c.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              {!filtered.length && <p className="py-8 text-center text-sm text-muted-foreground">Nenhum curso.</p>}
              {courses && courses.length > 500 && (
                <p className="pt-3 text-center text-xs text-muted-foreground">
                  Exibindo 500 resultados. Refine a busca para encontrar outros.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{form.id ? "Editar curso" : "Novo curso"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Nome *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label>Slug</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="auto"
              />
            </div>
            <div>
              <Label>Categoria *</Label>
              <Select value={form.category_slug} onValueChange={(v) => setForm({ ...form, category_slug: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(cats ?? []).map((c) => (
                    <SelectItem key={c.slug} value={c.slug}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label>Descrição</Label>
              <Textarea
                rows={3}
                value={form.description ?? ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div>
              <Label>Duração</Label>
              <Input value={form.duration ?? ""} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="ex: 18 meses" />
            </div>
            <div>
              <Label>Carga horária</Label>
              <Input value={form.workload ?? ""} onChange={(e) => setForm({ ...form, workload: e.target.value })} placeholder="ex: 1200 horas" />
            </div>
            <div>
              <Label>Preço (R$)</Label>
              <Input
                type="number"
                step="0.01"
                value={form.price ?? ""}
                onChange={(e) => setForm({ ...form, price: e.target.value === "" ? null : Number(e.target.value) })}
              />
            </div>
            <div>
              <Label>Área</Label>
              <Input value={form.area ?? ""} onChange={(e) => setForm({ ...form, area: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Label>Grade Curricular</Label>
              <Textarea
                rows={6}
                value={form.curriculum ?? ""}
                onChange={(e) => setForm({ ...form, curriculum: e.target.value })}
                placeholder="Liste as disciplinas/módulos do curso, uma por linha"
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Imagem</Label>
              <div className="flex items-center gap-3">
                <div className="h-16 w-24 overflow-hidden rounded bg-muted">
                  {form.image_url && <img src={form.image_url} alt="" className="h-full w-full object-cover" />}
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
                  placeholder="ou cole uma URL"
                  value={form.image_url ?? ""}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center gap-3 sm:col-span-2">
              <Switch
                checked={!!form.highlight}
                onCheckedChange={(v) => setForm({ ...form, highlight: v })}
                id="highlight"
              />
              <Label htmlFor="highlight" className="cursor-pointer">Marcar como destaque</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={onSave} disabled={upsert.isPending}>
              {upsert.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCursos;
