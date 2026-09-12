// Compartilhado pelo gerador e pelo navegador: a mesma mensagem em todos os fluxos.
export const validWhatsapp = value => /^55[1-9][0-9][0-9]{8,9}$/.test(value);
export function whatsappMessage({ brand = 'Cestas Populares', basket = '', city = '', neighborhood = '', topic = '' } = {}) {
  let message = `Olá! Vim pelo site ${brand}`;
  message += basket ? ` e gostaria de consultar a cesta ${basket}.` : ' e gostaria de conhecer as opções de cestas básicas.';
  if (topic) message += ` Gostaria de consultar ${topic}.`;
  if (city.trim()) message += ` Minha cidade é ${city.trim()}.`;
  if (neighborhood.trim()) message += ` Meu bairro é ${neighborhood.trim()}.`;
  return `${message} Podem informar o valor, a entrega e as condições de pagamento?`;
}
export const whatsappUrl = (number, options) => validWhatsapp(number) ? `https://wa.me/${number}?text=${encodeURIComponent(whatsappMessage(options))}` : '';
export function formatWhatsapp(number) {
  if (!validWhatsapp(number)) return '';
  const local = number.slice(4);
  return `(${number.slice(2, 4)}) ${local.slice(0, -4)}-${local.slice(-4)}`;
}
