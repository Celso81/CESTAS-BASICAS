import { readFile } from 'node:fs/promises';
import config from '../src/config.mjs';
import { commercialIssues } from '../src/lib.mjs';
const catalog = JSON.parse(await readFile(new URL('../src/data/catalog.json', import.meta.url), 'utf8'));
const issues = commercialIssues(config, catalog);
if (issues.length) {
  console.error(`Dados comerciais a completar (${issues.length} itens):\n- ${issues.join('\n- ')}\n\nEste relatório não bloqueia a publicação do site sob consulta nem a indexação autorizada.`);
  process.exitCode = 1;
} else console.log('Dados comerciais preenchidos. Mantenha as informações e ofertas atualizadas.');
