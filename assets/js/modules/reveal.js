/* Короткое появление блоков. Скрытие включается только здесь, поэтому без JS контент виден. */

export function initReveal() {
  const items = document.querySelectorAll('.reveal');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!items.length || reduce || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

  // Элементы, уже видимые при загрузке, не прячем — без мигания первого экрана.
  const viewport = window.innerHeight;
  items.forEach((el) => {
    if (el.getBoundingClientRect().top < viewport) el.classList.add('is-in');
    else observer.observe(el);
  });
  document.documentElement.classList.add('reveal-on');
}
