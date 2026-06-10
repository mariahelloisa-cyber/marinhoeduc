import saude from "@/assets/areas/saude.jpg";
import tecnologia from "@/assets/areas/tecnologia.jpg";
import gestao from "@/assets/areas/gestao.jpg";
import construcao from "@/assets/areas/construcao.jpg";
import direito from "@/assets/areas/direito.jpg";
import educacao from "@/assets/areas/educacao.jpg";
import logistica from "@/assets/areas/logistica.jpg";
import industria from "@/assets/areas/industria.jpg";
import estetica from "@/assets/areas/estetica.jpg";
import gastronomia from "@/assets/areas/gastronomia.jpg";
import agro from "@/assets/areas/agro.jpg";
import design from "@/assets/areas/design.jpg";
import geral from "@/assets/areas/geral.jpg";

/**
 * Mapeia palavras-chave do curso/área/categoria para uma foto temática.
 * Ordem importa — o primeiro match vence.
 */
const RULES: Array<{ match: RegExp; photo: string }> = [
  { match: /enferm|saude|saúde|medic|farma|fisio|odonto|nutri|cardio|cardía|hospital|clínic|radiolog|ssaude/i, photo: saude },
  { match: /inform|comput|software|program|desenvolv|sistemas|redes|cyber|dados|\bti\b|tecnologia da info/i, photo: tecnologia },
  { match: /direito|jurídic|juridic|advoc/i, photo: direito },
  { match: /constru|edific|civil|arquit|obras/i, photo: construcao },
  { match: /logís|logis|transp|supply|estoque/i, photo: logistica },
  { match: /elétri|eletri|mecân|mecan|industr|manuten|soldagem|metalúrg|metalurg/i, photo: industria },
  { match: /estétic|estetic|cabel|barbe|maquia|beleza/i, photo: estetica },
  { match: /gastro|cozinh|culin|chef|aliment|confeit/i, photo: gastronomia },
  { match: /agro|ambient|ecolog|sustent|veterin|zootec/i, photo: agro },
  { match: /design|moda|art|criati|public|market|comunic|foto|audiovis|vídeo|video/i, photo: design },
  { match: /pedagog|educ|ensino|profess|letras|idioma/i, photo: educacao },
  { match: /admin|gest|negóc|negoc|empreend|rh\b|recurs.*hum|contab|finanç|financ|economia|vendas/i, photo: gestao },
  { match: /segur.*trabalho|seguranca.*trabalho|sst/i, photo: construcao },
];

export const getAreaPhoto = (name: string, area?: string, category?: string): string => {
  const haystack = `${name} ${area ?? ""} ${category ?? ""}`;
  for (const { match, photo } of RULES) {
    if (match.test(haystack)) return photo;
  }
  return geral;
};
