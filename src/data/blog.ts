export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  author: string;
  tag: string;
  image: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "golpes-mercado-educacional",
    title: "Golpes no mercado educacional: por que escolher uma instituição séria faz toda a diferença",
    excerpt:
      "Os golpes no mercado educacional têm se tornado uma preocupação crescente, especialmente com a expansão da educação a distância no Brasil. Promessas de diplomas rápidos, cursos sem reconhecimento e instituições fantasmas enganam milhares de estudantes todos os anos.",
    date: "10 de mar. de 2026",
    readTime: "5 min",
    author: "Marketing",
    tag: "Notícias",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "nova-era-educacional",
    title: "Marinho Educacional entra em uma nova era educacional com expansão de polos pelo Brasil",
    excerpt:
      "A Marinho Educacional Educacional chega com um propósito claro: gerar oportunidades reais com segurança, credibilidade e crescimento para toda a comunidade. Junto a parceiros estratégicos, a instituição amplia seu alcance.",
    date: "10 de mar. de 2026",
    readTime: "3 min",
    author: "Marketing",
    tag: "Notícias",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "novo-embaixador",
    title: "Novo embaixador da Marinho Educacional: conheça quem representa nossa instituição!",
    excerpt:
      "Depois de contar com nomes de grande destaque, a Marinho Educacional dá mais um passo importante e anuncia agora um dos maiores embaixadores educacionais do país, reforçando seu compromisso com qualidade.",
    date: "09 de mar. de 2026",
    readTime: "5 min",
    author: "Marketing",
    tag: "Notícias",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "dicas-ead",
    title: "5 dicas essenciais para ter sucesso estudando na modalidade EAD",
    excerpt:
      "A educação a distância exige disciplina e organização. Confira dicas práticas para aproveitar ao máximo os estudos online, manter o foco e conquistar excelentes resultados acadêmicos.",
    date: "05 de mar. de 2026",
    readTime: "4 min",
    author: "Marketing",
    tag: "Dicas",
    image:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "mercado-trabalho-tecnico",
    title: "Cursos técnicos: a porta de entrada rápida para o mercado de trabalho",
    excerpt:
      "Os cursos técnicos seguem em alta no Brasil, oferecendo formação prática e rápida inserção profissional. Entenda por que esta modalidade é uma das mais procuradas por jovens e adultos.",
    date: "28 de fev. de 2026",
    readTime: "6 min",
    author: "Marketing",
    tag: "Carreira",
    image:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "pos-graduacao-vale-pena",
    title: "Pós-graduação vale a pena? Entenda os benefícios para sua carreira",
    excerpt:
      "Investir em uma pós-graduação pode abrir novas portas profissionais e aumentar significativamente o salário. Descubra as vantagens e como escolher a melhor especialização.",
    date: "20 de fev. de 2026",
    readTime: "7 min",
    author: "Marketing",
    tag: "Educação",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80&auto=format&fit=crop",
  },
];
