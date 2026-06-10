import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "./WhatsAppButton";
import { usePublicContact } from "@/hooks/usePublicContact";

const FloatingWhatsApp = () => {
  const { data: contact } = usePublicContact();
  return (
    <a
      href={buildWhatsAppLink("Olá! Gostaria de mais informações sobre os cursos técnicos EAD.", contact?.phone_whatsapp)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-cta animate-pulse-soft hover:bg-whatsapp-hover transition-colors md:h-16 md:w-16"
    >
      <MessageCircle className="h-7 w-7 md:h-8 md:w-8" strokeWidth={2.25} />
    </a>
  );
};

export default FloatingWhatsApp;
