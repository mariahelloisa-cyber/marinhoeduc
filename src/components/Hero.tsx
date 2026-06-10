import { useEffect, useMemo, useState } from "react";
import { ShieldCheck, Clock, Headphones, Award, GraduationCap, Users, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePublicHero } from "@/hooks/usePublicHero";
import { cn } from "@/lib/utils";
import heroGraduate from "@/assets/hero-student.png.asset.json";

const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const renderTitle = (title: string) => {
  const parts = title.split(/(<highlight>.*?<\/highlight>)/g);
  return parts.map((p, i) => {
    const m = p.match(/^<highlight>(.*?)<\/highlight>$/);
    if (m)
      return (
        <span key={i} className="font-display italic" style={{ color: "hsl(var(--accent))" }}>
          {m[1]}
        </span>
      );
    return <span key={i}>{p}</span>;
  });
};

const Hero = () => {
  const { data } = usePublicHero();

  const badge = data?.badge ?? "Diploma reconhecido nacionalmente";
  const titleRaw =
    data?.title ?? "Conquiste seu diploma mais rápido <highlight>do que você imagina</highlight>";
  const subtitle =
    data?.subtitle ?? "Cursos reconhecidos, 100% online\ne com foco no mercado de trabalho.";
  const primaryLabel = data?.primary_button_label ?? "Ver cursos disponíveis";
  const primaryTarget = data?.primary_button_target ?? "cursos";
  const secondaryLabel = data?.secondary_button_label ?? "Saiba mais";
  const secondaryTarget = data?.secondary_button_target ?? "beneficios";

  const slides = useMemo(() => {
    const main = data?.background_image_url || heroGraduate.url;
    const extras = (data?.extra_image_urls ?? []).filter(Boolean);
    return [main, ...extras];
  }, [data?.background_image_url, data?.extra_image_urls]);

  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => {
      setSlide((s) => (s + 1) % slides.length);
    }, 6000);
    return () => clearInterval(id);
  }, [slides.length]);

  const currentImage = slides[slide % Math.max(slides.length, 1)] || heroGraduate.url;

  const checks = [
    { icon: ShieldCheck, label: "Certificação", sub: "válida em todo Brasil" },
    { icon: Clock, label: "Estude", sub: "no seu ritmo" },
    { icon: Headphones, label: "Suporte", sub: "especializado" },
  ];

  const stats = [
    { icon: GraduationCap, value: "+200", label: "Cursos disponíveis" },
    { icon: Users, value: "+120 mil", label: "Alunos formados" },
    { icon: Star, value: "4,9/5", label: "Avaliação dos alunos" },
    { icon: ShieldCheck, value: "100%", label: "Online e reconhecido" },
  ];

  const goPrev = () => setSlide((s) => (s - 1 + slides.length) % slides.length);
  const goNext = () => setSlide((s) => (s + 1) % slides.length);

  return (
    <section id="topo" className="relative bg-background text-foreground overflow-hidden">
      <div
        className="absolute inset-0 bg-no-repeat bg-right bg-contain pointer-events-none"
        style={{ backgroundImage: `url(${currentImage})` }}
        aria-hidden
      />


      <div className="container relative pt-4 pb-12 md:pt-6 md:pb-16 min-h-[480px] md:min-h-[520px]">
        <div className="max-w-xl space-y-4 animate-fade-in">
          {badge && (
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-accent bg-background/70 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-foreground">
              <Award className="h-4 w-4 text-accent" />
              {badge}
            </span>
          )}

          <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {renderTitle(titleRaw)}
          </h1>

          <p className="max-w-md whitespace-pre-line text-base text-muted-foreground md:text-lg">
            {subtitle}
          </p>

          <ul className="flex flex-wrap gap-6">

            {checks.map(({ icon: Icon, label, sub }) => (
              <li key={label} className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-accent text-accent">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold leading-tight">
                  {label}
                  <br />
                  <span className="font-normal text-muted-foreground">{sub}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 pt-1 sm:flex-row">
            <Button
              size="lg"
              onClick={() => scrollToSection(primaryTarget)}
              className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-md font-bold shadow-cta"
            >
              {primaryLabel}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection(secondaryTarget)}
              className="border-2 border-foreground/80 bg-transparent text-foreground hover:bg-foreground/5 rounded-md font-bold"
            >
              {secondaryLabel}
            </Button>
          </div>
        </div>

        {slides.length > 1 && (
          <>
            <button
              onClick={goPrev}
              aria-label="Slide anterior"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-foreground shadow-md hover:bg-background transition"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goNext}
              aria-label="Próximo slide"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-foreground shadow-md hover:bg-background transition"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  aria-label={`Ir para slide ${i + 1}`}
                  className={cn(
                    "h-2 w-2 rounded-full transition-colors",
                    i === slide % slides.length ? "bg-accent" : "bg-foreground/30",
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Stats card overlapping bottom */}
      <div className="container relative">
        <div className="absolute inset-x-0 -bottom-10 mx-auto max-w-6xl rounded-2xl bg-card text-card-foreground shadow-card-hover ring-1 ring-border">
          <div className="grid divide-y divide-border md:grid-cols-4 md:divide-x md:divide-y-0">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-4 px-6 py-5">
                <Icon className="h-9 w-9 shrink-0 text-accent" />
                <div>
                  <div className="font-display text-2xl font-extrabold leading-none">{value}</div>
                  <div className="text-sm text-muted-foreground">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="h-12 bg-background" />
    </section>
  );
};

export default Hero;
