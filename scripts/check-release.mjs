import { readFile } from 'node:fs/promises';
import config from '../src/config.mjs';
import { releaseIssues } from '../src/lib.mjs';
const catalog = JSON.parse(await readFile(new URL('../src/data/catalog.json', import.meta.url), 'utf8'));
const issues = releaseIssues(config, catalog);
if (issues.length) {
  console.error(`Ativação comercial pendente (${issues.length} itens):\n- ${issues.join('\n- ')}\n\nA prévia continua funcionando. Não mude mode para production antes de completar os dados.`);
  process.exitCode = 1;
} else console.log('Dados comerciais preenchidos. Confira a prévia; use mode: production para ativar a versão final.');
