# Publicação na Cloudflare — 12/09/2026

## Hospedagem publicada

- Projeto Cloudflare Pages: **cestas-populares**, na conta **CESTAS BASICAS**.
- Endereço principal acessível e verificado: **https://cestaspopulares.com.br/**. Alternativo: **https://cestas-populares.pages.dev/**.
- Repositório: https://github.com/Celso81/CESTAS-BASICAS; branch **main**.
- Primeiro código publicado: commit **3f4bf63**.
- Integração Git autorizada por Celso. Commits em `main` disparam build e publicação.
- Framework **None**, raiz do repositório, saída **dist**, variável **NODE_VERSION=22**.
- Build: `npm run build && npm run check && npm test`; concluído com sucesso pela Cloudflare.
- Celso autorizou a **publicação normal** em 12/09/2026: modo production, páginas liberadas para indexação e sitemap completo. Catálogo e condições desconhecidas continuam sob consulta, sem marcar dados comerciais como confirmados.

## Domínio próprio ativo

- Domínio: `cestaspopulares.com.br`.
- Nameservers informados pela conta e encontrados na consulta DNS: `andronicus.ns.cloudflare.com` e `riya.ns.cloudflare.com`.
- Zona Cloudflare **ativa** em 12/09/2026, após a verificação dos nameservers. Domínio principal e www aparecem em Custom domains como **Active / SSL enabled**.
- Criados dois registros **CNAME**, ambos com proxy e TTL automático: `@` e `www`, destino `cestas-populares.pages.dev`. Não havia registros anteriores nessa zona.
- `cestaspopulares.com.br` e `www.cestaspopulares.com.br` cadastrados e ativos em Custom domains.
- A falha 522 inicial foi resolvida ao concluir o vínculo do domínio principal com o projeto Pages após a ativação da zona.
- **Always Use HTTPS** ativado.
- Regra **WWW para dominio principal** ativa: condição `(http.host eq "www.cestaspopulares.com.br")`, destino `concat("https://cestaspopulares.com.br", http.request.uri.path)`, status **301**, preservação da query ativada.
- HTTPS validado sem ignorar verificação de certificado. HTTP e www retornam **301** para HTTPS sem www, preservando caminho e query; exemplo conferido: `/entregas/?origem=dns`.

## Verificação da publicação

Em `cestas-populares.pages.dev` e `cestaspopulares.com.br`: sete páginas de conteúdo retornaram **200**, URL inexistente retornou **404 com a página de erro**, imagem WebP retornou **200** (215.872 bytes), `robots.txt` e `sitemap.xml` retornaram **200**. Conferidos títulos, canonical para o domínio principal e WhatsApp **(81) 99771-6247**. A aparência publicada e a lista das 14 cidades da RMR foram conferidas no navegador.

A Cloudflare inseriu automaticamente seu beacon de RUM no domínio próprio. A coleta foi desativada em **Speed → Real user monitoring → Disable completely → Disable RUM**, para manter a política de privacidade prevista. A conferência de HTML usa `Accept: text/html`, pois a injeção pode não aparecer sem esse cabeçalho. A Cloudflare acrescenta seu bloco gerenciado ao `robots.txt`, preservando as diretivas do projeto.

Após a autorização de publicação normal, o build remove o bloqueio global `X-Robots-Tag: noindex, nofollow`; as páginas de conteúdo têm `index, follow`, e o sitemap lista todas as URLs canônicas de conteúdo. A 404 permanece noindex. CSP e cabeçalhos de proteção do projeto são preservados.

## Próxima etapa: Google Search Console

Para 13/09/2026, Celso combinou verificar a propriedade, enviar o sitemap e solicitar indexação das URLs prioritárias. `npm run check:release` valida a publicação; `npm run check:commercial` mantém o relatório separado dos dados de negócio a completar. A publicação não inventa nem aprova esses dados.

Não solicitar indexação da prévia no Google. Publicação, indexação, posições e operação comercial são verificações distintas.

## Expansão de conteúdo — 12/09/2026

Nova estrutura de 31 páginas: sete páginas originais, 15 páginas municipais, dois diretórios (cidades e guias), seis guias e 404. Produção mantém 30 URLs indexáveis no sitemap. Build/check e 12 testes aprovados localmente, incluindo contexto da cidade no WhatsApp, navegação até todas as páginas locais/editoriais e hierarquia dos breadcrumbs. A maior linha de `_headers` tem 1.853 caracteres, abaixo do limite de 2.000 do Pages; check passa a impedir exceder o limite. A confirmação do commit publicado fica registrada no Segundo Cérebro e em `output/qa/`.
