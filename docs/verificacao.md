# Verificação local — 12/09/2026

- Build: oito páginas geradas em `dist/`, modo prévia.
- Verificação estática: títulos e descrições próprios, um H1 por página, canonical, links/âncoras, imagens com dimensões, mensagens WhatsApp, oito rotas, sitemap, robots, 404, JSON-LD e hashes CSP válidos.
- Cinco testes críticos passaram: montagem e codificação da mensagem; estado sem WhatsApp; filtro de produtos não confirmados; controle das modalidades comerciais; bloqueio de produção incompleta e branches de prévia.
- Navegador Edge/Chromium: oito rotas em 390, 768 e 1440 pixels, total de 24 combinações. Sem rolagem horizontal indevida, imagens quebradas, erros JavaScript ou solicitações externas durante navegação e preenchimento.
- Menu, Escape com retorno de foco, FAQ por teclado, formulário com cidade/bairro acentuados, alternativa de abertura da mensagem, leitura e contato sem JavaScript, texto a 200% conferidos.
- WhatsApp conferido pela URL e mensagem geradas, sem envio de mensagem real.
- A URL inexistente respondeu 404 com conteúdo. Publicação e conferência posterior do domínio, certificados, redirects e cabeçalhos concluídas em 12/09/2026; detalhes em [publicacao-cloudflare.md](publicacao-cloudflare.md).
- A imagem final da cesta grande e a lista completa de 14 cidades da RMR foram integradas e conferidas. Vitória de Santo Antão aparece separadamente como área adicional de interesse.
- `check:release` registra 14 pendências comerciais esperadas. Não é falha da prévia: faltam dados reais e aprovação da operação para habilitar `production`.

As verificações locais não comprovam entrega comercial, ranqueamento no Google, DNS ou publicação. Evidências de navegador e capturas ficam na pasta local ignorada `output/qa/`.

## Melhoria do orçamento e proteção do catálogo — 12/09/2026

- `npm run build`, `npm run check` e oito testes críticos aprovados após a mudança. A verificação percorre as oito páginas e confere links, âncoras, metadados, noindex, sitemap, imagens e sintaxe.
- Nova consulta em `/cestas-basicas/`, compartilhada com entregas e contato: cidade/bairro opcionais, quantidade de 1 a 999 cestas, sugestões de cidades sem garantia de cobertura e mensagem completa revisável antes do WhatsApp.
- A montagem da mensagem foi testada com acentos e quantidades válidas/inválidas; solicita composição, marcas, embalagens, disponibilidade, preço, frete, prazo, total e pagamento. Os links diretos preservam o uso sem JavaScript. Nenhuma mensagem foi enviada ao WhatsApp.
- O catálogo vazio é identificado explicitamente. A validação recusa produtos confirmados com campos vazios, itens incompletos, disponibilidade desconhecida, preço não finito, ID duplicado ou caminho de imagem inválido. O formulário não oferece produtos marcados indisponíveis.
- `npm run check:release` e `npm run build:production` seguem bloqueados pelas mesmas 14 pendências comerciais. Não houve liberação de noindex ou adição de URLs ao sitemap.
- A alteração do formulário requer conferência visual própria; a rodada anterior de 24 combinações registrada acima não comprova o novo layout. A publicação e a conferência HTTP desta rodada são registradas separadamente.

## Correção do cache encontrada na revisão visual — 12/09/2026

A rodada central de navegador encontrou o novo formulário sem atualizar a prévia da mensagem. A conferência HTTP mostrou HTML com `max-age=0, must-revalidate`, enquanto os endereços fixos de app.js e styles.css podiam ficar 14.400 segundos em cache e contact.mjs 3.600 segundos. O conteúdo novo obtido por HTTP isolado não comprovava qual JavaScript o navegador reutilizava.

O gerador passou a publicar nomes com hash para CSS, aplicativo e módulo de contato. O aplicativo importa o contato pelo nome versionado e inclui essa referência em seu próprio hash. A verificação estática confere essa cadeia em todas as páginas. O teste de regressão altera somente o módulo de contato e exige que a URL do aplicativo também mude; o cache de CSS é independente. Nove testes críticos passam. A rodada de navegador da tarefa principal deve confirmar a prévia com cidade, bairro e quantidade após o deploy.
