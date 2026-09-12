import { escape as e, whatsappUrl, formatWhatsapp, confirmedProducts, validWhatsapp } from './lib.mjs';
import { structuredData } from './seo.mjs';
export const icon = (name, className = '') => {
  const paths = {
    basket: '<path d="m7 9 5-6 5 6M3 9h18l-2 11H5L3 9Zm5 4 1 4m7-4-1 4m-3-4v4"/>',
    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    chat: '<path d="M21 11.5a8.5 8.5 0 0 1-12.7 7.4L3 21l1.8-5.5A8.5 8.5 0 1 1 21 11.5Z"/><path d="M8 8c0 4 4 7 7 7l1-2-3-1-1 1-2-2 1-1-1-3-2 1Z"/>',
    pin: '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    list: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 3h6v3H9zM9 11h6m-6 4h6"/>',
    wallet: '<path d="M20 8H5a2 2 0 0 1 0-4h13v4M4 6v13h17V8m0 4h-6v4h6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
    shield: '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    plus: '<path d="M12 5v14M5 12h14"/>'
  };
  return `<svg class="icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.basket}</svg>`;
};
export function contactButton(config, label = 'Conversar no WhatsApp', options = {}, style = 'button-primary') {
  const url = whatsappUrl(config.whatsapp, { brand: config.brand, ...options });
  return url ? `<a class="button ${style}" href="${e(url)}" target="_blank" rel="noopener noreferrer">${icon('chat')}<span>${e(label)}</span>${icon('arrow', 'button-arrow')}</a>` : `<span class="button button-disabled" aria-disabled="true">Atendimento em breve</span>`;
}
export const logo = (brand = 'Cestas Populares') => `<span class="brand-symbol">${icon('basket')}</span><span class="brand-name">${e(brand.split(' ')[0])}<span>${e(brand.split(' ').slice(1).join(' '))}<span class="brand-dot">.</span></span></span>`;
const links = [['/', 'Início'], ['/cestas-basicas/', 'Nossas cestas'], ['/como-comprar/', 'Como comprar'], ['/entregas/', 'Entregas'], ['/contato/', 'Contato']];
export function header(config, path, preview) {
  return `${preview ? '<div class="preview-notice">Prévia do site <span aria-hidden="true">·</span> Catálogo e condições comerciais em confirmação.</div>' : ''}
  <div class="topline"><div class="container"><span>Cestas básicas e alimentos para o dia a dia</span><a href="/entregas/">${icon('pin')} Consulte a entrega na sua região</a></div></div>
  <header class="site-header"><div class="container header-inner"><a class="brand" href="/" aria-label="${e(config.brand)} — início">${logo(config.brand)}</a>
  <button class="menu-toggle" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="main-nav" hidden>${icon('menu')}</button>
  <nav id="main-nav" class="main-nav" aria-label="Navegação principal">${links.map(([href, text]) => `<a href="${href}"${href === path ? ' aria-current="page"' : ''}>${text}</a>`).join('')}</nav>
  <a class="header-contact" href="/contato/" aria-label="Fale com a gente">${icon('chat')}<span>Fale com a gente</span></a></div></header>`;
}
export function footer(config) {
  return `<footer class="site-footer"><div class="container footer-grid"><div><a class="brand brand-light" href="/" aria-label="${e(config.brand)} — início">${logo(config.brand)}</a><p>Cestas básicas e alimentos.<br>Mais perto da sua mesa.</p></div><div><h2>Explore</h2>${links.slice(1, 4).map(([href, text]) => `<a href="${href}">${text}</a>`).join('')}</div><div><h2>Fale com a gente</h2><a href="/contato/">Atendimento e contato</a>${config.whatsapp ? `<a href="${e(whatsappUrl(config.whatsapp, { brand: config.brand }))}" target="_blank" rel="noopener noreferrer">WhatsApp: ${e(formatWhatsapp(config.whatsapp))}</a>` : ''}${config.contact.email ? `<a href="mailto:${e(config.contact.email)}">${e(config.contact.email)}</a>` : ''}${config.contact.hours ? `<p>${e(config.contact.hours)}</p>` : ''}</div><div><h2>Informações</h2><a href="/privacidade/">Privacidade</a><a href="/condicoes-de-compra/">Condições de compra</a>${config.business.legalName ? `<p>${e(config.business.legalName)}</p>` : ''}${config.business.responsible ? `<p>Responsável: ${e(config.business.responsible)}</p>` : ''}${config.business.cnpj ? `<p>CNPJ: ${e(config.business.cnpj)}</p>` : ''}${config.business.address ? `<p>${e(config.business.address)}</p>` : ''}</div></div><div class="container footer-bottom"><span>© ${new Date().getFullYear()} ${e(config.brand)}.</span><span>Consulte composição, disponibilidade e condições antes de comprar.</span></div></footer>`;
}
export const sectionTitle = (eyebrow, title, text = '') => `<div class="section-heading"><span class="eyebrow">${eyebrow}</span><h2>${title}</h2>${text ? `<p>${text}</p>` : ''}</div>`;
export const steps = () => `<ol class="steps"><li><span class="step-number">01</span>${icon('basket')}<h3>Conheça as opções</h3><p>Consulte quais cestas estão disponíveis e os alimentos de cada uma.</p></li><li><span class="step-number">02</span>${icon('chat')}<h3>Converse com a gente</h3><p>Informe sua cidade e tire suas dúvidas sobre valor, pagamento e entrega.</p></li><li><span class="step-number">03</span>${icon('check')}<h3>Combine sua compra</h3><p>Confira todos os detalhes com o atendimento antes de confirmar o pedido.</p></li></ol>`;
export const callout = config => `<section class="contact-section"><div class="container contact-callout"><div><span class="eyebrow">PODE CHAMAR</span><h2>Sua próxima cesta<br>começa com uma conversa.</h2><p>Conte o que você precisa. Consulte as opções para sua família.</p></div>${contactButton(config)}</div></section>`;
export const pageHero = (eyebrow, title, description) => `<section class="page-hero"><div class="container"><a class="breadcrumb" href="/">Início</a><span class="eyebrow">${eyebrow}</span><h1>${title}</h1><p>${description}</p></div></section>`;
export function plannedCities(config, compact = false) {
  return `<div class="planned-city-block${compact ? ' compact-cities' : ''}"><h3>Recife e todas as cidades da Região Metropolitana</h3><p>Consulte a possibilidade de entrega na sua cidade. O atendimento, o frete e o prazo dependem de confirmação por bairro ou CEP.</p><ul class="all-cities">${config.delivery.plannedCities.map(city => `<li>${e(city)}</li>`).join('')}</ul>${config.delivery.additionalPlannedCities?.length ? `<p class="additional-cities">Também sob consulta: <strong>${e(config.delivery.additionalPlannedCities.join(', '))}</strong>.</p>` : ''}</div>`;
}
export function catalogCards(config, catalog, limit) {
  const products = confirmedProducts(catalog).slice(0, limit);
  if (!products.length) return `<div class="catalog-empty"><span class="empty-icon">${icon('basket')}</span><div><h3>Vamos encontrar sua cesta?</h3><p>Fale com a gente para conhecer as opções. Confirme os itens, as quantidades e o valor antes de comprar.</p></div>${contactButton(config, 'Consultar opções')}</div>`;
  const labels = { available: 'Disponível', on_request: 'Consulte a disponibilidade', unavailable: 'Indisponível no momento' };
  return `<div class="catalog-grid">${products.map(item => `<article class="product-card" id="cesta-${e(item.id)}">${item.image ? `<figure><img src="${e(item.image)}" width="${Number(item.imageWidth) || 640}" height="${Number(item.imageHeight) || 480}" alt="${e(item.imageAlt || item.name)}" loading="lazy">${item.imageIllustrative ? '<figcaption>Imagem ilustrativa. Confira a composição abaixo.</figcaption>' : ''}</figure>` : `<div class="product-no-image" aria-hidden="true">${icon('basket')}</div>`}<div class="product-content"><span class="availability">${e(labels[item.availability] || item.availability)}</span><h2>${e(item.name)}</h2><p>${e(item.description)}</p><ul class="product-items">${(item.items || []).map(row => `<li><span>${e(row.name)}</span><strong>${e(row.quantity)}</strong></li>`).join('')}</ul><div class="product-price">${item.priceOnRequest ? 'Sob consulta' : typeof item.price === 'number' && item.price > 0 ? e(new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)) : 'Consulte o valor'}</div>${item.notes ? `<p class="product-notes">${e(item.notes)}</p>` : ''}${contactButton(config, 'Consultar esta cesta', { basket: item.name })}</div></article>`).join('')}</div>`;
}
export function paymentDetails(config) {
  const payments = config.payments;
  const modalities = { installments: 'Cesta básica parcelada', noCard: 'Compra sem cartão', ownCredit: 'Crediário próprio', fiado: 'Compra no fiado', boleto: 'Pagamento no boleto', noIncomeProof: 'Compra sem comprovação de renda' };
  const enabled = Object.entries(modalities).filter(([key]) => payments[key].enabled && payments[key].details);
  return `<div class="payment-details">${payments.methods.length ? `<h3>Formas de pagamento</h3><ul class="simple-list">${payments.methods.map(method => `<li>${e(method)}</li>`).join('')}</ul><p>${e(payments.conditions)}</p>` : '<p>Fale com o atendimento para conhecer as opções de pagamento disponíveis. Confirme o valor total e as condições antes de comprar.</p>'}${enabled.map(([key, title]) => `<div class="payment-modality"><h3>${title}</h3><p>${e(payments[key].details)}</p></div>`).join('')}</div>`;
}
export function inquiry(config, catalog, topic = '') {
  if (!validWhatsapp(config.whatsapp)) return '<div class="notice-box"><h2>Atendimento em breve</h2><p>O contato será disponibilizado assim que o atendimento estiver pronto.</p></div>';
  const products = confirmedProducts(catalog);
  return `<div class="inquiry-panel"><span class="eyebrow">VAMOS CONVERSAR</span><h2>Conte de onde você é.</h2><p>Se quiser, informe sua região para começar a conversa. Os campos são opcionais.</p><form class="inquiry-form" data-whatsapp="${e(config.whatsapp)}" data-brand="${e(config.brand)}" data-topic="${e(topic)}" hidden><div class="form-row"><div><label for="city">Cidade <span>(opcional)</span></label><input id="city" name="city" maxlength="80" autocomplete="address-level2" placeholder="Sua cidade"></div><div><label for="neighborhood">Bairro <span>(opcional)</span></label><input id="neighborhood" name="neighborhood" maxlength="80" autocomplete="off" placeholder="Seu bairro"></div></div>${products.length ? `<label for="basket">Cesta de interesse <span>(opcional)</span></label><select id="basket" name="basket"><option value="">Quero conhecer as opções</option>${products.map(item => `<option value="${e(item.name)}">${e(item.name)}</option>`).join('')}</select>` : ''}<p class="form-privacy">Estes campos apenas preparam sua mensagem. Ela será aberta no WhatsApp para você conferir e enviar. <a href="/privacidade/">Saiba sobre privacidade</a>.</p><button class="button button-primary" type="submit">${icon('chat')} Continuar no WhatsApp ${icon('arrow', 'button-arrow')}</button><p class="form-feedback" aria-live="polite"></p></form><div class="direct-contact"><p>Prefere ir direto ao atendimento?</p>${contactButton(config, 'Abrir WhatsApp', { topic }, 'button-outline')}<span>${e(formatWhatsapp(config.whatsapp))}</span></div></div>`;
}
export function layout(config, page, body, mode) {
  const canonical = config.domain + page.path;
  const noindex = mode === 'preview' || page.path === '/404.html';
  const schema = structuredData(config, page);
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${e(page.title)} | ${e(config.brand)}</title><meta name="description" content="${e(page.description)}"><meta name="robots" content="${noindex ? 'noindex, nofollow' : 'index, follow'}"><link rel="canonical" href="${e(canonical)}"><meta name="theme-color" content="#173d2d"><meta property="og:type" content="website"><meta property="og:locale" content="pt_BR"><meta property="og:site_name" content="${e(config.brand)}"><meta property="og:title" content="${e(page.title)}"><meta property="og:description" content="${e(page.description)}"><meta property="og:url" content="${e(canonical)}"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="${e(page.title)}"><meta name="twitter:description" content="${e(page.description)}">${schema ? `<script type="application/ld+json">${schema}</script>` : ''}<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg"><link rel="stylesheet" href="/assets/styles.css"><script type="module" src="/assets/app.js"></script></head><body><a class="skip-link" href="#conteudo">Pular para o conteúdo</a>${header(config, page.path, mode === 'preview')}<main id="conteudo" tabindex="-1">${body}</main>${footer(config)}</body></html>`;
}
