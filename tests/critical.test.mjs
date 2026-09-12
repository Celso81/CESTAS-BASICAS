import test from 'node:test';
import assert from 'node:assert/strict';
import config from '../src/config.mjs';
import { whatsappUrl, whatsappMessage, catalogIssues, releaseIssues, resolveMode } from '../src/lib.mjs';
import { contactButton, catalogCards, inquiry, paymentDetails } from '../src/components.mjs';
import { browserAssets } from '../src/assets.mjs';

test('WhatsApp preserva acentos, espaços e dados reais preenchidos sem campos inventados', () => {
  const url = new URL(whatsappUrl(config.whatsapp, { basket: 'Feijão & arroz', city: 'São Lourenço da Mata', neighborhood: ' Centro ' }));
  assert.equal(url.pathname, '/' + config.whatsapp);
  assert.match(url.searchParams.get('text'), /Feijão & arroz.*São Lourenço da Mata.*Centro\./);
  const simple = new URL(whatsappUrl(config.whatsapp)).searchParams.get('text');
  assert.doesNotMatch(simple, /Minha cidade|Meu bairro|\[cidade\]|\[nome\]/);
});

test('Sem número não há link falso para WhatsApp', () => {
  assert.equal(whatsappUrl(''), '');
  assert.doesNotMatch(contactButton({ ...config, whatsapp: '' }), /href=|wa.me/);
});

test('Catálogo oculta produtos não confirmados; produtos reais são escapados', () => {
  const product = { id: 'fixture', name: '<Teste & revisão>', confirmed: false, items: [], description: '', availability: 'on_request' };
  assert.doesNotMatch(catalogCards(config, [product]), /cesta-fixture/);
  const rendered = catalogCards(config, [{ ...product, confirmed: true }]);
  assert.match(rendered, /&lt;Teste &amp; revisão&gt;/);
  assert.doesNotMatch(rendered, /<Teste/);
});

test('Modalidades de crédito só aparecem quando ativadas com regras', () => {
  assert.doesNotMatch(paymentDetails(config), /Crediário próprio|Compra no fiado|Cesta básica parcelada/);
  const modified = structuredClone(config);
  modified.payments.installments.enabled = true;
  assert.doesNotMatch(paymentDetails(modified), /Cesta básica parcelada/);
  modified.payments.installments.details = 'Condições confirmadas para teste de apresentação.';
  assert.match(paymentDetails(modified), /Cesta básica parcelada/);
});

test('Dados incompletos bloqueiam produção e previews Cloudflare nunca viram produção', () => {
  const issues = releaseIssues(config, []);
  assert.ok(issues.length > 0);
  assert.ok(issues.includes('Catálogo real confirmado'));
  assert.equal(resolveMode({ ...config, mode: 'production' }, { CF_PAGES: '1', CF_PAGES_BRANCH: 'ajuste' }, true), 'preview');
  assert.equal(resolveMode({ ...config, mode: 'production' }, { CF_PAGES: '1', CF_PAGES_BRANCH: 'main' }), 'production');
});

test('Consulta pede orçamento completo e inclui apenas quantidades inteiras válidas', () => {
  const message = whatsappMessage({ quantity: '3' });
  assert.match(message, /Quero consultar 3 cestas/);
  assert.match(message, /Alimentos, marcas, tamanhos e quantidades/);
  assert.match(message, /Frete, prazo e valor total com entrega/);
  assert.match(message, /antes de confirmar a compra/);
  assert.match(whatsappMessage({ quantity: '1' }), /Quero consultar 1 cesta\./);
  for (const quantity of ['', '0', '-2', '1.5', '1000', '<script>']) assert.doesNotMatch(whatsappMessage({ quantity }), /Quero consultar/);
});

test('Catálogo marcado como confirmado exige oferta completa, preço finito e IDs únicos', () => {
  const product = { id: 'fixture', name: 'Cesta de teste', description: 'Dados exclusivos para teste.', confirmed: true, availability: 'on_request', priceOnRequest: true, items: [{ name: 'Item de teste', quantity: 'Uma unidade de teste' }] };
  assert.deepEqual(catalogIssues([]), []);
  assert.deepEqual(catalogIssues([product]), []);
  assert.ok(catalogIssues({}).length);
  assert.ok(catalogIssues([product, product]).some(issue => /duplicado/.test(issue)));
  for (const changes of [{ items: [] }, { items: [{ name: 'Item', quantity: ' ' }] }, { description: ' ' }, { availability: 'inventada' }, { priceOnRequest: false, price: Infinity }, { image: '/assets/../privado.webp' }]) assert.ok(catalogIssues([{ ...product, ...changes }]).length);
  assert.deepEqual(catalogIssues([{ ...product, confirmed: false, items: [] }]), []);
});

test('Consulta não apresenta produto indisponível e mantém contato direto sem JavaScript', () => {
  const html = inquiry(config, [{ id: 'sem-estoque', name: 'Cesta indisponível', confirmed: true, availability: 'unavailable' }]);
  assert.doesNotMatch(html, /<option value="Cesta indisponível"/);
  assert.match(html, /class="message-preview"/);
  assert.match(html, /As sugestões não confirmam cobertura/);
  assert.match(html, /name="quantity" type="number" min="1"/);
  assert.match(html, new RegExp(`href="https://wa.me/${config.whatsapp}`));
});

test('Mudança do módulo de contato invalida também o cache do aplicativo que o importa', () => {
  const source = { styles: 'body { color: green; }', app: "import { message } from './contact.mjs'; message();", contact: "export const message = () => 'consulta anterior';" };
  const previous = browserAssets(source);
  const next = browserAssets({ ...source, contact: "export const message = () => 'consulta com quantidade';" });
  assert.notEqual(next.contact.path, previous.contact.path);
  assert.notEqual(next.app.path, previous.app.path);
  assert.equal(next.styles.path, previous.styles.path);
  assert.ok(next.app.source.includes(next.contact.path.split('/').at(-1)));
  assert.ok(!next.app.source.includes(previous.contact.path.split('/').at(-1)));
  assert.deepEqual(browserAssets(source), previous);
  const styleChange = browserAssets({ ...source, styles: 'body { color: blue; }' });
  assert.notEqual(styleChange.styles.path, previous.styles.path);
  assert.equal(styleChange.app.path, previous.app.path);
  assert.throws(() => browserAssets({ ...source, app: "import './other.mjs';" }), /exatamente uma vez/);
});
