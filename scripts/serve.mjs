import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch as watchFiles } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const build = () => execFileSync(process.execPath, ['scripts/build.mjs'], { cwd: root, stdio: 'inherit' });
build();
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.json': 'application/json', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8' };
const server = http.createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return; }
  try {
    const url = new URL(req.url, 'http://localhost');
    const decoded = decodeURIComponent(url.pathname);
    if (decoded.includes('\\') || decoded.includes('\0')) throw new Error('Caminho inválido');
    let file = path.resolve(dist, '.' + decoded);
    if (file !== dist && !file.startsWith(dist + path.sep)) { res.writeHead(403); res.end(); return; }
    if (path.basename(file).startsWith('_')) { res.writeHead(404); res.end(); return; }
    let status = 200;
    try {
      if ((await stat(file)).isDirectory()) {
        if (!url.pathname.endsWith('/')) { res.writeHead(301, { Location: url.pathname + '/' + url.search }); res.end(); return; }
        file = path.join(file, 'index.html');
      }
      await stat(file);
    } catch { file = path.join(dist, '404.html'); status = 404; }
    const data = await readFile(file);
    const headers = { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow', 'X-Content-Type-Options': 'nosniff' };
    res.writeHead(status, headers); res.end(req.method === 'HEAD' ? undefined : data);
  } catch { res.writeHead(400); res.end('Não foi possível abrir esta página.'); }
});
server.listen(Number(process.env.PORT || 4173), '127.0.0.1', () => console.log(`Prévia: http://127.0.0.1:${server.address().port}`));
if (process.argv.includes('--watch')) {
  let timer;
  for (const folder of ['src', 'public']) watchFiles(path.join(root, folder), { recursive: true }, () => {
    clearTimeout(timer); timer = setTimeout(() => { try { build(); } catch { console.error('Corrija o arquivo e salve novamente.'); } }, 180);
  });
}
