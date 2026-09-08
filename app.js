const body = document.body;
const menu = document.querySelector('.menu');
const nav = document.querySelector('.nav');
const main = document.querySelector('main');
const footer = document.querySelector('.footer');
let modal = null;
let returnFocus = null;
function setMenu(open) {
  menu?.setAttribute('aria-expanded', String(open));
  nav?.classList.toggle('is-open', open);
  body.classList.toggle('menu-open', open);
  main.inert = open;
  footer.inert = open;
  if (open) nav.querySelector('a')?.focus();
}
menu?.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
nav?.querySelectorAll('a').forEach(a => {
  if (a.getAttribute('href') === (location.pathname.split('/').pop() || 'index.html')) a.setAttribute('aria-current', 'page');
  a.addEventListener('click', () => setMenu(false));
});
matchMedia('(min-width:641px)').addEventListener('change', e => { if (e.matches) setMenu(false); });
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
  root.insertAdjacentHTML('beforeend','<div class="lightbox-navigation"><button type="button" data-previous aria-label="Poprzednie zdjęcie">←</button><p data-photo-count aria-live="polite"></p><button type="button" data-next aria-label="Następne zdjęcie">→</button></div>');
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
body.insertAdjacentHTML('beforeend', '<aside class="cookie-bar" data-cookie-bar hidden aria-label="Informacja o prywatności"><p>Bez analityki i reklam. Możemy zapamiętać przeczytanie tej informacji wyłącznie w tej przeglądarce (localStorage). <a href="cookies.html">Szczegóły</a></p><div class="cookie-actions"><button data-cookie-dismiss type="button">Zamknij bez zapisu</button><button data-cookie-remember type="button">Zapamiętaj</button></div><p data-storage-error hidden role="status">Zapis jest niedostępny w tej przeglądarce.</p></aside><div class="cookie-settings" data-cookie-settings hidden><section class="cookie-dialog" role="dialog" aria-modal="true" aria-labelledby="cookie-title"><h2 id="cookie-title">Ustawienia prywatności</h2><p>Nie używamy analityki, reklam ani cookies śledzących. Możesz zapamiętać przeczytanie informacji w localStorage lub usunąć ten zapis.</p><p data-preference-status role="status"></p><div class="cookie-actions"><button data-cookie-close type="button">Zamknij</button><button data-cookie-remove type="button">Usuń zapis</button><button data-cookie-save type="button">Zapamiętaj</button></div></section></div>');
footer.querySelector('.footer-bottom > span:last-child')?.insertAdjacentHTML('beforeend','<button class="cookie-open" data-cookie-open type="button">Ustawienia prywatności</button>');
const key = 'mk-editorial-privacy-v3';
const bar = document.querySelector('[data-cookie-bar]');
const settings = document.querySelector('[data-cookie-settings]');
const status = document.querySelector('[data-preference-status]');
let remembered = false;
try { remembered = Boolean(localStorage.getItem(key)); } catch {}
bar.hidden = remembered;
document.querySelector('[data-cookie-dismiss]').addEventListener('click', () => { bar.hidden = true; });
function remember() {
  try {
    localStorage.setItem(key, 'acknowledged');
    remembered = true;
    bar.hidden = true;
    if (modal === settings) closeModal();
  } catch {
    if (modal === settings) status.textContent = 'Zapis jest niedostępny w tej przeglądarce.';
    else document.querySelector('[data-storage-error]').hidden = false;
  }
}
document.querySelector('[data-cookie-remember]').addEventListener('click', remember);
document.querySelector('[data-cookie-save]').addEventListener('click', remember);
document.querySelector('[data-cookie-open]').addEventListener('click', () => {
  status.textContent = remembered ? 'Informacja została zapamiętana.' : 'Brak zapisanego potwierdzenia.';
  openModal(settings);
});
document.querySelector('[data-cookie-close]').addEventListener('click', closeModal);
document.querySelector('[data-cookie-remove]').addEventListener('click', () => {
  try { localStorage.removeItem(key); remembered = false; status.textContent = 'Zapis został usunięty.'; }
  catch { status.textContent = 'Pamięć przeglądarki jest niedostępna.'; }
});
settings.addEventListener('click', e => { if (e.target === settings) closeModal(); });
document.addEventListener('keydown', e => {
  const menuOpen = menu?.getAttribute('aria-expanded') === 'true';
  if (e.key === 'Escape') {
    if (modal) closeModal();
    else if (menuOpen) { setMenu(false); menu.focus(); }
  }
  if (e.key !== 'Tab') return;
  const scope = modal || (menuOpen ? document.querySelector('.header') : null);
  if (!scope) return;
  const items = Array.from(scope.querySelectorAll('a[href],button:not([disabled]),input:not([disabled])')).filter(el => el.getClientRects().length);
  const first = items[0], last = items[items.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});
