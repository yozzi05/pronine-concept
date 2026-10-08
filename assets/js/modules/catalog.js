/* Карточки моделей, локальные фильтры, избранное, цвета Glow и таблица сравнения. */
import { products, filters, compareRows, formatPrice } from '../data/products.js';

const favorites = new Set();

export function initCatalog() {
  const grid = document.querySelector('[data-product-grid]');
  if (!grid) return;

  grid.innerHTML = products.map(cardTemplate).join('');
  renderFilters(document.querySelector('[data-filters]'), grid);
  bindCards(grid);
  renderCompare(document.querySelector('[data-compare-table]'));
  bindCompareToggle();
}

function cardTemplate(p) {
  const first = p.variants ? p.variants[0] : p.image;
  const swatches = p.variants
    ? `<div class="product__swatches" role="group" aria-label="Цвет ${p.name}">
         ${p.variants.map((v, i) => `<button type="button" class="swatch" style="--sw:${v.swatch}" aria-pressed="${i === 0}" data-variant="${v.id}"><span></span><span class="visually-hidden">${v.label}</span></button>`).join('')}
       </div>`
    : '';

  return `
  <article class="product" id="model-${p.id}" data-id="${p.id}" data-groups="${p.group.join(' ')}" aria-labelledby="name-${p.id}">
    <div class="product__media">
      <img src="${first.src}" width="900" height="1200" alt="${first.alt}" loading="lazy"${p.variants ? ' data-variant-img' : ''}>
      ${swatches}
      <button type="button" class="product__fav" aria-pressed="false" data-fav="${p.id}">
        <svg class="icon" aria-hidden="true"><use href="#i-heart"/></svg>
        <span class="visually-hidden">Добавить ${p.name} в избранное</span>
      </button>
    </div>
    <div class="product__body">
      <p class="product__series">${p.series}</p>
      <h3 class="product__name" id="name-${p.id}">${p.name}</h3>
      <p class="product__pitch">${p.pitch}</p>
      <ul class="product__tags" aria-label="Ключевые характеристики">${p.tags.map((t) => `<li>${t}</li>`).join('')}</ul>
      <div class="product__foot">
        <p class="product__price"><span class="visually-hidden">Цена: </span>${formatPrice(p.price)}</p>
        <button type="button" class="btn btn--dark product__buy" aria-disabled="true" aria-describedby="soon-desc" data-soon="Здесь стоит заглушка">В корзину</button>
      </div>
    </div>
  </article>`;
}

function renderFilters(root, grid) {
  if (!root) return;
  const count = (id) => (id === 'all' ? products.length : products.filter((p) => p.group.includes(id)).length);
  root.innerHTML = filters.map((f, i) =>
    `<button type="button" class="tab" aria-pressed="${i === 0}" data-filter="${f.id}">${f.label}<span class="tab__count">${count(f.id)}</span></button>`
  ).join('');

  root.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-filter]');
    if (!chip) return;
    root.querySelectorAll('[data-filter]').forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    applyFilter(grid, chip.dataset.filter);
  });
}

function applyFilter(grid, id) {
  const cards = grid.querySelectorAll('.product');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  cards.forEach((card) => {
    const match = id === 'all' || card.dataset.groups.split(' ').includes(id);
    card.classList.toggle('is-hidden', !match);
    if (match && !reduce) {
      card.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'cubic-bezier(.2,.7,.2,1)' });
    }
  });
}

/* Сбрасывает фильтр, чтобы выбранная модель была видна (используется подбором). */
export function revealModel(id) {
  const all = document.querySelector('[data-filter="all"]');
  const card = document.getElementById(`model-${id}`);
  if (!card) return;
  if (card.classList.contains('is-hidden') && all) all.click();
  document.querySelectorAll('.product.is-highlight').forEach((c) => c.classList.remove('is-highlight'));
  card.classList.add('is-highlight');
  card.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
  card.querySelector('.product__name').setAttribute('tabindex', '-1');
  card.querySelector('.product__name').focus({ preventScroll: true });
  setTimeout(() => card.classList.remove('is-highlight'), 2600);
}

function bindCards(grid) {
  const badge = document.querySelector('[data-fav-count]');
  const favDesc = document.querySelector('[data-fav-desc]');

  grid.addEventListener('click', (e) => {
    const fav = e.target.closest('[data-fav]');
    if (fav) {
      const id = fav.dataset.fav;
      const on = !favorites.has(id);
      on ? favorites.add(id) : favorites.delete(id);
      fav.setAttribute('aria-pressed', String(on));
      const name = products.find((p) => p.id === id).name;
      fav.querySelector('.visually-hidden').textContent = on ? `Убрать ${name} из избранного` : `Добавить ${name} в избранное`;
      if (badge) { badge.textContent = String(favorites.size); badge.hidden = favorites.size === 0; }
      if (favDesc) favDesc.textContent = favorites.size
        ? `Отмечено моделей: ${favorites.size}. Список избранного доступен в полной версии магазина`
        : 'Отметок нет. Список избранного доступен в полной версии магазина';
      return;
    }

    const sw = e.target.closest('[data-variant]');
    if (sw) {
      const card = sw.closest('.product');
      const product = products.find((p) => p.id === card.dataset.id);
      const variant = product.variants.find((v) => v.id === sw.dataset.variant);
      const img = card.querySelector('[data-variant-img]');
      card.querySelectorAll('[data-variant]').forEach((b) => b.setAttribute('aria-pressed', String(b === sw)));
      img.src = variant.src;
      img.alt = variant.alt;
    }
  });
}

function renderCompare(table) {
  if (!table) return;
  const head = `<thead><tr><th scope="col"><span class="visually-hidden">Характеристика</span></th>${products.map((p) => `<th scope="col">${p.name}</th>`).join('')}</tr></thead>`;
  const body = `<tbody>${compareRows.map(([label, get]) =>
    `<tr><th scope="row">${label}</th>${products.map((p) => `<td>${get(p)}</td>`).join('')}</tr>`
  ).join('')}</tbody>`;
  table.insertAdjacentHTML('beforeend', head + body);
}

function bindCompareToggle() {
  const toggle = document.querySelector('[data-compare-toggle]');
  const panel = document.getElementById('compare');
  if (!toggle || !panel) return;
  toggle.addEventListener('click', () => {
    const open = panel.hidden;
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
  });
}
