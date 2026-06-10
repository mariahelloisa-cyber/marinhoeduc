import { Link } from "react-router-dom";
import {
  Wrench,
  Award,
  Briefcase,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Category {
  name: string;
  slug: string;
  count: string;
  icon: React.ComponentType<{ className?: string }>;
}

const categories: Category[] = [
  { name: "Cursos técnicos", slug: "cursos-tecnicos", count: "30+ cursos", icon: Wrench },
  { name: "Técnico por competência", slug: "tecnico-competencia", count: "15+ cursos", icon: Award },
  { name: "Pós-graduação", slug: "pos-graduacao", count: "40+ cursos", icon: Sparkles },
  { name: "Profissionalizantes", slug: "profissionalizantes", count: "990+ cursos", icon: Briefcase },
];

const Categories = () => {
  return (
    <section
      id="categorias"
      className="relative overflow-hidden bg-[hsl(195_45%_8%)] py-20 md:py-28"
    >
      {/* Decorative glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-[hsl(var(--accent))] opacity-10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-[hsl(var(--primary-glow))] opacity-10 blur-3xl"
      />

      <div className="container relative">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-white md:text-4xl">
            Explore nossas{" "}
            <span className="text-[hsl(var(--accent))]">categorias</span>
          </h2>
          <p className="mt-4 text-base text-white/65 md:text-lg">
            Temos cursos para todos os níveis e áreas de atuação.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.slug}
                to={`/cursos?categoria=${category.slug}`}
                className="group flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur-sm transition-all hover:border-[hsl(var(--accent))]/60 hover:bg-white/[0.08] hover:shadow-[0_0_30px_-5px_hsl(var(--accent)/0.4)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[hsl(var(--accent))] transition-colors group-hover:bg-[hsl(var(--accent))]/15">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <span className="font-display text-sm font-semibold text-white md:text-base">
                    {category.name}
                  </span>
                </div>
                <span className="text-xs font-medium text-white/50 transition-colors group-hover:text-[hsl(var(--accent))] md:text-sm">
                  {category.count}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/20 bg-transparent font-semibold text-white hover:border-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/10 hover:text-white"
          >
            <Link to="/cursos">
              Ver todos os cursos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Categories;
