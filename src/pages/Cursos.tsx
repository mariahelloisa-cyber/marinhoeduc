import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight, LayoutGrid, List as ListIcon } from "lucide-react";
import Header from "@/components/Header";
import SubNav from "@/components/SubNav";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import CourseCard from "@/components/CourseCard";
import CourseList from "@/components/CourseList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePublicCourses, usePublicCategories } from "@/hooks/usePublicData";
import { cn } from "@/lib/utils";
import cursosHero from "@/assets/cursos-hero.jpg";

const PAGE_SIZE = 20;
type ViewMode = "cards" | "list";

const Cursos = () => {
  const { data: courses = [] } = usePublicCourses();
  const { data: categories = [] } = usePublicCategories();
  const categoryOptions = categories;
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("categoria") ?? "all";
  const initialQuery = searchParams.get("q") ?? "";
  const [category, setCategory] = useState<string>(initialCategory);
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>("cards");

  // Categorias que sempre exibem em formato de lista (alto volume)
  const LIST_ONLY_CATEGORIES = new Set([
    "pos-graduacao",
    "profissionalizantes",
    "profissionalizantes-premium",
    "profissionalizantes-avancado",
    "profissionalizantes-comum",
  ]);
  const isListOnly = LIST_ONLY_CATEGORIES.has(category);
  const isAll = category === "all";
  const effectiveViewMode: ViewMode = isListOnly ? "list" : viewMode;

  // Sync state with URL changes
  useEffect(() => {
    const fromUrl = searchParams.get("categoria") ?? "all";
    setCategory(fromUrl);
    setQuery(searchParams.get("q") ?? "");
    setPage(1);
    if (LIST_ONLY_CATEGORIES.has(fromUrl)) {
      setViewMode("list");
    }
  }, [searchParams]);

  // Reset page when query changes
  useEffect(() => {
    setPage(1);
  }, [query]);

  const handleCategory = (slug: string) => {
    setCategory(slug);
    const next = new URLSearchParams(searchParams);
    if (slug === "all") next.delete("categoria");
    else next.set("categoria", slug);
    setSearchParams(next, { replace: true });
  };

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchCategory = category === "all"
        ? !LIST_ONLY_CATEGORIES.has(c.category)
        : c.category === category;
      const matchQuery = c.name.toLowerCase().includes(query.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [category, query, courses]);

  // Listas fixas exibidas quando "Todas" está selecionado
  const profissionalizantesPremiumList = useMemo(
    () =>
      courses.filter(
        (c) =>
          c.category === "profissionalizantes-premium" &&
          c.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [courses, query],
  );
  const profissionalizantesAvancadoList = useMemo(
    () =>
      courses.filter(
        (c) =>
          c.category === "profissionalizantes-avancado" &&
          c.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [courses, query],
  );
  const profissionalizantesComumList = useMemo(
    () =>
      courses.filter(
        (c) =>
          c.category === "profissionalizantes-comum" &&
          c.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [courses, query],
  );
  const posGraduacaoList = useMemo(
    () =>
      courses.filter(
        (c) =>
          c.category === "pos-graduacao" &&
          c.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [courses, query],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage],
  );

  const goToPage = (p: number) => {
    const next = Math.min(Math.max(1, p), totalPages);
    setPage(next);
    const target = document.getElementById("resultados");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Compact page list (max 7 entries with ellipsis)
  const pageList = useMemo<(number | "...")[]>(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push("...");
    pages.push(totalPages);
    return pages;
  }, [currentPage, totalPages]);

  const allChips = [{ slug: "all", label: "Todas" }, ...categoryOptions];

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Header />
      <SubNav />
      <main>
        {/* HERO with background image */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${cursosHero})` }}
          />
          <div aria-hidden className="absolute inset-0 bg-white/70" />
          <div className="container relative py-14 md:py-20">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="font-display text-4xl font-extrabold leading-tight text-foreground md:text-6xl">
                Nossos Cursos
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-base text-foreground/80 md:text-lg">
                Explore nosso catálogo completo e encontre o curso ideal para transformar sua carreira. Todos os cursos são reconhecidos pelo MEC.
              </p>

              <div className="relative mt-8">
                <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
                <Input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Pesquisar curso por nome..."
                  aria-label="Buscar curso"
                  className="h-14 rounded-2xl border-2 border-primary/60 bg-card pl-14 pr-5 text-base text-foreground shadow-card placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FILTERS + RESULTS */}
        <section id="resultados" className="bg-background py-6 md:py-8">
          <div className="container">
            {/* Category chips - compact */}
            <div
              className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
              role="tablist"
              aria-label="Filtrar por categoria"
            >
              {allChips.map((opt) => {
                const isActive = category === opt.slug;
                return (
                  <button
                    key={opt.slug}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => handleCategory(opt.slug)}
                    className={cn(
                      "shrink-0 cursor-pointer rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-secondary hover:text-primary",
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Results count + view toggle */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                {filtered.length}{" "}
                {filtered.length === 1 ? "curso encontrado" : "cursos encontrados"}
                {effectiveViewMode === "cards" && filtered.length > PAGE_SIZE && (
                  <span> · Página {currentPage} de {totalPages}</span>
                )}
              </p>

              {!isListOnly && (
                <div
                  className="inline-flex items-center rounded-full border border-border bg-card p-1 shadow-soft"
                  role="tablist"
                  aria-label="Modo de visualização"
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={viewMode === "cards"}
                    onClick={() => setViewMode("cards")}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                      viewMode === "cards"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                    Cards
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={viewMode === "list"}
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                      viewMode === "list"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <ListIcon className="h-3.5 w-3.5" />
                    Lista
                  </button>
                </div>
              )}
            </div>

            {/* Results */}
            <div className="mt-5 space-y-10">
              {effectiveViewMode === "list" ? (
                filtered.length === 0 ? (
                  <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
                    <p className="font-display text-lg font-semibold text-foreground">
                      Nenhum curso encontrado
                    </p>
                    <p className="mt-2 text-muted-foreground">
                      Tente ajustar a busca ou selecionar outra categoria.
                    </p>
                  </div>
                ) : (
                  <CourseList
                    title={
                      categoryOptions.find((c) => c.slug === category)?.label ?? "Cursos"
                    }
                    courses={filtered}
                  />
                )
              ) : (
                <>
                  {filtered.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {paginated.map((course) => (
                        <CourseCard key={course.id} course={course} />
                      ))}
                    </div>
                  ) : (
                    (!isAll || (profissionalizantesPremiumList.length === 0 && profissionalizantesAvancadoList.length === 0 && profissionalizantesComumList.length === 0 && posGraduacaoList.length === 0)) && (
                      <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
                        <p className="font-display text-lg font-semibold text-foreground">
                          Nenhum curso encontrado
                        </p>
                        <p className="mt-2 text-muted-foreground">
                          Tente ajustar a busca ou selecionar outra categoria.
                        </p>
                      </div>
                    )
                  )}

                  {/* Pagination (cards only) — entre a grid e as listas */}
                  {totalPages > 1 && (
                    <nav
                      className="flex flex-wrap items-center justify-center gap-2"
                      aria-label="Paginação"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="gap-1"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Anterior
                      </Button>

                      <div className="flex items-center gap-1">
                        {pageList.map((p, idx) =>
                          p === "..." ? (
                            <span
                              key={`ellipsis-${idx}`}
                              className="px-2 text-sm text-muted-foreground"
                            >
                              …
                            </span>
                          ) : (
                            <button
                              key={p}
                              type="button"
                              onClick={() => goToPage(p)}
                              aria-current={p === currentPage ? "page" : undefined}
                              className={cn(
                                "h-9 min-w-9 rounded-md border px-3 text-sm font-medium transition-colors",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
                                p === currentPage
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-secondary hover:text-primary",
                              )}
                            >
                              {p}
                            </button>
                          ),
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="gap-1"
                      >
                        Próximo
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </nav>
                  )}

                  {isAll && profissionalizantesPremiumList.length > 0 && (
                    <CourseList
                      title="Profissionalizantes Premium"
                      courses={profissionalizantesPremiumList}
                    />
                  )}
                  {isAll && profissionalizantesAvancadoList.length > 0 && (
                    <CourseList
                      title="Profissionalizantes Avançado"
                      courses={profissionalizantesAvancadoList}
                    />
                  )}
                  {isAll && profissionalizantesComumList.length > 0 && (
                    <CourseList
                      title="Profissionalizantes Comum"
                      courses={profissionalizantesComumList}
                    />
                  )}
                  {isAll && posGraduacaoList.length > 0 && (
                    <CourseList
                      title="Pós-Graduação"
                      courses={posGraduacaoList}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default Cursos;
