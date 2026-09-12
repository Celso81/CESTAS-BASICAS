export const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
import { validWhatsapp } from '../public/assets/contact.mjs';
export { validWhatsapp, whatsappUrl, whatsappMessage, formatWhatsapp } from '../public/assets/contact.mjs';
export const confirmedProducts = catalog => catalog.filter(item => item.confirmed === true && item.visible !== false);
export function releaseIssues(config, catalog) {
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
  for (const item of confirmedProducts(catalog)) {
    require(item.id && item.name && item.description && item.availability && item.items?.length, `Dados completos da cesta ${item.name || '(sem nome)'}`);
    require(item.priceOnRequest === true || (typeof item.price === 'number' && item.price > 0), `Preço real ou sob consulta confirmado para ${item.name}`);
    require(item.items?.every(row => row.name && row.quantity), `Itens e quantidades da cesta ${item.name}`);
  }
  require(config.terms.reviewed && config.terms.cancellation.trim() && config.terms.exchanges.trim(), 'Condições de compra, cancelamento e troca revisadas');
  require(config.commercialApproved, 'Conferência comercial final (commercialApproved)');
  return issues;
}
export function resolveMode(config, env = process.env, forceProduction = false) {
  if (env.CF_PAGES && env.CF_PAGES_BRANCH !== config.productionBranch) return 'preview';
  return forceProduction ? 'production' : config.mode;
}
