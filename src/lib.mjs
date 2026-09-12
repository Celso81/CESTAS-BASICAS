export const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
import { validWhatsapp } from '../public/assets/contact.mjs';
export { validWhatsapp, whatsappUrl, whatsappMessage, formatWhatsapp } from '../public/assets/contact.mjs';
export const confirmedProducts = catalog => Array.isArray(catalog) ? catalog.filter(item => item?.confirmed === true && item.visible !== false) : [];
const filled = value => typeof value === 'string' && Boolean(value.trim());
export function catalogIssues(catalog) {
  if (!Array.isArray(catalog)) return ['Catálogo deve ser uma lista JSON'];
  const issues = [];
  const ids = new Set();
  for (const item of confirmedProducts(catalog)) {
    const label = filled(item.name) ? item.name : '(sem nome)';
    if (typeof item.id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id) || ids.has(item.id)) issues.push(`ID inválido ou duplicado da cesta ${label}`);
    ids.add(item.id);
    if (!filled(item.name) || !filled(item.description)) issues.push(`Nome e descrição completos da cesta ${label}`);
    if (!['available', 'on_request', 'unavailable'].includes(item.availability)) issues.push(`Disponibilidade válida da cesta ${label}`);
    if (item.priceOnRequest !== true && !(Number.isFinite(item.price) && item.price > 0)) issues.push(`Preço real ou sob consulta confirmado para ${label}`);
    if (!Array.isArray(item.items) || !item.items.length || !item.items.every(row => filled(row?.name) && filled(row?.quantity))) issues.push(`Itens e quantidades da cesta ${label}`);
    if (item.image && (typeof item.image !== 'string' || !/^\/assets\/[^?#\\]+$/.test(item.image) || item.image.includes('..'))) issues.push(`Imagem local válida da cesta ${label}`);
  }
  return issues;
}
export function releaseIssues(config, catalog) {
  const issues = [];
  if (!filled(config.brand)) issues.push('Nome do site');
  if (!validWhatsapp(config.whatsapp)) issues.push('WhatsApp válido com código 55 e DDD');
  try {
    const domain = new URL(config.domain);
    if (domain.protocol !== 'https:' || !domain.hostname.includes('.') || domain.username || domain.password || domain.search || domain.hash || config.domain !== domain.origin) throw new Error('Domínio inválido');
  } catch { issues.push('Domínio HTTPS válido, sem caminho, parâmetros ou barra final'); }
  return [...issues, ...catalogIssues(catalog)];
}
// A conferência comercial orienta o preenchimento futuro, sem bloquear o site sob consulta.
export function commercialIssues(config, catalog) {
  const issues = [];
  const require = (condition, label) => { if (!condition) issues.push(label); };
  require(validWhatsapp(config.whatsapp), 'WhatsApp válido com código 55 e DDD');
  require(config.business.responsible.trim(), 'Responsável comercial');
  require(config.business.legalName.trim(), 'Identificação da empresa ou vendedor');
  require(config.business.address.trim(), 'Endereço comercial real');
  require(config.business.registrationStatus === 'not_applicable' || (config.business.registrationStatus === 'provided' && config.business.cnpj.replace(/\D/g, '').length === 14), 'CNPJ da empresa, quando aplicável, ou confirmação de inaplicabilidade');
  require(config.contact.hours.trim(), 'Horário de atendimento');
  require(config.privacy.contactConfirmed && (config.privacy.email || config.whatsapp), 'Canal de privacidade confirmado');
  require(config.privacy.retention.trim(), 'Informação sobre retenção de dados no atendimento');
  require(config.delivery.confirmedCities.length, 'Cidades com entrega confirmada');
  require(config.delivery.freight.trim(), 'Condições reais de frete');
  require(config.delivery.leadTime.trim(), 'Condições reais de prazo');
  require(config.payments.methods.length && config.payments.conditions.trim(), 'Meios de pagamento e condições confirmados');
  for (const [key, value] of Object.entries(config.payments)) {
    if (value && typeof value === 'object' && !Array.isArray(value) && value.enabled) require(value.details?.trim(), `Regras da modalidade ${key}`);
  }
  require(config.catalogConfirmed && confirmedProducts(catalog).length, 'Catálogo real confirmado');
  issues.push(...catalogIssues(catalog));
  require(config.terms.reviewed && config.terms.cancellation.trim() && config.terms.exchanges.trim(), 'Condições de compra, cancelamento e troca revisadas');
  require(config.commercialApproved, 'Conferência comercial final (commercialApproved)');
  return issues;
}
export function resolveMode(config, env = process.env, forceProduction = false) {
  if (env.CF_PAGES && env.CF_PAGES_BRANCH !== config.productionBranch) return 'preview';
  return forceProduction ? 'production' : config.mode;
}
