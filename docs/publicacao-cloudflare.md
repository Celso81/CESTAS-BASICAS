# Publicação na Cloudflare — 12/09/2026

## Hospedagem publicada

- Projeto Cloudflare Pages: **cestas-populares**, na conta **CESTAS BASICAS**.
- Endereço acessível e verificado: **https://cestas-populares.pages.dev/**.
- Repositório: https://github.com/Celso81/CESTAS-BASICAS; branch **main**.
- Primeiro código publicado: commit **3f4bf63**.
- Integração Git autorizada por Celso. Commits em `main` disparam build e publicação.
- Framework **None**, raiz do repositório, saída **dist**, variável **NODE_VERSION=22**.
- Build: `npm run build && npm run check && npm test`; concluído com sucesso pela Cloudflare.
- O site continua em **prévia comercial**, com `noindex, nofollow`, catálogo vazio e condições sob consulta, conforme o briefing. Hospedagem publicada não significa liberação de indexação.

## Domínio próprio: ativação pendente

- Domínio: `cestaspopulares.com.br`.
- Nameservers informados pela conta e encontrados na consulta DNS: `andronicus.ns.cloudflare.com` e `riya.ns.cloudflare.com`.
- Zona Cloudflare ainda em **pending** na verificação de 12/09/2026. Foi acionado **Check nameservers now**; a Cloudflare informou que fará a verificação e que a atualização pode levar algumas horas.
- Criados dois registros **CNAME**, ambos com proxy e TTL automático: `@` e `www`, destino `cestas-populares.pages.dev`. Não havia registros anteriores nessa zona.
- `www.cestaspopulares.com.br` cadastrado em Custom domains; verificação DNS iniciada, ainda pendente.
- O cadastro do domínio principal no Pages depende da ativação da zona. O painel ainda solicita concluir a transferência DNS antes de permitir esse vínculo.
- **Always Use HTTPS** ativado.
- Regra **WWW para dominio principal** ativa: condição `(http.host eq "www.cestaspopulares.com.br")`, destino `concat("https://cestaspopulares.com.br", http.request.uri.path)`, status **301**, preservação da query ativada.
- O domínio próprio ainda apresentou falha no handshake TLS; certificado e redirecionamentos públicos ainda não estão comprovados.

## Verificação da publicação

Em `cestas-populares.pages.dev`: sete páginas de conteúdo retornaram **200**, URL inexistente retornou **404 com a página de erro**, imagem WebP retornou **200** (215.872 bytes), `robots.txt` e `sitemap.xml` retornaram **200**. Conferidos títulos, canonical para o domínio principal e WhatsApp **(81) 99771-6247**. Sem injeção de Web Analytics/Zaraz encontrada no HTML solicitado com cabeçalhos de navegador. A aparência publicada e a lista das 14 cidades da RMR foram conferidas no navegador.

`X-Robots-Tag: noindex, nofollow` confirmado na publicação. O sitemap está vazio de propósito enquanto a operação comercial não estiver confirmada. CSP e cabeçalhos de proteção do projeto estão presentes; HSTS não foi observado nesta etapa.

## Retomada após ativação da zona

1. Abrir **Workers & Pages → cestas-populares → Custom domains** e cadastrar `cestaspopulares.com.br` quando a zona estiver ativa; confirmar o CNAME existente para `cestas-populares.pages.dev`.
2. Confirmar status e certificados de domínio principal e www.
3. Testar os endereços HTTP/HTTPS, com/sem www, uma rota interna com query e uma URL inexistente. Verificar conteúdo, redirects, imagem, cabeçalhos, robots e sitemap no domínio final.
4. Liberar indexação somente após completar os dados comerciais e passar `npm run check:release`, seguindo `README.md` e `docs/seo.md`.

Não solicitar indexação da prévia no Google. Publicação, indexação, posições e operação comercial são verificações distintas.
