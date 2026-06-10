import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { BookOpen, Clock, Layers, Tag, ArrowLeft, ListChecks } from "lucide-react";
import Header from "@/components/Header";
import SubNav from "@/components/SubNav";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import WhatsAppButton from "@/components/WhatsAppButton";
import { categoryOptions } from "@/data/courses";
import { usePublicCourses } from "@/hooks/usePublicData";
import { getAreaPhoto } from "@/lib/areaPhotos";

const ACADEMIC_CATEGORIES = new Set([
  "cursos-tecnicos",
  "tecnico-competencia",
  "pos-tecnico",
  "tecnologo",
  "bacharelado",
  "superior-sequencial",
  "mestrado",
]);

const CursoDetalhe = () => {
  const { id } = useParams<{ id: string }>();
  const { data: courses = [] } = usePublicCourses();
  const course = useMemo(() => courses.find((c) => c.id === id), [id, courses]);

  if (!course) {
    return (
      <div className="min-h-screen bg-background font-sans antialiased">
        <Header />
        <SubNav />
        <main className="container py-20 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Curso não encontrado
          </h1>
          <p className="mt-3 text-muted-foreground">
            O curso que você procura não existe ou foi removido.
          </p>
          <Link
            to="/cursos"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-cta transition-colors hover:bg-primary/90"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para cursos
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const categoryLabel =
    categoryOptions.find((c) => c.slug === course.category)?.label ?? "Curso";
  const isAcademic = ACADEMIC_CATEGORIES.has(course.category);
  const modalidade = "EAD";

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Header />
      <SubNav />
      <main>
        {/* HERO */}
        <section className="bg-gradient-hero text-primary-foreground">
          <div className="container py-10 md:py-14">
            <h1 className="font-display text-3xl font-bold uppercase leading-tight md:text-5xl">
              {course.name}
            </h1>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-primary-foreground/15 px-4 py-1.5 text-sm font-medium text-primary-foreground ring-1 ring-primary-foreground/20">
                {modalidade}
              </span>
              <span className="inline-flex items-center rounded-full bg-primary-foreground/15 px-4 py-1.5 text-sm font-medium text-primary-foreground ring-1 ring-primary-foreground/20">
                {course.name}
              </span>
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <section className="bg-secondary/40 py-10 md:py-14">
          <div className="container grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* LEFT */}
            <div className="space-y-6">
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
                <img
                  src={course.image ?? getAreaPhoto(course.name, course.area, course.category)}
                  alt={course.name}
                  loading="lazy"
                  width={1024}
                  height={640}
                  className="aspect-[16/9] w-full object-cover"
                />
              </div>

              <article className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
                <div className="flex items-center gap-2 text-primary">
                  <BookOpen className="h-5 w-5" />
                  <h2 className="font-display text-xl font-bold text-foreground md:text-2xl">
                    Sobre o Curso
                  </h2>
                </div>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  {course.description ??
                    `Conquiste seu certificado de ${course.name} por competência e dê o próximo passo na sua carreira com agilidade e reconhecimento.`}
                </p>
              </article>

              {course.curriculum && course.curriculum.trim() && (
                <article className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
                  <div className="flex items-center gap-2 text-primary">
                    <ListChecks className="h-5 w-5" />
                    <h2 className="font-display text-xl font-bold text-foreground md:text-2xl">
                      Grade Curricular
                    </h2>
                  </div>
                  <div className="mt-4 whitespace-pre-line leading-relaxed text-muted-foreground">
                    {course.curriculum}
                  </div>
                </article>
              )}
            </div>

            {/* RIGHT – INFO CARD */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-7">
                <h2 className="font-display text-xl font-bold text-foreground">
                  Informações do Curso
                </h2>
                <dl className="mt-5 space-y-5">
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Duração
                      </dt>
                      <dd className="font-semibold text-foreground">
                        {course.duration}
                      </dd>
                    </div>
                  </div>
                  {course.workload && (
                    <div className="flex items-start gap-3">
                      <Clock className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Carga Horária
                        </dt>
                        <dd className="font-semibold text-foreground">
                          {course.workload}
                        </dd>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <Layers className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Modalidade
                      </dt>
                      <dd className="font-semibold text-foreground">
                        {modalidade}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Tag className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Categoria
                      </dt>
                      <dd className="font-semibold text-foreground">
                        {categoryLabel}
                      </dd>
                    </div>
                  </div>
                  {course.curriculum && course.curriculum.trim() && (
                    <div className="flex items-start gap-3">
                      <ListChecks className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Grade Curricular
                        </dt>
                        <dd className="font-semibold text-foreground">
                          Disponível abaixo
                        </dd>
                      </div>
                    </div>
                  )}
                </dl>

                <WhatsAppButton
                  className="mt-6 w-full"
                  message={`Olá! Tenho interesse no curso ${course.name}. Gostaria de mais informações.`}
                >
                  {isAcademic ? "Quero ser Parceiro" : "Quero me inscrever"}
                </WhatsAppButton>

                <Link
                  to="/cursos"
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar para cursos
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default CursoDetalhe;
