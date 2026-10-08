/*
 * Простой демонстрационный подбор.
 * Баллы и пояснения опираются только на свойства из описаний моделей
 * (форма, баланс, сердечник, поверхность, уровень игрока). Это ориентир, а не диагностика.
 */
import { products, formatPrice } from '../data/products.js';
import { revealModel } from './catalog.js';

const SCORES = {
  level: {
    start:    { nine: 3, glow: 2, nexit: 0, solar: -2 },
    progress: { nine: 1, glow: 2, nexit: 3, solar: 1 },
    advanced: { nine: 0, glow: 0, nexit: 1, solar: 3 }
  },
  focus: {
    control: { nine: 3, glow: 2, nexit: 0, solar: 0 },
    spin:    { nine: 1, glow: 3, nexit: 2, solar: 1 },
    power:   { nine: 0, glow: 0, nexit: 2, solar: 3 }
  },
  balance: {
    fixed: { nine: 2, glow: 2, nexit: 0, solar: 0 },
    tune:  { nine: 0, glow: 0, nexit: 3, solar: 3 }
  }
};

// Порядок при равенстве баллов: более доступная и мягкая модель — первой.
const ORDER = ['nine', 'glow', 'nexit', 'solar'];

const REASONS = {
  nine: {
    level:   { start: 'Создана для первых шагов: уровни D и D+ по описанию бренда.', progress: 'Подходит и прогрессирующим игрокам, которым важен контроль.' },
    focus:   { control: 'Круглая форма, низкий баланс и большая зона удара прощают неточный контакт.', spin: 'Матовая поверхность MatControl помогает держать фокус на мяче при подаче и у сетки.' },
    balance: { fixed: 'Баланс низкий, в ручку: ракеткой проще управлять.' },
    base:    'Сердечник EVA Soft Core гасит вибрации и бережёт руку.'
  },
  glow: {
    level:   { start: 'Серия Control It рассчитана на уровни D, D+ и C.', progress: 'Подходит тем, кто растёт с уровня D до C.' },
    focus:   { control: 'Та же мягкая основа Control It: круглая форма и низкий баланс.', spin: 'Рельефная поверхность GripGlow лучше цепляет мяч — проще закручивать вибору и бандеху.' },
    balance: { fixed: 'Баланс низкий, в ручку: ракеткой проще управлять.' },
    base:    'Можно выбрать цвет: Rose, Mint или Peach.'
  },
  nexit: {
    level:   { start: 'Это не стартовая модель — подойдёт, если хотите сразу развивать атакующую игру.', progress: 'Создана для прогрессирующих игроков, которые добавляют атаку.', advanced: 'Подходит уверенным игрокам, которым нужен запас мощи.' },
    focus:   { spin: 'Текстура лицевой поверхности усиливает сцепление с мячом в топспине и подрезке.', power: 'Гибридная ромбовидная форма и карбон 12K дают мощь в смэше.' },
    balance: { tune: 'Smart Balance позволяет сместить баланс под защиту или атаку.' },
    base:    'Vibro Stop гасит вибрации при ударе.'
  },
  solar: {
    level:   { advanced: 'Для активных любителей и продвинутых игроков, которые играют первым номером.', progress: 'Это следующий шаг: модель рассчитана на уверенный уровень.' },
    focus:   { power: 'Алмазная форма, высокий баланс и жёсткий сердечник EVA Hard — плотный мяч в смэше и виборе.', spin: 'Поверхность Spin Control усиливает зацеп мяча для агрессивных вращений.' },
    balance: { tune: 'Четыре демпфера Smart Balance смещают баланс к голове или к рукояти.' },
    base:    '18K Carbon и встроенный Vibro Stop.'
  }
};

const QUESTIONS = ['level', 'focus', 'balance'];
const STEP_NAMES = ['Опыт', 'Стиль', 'Баланс'];

/*
 * Пошаговый подбор: один вопрос за раз, переход только по кнопке «Далее».
 * Ответы хранятся в радиокнопках формы, поэтому сохраняются при возврате между шагами.
 * Результат выводится в левой колонке (data-picker-result) тем же алгоритмом rank().
 */
export function initPicker() {
  const form = document.querySelector('[data-picker]');
  const out = document.querySelector('[data-picker-result]');
  if (!form || !out) return;

  const emptyState = out.innerHTML;
  const steps = [...form.querySelectorAll('[data-goto]')];
  const fill = form.querySelector('[data-steps-fill]');
  const panes = [...form.querySelectorAll('[data-q]')];
  const summary = form.querySelector('[data-summary]');
  const summaryList = form.querySelector('[data-summary-list]');
  const bar = form.querySelector('[data-bar]');
  const back = form.querySelector('[data-back]');
  const next = form.querySelector('[data-next]');
  const counter = form.querySelector('[data-counter]');
  const hint = form.querySelector('[data-hint]');
  const live = form.querySelector('[data-wizard-live]');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = window.matchMedia('(max-width: 767px)');

  // step: 0..2 — вопросы, 3 — резюме ответов
  let step = 0;
  let reached = 0;          // самый дальний открытый шаг
  let hasResult = false;

  const answers = () => Object.fromEntries(new FormData(form));
  const answered = (i) => Boolean(answers()[QUESTIONS[i]]);
  const labelFor = (i) => {
    const input = form.querySelector(`input[name="${QUESTIONS[i]}"]:checked`);
    return input ? input.closest('.choice').querySelector('.choice__name').textContent : '';
  };

  function render({ focus = false, animate = true } = {}) {
    const inSummary = step === QUESTIONS.length;

    panes.forEach((pane, i) => {
      const current = i === step;
      pane.classList.toggle('is-current', current);
      pane.toggleAttribute('inert', !current);
      if (current && animate && !reduce.matches) restartAnimation(pane);
    });
    summary.classList.toggle('is-current', inSummary);
    summary.toggleAttribute('inert', !inSummary);
    if (inSummary && animate && !reduce.matches) restartAnimation(summary);

    steps.forEach((btn, i) => {
      const done = answered(i) && i <= reached;
      btn.classList.toggle('is-current', i === step);
      btn.classList.toggle('is-done', done && i !== step);
      btn.disabled = !(i <= reached && i !== step);
      if (i === step) btn.setAttribute('aria-current', 'step'); else btn.removeAttribute('aria-current');
      btn.setAttribute('aria-label', `Шаг ${i + 1} из 3: ${STEP_NAMES[i]}${done ? `, ответ: ${labelFor(i)}` : ''}${i === step ? ', текущий' : ''}`);
    });
    fill.style.transform = `scaleX(${Math.min(step + 1, 3) / 3})`;

    bar.classList.toggle('is-off', inSummary);
    bar.toggleAttribute('inert', inSummary);
    if (!inSummary) {
      const ok = answered(step);
      counter.textContent = `${step + 1} из 3`;
      next.textContent = step === QUESTIONS.length - 1 ? 'Показать рекомендацию' : 'Далее';
      next.disabled = !ok;
      hint.hidden = ok;
      back.disabled = step === 0;
    }
    // резюме заполнено всегда, чтобы высота области не менялась при его показе
    summaryList.innerHTML = QUESTIONS.map((q, i) =>
      `<div><dt><span>0${i + 1}</span> ${STEP_NAMES[i]}</dt><dd>${labelFor(i) || '—'}</dd></div>`).join('');

    if (focus) {
      const target = inSummary ? summary.querySelector('[data-summary-title]') : panes[step].querySelector('.q__title');
      target.focus({ preventScroll: true });
      if (narrow.matches) {
        const top = form.getBoundingClientRect().top;
        if (top < 0 || top > window.innerHeight * 0.6) form.scrollIntoView({ block: 'start', behavior: reduce.matches ? 'auto' : 'smooth' });
      }
    }
  }

  function announce(text) { live.textContent = ''; requestAnimationFrame(() => { live.textContent = text; }); }

  function goTo(i, opts) {
    step = i;
    reached = Math.max(reached, Math.min(i, QUESTIONS.length - 1));
    render({ focus: true, ...opts });
    if (i < QUESTIONS.length) announce(`Шаг ${i + 1} из 3. ${panes[i].querySelector('.q__title').textContent}`);
    else announce('Ответы приняты. Рекомендация показана слева.');
  }

  function markStale() {
    if (!hasResult) return;
    const result = out.querySelector('.result');
    if (result && !result.classList.contains('is-stale')) {
      result.classList.add('is-stale');
      result.insertAdjacentHTML('afterbegin', '<p class="result__stale">Ответы изменены — рекомендация обновится после расчёта</p>');
    }
  }

  form.addEventListener('change', (e) => {
    if (!e.target.matches('.choice__input')) return;
    markStale();
    render({ animate: false });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (step >= QUESTIONS.length || !answered(step)) return;
    if (step < QUESTIONS.length - 1) { goTo(step + 1); return; }
    renderResult(out, answers());
    hasResult = true;
    goTo(QUESTIONS.length);
    if (window.matchMedia('(max-width: 1023px)').matches) {
      out.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'nearest' });
    }
  });

  back.addEventListener('click', () => { if (step > 0) goTo(step - 1); });
  steps.forEach((btn, i) => btn.addEventListener('click', () => { if (!btn.disabled) goTo(i); }));

  form.querySelector('[data-edit]').addEventListener('click', () => goTo(0));
  form.querySelector('[data-restart]').addEventListener('click', () => {
    form.reset();
    out.innerHTML = emptyState;
    hasResult = false;
    reached = 0;
    goTo(0);
  });

  out.addEventListener('click', (e) => {
    const go = e.target.closest('[data-show-model]');
    if (go) revealModel(go.dataset.showModel);
  });

  render({ animate: false });
}

function restartAnimation(el) {
  el.classList.remove('is-entering');
  void el.offsetWidth;
  el.classList.add('is-entering');
}

function rank(data) {
  const total = Object.fromEntries(ORDER.map((id) => [id, 0]));
  Object.entries(data).forEach(([q, answer]) => {
    Object.entries(SCORES[q][answer]).forEach(([id, pts]) => { total[id] += pts; });
  });
  return [...ORDER].sort((a, b) => total[b] - total[a] || ORDER.indexOf(a) - ORDER.indexOf(b));
}

function reasonsFor(id, data) {
  const r = REASONS[id];
  const list = ['level', 'focus', 'balance'].map((q) => r[q][data[q]]).filter(Boolean);
  if (list.length < 3) list.push(r.base);
  return list.slice(0, 3);
}

function renderResult(out, data) {
  const [best, second] = rank(data);
  const p = products.find((x) => x.id === best);
  const alt = products.find((x) => x.id === second);
  const img = p.variants ? p.variants[0] : p.image;

  out.innerHTML = `
    <div class="result">
      <div class="result__img"><img src="${img.src}" width="900" height="1200" alt="${img.alt}"></div>
      <div>
        <p class="result__kicker">Можно начать с модели</p>
        <p class="result__name">${p.name}</p>
        <ul class="result__why">
          ${reasonsFor(best, data).map((t) => `<li><svg class="icon" aria-hidden="true"><use href="#i-check"/></svg><span>${t}</span></li>`).join('')}
        </ul>
        <p class="result__alt">Также посмотрите ${alt.name} · ${formatPrice(alt.price)}</p>
        <div class="result__actions">
          <button type="button" class="btn btn--primary" data-show-model="${p.id}">Показать ${p.name} · ${formatPrice(p.price)}</button>
        </div>
      </div>
    </div>`;
  out.focus({ preventScroll: true });
}
