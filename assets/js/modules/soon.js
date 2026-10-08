/*
 * Неактивные элементы полной версии (aria-disabled="true").
 * Клик ничего не делает и не меняет адрес. Подсказка показывается по наведению
 * или фокусу (CSS). На сенсорных экранах, где наведения нет, первое касание
 * элемента один раз показывает короткое уведомление; повторные — нет.
 */
import { SOON_LABEL } from '../data/routes.js';

export function initSoon() {
  const toast = document.querySelector('[data-toast]');
  const touchOnly = window.matchMedia('(hover: none)');
  const shown = new WeakSet();
  let timer;

  document.addEventListener('click', (event) => {
    const el = event.target.closest('[aria-disabled="true"]');
    if (!el) return;
    event.preventDefault();
    event.stopPropagation();
    if (!toast || !touchOnly.matches || shown.has(el)) return;
    shown.add(el);
    toast.textContent = el.dataset.soon || SOON_LABEL;
    toast.classList.add('is-on');
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove('is-on'), 2200);
  }, true);
}
