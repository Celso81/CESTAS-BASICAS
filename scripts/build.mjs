import { readFile, mkdir, writeFile, cp, lstat, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import config from '../src/config.mjs';
import { sitePages } from '../src/site.mjs';
import { layout } from '../src/components.mjs';
import { catalogIssues, releaseIssues, resolveMode } from '../src/lib.mjs';
import { structuredData, scriptHash } from '../src/seo.mjs';
import { browserAssets } from '../src/assets.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalog = JSON.parse(await readFile(path.join(root, 'src/data/catalog.json'), 'utf8'));
const invalidCatalog = catalogIssues(catalog);
if (invalidCatalog.length) throw new Error(`Corrija os produtos marcados como confirmados:\n- ${invalidCatalog.join('\n- ')}`);
const mode = resolveMode(config, process.env, process.argv.includes('--production'));
if (!['preview', 'production'].includes(mode)) throw new Error('mode deve ser preview ou production.');
if (mode === 'production') {
  const issues = releaseIssues(config, catalog);
  if (issues.length) { console.error(`Produção bloqueada. Complete:\n- ${issues.join('\n- ')}`); process.exit(1); }
}
const dist = path.join(root, 'dist');
// Só removemos a saída deste projeto. Recusar links impede atravessar para outro local.
if (path.dirname(dist) !== root || path.basename(dist) !== 'dist') throw new Error('Diretório de saída inválido.');
try { if ((await lstat(dist)).isSymbolicLink()) throw new Error('dist não pode ser um link simbólico.'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(path.join(root, 'public'), dist, { recursive: true });
const assets = browserAssets({
  styles: await readFile(path.join(root, 'public/assets/styles.css'), 'utf8'),
  app: await readFile(path.join(root, 'public/assets/app.js'), 'utf8'),
  contact: await readFile(path.join(root, 'public/assets/contact.mjs'), 'utf8')
});
for (const asset of Object.values(assets)) await writeFile(path.join(dist, asset.path), asset.source);
const allPages = sitePages(config, catalog);
if (new Set(allPages.map(page => page.path)).size !== allPages.length) throw new Error('Rotas duplicadas no site.');
const schemaHashes = [...new Set(allPages.map(page => structuredData(config, page)).filter(Boolean).map(scriptHash))].join(' ');
for (const page of allPages) {
  const target = path.join(dist, page.path.endsWith('.html') ? page.path : `${page.path}/index.html`);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, layout(config, page, page.body, mode, assets));
}
const urls = mode === 'production' ? allPages.filter(page => page.path !== '/404.html') : [];
await writeFile(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(page => `\n  <url><loc>${config.domain}${page.path}</loc></url>`).join('')}\n</urlset>\n`);
await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n${mode === 'production' ? `Sitemap: ${config.domain}/sitemap.xml\n` : '# Previa: bloqueio por meta robots e X-Robots-Tag; permitir leitura dessas diretivas.\n'}`);
await writeFile(path.join(dist, '_headers'), `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: DENY\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  Content-Security-Policy: default-src 'self'; script-src 'self' ${schemaHashes}; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'none'; object-src 'none'; frame-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'\n${mode === 'preview' ? '  X-Robots-Tag: noindex, nofollow\n' : ''}/404.html\n  X-Robots-Tag: noindex, nofollow\n/assets/*\n  Cache-Control: public, max-age=3600\n`);
await writeFile(path.join(dist, '_redirects'), `# Redirecionamentos HTTP e www devem ser configurados na zona Cloudflare.\n# Pages _redirects nao aceita origem com dominio. Consulte README.md.\n`);
await writeFile(path.join(dist, 'build-info.json'), JSON.stringify({ mode, revision: process.env.CF_PAGES_COMMIT_SHA || null, assets: Object.fromEntries(Object.entries(assets).map(([name, asset]) => [name, asset.path])), routes: allPages.map(page => page.path) }, null, 2));
console.log(`Build concluído: ${allPages.length} páginas em dist/ • modo ${mode}`);
