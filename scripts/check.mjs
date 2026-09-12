import { readFile, stat, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import config from '../src/config.mjs';
import { confirmedProducts, validWhatsapp } from '../src/lib.mjs';
import { scriptHash } from '../src/seo.mjs';
import { contentHash } from '../src/assets.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const errors = [];
const verify = (condition, message) => { if (!condition) errors.push(message); };
async function files(dir) { return (await Promise.all((await readdir(dir, { withFileTypes: true })).map(entry => entry.isDirectory() ? files(path.join(dir, entry.name)) : path.join(dir, entry.name)))).flat(); }
const generated = await files(dist);
const info = JSON.parse(await readFile(path.join(dist, 'build-info.json'), 'utf8'));
const catalog = JSON.parse(await readFile(path.join(root, 'src/data/catalog.json'), 'utf8'));
const expectedHeaders = await readFile(path.join(dist, '_headers'), 'utf8');
const assetPaths = info.assets || {};
for (const [name, extension] of [['styles', 'css'], ['app', 'js'], ['contact', 'mjs']]) {
  const assetPath = assetPaths[name];
  verify(typeof assetPath === 'string' && new RegExp(`^/assets/${name}\\.[a-f0-9]{16}\\.${extension}$`).test(assetPath), `${name}: caminho versionado ausente ou inválido.`);
  if (assetPath) {
    try {
      const source = await readFile(path.join(dist, assetPath), 'utf8');
      verify(assetPath === `/assets/${name}.${contentHash(source)}.${extension}`, `${name}: hash não corresponde ao arquivo publicado.`);
      if (name === 'app') verify(source.includes(`'./${assetPaths.contact?.split('/').at(-1)}'`) && !source.includes("'./contact.mjs'"), 'Aplicativo deve importar a versão correspondente do módulo de contato.');
    } catch { errors.push(`${name}: arquivo versionado não encontrado.`); }
  }
}
const titles = new Set(); const descriptions = new Set();
verify(info.routes.length === 8, 'Devem existir as oito páginas solicitadas.');
verify(generated.filter(file => file.endsWith('.html')).length === 8, 'Arquivos HTML inesperados ou ausentes.');
for (const route of info.routes) {
  const file = path.join(dist, route.endsWith('.html') ? route : `${route}/index.html`);
  const html = await readFile(file, 'utf8');
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  verify(title && !titles.has(title), `${route}: título ausente ou duplicado.`); titles.add(title);
  verify(description && !descriptions.has(description), `${route}: descrição ausente ou duplicada.`); descriptions.add(description);
  verify((html.match(/<h1[ >]/g) || []).length === 1, `${route}: precisa de exatamente um h1.`);
  verify(html.includes(`rel="canonical" href="${config.domain}${route}"`), `${route}: canonical incorreto.`);
  verify(html.includes('<html lang="pt-BR">') && html.includes('<main id="conteudo"'), `${route}: estrutura semântica ausente.`);
  verify(html.includes(`rel="stylesheet" href="${assetPaths.styles}"`) && html.includes(`type="module" src="${assetPaths.app}"`), `${route}: CSS/JS devem usar os arquivos versionados do build.`);
  const jsonld = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)?.[1];
  if (route !== '/404.html') {
    verify(Boolean(jsonld), `${route}: dados estruturados ausentes.`);
    if (jsonld) {
      const data = JSON.parse(jsonld);
      verify(data['@graph']?.[0]?.url === config.domain + '/', `${route}: dados estruturados incorretos.`);
      verify(!/AggregateRating|"offers"|"price"|"address"/.test(jsonld), `${route}: dados comerciais não verificados no JSON-LD.`);
      verify(expectedHeaders.includes(scriptHash(jsonld)), `${route}: hash dos dados estruturados ausente no CSP.`);
    }
  }
  if (route === '/' || route === '/entregas/') {
    for (const city of [...config.delivery.plannedCities, ...config.delivery.additionalPlannedCities]) verify(html.includes(`<li>${city}</li>`) || html.includes(`<strong>${city}</strong>`), `${route}: cidade não citada no conteúdo visível: ${city}`);
  }
  const shouldNoindex = info.mode === 'preview' || route === '/404.html';
  verify(html.includes(`name="robots" content="${shouldNoindex ? 'noindex, nofollow' : 'index, follow'}"`), `${route}: indexação incorreta.`);
  verify(!/Lorem ipsum|PLACEHOLDER|SUBSTITUIR|aprovação garantida|crédito para todos/i.test(html.replace(/<[^>]*>/g, ' ')), `${route}: texto demonstrativo ou promessa não confirmada.`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  verify(ids.length === new Set(ids).size, `${route}: IDs duplicados.`);
  for (const img of html.matchAll(/<img\b[^>]*>/g)) {
    verify(/\balt="[^"]*"/.test(img[0]) && /\bwidth="\d+"/.test(img[0]) && /\bheight="\d+"/.test(img[0]), `${route}: imagem sem alt ou dimensões.`);
  }
  for (const [, raw] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const ref = raw.replaceAll('&amp;', '&');
    if (ref.startsWith('#')) { verify(ids.includes(ref.slice(1)), `${route}: âncora ausente ${ref}`); continue; }
    if (/^https:\/\/wa.me\//.test(ref)) {
      const link = new URL(ref);
      verify(validWhatsapp(link.pathname.slice(1)) && link.pathname === '/' + config.whatsapp, `${route}: WhatsApp incorreto.`);
      verify(link.searchParams.get('text')?.startsWith('Olá! Vim pelo site'), `${route}: mensagem incorreta.`);
      verify(!/\[nome\]|\[cidade\]/.test(link.searchParams.get('text')), `${route}: mensagem com campos fictícios.`);
    }
    if (ref.startsWith('/')) {
      const uri = new URL(ref, config.domain);
      let target = path.join(dist, uri.pathname);
      try {
        if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html');
        await stat(target);
        if (uri.hash && target.endsWith('.html')) verify((await readFile(target, 'utf8')).includes(`id="${uri.hash.slice(1)}"`), `${route}: âncora não encontrada em ${ref}`);
      } catch { errors.push(`${route}: arquivo ou link interno inexistente ${ref}`); }
    }
  }
  for (const item of catalog.filter(item => !item.confirmed || item.visible === false)) verify(!html.includes(`id="cesta-${item.id}"`), `${route}: cesta não confirmada foi publicada.`);
}
for (const item of confirmedProducts(catalog)) {
  verify(/^[a-z0-9-]+$/.test(item.id), 'ID de produto inválido.');
  if (item.image) verify(item.image.startsWith('/assets/') && !item.image.includes('..') && generated.includes(path.join(dist, item.image)), `${item.name}: imagem deve existir em public/assets/.`);
}
const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8');
verify((sitemap.match(/<loc>/g) || []).length === (info.mode === 'preview' ? 0 : 7), 'Quantidade de URLs incorreta no sitemap.');
verify(!sitemap.includes('/404.html'), '404 não pode estar no sitemap.');
const headers = await readFile(path.join(dist, '_headers'), 'utf8');
verify(headers.includes('Content-Security-Policy:') && headers.includes("form-action 'none'"), 'Cabeçalhos de segurança ausentes.');
verify(!/^https?:\/\//m.test(await readFile(path.join(dist, '_redirects'), 'utf8')), 'Pages não aceita redirecionamento por domínio no _redirects.');
const robots = await readFile(path.join(dist, 'robots.txt'), 'utf8');
verify(robots.includes('Allow: /'), 'Robots deve permitir leitura das diretivas de indexação.');
verify(info.mode === 'preview' ? !robots.includes('Sitemap:') : robots.includes(`Sitemap: ${config.domain}/sitemap.xml`), 'Robots não corresponde ao ambiente.');
for (const file of [...await files(path.join(root, 'src')), ...await files(path.join(root, 'scripts')), ...await files(path.join(root, 'public'))].filter(file => /\.(mjs|js)$/.test(file))) {
  try { execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' }); } catch { errors.push(`Erro de sintaxe em ${path.relative(root, file)}`); }
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`OK: ${info.routes.length} páginas, links e âncoras, imagens, WhatsApp, catálogo, metadados, indexação ${info.mode}, sitemap, 404 e sintaxe.`);
