import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePublicContact, DEFAULT_CONTACT } from "@/hooks/usePublicContact";

interface WhatsAppButtonProps {
  message?: string;
  variant?: "default" | "large" | "compact";
  className?: string;
  children?: React.ReactNode;
}

export const buildWhatsAppLink = (message: string, number?: string) => {
  const n = (number ?? DEFAULT_CONTACT.phone_whatsapp).replace(/\D/g, "");
  return `https://wa.me/${n}?text=${encodeURIComponent(message)}`;
};

const WhatsAppButton = ({
  message = "Olá! Tenho interesse nos cursos técnicos EAD.",
  variant = "default",
  className,
  children,
}: WhatsAppButtonProps) => {
  const { data: contact } = usePublicContact();
  const sizes = {
    default: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg",
    compact: "px-5 py-2.5 text-sm",
  };

  return (
    <a
      href={buildWhatsAppLink(message, contact?.phone_whatsapp)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-2.5 rounded-lg font-semibold",
        "bg-whatsapp text-whatsapp-foreground shadow-cta",
        "hover:bg-whatsapp-hover hover:-translate-y-0.5",
        "transition-[transform,background-color,box-shadow] duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp focus-visible:ring-offset-2",
        sizes[variant],
        className,
      )}
    >
      <MessageCircle className="h-5 w-5" strokeWidth={2.25} />
      {children ?? "Falar no WhatsApp"}
    </a>
  );
};

export default WhatsAppButton;
