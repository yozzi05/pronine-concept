/*
 * Покачивание ракетки в первом экране.
 * Анимация задана в CSS (только transform); здесь — пауза по кнопке,
 * а также остановка, когда первый экран не виден или вкладка скрыта.
 * animation-play-state сохраняет текущую фазу, поэтому продолжение идёт без рывка.
 */
export function initHeroMotion() {
  const hero = document.querySelector('.hero');
  const button = document.querySelector('[data-motion-toggle]');
  if (!hero || !button) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const label = button.querySelector('[data-motion-label]');
  let userPaused = false;
  let offscreen = false;

  const apply = () => {
    hero.classList.toggle('is-motion-paused', userPaused || offscreen || document.hidden);
  };

  const syncButton = () => {
    // При reduced motion движения нет — кнопка не нужна.
    button.hidden = reduce.matches;
    button.setAttribute('aria-pressed', String(userPaused));
    label.textContent = userPaused ? 'Возобновить движение ракетки' : 'Остановить движение ракетки';
  };

  button.addEventListener('click', () => {
    userPaused = !userPaused;
    syncButton();
    apply();
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      offscreen = !entry.isIntersecting;
      apply();
    }).observe(hero);
  }

  document.addEventListener('visibilitychange', apply);
  reduce.addEventListener('change', syncButton);

  syncButton();
  apply();
}
