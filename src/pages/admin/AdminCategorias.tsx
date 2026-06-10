import { useEffect, useMemo, useState } from "react";
import { useCategories, useCourses, useDeleteCategory, useUpsertCategory } from "@/hooks/useAdminData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Pencil, Trash2, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const AdminCategorias = () => {
  useEffect(() => {
    document.title = "Categorias | Admin";
  }, []);
  const { data: cats, isLoading } = useCategories();
  const { data: courses } = useCourses();
  const upsert = useUpsertCategory();
  const del = useDeleteCategory();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<{ id?: string; slug: string; label: string; sort_order: number; featured: boolean } | null>(null);

  const courseCount = useMemo(() => {
    const map = new Map<string, number>();
    (courses ?? []).forEach((c) => map.set(c.category_slug, (map.get(c.category_slug) ?? 0) + 1));
    return map;
  }, [courses]);

  const featuredCount = (cats ?? []).filter((c: any) => c.featured).length;

  const openNew = () => {
    setEditing({ slug: "", label: "", sort_order: (cats?.length ?? 0) + 1, featured: false });
    setOpen(true);
  };

  const openEdit = (c: any) => {
    setEditing({ id: c.id, slug: c.slug, label: c.label, sort_order: c.sort_order, featured: !!c.featured });
    setOpen(true);
  };

  const toggleFeatured = async (c: any) => {
    const next = !c.featured;
    if (next && featuredCount >= 6) {
      toast.error("Máximo de 6 categorias em destaque. Desative uma antes.");
      return;
    }
    try {
      await upsert.mutateAsync({ id: c.id, slug: c.slug, label: c.label, sort_order: c.sort_order, featured: next });
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const onSave = async () => {
    if (!editing) return;
    if (!editing.label.trim()) {
      toast.error("Nome obrigatório");
      return;
    }
    const slug = editing.slug.trim() || slugify(editing.label);
    try {
      await upsert.mutateAsync({ ...editing, slug });
      toast.success("Categoria salva");
      setOpen(false);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const onDelete = async (id: string, slug: string) => {
    if ((courseCount.get(slug) ?? 0) > 0) {
      toast.error("Existem cursos nessa categoria. Mova-os antes de excluir.");
      return;
    }
    if (!confirm("Excluir esta categoria?")) return;
    try {
      await del.mutateAsync(id);
      toast.success("Categoria excluída");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Categorias</h1>
          <p className="text-sm text-muted-foreground">Organize as áreas de cursos do site. Até 6 podem aparecer em destaque na barra de navegação ({featuredCount}/6 ativas).</p>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" /> Nova categoria
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <div className="divide-y">
              {(cats ?? []).map((c: any) => (
                <div key={c.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 font-medium">
                      {c.label}
                      {c.featured && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      /{c.slug} · {courseCount.get(c.slug) ?? 0} cursos
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-xs text-muted-foreground">
                      Destaque
                      <Switch checked={!!c.featured} onCheckedChange={() => toggleFeatured(c)} />
                    </label>
                    <Button size="sm" variant="ghost" onClick={() => openEdit(c)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => onDelete(c.id, c.slug)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
              {!cats?.length && <p className="py-6 text-center text-sm text-muted-foreground">Nenhuma categoria.</p>}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Editar categoria" : "Nova categoria"}</DialogTitle>
            <DialogDescription>O slug é usado nas URLs. Deixe em branco para gerar automaticamente.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nome</Label>
              <Input
                value={editing?.label ?? ""}
                onChange={(e) => setEditing((s) => ({ ...(s as any), label: e.target.value }))}
              />
            </div>
            <div>
              <Label>Slug</Label>
              <Input
                value={editing?.slug ?? ""}
                onChange={(e) => setEditing((s) => ({ ...(s as any), slug: e.target.value }))}
                placeholder="ex: cursos-tecnicos"
              />
            </div>
            <div>
              <Label>Ordem</Label>
              <Input
                type="number"
                value={editing?.sort_order ?? 0}
                onChange={(e) => setEditing((s) => ({ ...(s as any), sort_order: Number(e.target.value) }))}
              />
            </div>
            <div className="flex items-center gap-3 pt-1">
              <Switch
                id="featured"
                checked={!!editing?.featured}
                onCheckedChange={(v) => {
                  if (v && !editing?.featured && featuredCount >= 6) {
                    toast.error("Máximo de 6 categorias em destaque.");
                    return;
                  }
                  setEditing((s) => ({ ...(s as any), featured: v }));
                }}
              />
              <Label htmlFor="featured" className="cursor-pointer">Exibir na barra de destaques</Label>
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

export default AdminCategorias;
