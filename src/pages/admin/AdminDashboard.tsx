import { useEffect, useState } from "react";
import { useCourses, useCategories } from "@/hooks/useAdminData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Database, BookOpen, Tag, Home, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { courses as mockCourses, categoryOptions } from "@/data/courses";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const AdminDashboard = () => {
  useEffect(() => {
    document.title = "Dashboard | Admin Marinho Educacional";
  }, []);

  const { data: courses, isLoading: lc } = useCourses();
  const { data: cats, isLoading: lcat } = useCategories();
  const [importing, setImporting] = useState(false);

  const totalCourses = courses?.length ?? 0;
  const totalHighlights = courses?.filter((c) => c.highlight).length ?? 0;
  const totalCats = cats?.length ?? 0;

  const handleImport = async () => {
    if (!confirm(`Importar ${mockCourses.length} cursos do conteúdo padrão para o banco? Cursos já existentes serão atualizados.`)) return;
    setImporting(true);
    try {
      // Garante categorias
      const catRows = categoryOptions.map((c, i) => ({ slug: c.slug, label: c.label, sort_order: i + 1 }));
      const { error: ce } = await supabase.from("categories").upsert(catRows, { onConflict: "slug" });
      if (ce) throw ce;

      const rows = mockCourses.map((c, i) => ({
        slug: c.id,
        name: c.name,
        description: c.description ?? null,
        price: c.price ?? null,
        duration: c.duration ?? null,
        workload: c.workload ?? null,
        area: c.area ?? null,
        category_slug: c.category,
        image_url: typeof c.image === "string" ? c.image : null,
        highlight: !!c.highlight,
        sort_order: i,
      }));

      // Insere em lotes de 200
      for (let i = 0; i < rows.length; i += 200) {
        const chunk = rows.slice(i, i + 200);
        const { error } = await supabase.from("courses").upsert(chunk, { onConflict: "slug" });
        if (error) throw error;
      }
      toast.success(`Importados ${rows.length} cursos.`);
    } catch (e: any) {
      toast.error(e.message ?? "Falha ao importar");
    } finally {
      setImporting(false);
    }
  };

  void slugify;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral do conteúdo do site.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={BookOpen} label="Cursos" value={lc ? "—" : totalCourses} to="/admin/cursos" />
        <StatCard icon={Star} label="Em destaque" value={lc ? "—" : totalHighlights} to="/admin/cursos" />
        <StatCard icon={Tag} label="Categorias" value={lcat ? "—" : totalCats} to="/admin/categorias" />
        <StatCard icon={Home} label="Página inicial" value="Editar" to="/admin/home" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" /> Importar conteúdo padrão
          </CardTitle>
          <CardDescription>
            Copia os {mockCourses.length} cursos do conteúdo embutido para o banco de dados. Use uma única vez para popular o site. Itens existentes (mesmo identificador) serão atualizados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleImport} disabled={importing}>
            {importing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Importar agora
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  to,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  to: string;
}) => (
  <Link to={to}>
    <Card className="transition-colors hover:border-primary/40">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="rounded-lg bg-primary/10 p-3 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
          <div className="text-xl font-semibold">{value}</div>
        </div>
      </CardContent>
    </Card>
  </Link>
);

export default AdminDashboard;
