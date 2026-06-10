import { useEffect, useMemo, useState } from "react";
import {
  useAdminPosts,
  useDeletePost,
  useUpsertPost,
  type DbBlogPost,
} from "@/hooks/useBlogPosts";
import { uploadMedia } from "@/hooks/useAdminData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Plus, Pencil, Trash2, Upload, Search } from "lucide-react";
import { toast } from "sonner";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

type Form = Partial<DbBlogPost> & { title: string; slug: string };

const empty = (): Form => ({
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  image_url: "",
  published: false,
});

const AdminBlog = () => {
  useEffect(() => {
    document.title = "Blog | Admin";
  }, []);

  const { data: posts, isLoading } = useAdminPosts();
  const upsert = useUpsertPost();
  const del = useDeletePost();

  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(empty());
  const [uploading, setUploading] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = posts ?? [];
    if (q) {
      const lq = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(lq) ||
          p.slug.toLowerCase().includes(lq)
      );
    }
    return list;
  }, [posts, q]);

  const openNew = () => {
    setForm(empty());
    setOpen(true);
  };
  const openEdit = (p: DbBlogPost) => {
    setForm({ ...p });
    setOpen(true);
  };

  const onUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadMedia(file, "blog");
      setForm((f) => ({ ...f, image_url: url }));
      toast.success("Imagem enviada");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  };

  const onSave = async () => {
    if (!form.title.trim()) return toast.error("Título obrigatório");
    const slug = form.slug?.trim() || slugify(form.title);
    try {
      await upsert.mutateAsync({ ...form, slug });
      toast.success("Post salvo");
      setOpen(false);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const onConfirmDelete = async () => {
    if (!confirmId) return;
    try {
      await del.mutateAsync(confirmId);
      toast.success("Post excluído");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Blog</h1>
          <p className="text-sm text-muted-foreground">
            {posts?.length ?? 0} posts no banco
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" /> Novo post
        </Button>
      </div>

      <Card>
        <CardHeader className="space-y-3">
          <CardTitle>Posts</CardTitle>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Buscar por título ou slug..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <div className="divide-y">
              {filtered.map((p) => (
                <div key={p.id} className="flex items-center gap-3 py-3">
                  <div className="h-12 w-16 shrink-0 overflow-hidden rounded bg-muted">
                    {p.image_url && (
                      <img
                        src={p.image_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium">{p.title}</span>
                      {p.published ? (
                        <Badge variant="default">Publicado</Badge>
                      ) : (
                        <Badge variant="secondary">Rascunho</Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      /{p.slug}
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => openEdit(p)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setConfirmId(p.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              {!filtered.length && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Nenhum post.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {form.id ? "Editar post" : "Novo post"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div>
              <Label>Título *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
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
              <Label>Resumo</Label>
              <Textarea
                rows={3}
                value={form.excerpt ?? ""}
                onChange={(e) =>
                  setForm({ ...form, excerpt: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Conteúdo</Label>
              <Textarea
                rows={10}
                value={form.content ?? ""}
                onChange={(e) =>
                  setForm({ ...form, content: e.target.value })
                }
                placeholder="Texto do post..."
              />
            </div>
            <div>
              <Label>Imagem</Label>
              <div className="flex items-center gap-3">
                <div className="h-16 w-24 overflow-hidden rounded bg-muted">
                  {form.image_url && (
                    <img
                      src={form.image_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files?.[0] && onUpload(e.target.files[0])
                    }
                  />
                  <span className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm hover:bg-muted">
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    Enviar imagem
                  </span>
                </label>
                <Input
                  className="flex-1"
                  placeholder="ou cole uma URL"
                  value={form.image_url ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, image_url: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="published"
                checked={!!form.published}
                onCheckedChange={(v) => setForm({ ...form, published: v })}
              />
              <Label htmlFor="published" className="cursor-pointer">
                Publicado
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={onSave} disabled={upsert.isPending}>
              {upsert.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!confirmId}
        onOpenChange={(v) => !v && setConfirmId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir post?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminBlog;
