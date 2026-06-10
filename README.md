# Marinho Educacional

Aplicação web em React + Vite + TypeScript + Tailwind, com backend Lovable Cloud (Supabase).

## Rodando localmente no VS Code

Pré-requisitos: Node.js 18+ e npm (ou bun).

```bash
# 1. Instalar dependências
npm install

# 2. Criar arquivo de ambiente
cp .env.example .env
# edite .env e preencha VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, VITE_SUPABASE_PROJECT_ID

# 3. Rodar em modo desenvolvimento
npm run dev
```

O servidor sobe em http://localhost:5173

## Scripts disponíveis

- `npm run dev` — inicia o Vite em modo desenvolvimento (porta 5173)
- `npm run build` — gera build de produção em `dist/`
- `npm run preview` — serve o build de produção localmente
- `npm run lint` — roda o ESLint
- `npm test` — roda os testes (Vitest)

## Variáveis de ambiente

Veja `.env.example`. As três variáveis são publicáveis (anon key) e podem ir para o front-end.
Sem elas o cliente Supabase não inicializa e o site mostra tela branca — sempre crie o `.env` antes de rodar.
