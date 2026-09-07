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
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', 'Podgląd zdjęcia — Unifora Interieur');
  document.querySelectorAll('[data-lightbox]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    image.src = link.href;
    image.alt = link.querySelector('img')?.alt || 'Zdjęcie — Unifora Interieur';
    openModal(root);
  }));
  root.addEventListener('click', e => { if (e.target === root || e.target.closest('[data-lightbox-close]')) closeModal(); });
}
body.insertAdjacentHTML('beforeend', '<aside class="cookie-bar" data-cookie-bar hidden aria-label="Informacja o prywatności"><p>Bez analityki i reklam. Możemy zapamiętać przeczytanie tej informacji wyłącznie w tej przeglądarce (localStorage). <a href="cookies.html">Szczegóły</a></p><div class="cookie-actions"><button data-cookie-dismiss type="button">Zamknij bez zapisu</button><button data-cookie-remember type="button">Zapamiętaj</button></div><p data-storage-error hidden role="status">Zapis jest niedostępny w tej przeglądarce.</p></aside><div class="cookie-settings" data-cookie-settings hidden><section class="cookie-dialog" role="dialog" aria-modal="true" aria-labelledby="cookie-title"><h2 id="cookie-title">Ustawienia prywatności</h2><p>Nie używamy analityki, reklam ani cookies śledzących. Możesz zapamiętać przeczytanie informacji w localStorage lub usunąć ten zapis.</p><p data-preference-status role="status"></p><div class="cookie-actions"><button data-cookie-close type="button">Zamknij</button><button data-cookie-remove type="button">Usuń zapis</button><button data-cookie-save type="button">Zapamiętaj</button></div></section></div>');
footer.querySelector('.footer-bottom span:last-child')?.insertAdjacentHTML('beforeend','<button class="cookie-open" data-cookie-open type="button">Ustawienia prywatności</button>');
const key = 'mk-cookie-preferences';
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

/* Shared-photo atlas loader: images are optimized once and shared across the three proposal sites. */
(() => {
  const photoKeys = ["apartments-01", "apartments-02", "eating-01", "eating-02", "eating-03", "eating-04", "eating-05", "eating-06", "eating-07", "eating-08", "eating-09", "eating-10", "eating-11", "eating-12", "living-01", "living-02", "living-03", "living-04", "living-05", "living-06", "sleeping-01", "sleeping-02", "sleeping-03", "sleeping-04", "sleeping-05", "sleeping-06", "sleeping-07", "sleeping-08", "sleeping-09", "sleeping-10", "sleeping-11"];
  const photoIndex = Object.fromEntries(photoKeys.map((key,index)=>[key,index]));
  const chunkUrls = Array.from({length:13},(_,i)=>`/meble-krenc-proposal-gallery/assets/shared/sprite-${i+1}.txt`);
  const hydrate = async () => {
    const encoded = (await Promise.all(chunkUrls.map(url=>fetch(url,{cache:'force-cache'}).then(r=>{if(!r.ok) throw new Error(url); return r.text();})))).join('').replace(/\s+/g,'');
    const atlas = new Image();
    atlas.decoding='async';
    atlas.src=`data:image/webp;base64,${encoded}`;
    await atlas.decode();
    const cache=new Map();
    document.querySelectorAll('img[data-photo]').forEach(img=>{
      const key=img.dataset.photo, idx=photoIndex[key];
      if(idx==null) return;
      let url=cache.get(key);
      if(!url){
        const canvas=document.createElement('canvas'); canvas.width=800; canvas.height=600;
        const ctx=canvas.getContext('2d');
        const sx=(idx%2)*400, sy=Math.floor(idx/2)*300;
        ctx.drawImage(atlas,sx,sy,400,300,0,0,800,600);
        url=canvas.toDataURL('image/jpeg',0.9); cache.set(key,url);
      }
      img.src=url; img.classList.add('photo-ready');
      const link=img.closest('a[data-photo-link],a[data-lightbox]'); if(link) link.href=url;
    });
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>hydrate().catch(()=>{})); else hydrate().catch(()=>{});
})();
