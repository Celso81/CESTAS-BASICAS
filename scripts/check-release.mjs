import { readFile } from 'node:fs/promises';
import config from '../src/config.mjs';
import { releaseIssues } from '../src/lib.mjs';
const catalog = JSON.parse(await readFile(new URL('../src/data/catalog.json', import.meta.url), 'utf8'));
const issues = releaseIssues(config, catalog);
if (issues.length) {
  console.error(`Corrija antes de publicar (${issues.length} itens):\n- ${issues.join('\n- ')}`);
  process.exitCode = 1;
} else console.log('Configuração de publicação válida. Execute build e check para conferir páginas, sitemap e indexação.');
