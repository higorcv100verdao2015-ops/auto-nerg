# Auto&Nerg

Sistema React + Vite para gestao da Auto&Nerg.

## Rodar local

```bash
npm install
npm run dev
```

## Banco online

1. Crie um projeto no Supabase.
2. Rode o SQL do arquivo `supabase-clientes.sql` no SQL Editor do Supabase.
3. Crie um arquivo `.env` com base no `.env.example`.

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

## Deploy no Render

O projeto ja tem um `render.yaml` para deploy como Static Site.

1. Suba este projeto para um repositorio GitHub.
2. No Render, escolha **New > Blueprint** e conecte o repositorio.
3. O Render vai ler o `render.yaml`.
4. Preencha as variaveis:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Clique em deploy.

Como alternativa, crie manualmente um **Static Site** no Render:

- Build Command: `npm ci && npm run build`
- Publish Directory: `dist`
- Rewrite: `/*` para `/index.html`
