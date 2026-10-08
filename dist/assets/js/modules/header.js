/* Мега-меню каталога и мобильное меню. */

export function initHeader() {
  initMega();
  initDrawer();
}

function initMega() {
  const toggle = document.querySelector('[data-mega-toggle]');
  const panel = document.getElementById('mega');
  if (!toggle || !panel) return;

  const setOpen = (open, { focusToggle = false } = {}) => {
    toggle.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
    if (!open && focusToggle) toggle.focus();
  };

  toggle.addEventListener('click', () => setOpen(panel.hidden));
  panel.addEventListener('click', (e) => { if (e.target.closest('[data-close-menu]')) setOpen(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) setOpen(false, { focusToggle: true });
  });
  document.addEventListener('click', (e) => {
    if (!panel.hidden && !panel.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
  });
  window.matchMedia('(max-width: 1023px)').addEventListener('change', (m) => { if (m.matches) setOpen(false); });
}

function initDrawer() {
  const drawer = document.getElementById('drawer');
  const opener = document.querySelector('[data-drawer-open]');
  const catalogSlot = drawer?.querySelector('[data-drawer-catalog]');
  if (!drawer || !opener) return;

  buildDrawerCatalog(catalogSlot);

  const panel = drawer.querySelector('.drawer__panel');
  const focusables = () => [...panel.querySelectorAll('a[href], button')].filter((el) => el.offsetParent !== null);

  const open = () => {
    drawer.hidden = false;
    opener.setAttribute('aria-expanded', 'true');
    document.body.classList.add('is-locked');
    focusables()[0]?.focus();
  };
  const close = ({ restoreFocus = true } = {}) => {
    drawer.hidden = true;
    opener.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('is-locked');
    if (restoreFocus) opener.focus();
  };

  opener.addEventListener('click', open);
  drawer.addEventListener('click', (e) => {
    if (e.target.closest('[data-drawer-close]')) close();
    if (e.target.closest('[data-drawer-link]')) close({ restoreFocus: false });
  });
  drawer.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
    if (e.key !== 'Tab') return;
    const items = focusables();
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (m) => { if (m.matches && !drawer.hidden) close({ restoreFocus: false }); });
}

/* Каталог в мобильном меню собирается из той же структуры, что и мега-меню. */
function buildDrawerCatalog(slot) {
  const tree = document.querySelector('[data-catalog-tree]');
  if (!slot || !tree) return;

  tree.querySelectorAll('.mega__col').forEach((col, index) => {
    const title = col.querySelector('.mega__title').textContent.trim();
    const id = `drawer-group-${index}`;
    const group = document.createElement('div');
    group.className = 'drawer__group';

    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', id);
    button.innerHTML = `<span>${title}</span><svg class="icon" aria-hidden="true"><use href="#i-chevron"/></svg>`;

    const list = col.querySelector('ul').cloneNode(true);
    list.id = id;
    list.hidden = true;
    list.querySelectorAll('[data-close-menu]').forEach((a) => {
      a.removeAttribute('data-close-menu');
      a.setAttribute('data-drawer-link', '');
    });
    if (list.querySelector('[aria-disabled="true"]')) {
      const note = document.createElement('li');
      note.className = 'drawer__note';
      note.textContent = 'Разделы откроются в полной версии магазина';
      list.append(note);
    }

    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      list.hidden = expanded;
    });

    group.append(button, list);
    slot.append(group);
  });
}
