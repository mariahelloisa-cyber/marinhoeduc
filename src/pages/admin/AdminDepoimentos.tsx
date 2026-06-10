import { useEffect, useState } from "react";
import {
  useTestimonialsContent,
  useSaveTestimonials,
  DEFAULT_TESTIMONIALS,
  type Testimonial,
} from "@/hooks/usePublicTestimonials";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const empty: Testimonial = { name: "", role: "", city: "", text: "", rating: 5 };

const AdminDepoimentos = () => {
  useEffect(() => {
    document.title = "Depoimentos | Admin";
  }, []);
  const { data, isLoading } = useTestimonialsContent();
  const save = useSaveTestimonials();
  const [items, setItems] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS.items);

  useEffect(() => {
    if (data?.items?.length) setItems(data.items);
  }, [data]);

  const update = (i: number, patch: Partial<Testimonial>) =>
    setItems((prev) => prev.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));

  const remove = (i: number) => setItems((prev) => prev.filter((_, idx) => idx !== i));
  const add = () => setItems((prev) => [...prev, { ...empty }]);

  const onSave = async () => {
    try {
      const cleaned = items.map((t) => ({
        ...t,
        rating: Math.max(1, Math.min(5, Number(t.rating) || 5)),
      }));
      await save.mutateAsync({ items: cleaned });
      toast.success("Depoimentos atualizados");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  if (isLoading) return <Loader2 className="h-5 w-5 animate-spin" />;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Depoimentos</h1>
          <p className="text-sm text-muted-foreground">
            Edite os depoimentos exibidos na seção "Histórias reais".
          </p>
        </div>
        <Button variant="outline" onClick={add}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar
        </Button>
      </div>

      <div className="grid gap-4">
        {items.map((t, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Depoimento {i + 1}</CardTitle>
                <CardDescription>{t.name || "Sem nome"}</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => remove(i)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Nome</Label>
                <Input value={t.name} onChange={(e) => update(i, { name: e.target.value })} />
              </div>
              <div>
                <Label>Cargo / curso</Label>
                <Input value={t.role} onChange={(e) => update(i, { role: e.target.value })} />
              </div>
              <div>
                <Label>Cidade</Label>
                <Input value={t.city} onChange={(e) => update(i, { city: e.target.value })} />
              </div>
              <div>
                <Label>Avaliação (1-5)</Label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={t.rating}
                  onChange={(e) => update(i, { rating: Number(e.target.value) })}
                />
              </div>
              <div className="sm:col-span-2">
                <Label>Depoimento</Label>
                <Textarea
                  rows={4}
                  value={t.text}
                  onChange={(e) => update(i, { text: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhum depoimento. Clique em "Adicionar".</p>
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

export default AdminDepoimentos;
