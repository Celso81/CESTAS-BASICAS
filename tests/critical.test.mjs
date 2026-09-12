import test from 'node:test';
import assert from 'node:assert/strict';
import config from '../src/config.mjs';
import { whatsappUrl, releaseIssues, resolveMode } from '../src/lib.mjs';
import { contactButton, catalogCards, paymentDetails } from '../src/components.mjs';

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
