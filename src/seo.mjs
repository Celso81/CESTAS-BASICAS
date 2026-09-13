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
      ...(page.parent ? [{ '@type': 'ListItem', position: 2, name: page.parent.title, item: config.domain + page.parent.path }] : []),
      { '@type': 'ListItem', position: page.parent ? 3 : 2, name: page.title, item: config.domain + page.path }
    ]
  });
  if (page.article) graph.push({
    '@type': 'Article',
    '@id': `${config.domain}${page.path}#artigo`,
    mainEntityOfPage: `${config.domain}${page.path}`,
    headline: page.title,
    description: page.description,
    inLanguage: 'pt-BR',
    dateModified: page.article.modified,
    author: { '@type': 'Organization', name: config.brand, url: `${config.domain}/contato/#editorial` },
    citation: page.article.sources.map(source => source.url)
  });
  // Artigos refletem autoria da marca, data e referências visíveis; sem ofertas ou credenciais inventadas.
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
}
export const scriptHash = source => `'sha256-${createHash('sha256').update(source).digest('base64')}'`;
