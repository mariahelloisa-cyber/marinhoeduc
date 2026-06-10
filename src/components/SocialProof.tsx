import { Star, Quote, ShieldCheck, Award, Users, ThumbsUp } from "lucide-react";
import { usePublicTestimonials, DEFAULT_TESTIMONIALS } from "@/hooks/usePublicTestimonials";

const trustItems = [
  { icon: Users, value: "+15.000", label: "Alunos formados" },
  { icon: ShieldCheck, value: "100%", label: "Diploma reconhecido" },
  { icon: Award, value: "12 anos", label: "De experiência em EAD" },
  { icon: ThumbsUp, value: "4.9/5", label: "Avaliação dos alunos" },
];

const SocialProof = () => {
  const { data } = usePublicTestimonials();
  const testimonials = data?.items?.length ? data.items : DEFAULT_TESTIMONIALS.items;

  return (
    <section id="depoimentos" className="bg-secondary py-20 md:py-28">
      <div className="container">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map(({ icon: Icon, value, label }) => (
            <div key={label} className="rounded-xl border border-border bg-card p-6 text-center shadow-soft">
              <Icon className="mx-auto h-8 w-8 text-primary" strokeWidth={1.75} />
              <p className="mt-3 font-display text-2xl font-bold text-primary md:text-3xl">{value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Quem já transformou a carreira</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">
            Histórias reais de quem conquistou um novo futuro
          </h2>
        </div>

        <div className="mt-12 grid gap-7 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <article
              key={`${t.name}-${i}`}
              className="relative flex flex-col rounded-xl border border-border bg-card p-7 shadow-card"
            >
              <Quote className="absolute right-6 top-6 h-8 w-8 text-primary/10" />
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star key={idx} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="mt-4 flex-1 leading-relaxed text-foreground">"{t.text}"</p>
              <div className="mt-6 border-t border-border pt-5">
                <p className="font-display font-semibold text-foreground">{t.name}</p>
                <p className="text-sm text-muted-foreground">{t.role} • {t.city}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
