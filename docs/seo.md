# SEO e conteúdo — expansão de 12/09/2026

Celso pediu a ampliação da primeira versão, com uma página por cidade e tutoriais de compra e venda. O site passa a ter **30 páginas indexáveis e uma 404**: sete páginas originais, dois diretórios, 15 páginas locais e seis guias. A limitação de oito páginas do briefing inicial foi substituída por esse pedido; os cuidados com veracidade e conteúdo próprio continuam.

## Organização e intenção

| Conjunto | Função |
|---|---|
| `/` | Apresentação regional da marca e acesso a cestas, cidades e guias. |
| `/cestas-basicas/`, `/como-comprar/`, `/entregas/`, `/contato/` | Consulta comercial: composição, compra, entrega e canal real. |
| `/cidades/` | Diretório navegável dos 14 municípios da RMR, com Vitória de Santo Antão em seção adicional. |
| `/cidades/<cidade>/` | Orientação local, referências de endereço, roteiro de compra, dúvidas e consulta contextualizada. |
| `/guias/` | Entrada para os seis tutoriais. |
| `/guias/<assunto>/` | Montagem da cesta, conferência de alimentos, comparação de orçamento, venda, compra coletiva e carnes/refrigerantes. |
| Páginas informativas | Privacidade e condições de compra, com dados pendentes apresentados como tais. |

## Conteúdo municipal

Os textos ficam em `src/data/cities.mjs`. Cada página tem introdução, referência local com fonte oficial, orientação aplicada àquela consulta, roteiro de compra e dúvidas próprios. Exemplos: etapas de Rio Doce em Olinda, identificação completa de Maranguape em Paulista, distinção entre Cruz de Rebouças e Nova Cruz em Igarassu, sede e Bonança em Moreno e consulta separada para Vitória. As orientações de compra são editoriais; as fontes governamentais sustentam apenas as referências territoriais.

O formulário já contém a cidade, editável pelo visitante. A mensagem preparada e o link direto sem JavaScript mantêm o contexto. Não há cadastro, envio automático ou armazenamento dos campos. Links de cidades aparecem no conteúdo da inicial/entregas, no diretório e entre páginas relacionadas. Guias são acessíveis pela inicial, pelo menu, pelo rodapé e pelas páginas locais.

A fonte geográfica não representa filial, ponto de retirada, contrato público ou cobertura de entrega. `delivery.confirmedCities` continua vazio. Fontes de cada localidade estão junto do conteúdo e na estrutura de dados; todas foram consultadas em 12/09/2026. As direções norte/oeste/sul no diretório são agrupamentos editoriais de navegação, não uma divisão administrativa oficial.

## Guias

Os seis tutoriais estão em `src/data/guides.mjs`, com sumário por âncoras, passos acionáveis, exemplos e links relacionados. O tutorial de venda aborda público, fornecedor, composição, custos, estrutura, divulgação e conferência. Não anuncia programa de revendedores, tabela de atacado ou parceria. Valores de exemplos são identificados como fictícios, não ofertas da Cestas Populares. Referências de conservação: Anvisa; formação de preços: Sebrae, citados junto das orientações correspondentes.

## Indexação e validação

Produção autorizada: `index, follow` nas 30 páginas, canonical próprio HTTPS, títulos/descrições únicos, um H1 por página, HTML legível sem JavaScript e sitemap completo. `robots.txt` referencia o sitemap. A 404 e branches de prévia permanecem sem indexação. A hierarquia dos breadcrumbs das cidades/guias tem três níveis, tanto na página quanto no JSON-LD.

Não há marcação de avaliações, ofertas, preços, filiais ou endereço comercial inventados. WebSite e BreadcrumbList são usados somente com informações existentes. Desde a revisão de 13/09, três guias também têm Article com título, descrição, autoria da marca, data da revisão e referências que aparecem no HTML. Assets permanecem versionados e leves, sem bibliotecas de produção adicionadas.

`npm run check` valida inventário completo, sitemap, metadados, links/âncoras, IDs, imagens, arquivos e hashes da política de scripts. Verifica também o limite de 2.000 caracteres por linha de `_headers`. Os 12 testes cobrem comportamentos críticos, incluindo cidade no formulário/fallback, escape de conteúdo e navegação até as páginas novas.

Sessão de **13/09/2026 no Google Search Console**: o registro do projeto documenta inicial indexada, sitemap Processado com 30 páginas e solicitações aceitas para Cestas básicas, Como comprar e Entregas. Não repetir pedidos já aceitos sem nova necessidade. Publicação e rastreabilidade não demonstram indexação, posição ou tráfego; acompanhar resultados reais depois do envio.

A quantidade de páginas, isoladamente, não garante melhora. O conteúdo foi organizado para uso direto e navegação clara, seguindo a distinção do Google entre conteúdo útil e páginas semelhantes criadas só para alcançar consultas: [políticas de spam, doorways e conteúdo em escala](https://developers.google.com/search/docs/essentials/spam-policies?hl=pt-br). Outras referências: [breadcrumbs](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb?hl=pt-br), [controle de indexação](https://developers.google.com/search/docs/crawling-indexing/block-indexing?hl=pt-br) e [limites de headers do Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/headers/).

## Revisão editorial para busca e IA — 13/09/2026

Foram aprofundados três guias existentes, sem criar novas rotas:

- `/guias/como-montar-cesta-basica/`: resposta direta, ficha de reposição usando consumo/estoque/período e dúvidas sobre duração, embalagens e personalização.
- `/guias/lista-de-alimentos-cesta-basica/`: conferência objetiva da composição, peso líquido/drenado, roteiro para pedir informações e distinção entre foto ilustrativa e oferta.
- `/guias/como-comparar-precos/`: equivalência de composição, custo por medida com valores explicitamente fictícios, limites do preço fechado da cesta e decisões sobre destino, extras e lotes.

Os textos identificam Cestas Populares como responsável pelo conteúdo editorial, com revisão em 13/09/2026 e contato para correções. Não atribuem autoria a pessoa, especialista ou empresa legal não confirmados. `/contato/#editorial` explica o papel do site e do atendimento e mantém a identificação comercial completa como pendente. WhatsApp continua `5581997716247`.

Referências primárias consultadas e ligadas no conteúdo: [Anvisa — rotulagem](https://www.gov.br/anvisa/pt-br/assuntos/alimentos/rotulagem), [Anvisa — compra e conservação](https://www.gov.br/anvisa/pt-br/assuntos/noticias-anvisa/2025/vai-preparar-a-ceia-se-liga-em-nossas-dicas-e-garanta-saude-no-prato/) e [Inmetro — produtos pré-embalados](https://www.gov.br/inmetro/pt-br/assuntos/metrologia-legal/produtos-pre-embalados). As fontes sustentam somente as orientações identificadas; não confirmam oferta, entrega ou vínculo com o site.

O sitemap mantém 30 URLs e usa `lastmod` somente nos três guias e no contato, alterados nesta revisão. Nenhuma data é renovada apenas por executar um build. Produção, canonicals, noindex da 404, catálogo vazio e condições sob consulta foram preservados. Não houve alteração em robots.txt, Cloudflare, treinamento de IA ou criação de llms.txt. As prioridades de inspeção após publicar são os três guias acima; o registro do Search Console pertence à tarefa principal.

Validação local: build de produção, check, 12 testes e check:release aprovados. Conferência adicional confirmou três Article com autor/data/fontes visíveis, quatro lastmod e a maior linha de CSP com 1.853 caracteres, abaixo do limite de 2.000. O visual base e os arquivos de CSS/JavaScript permanecem iguais; a revisão de navegador da produção fica a cargo da tarefa principal.
