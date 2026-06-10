import { Clock, Wallet, Award, Laptop, Users, BookOpen } from "lucide-react";

const benefits = [
  {
    icon: Clock,
    title: "Conclusão Rápida",
    description: "Forme-se em até 18 meses, no seu próprio ritmo, conciliando com o trabalho.",
  },
  {
    icon: Wallet,
    title: "Mensalidades Acessíveis",
    description: "Planos a partir de R$ 89,90 sem taxa de matrícula e sem surpresas.",
  },
  {
    icon: Award,
    title: "Reconhecimento Nacional",
    description: "Diploma válido em todo o território brasileiro, aceito por empresas e concursos.",
  },
  {
    icon: Laptop,
    title: "100% Online",
    description: "Aulas, materiais e provas pela internet. Estude pelo celular, tablet ou computador.",
  },
  {
    icon: Users,
    title: "Suporte Dedicado",
    description: "Tutoria especializada e atendimento humanizado durante toda a sua jornada.",
  },
  {
    icon: BookOpen,
    title: "Material Incluso",
    description: "Apostilas digitais, videoaulas e biblioteca virtual sem custo adicional.",
  },
];

const Benefits = () => {
  return (
    <section id="beneficios" className="bg-secondary py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Por que estudar conosco</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">
            Vantagens pensadas para quem trabalha e quer crescer
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Estrutura completa para que você conquiste seu diploma técnico sem abrir mão da sua rotina.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="group rounded-xl border border-border bg-card p-7 shadow-soft transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-6 w-6" strokeWidth={2} />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-foreground">{title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
