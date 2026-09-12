// Compartilhado pelo gerador e pelo navegador: a mesma mensagem em todos os fluxos.
export const validWhatsapp = value => /^55[1-9][0-9][0-9]{8,9}$/.test(value);
export function whatsappMessage({ brand = 'Cestas Populares', basket = '', city = '', neighborhood = '', quantity = '', topic = '' } = {}) {
  let message = `Olá! Vim pelo site ${brand}`;
  message += basket ? ` e gostaria de consultar a cesta ${basket}.` : ' e gostaria de conhecer as opções de cestas básicas.';
  if (topic) message += ` Gostaria de consultar ${topic}.`;
  if (city.trim()) message += ` Minha cidade é ${city.trim()}.`;
  if (neighborhood.trim()) message += ` Meu bairro é ${neighborhood.trim()}.`;
  if (/^[1-9]\d{0,2}$/.test(String(quantity))) message += ` Quero consultar ${quantity} cesta${Number(quantity) === 1 ? '' : 's'}.`;
  return `${message}\n\nPodem enviar um orçamento com:\n- Alimentos, marcas, tamanhos e quantidades de cada cesta;\n- Disponibilidade e preço das cestas;\n- Frete, prazo e valor total com entrega;\n- Formas de pagamento e condições?\n\nQuero conferir os detalhes antes de confirmar a compra.`;
}
export const whatsappUrl = (number, options) => validWhatsapp(number) ? `https://wa.me/${number}?text=${encodeURIComponent(whatsappMessage(options))}` : '';
export function formatWhatsapp(number) {
  if (!validWhatsapp(number)) return '';
  const local = number.slice(4);
  return `(${number.slice(2, 4)}) ${local.slice(0, -4)}-${local.slice(-4)}`;
}
