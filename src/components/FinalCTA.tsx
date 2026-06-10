import { CheckCircle2 } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";

const FinalCTA = () => {
  return (
    <section className="bg-gradient-cta py-20 text-primary-foreground md:py-28">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Sua nova carreira começa hoje</p>
          <h2 className="mt-3 font-display text-3xl font-bold leading-tight md:text-5xl">
            Dê o primeiro passo rumo ao seu diploma técnico
          </h2>
          <p className="mt-5 text-lg text-primary-foreground/85 md:text-xl">
            Fale agora com um consultor pelo WhatsApp e tire todas as suas dúvidas.
            Atendimento humanizado, sem compromisso.
          </p>

          <ul className="mx-auto mt-8 grid max-w-xl gap-3 text-left sm:grid-cols-2">
            {[
              "Matrícula 100% online",
              "Sem taxa de adesão",
              "Mensalidades acessíveis",
              "Diploma reconhecido nacionalmente",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-primary-foreground/90">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col items-center gap-4">
            <WhatsAppButton
              variant="large"
              message="Olá! Quero garantir minha vaga em um curso técnico EAD."
            >
              Quero garantir minha vaga
            </WhatsAppButton>
            <p className="text-sm text-primary-foreground/70">
              Resposta em poucos minutos durante o horário comercial
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
