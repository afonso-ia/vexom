# Vexom Site (estático)

Site institucional estático da Vexom (HTML + CSS + JS), pronto para subir em hospedagem simples.

## Estrutura
- `index.html`: página principal com SEO on-page e dados estruturados.
- `styles.css`: estilos responsivos.
- `script.js`: menu mobile e simulação de envio do formulário.
- `robots.txt` e `sitemap.xml`: suporte para indexação.

## Como rodar localmente
Você pode abrir o `index.html` diretamente no navegador, ou usar um servidor local:

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

## Próximos passos recomendados de SEO
- Criar páginas individuais de produto (uma URL por produto).
- Publicar conteúdos de blog para palavras-chave de cauda longa.
- Integrar formulário com WhatsApp API ou e-mail real.
- Adicionar Google Analytics 4 e Google Tag Manager.
