# Vexom Site (estático)

Site institucional estático da Vexom (HTML + CSS + JS), com foco em SEO, catálogo de produtos e captação de orçamento.

## Estrutura
- `index.html`: página principal com SEO on-page, dados estruturados e catálogo.
- `styles.css`: estilos responsivos com identidade verde e branca.
- `script.js`: menu mobile, filtros do catálogo, busca e preenchimento automático de orçamento.
- `robots.txt` e `sitemap.xml`: suporte para indexação.

## Catálogo incluído
- Capela de PCR
- Capela para Exaustão de Gases
- Capela para Farmácia de Manipulação
- Capela de Fluxo Laminar Vertical e Horizontal
- Cabine de Segurança Biológica Classe II A1
- Cabine de Segurança Biológica Classe II A2
- Cabine de Segurança Biológica Classe II B2
- Equipamentos para Biotérios

## Como rodar localmente
```bash
python -m http.server 8080
```

Depois acesse: `http://localhost:8080`

## Publicação (quando comprar o domínio)
1. Compre o domínio (ex.: `vexom.com.br`).
2. Contrate hospedagem estática (Hostinger, Netlify, Vercel, Cloudflare Pages, etc.).
3. Envie os arquivos do projeto para a raiz do site.
4. Configure DNS do domínio para a hospedagem.
5. Ative HTTPS/SSL.
6. Ajuste os links em `index.html`, `robots.txt` e `sitemap.xml` se necessário.
7. Cadastre o domínio no Google Search Console e envie o `sitemap.xml`.
