import { Mail, Phone, MapPin } from "lucide-react";
import { usePublicContact, DEFAULT_CONTACT } from "@/hooks/usePublicContact";
import logoMarinho from "@/assets/logo-marinho.png";

const Footer = () => {
  const { data } = usePublicContact();
  const contact = data ?? DEFAULT_CONTACT;
  return (
    <footer className="bg-primary py-14 text-primary-foreground">
      <div className="container">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-3">
             <img src={logoMarinho} alt="Marinho Educacional" className="h-14 w-14 rounded-md bg-white/5 object-contain p-1" />
              <div>
                <p className="font-display text-2xl font-bold tracking-wide text-accent">MARINHO EDUCACIONAL</p>
                <p className="text-xs text-primary-foreground/70">Educação que transforma</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-primary-foreground/75">
              Instituição dedicada à excelência educacional, formando profissionais
              preparados para o mercado com diplomas reconhecidos em todo o Brasil.
            </p>
          </div>

          <div>
            <h3 className="font-display text-xl font-semibold text-accent">Contato</h3>
            <ul className="mt-4 space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-accent" />
                <span>{contact.phone_display}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-accent" />
                <span>{contact.email}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-accent" />
                <span>{contact.location}</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 border-t border-accent/20 pt-6 text-center text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} Marinho Educacional. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
