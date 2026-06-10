import { useState } from "react";
import { ExternalLink, User } from "lucide-react";
import Header from "@/components/Header";
import SubNav from "@/components/SubNav";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildWhatsAppLink } from "@/components/WhatsAppButton";
import { usePublicContact } from "@/hooks/usePublicContact";

interface PlatformCardProps {
  title: string;
  href: string;
  variant: "primary" | "secondary";
}

const PlatformCard = ({ title, href, variant }: PlatformCardProps) => {
  const bg =
    variant === "primary"
      ? "bg-primary text-primary-foreground"
      : "bg-[hsl(265_55%_22%)] text-primary-foreground";

  return (
    <div
      className={`flex flex-col items-center justify-center gap-6 px-6 py-14 text-center md:py-20 ${bg}`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
        <User className="h-8 w-8" aria-hidden="true" />
      </div>
      <h2 className="font-display text-base font-bold uppercase leading-snug md:text-lg max-w-xs">
        {title}
      </h2>
      <Button
        asChild
        size="lg"
        className="rounded-full bg-orange-500 px-8 text-sm font-bold uppercase text-white hover:bg-orange-600"
      >
        <a href={href} target="_blank" rel="noreferrer">
          Acesse <ExternalLink className="ml-1 h-4 w-4" />
        </a>
      </Button>
    </div>
  );
};

const COURSE_OPTIONS = [
  "Graduação",
  "Licenciatura",
  "Pós Graduação",
  "MBA",
];

const IndicacaoForm = () => {
  const { data: contact } = usePublicContact();
  const [nome, setNome] = useState("");
  const [amigo, setAmigo] = useState("");
  const [telefone, setTelefone] = useState("");
  const [curso, setCurso] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = nome.trim().slice(0, 100);
    const a = amigo.trim().slice(0, 100);
    const t = telefone.trim().slice(0, 30);
    if (!n || !a || !t || !curso) return;
    const message =
      `Olá! Quero indicar um amigo e ganhar um curso.\n\n` +
      `*Meu nome:* ${n}\n` +
      `*Nome do amigo:* ${a}\n` +
      `*Telefone do amigo:* ${t}\n` +
      `*Curso desejado:* ${curso}`;
    window.open(buildWhatsAppLink(message, contact?.phone_whatsapp), "_blank", "noopener,noreferrer");
  };

  return (
    <form className="mx-auto mt-8 space-y-4" onSubmit={handleSubmit}>
      <Input
        placeholder="Seu Nome Completo*"
        required
        maxLength={100}
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        className="h-14 rounded-md bg-background"
      />
      <Input
        placeholder="Nome do Seu Amigo*"
        required
        maxLength={100}
        value={amigo}
        onChange={(e) => setAmigo(e.target.value)}
        className="h-14 rounded-md bg-background"
      />
      <Input
        placeholder="Telefone do Seu Amigo*"
        required
        maxLength={30}
        type="tel"
        value={telefone}
        onChange={(e) => setTelefone(e.target.value)}
        className="h-14 rounded-md bg-background"
      />
      <div>
        <label className="mb-2 block text-sm text-foreground">
          Escolha o curso de capacitação que deseja ganhar:
        </label>
        <select
          required
          value={curso}
          onChange={(e) => setCurso(e.target.value)}
          className="h-14 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
        >
          <option value="" disabled>
            —Selecione uma opção—
          </option>
          {COURSE_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <Button
        type="submit"
        className="h-14 w-full rounded-md bg-orange-500 text-base font-bold uppercase tracking-wider text-white hover:bg-orange-600"
      >
        Enviar
      </Button>
    </form>
  );
};
const AreaAluno = () => {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Header />
      <SubNav />

      <main>
        {/* Title */}
        <section className="container py-12 text-center md:py-16">
          <h1 className="font-display text-4xl font-extrabold text-[hsl(215_75%_30%)] md:text-6xl uppercase">
            Área do Aluno
          </h1>
          <p className="mt-4 text-base italic text-muted-foreground md:text-lg">
            Faça seu login e comece já seus estudos
          </p>
        </section>

        {/* Platforms */}
        <section className="grid grid-cols-1 md:grid-cols-2">
          <PlatformCard
            variant="primary"
            title="Plataforma Segunda Licenciatura Formação Pedagógica R2 Graduação"
            href="https://www.faculdadeeducamais.edu.br/acesso-aluno.php"
          />
          <PlatformCard
            variant="secondary"
            title="Plataforma Pós Graduação"
            href="https://virtualead.com.br/sistema/login/geracaoead"
          />
        </section>

        {/* Indique um amigo */}
        <section className="bg-muted/40 py-16 md:py-24">
          <div className="container max-w-3xl">
            <h2 className="text-center font-display text-3xl font-extrabold text-primary md:text-4xl">
              QUER GANHAR UM CURSO? É SIMPLES!
            </h2>

            <div className="mx-auto mt-8 max-w-2xl space-y-3 text-center text-sm text-muted-foreground md:text-base">
              <p>
                <strong className="text-foreground">Passo 1:</strong> Preencha o
                formulário abaixo indicando um amigo e escolhendo o curso de
                capacitação que você quer ganhar.
              </p>
              <p>
                <strong className="text-foreground">Passo 2:</strong> Entraremos
                em contato com o seu amigo apresentando nossos cursos de:
                Graduação, Licenciatura, Pós Graduação ou MBA.
              </p>
              <p>
                <strong className="text-foreground">Passo 3:</strong> Seu amigo
                realizando a matrícula, você ganha o curso que escolheu.
              </p>
            </div>

            <p className="mt-6 text-center font-semibold text-foreground">
              Já escolheu qual amigo irá indicar? Conte para nós!
            </p>

            <IndicacaoForm />
          </div>
        </section>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default AreaAluno;
