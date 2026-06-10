import {
  GraduationCap,
  Stethoscope,
  Briefcase,
  HardHat,
  Truck,
  Laptop,
  Users,
  Scale,
  Building2,
  Wrench,
  Palette,
  Utensils,
  Plane,
  Leaf,
  HeartPulse,
  Calculator,
  BookOpen,
  Camera,
  Scissors,
  Megaphone,
  Hammer,
  FlaskConical,
  Cpu,
  Globe,
  Music,
  type LucideIcon,
} from "lucide-react";

/** Paleta de gradientes (HSL) — combina com a identidade visual */
const GRADIENTS: Array<{ from: string; via: string; to: string }> = [
  { from: "hsl(220 90% 56%)", via: "hsl(260 80% 60%)", to: "hsl(290 70% 55%)" }, // azul → roxo
  { from: "hsl(340 82% 58%)", via: "hsl(15 85% 60%)", to: "hsl(40 90% 60%)" },   // rosa → laranja
  { from: "hsl(160 70% 42%)", via: "hsl(180 65% 45%)", to: "hsl(200 75% 50%)" }, // verde → ciano
  { from: "hsl(265 75% 55%)", via: "hsl(295 65% 55%)", to: "hsl(330 75% 60%)" }, // roxo → magenta
  { from: "hsl(25 90% 55%)", via: "hsl(15 85% 55%)", to: "hsl(355 80% 55%)" },   // laranja → vermelho
  { from: "hsl(200 85% 50%)", via: "hsl(215 80% 55%)", to: "hsl(235 75% 60%)" }, // azul céu → índigo
  { from: "hsl(140 60% 42%)", via: "hsl(160 60% 40%)", to: "hsl(180 65% 42%)" }, // verde esmeralda
  { from: "hsl(280 65% 55%)", via: "hsl(310 65% 55%)", to: "hsl(340 70% 58%)" }, // violeta → rosa
  { from: "hsl(190 75% 45%)", via: "hsl(210 75% 50%)", to: "hsl(245 70% 58%)" }, // turquesa → azul
  { from: "hsl(45 90% 55%)", via: "hsl(30 90% 55%)", to: "hsl(15 85% 55%)" },    // amarelo → laranja
];

/** Mapa de palavras-chave → ícone (ordem importa: específico primeiro) */
const KEYWORD_ICONS: Array<{ match: RegExp; icon: LucideIcon }> = [
  { match: /enferm|saude|saúde|medic|farma|fisio|odonto|nutri/i, icon: Stethoscope },
  { match: /cardio|cardía|hospital|clínic/i, icon: HeartPulse },
  { match: /admin|gest|negóc|negoc|empreend/i, icon: Briefcase },
  { match: /segur.*trabalho|seguranca.*trabalho|sst/i, icon: HardHat },
  { match: /logís|logis|transp|supply/i, icon: Truck },
  { match: /inform|comput|software|program|desenvolv|tec.*infor/i, icon: Laptop },
  { match: /sistemas|redes|cyber|dados|ti\b/i, icon: Cpu },
  { match: /rh\b|recurs.*hum|pessoas/i, icon: Users },
  { match: /direito|jurídic|juridic|advoc/i, icon: Scale },
  { match: /constru|edific|civil|arquit/i, icon: Building2 },
  { match: /elétri|eletri|mecân|mecan|industr|manuten/i, icon: Wrench },
  { match: /design|moda|art|criati/i, icon: Palette },
  { match: /gastro|cozinh|culin|chef|aliment/i, icon: Utensils },
  { match: /turism|hotel|aviaç|aviac|aero/i, icon: Plane },
  { match: /agro|ambient|ecolog|sustent/i, icon: Leaf },
  { match: /contab|finanç|financ|economia/i, icon: Calculator },
  { match: /pedagog|educ|ensino|profess|letras/i, icon: BookOpen },
  { match: /foto|audiovis|vídeo|video|cinem/i, icon: Camera },
  { match: /estétic|estetic|cabel|barbe|maquia/i, icon: Scissors },
  { match: /market|public|comunic|vendas/i, icon: Megaphone },
  { match: /soldagem|metalúrg|metalurg|mecanic/i, icon: Hammer },
  { match: /quím|quim|biolog|laborat/i, icon: FlaskConical },
  { match: /idioma|inglês|ingles|espanhol/i, icon: Globe },
  { match: /músic|music|instrument/i, icon: Music },
];

/** Hash determinístico (string → int) */
const hashString = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
};

export interface CoursePlaceholderStyle {
  Icon: LucideIcon;
  gradient: { from: string; via: string; to: string };
  /** CSS background para o container */
  background: string;
  initials: string;
}

const getInitials = (name: string): string => {
  const words = name
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !/^(de|da|do|em|para|com|the|of)$/i.test(w));
  if (words.length === 0) return name.slice(0, 2).toUpperCase();
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

const pickIcon = (name: string, area?: string, category?: string): LucideIcon => {
  const haystack = `${name} ${area ?? ""} ${category ?? ""}`;
  for (const { match, icon } of KEYWORD_ICONS) {
    if (match.test(haystack)) return icon;
  }
  return GraduationCap;
};

/**
 * Gera uma identidade visual única (gradiente + ícone) determinística por curso.
 * Mesma entrada = mesmo resultado.
 */
export const getCoursePlaceholder = (
  seed: string,
  name: string,
  area?: string,
  category?: string,
): CoursePlaceholderStyle => {
  const hash = hashString(seed || name);
  const gradient = GRADIENTS[hash % GRADIENTS.length];
  const Icon = pickIcon(name, area, category);
  const angle = (hash % 6) * 30 + 120; // 120, 150, 180, 210, 240, 270

  const background = `linear-gradient(${angle}deg, ${gradient.from} 0%, ${gradient.via} 50%, ${gradient.to} 100%)`;

  return {
    Icon,
    gradient,
    background,
    initials: getInitials(name),
  };
};
