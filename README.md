# Cestas Populares

Site estático com oito páginas, HTML gerado e JavaScript leve, sem dependências de produção. Projeto independente para venda de cestas básicas. Domínio: **https://cestaspopulares.com.br**. Repositório: **https://github.com/Celso81/CESTAS-BASICAS**.

## Abrir e conferir

Use Node.js 22 ou superior. Não é necessário instalar pacotes para rodar o projeto.

```sh
npm run dev
```

Abra **http://127.0.0.1:4173/**. O comando regenera `dist/` ao salvar arquivos em `src/` ou `public/`; atualize o navegador para ver a mudança. `npm run preview` abre sem observar alterações. Para mudar a porta no PowerShell: `$env:PORT='4174'` e execute o comando.

```sh
npm run build
npm run check
npm test
npm run check:release
```

`check` verifica as oito páginas, links, imagens, WhatsApp, metadados, indexação, sitemap, 404 e sintaxe. `test` confere os comportamentos críticos de contato e proteção comercial. `check:release` retorna código 1 enquanto houver dados comerciais pendentes; isso é esperado na prévia.

## Editar o negócio

- **`src/config.mjs`**: marca, domínio, WhatsApp, contato, horário, responsável, identificação da empresa, privacidade, cidades, frete, prazo, pagamento e modo.
- **`src/data/catalog.json`**: catálogo real. Começa vazio; o site informa que o catálogo está em confirmação e permite pedir composição e orçamento sem inventar produtos. Até três cestas aparecem na inicial. A página de cestas mostra todo o catálogo confirmado.
- **`src/pages.mjs` / `src/inner-pages.mjs`**: textos e páginas.
- **`src/components.mjs`**: cabeçalho, rodapé, catálogo e contato compartilhados.
- **`public/assets/`**: imagens, marca, CSS e JavaScript. O build copia para `dist/assets/`.

Edite as fontes, nunca `dist/`. Essa pasta é regenerada integralmente e fica fora do Git. Não adicione documentos de clientes, senhas, tokens ou chaves. Fotos reais fornecidas pelo negócio devem substituir imagens genéricas de produtos, quando disponíveis. A ilustração da inicial está marcada como ilustrativa; origem e prompt em `docs/imagens.md`.

Cada produto em `catalog.json` aceita os seguintes campos. Preencha somente com dados reais, retire as linhas em branco e defina `confirmed: true` depois da conferência:

```json
{
  "id": "",
  "confirmed": false,
  "visible": true,
  "name": "",
  "description": "",
  "image": "",
  "imageWidth": 640,
  "imageHeight": 480,
  "imageAlt": "",
  "imageIllustrative": false,
  "items": [{ "name": "", "quantity": "" }],
  "price": null,
  "priceOnRequest": false,
  "availability": "on_request",
  "notes": ""
}
```

O arquivo é uma lista JSON (`[produto1, produto2]`). `price` é um número em reais, sem símbolo. Use `priceOnRequest: true` somente quando a venda sob consulta for confirmada. `availability`: `available`, `on_request` ou `unavailable`. `image` é opcional e deve começar com `/assets/`; o arquivo precisa existir em `public/assets/`. Sem foto, aparece apenas o símbolo neutro da cesta. `quantity` contém quantidade e unidade reais, por exemplo conforme a embalagem confirmada.

Produtos marcados como confirmados e visíveis precisam ter ID único, nome, descrição, disponibilidade válida, itens com quantidades e preço finito positivo ou consulta explicitamente confirmada. O build recusa dados incompletos mesmo no modo de prévia, antes de substituir a saída anterior. Produtos indisponíveis continuam identificados no catálogo, mas não são sugeridos no formulário de interesse.

Modalidades como parcelamento, compra sem cartão, crediário, fiado, boleto e dispensa de comprovante de renda têm `enabled` e `details`. Elas só são exibidas com ambos preenchidos. Boleto e parcelamento são configurações diferentes.

## Prévia e ativação comercial

Estado entregue: **prévia**, WhatsApp confirmado **(81) 99771-6247**, catálogo vazio e cobertura não confirmada. Os links abrem o WhatsApp apenas após ação do visitante. Não há mensagem automática, coleta em banco de dados ou pedido automático.

Catálogo, entregas e contato permitem preparar uma consulta com cidade, bairro e quantidade opcional de 1 a 999 cestas. As sugestões de cidades não afirmam cobertura. O visitante pode conferir a mensagem antes de abrir o WhatsApp; ela pede alimentos, marcas, tamanhos, quantidades, disponibilidade, preço, frete, prazo, total e pagamento. Sem JavaScript, o link direto continua disponível com o mesmo roteiro. Nada é enviado ao atendimento pelo site.

A prévia usa `noindex, nofollow` no HTML e nos cabeçalhos, sitemap vazio e robots permitindo que buscadores leiam o `noindex`. Isso impede a solicitação de indexação; não é controle de acesso. Não compartilhe informações privadas. Deploys Cloudflare em branches diferentes de `main` são sempre prévia, mesmo com configuração de produção.

Para ativar: complete `check:release`, confirme identificação comercial e CNPJ quando aplicável (`business.registrationStatus`: `provided` ou `not_applicable`), catálogo, entregas, pagamento, canal de privacidade, retenção e regras de troca/cancelamento. Marque a revisão comercial e altere `mode` para `production`. Execute:

```sh
npm run build:production
npm run check
npm test
```

`build:production` recusa a geração quando faltam dados. Em produção são gerados sete endereços no sitemap e a 404 continua `noindex`. Antes de publicar alterações futuras, revise textos e confirme que refletem a operação real. O JSON-LD usa apenas WebSite e BreadcrumbList com dados reais. Não há ofertas ou avaliações fictícias. O foco regional, a estrutura de conteúdo e o roteiro do Search Console estão em `docs/seo.md`.

## Cloudflare Pages com GitHub

**Publicado em 12/09/2026:** https://cestaspopulares.com.br/. Projeto `cestas-populares` com integração Git, domínio principal e www ativos com SSL. Endereço alternativo: https://cestas-populares.pages.dev/. Estado e evidências em [docs/publicacao-cloudflare.md](docs/publicacao-cloudflare.md).

`/build-info.json` informa modo, rotas e o SHA do commit usado pelo Cloudflare Pages (`revision`). Em build local sem a variável `CF_PAGES_COMMIT_SHA`, a revisão é `null`. Use o SHA e o conteúdo publicado para conferir que o deploy esperado chegou ao domínio.

Configuração usada: **Workers & Pages → Create application → Pages → Connect to Git** (os rótulos podem variar), com acesso autorizado ao repositório `Celso81/CESTAS-BASICAS`.

| Campo | Valor |
|---|---|
| Tipo | Cloudflare Pages com integração Git |
| Branch de produção | `main` |
| Framework preset | `None` |
| Build command | `npm run build && npm run check && npm test` |
| Build output directory | `dist` |
| Root directory | raiz do repositório |
| Variável de build | `NODE_VERSION=22` |

Use a integração Git desde a criação para publicar automaticamente novos commits na branch escolhida. Não é necessário criar banco, Worker, Functions ou arquivo wrangler para este site. Mantenha Web Analytics/Zaraz e outras injeções desativados enquanto a política informar ausência de rastreadores. Instruções conferidas na [documentação de integração Git](https://developers.cloudflare.com/pages/configuration/git-integration/).

## Domínio, HTTPS e conferência real

1. Abra **Custom domains → Set up a custom domain** no projeto Pages e adicione `cestaspopulares.com.br`. Use somente o destino DNS real e os nameservers exibidos pela sua conta. O domínio principal exige que a zona esteja na conta Cloudflare. Não substitua registros de e-mail ou outros serviços. Veja [domínios personalizados](https://developers.cloudflare.com/pages/configuration/custom-domains/).
2. Adicione também `www.cestaspopulares.com.br` e aguarde os dois certificados ficarem ativos.
3. Na zona do domínio, ative **SSL/TLS → Edge Certificates → Always Use HTTPS**.
4. Em **Rules → Redirect Rules**, crie uma regra com condição **Hostname equals `www.cestaspopulares.com.br`**; destino dinâmico `concat("https://cestaspopulares.com.br", http.request.uri.path)`, código **301**, opção **Preserve query string** ativada. Se a interface oferecer Bulk Redirects, siga o procedimento oficial de [www para domínio principal](https://developers.cloudflare.com/pages/how-to/www-redirect/), preservando caminho e query. Use uma única regra para esse propósito.
5. `_redirects` do Pages não aceita origem por domínio; por isso esse comportamento depende do painel, conforme [documentação de redirects](https://developers.cloudflare.com/pages/configuration/redirects/). Nunca crie regra que redirecione o domínio principal para ele mesmo.
6. Depois da publicação, confira a inicial, uma página interna com query e uma URL inexistente. Teste HTTPS, HTTP e www: caminhos e query devem sobreviver, sem loops, com destino final HTTPS sem www. A URL inexistente deve responder **404 com o conteúdo visível da página 404**. O servidor local confere esse conteúdo, mas não comprova o comportamento do domínio na Cloudflare.
7. Confira `robots.txt`, `sitemap.xml`, cabeçalhos e meta robots na versão final; só então envie o sitemap para o Search Console. Não use a prévia para solicitar indexação. Se a Cloudflare administrar seu robots.txt, confira o conteúdo efetivamente servido.

Nenhum destino `pages.dev`, nameserver, DNS ou publicação é presumido. A preparação local e a verificação do site não comprovam domínio publicado.
