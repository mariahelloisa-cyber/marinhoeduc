# Deploy no Cloudflare Pages

## 1. Variáveis de ambiente (obrigatório)

No painel do Cloudflare Pages → **Settings → Environment variables**, adicione (Production **e** Preview):

```
VITE_SUPABASE_URL=<valor do seu .env>
VITE_SUPABASE_PUBLISHABLE_KEY=<valor do seu .env>
VITE_SUPABASE_PROJECT_ID=<valor do seu .env>
```

Copie os valores exatos do arquivo `.env` local.

## 2. Configuração de build

No Cloudflare Pages → **Create project → Connect to Git** (ou direct upload):

- **Framework preset:** Vite
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Node version:** 20 (em *Environment variables* adicione `NODE_VERSION=20`)
- **Root directory:** (deixe em branco)

## 3. Arquivos já configurados

- `public/_redirects` → SPA fallback (rotas do React Router funcionam em refresh/deep link)
- `public/_headers` → cache de assets + headers de segurança
- `wrangler.toml` → para deploy via CLI (`npx wrangler pages deploy dist`)

## 4. Deploy via CLI (alternativa ao Git)

```bash
npm install -g wrangler
npm run build
wrangler pages deploy dist --project-name=marinho-novo
```

## 5. Domínio customizado

Após o primeiro deploy: **Custom domains → Set up a custom domain** no painel do Cloudflare Pages. SSL é automático.

## 6. Backend (Lovable Cloud / Supabase)

O backend continua funcionando normalmente — ele é independente do hosting. Apenas garanta que as variáveis `VITE_*` foram preenchidas no passo 1.
