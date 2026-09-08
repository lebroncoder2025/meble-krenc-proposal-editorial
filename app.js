const body = document.body;
const footer = document.querySelector('.footer');
let modal = null;
let returnFocus = null;
document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
function openModal(el) {
  returnFocus = document.activeElement;
  modal = el;
  el.hidden = false;
  Array.from(body.children).forEach(child => { if (child !== el && child.tagName !== 'SCRIPT') child.inert = true; });
  body.classList.add('menu-open');
  el.querySelector('button')?.focus();
}
function closeModal() {
  if (!modal) return;
  modal.hidden = true;
  modal = null;
  Array.from(body.children).forEach(child => child.inert = false);
  body.classList.remove('menu-open');
  if (returnFocus?.isConnected && !returnFocus.closest('[hidden]')) returnFocus.focus();
  else document.querySelector('.footer [data-cookie-open]')?.focus();
}
const root = document.querySelector('[data-lightbox-root]');
const image = root?.querySelector('[data-lightbox-image]');
if (root) {
  const links = [...document.querySelectorAll('[data-lightbox]')];
  let index = 0;
  root.insertAdjacentHTML('beforeend','<div class="lightbox-navigation"><button type="button" data-previous aria-label="Poprzednie zdjęcie"><svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 12H4m6-6-6 6 6 6"/></svg></button><p data-photo-count aria-live="polite"></p><button type="button" data-next aria-label="Następne zdjęcie"><svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 12h16m-6-6 6 6-6 6"/></svg></button></div>');
  function showPhoto(next) {
    index = (next + links.length) % links.length;
    image.src = links[index].href;
    image.alt = links[index].querySelector('img')?.alt || 'Zdjęcie — Unifora Interieur';
    root.querySelector('[data-photo-count]').textContent = `${index + 1} / ${links.length}`;
  }
  root.querySelector('[data-previous]').addEventListener('click', () => showPhoto(index - 1));
  root.querySelector('[data-next]').addEventListener('click', () => showPhoto(index + 1));
  root.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); showPhoto(index + (e.key === 'ArrowRight' ? 1 : -1)); }
  });
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', 'Podgląd zdjęcia — Unifora Interieur');
  document.querySelectorAll('[data-lightbox]').forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    showPhoto(links.indexOf(link));
    openModal(root);
  }));
  root.addEventListener('click', e => { if (e.target === root || e.target.closest('[data-lightbox-close]')) closeModal(); });
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (modal) closeModal();
  }
  if (e.key !== 'Tab') return;
  const scope = modal;
  if (!scope) return;
  const items = Array.from(scope.querySelectorAll('a[href],button:not([disabled]),input:not([disabled])')).filter(el => el.getClientRects().length);
  const first = items[0], last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});
