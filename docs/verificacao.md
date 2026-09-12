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
