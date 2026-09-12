import { whatsappUrl } from './contact.mjs';
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
if (menuButton && nav) {
  menuButton.hidden = false;
  document.documentElement.classList.add('js');
  const closeMenu = () => { menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Abrir menu'); nav.classList.remove('is-open'); };
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('is-open', open);
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') { closeMenu(); menuButton.focus(); } });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
  nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
}
for (const form of document.querySelectorAll('.inquiry-form')) {
  form.hidden = false;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const url = whatsappUrl(form.dataset.whatsapp, {
      brand: form.dataset.brand,
      city: String(data.get('city') || '').trim(),
      neighborhood: String(data.get('neighborhood') || '').trim(),
      basket: String(data.get('basket') || ''),
      topic: form.dataset.topic || ''
    });
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
    const feedback = form.querySelector('.form-feedback');
    feedback.replaceChildren();
    feedback.append('Confira a mensagem no WhatsApp antes de enviar. Se a janela não abriu, ');
    const fallback = document.createElement('a');
    fallback.href = url;
    fallback.textContent = 'abra sua consulta aqui';
    fallback.target = '_blank';
    fallback.rel = 'noopener noreferrer';
    feedback.append(fallback, '.');
  });
}
