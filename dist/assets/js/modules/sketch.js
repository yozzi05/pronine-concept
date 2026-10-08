/*
 * Схема Control It: слои рисунка (подготовлены из исходного PNG, см. docs/sketch-layers.py)
 * при первом появлении расходятся вдоль вертикальной оси и остаются раскрытыми.
 * Пока слои не загружены или при ошибке — показывается исходная иллюстрация.
 * При prefers-reduced-motion сразу показывается раскрытое положение без движения.
 */
export function initSketch() {
  const sketch = document.querySelector('[data-sketch]');
  const replay = document.querySelector('[data-sketch-replay]');
  if (!sketch) return;

  const layers = [...sketch.querySelectorAll('.sketch__layer')];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  const ready = (img) => (img.decode ? img.decode() : new Promise((res, rej) => {
    if (img.complete && img.naturalWidth) res(); else { img.onload = res; img.onerror = rej; }
  }));

  const open = () => requestAnimationFrame(() => requestAnimationFrame(() => sketch.classList.add('is-open')));

  const restart = () => {
    sketch.classList.add('is-resetting');
    sketch.classList.remove('is-open');
    void sketch.offsetWidth;
    sketch.classList.remove('is-resetting');
    open();
  };

  // Слои грузятся, когда раздел приближается к экрану; до этого виден исходный рисунок.
  const start = () => {
    layers.forEach((img) => { img.loading = 'eager'; });
    Promise.all(layers.map(ready)).then(() => {
      if (reduce.matches) {
        sketch.classList.add('is-layered', 'is-open');
        return;
      }
      sketch.classList.add('is-layered');
      if (replay) replay.hidden = false;
      open();
    }).catch(() => { /* остаётся исходная иллюстрация */ });
  };

  if (!('IntersectionObserver' in window)) { start(); return; }
  const io = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    io.disconnect();
    start();
  }, { threshold: 0.35 });
  io.observe(sketch);

  if (replay) replay.addEventListener('click', restart);
  reduce.addEventListener('change', () => {
    if (replay) replay.hidden = reduce.matches || !sketch.classList.contains('is-layered');
  });
}
