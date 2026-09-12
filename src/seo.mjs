import { createHash } from 'node:crypto';

export function structuredData(config, page) {
  if (page.path === '/404.html') return '';
  const graph = [{
    '@type': 'WebSite',
    '@id': `${config.domain}/#website`,
    name: config.brand,
    url: `${config.domain}/`,
    inLanguage: 'pt-BR'
  }];
  if (page.path !== '/') graph.push({
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: config.brand, item: `${config.domain}/` },
      { '@type': 'ListItem', position: 2, name: page.title, item: config.domain + page.path }
    ]
  });
  // JSON-LD contém apenas marca, endereço do site e navegação reais.
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
}
export const scriptHash = source => `'sha256-${createHash('sha256').update(source).digest('base64')}'`;
