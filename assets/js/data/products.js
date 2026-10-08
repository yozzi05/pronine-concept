/*
 * Товарные данные главной.
 * Источник: карточки товаров padel.pronine.ru, проверка 6 октября 2026 г.
 * Ссылки на источники и спорные значения — в docs/sources.md и docs/contradictions.md.
 * В интерфейс URL исходного сайта не выводятся.
 *
 * price      — обычная цена, видимая гостю в карточке товара;
 * clubPrice  — клубная цена «после авторизации», показывается только с этим условием.
 */

export const CHECKED_AT = '6 октября 2026';

export const products = [
  {
    id: 'nine',
    tags: ['Круглая форма', '360 г', 'Низкий баланс'],
    name: 'Nine',
    series: 'Control It',
    route: 'product/nine',
    group: ['start', 'control'],
    pitch: 'Мягкая круглая ракетка для первых сезонов: прощает неточный удар и бережёт руку.',
    specs: [
      ['Форма', 'Круглая'],
      ['Вес', '360 г'],
      ['Баланс', 'Низкий, в ручку']
    ],
    level: 'Новичок, любитель (уровни D, D+)',
    construction: 'Карбоновая рама, поверхность из фибергласа',
    core: 'EVA Soft Core',
    surface: 'Матовая MatControl Finish',
    balanceTuning: false,
    price: 5900,
    clubPrice: 5605,
    image: { src: 'assets/img/products/nine.webp', alt: 'Ракетка PRONINE Nine Control It: круглая голова, бело-чёрный корпус с красными акцентами' }
  },
  {
    id: 'glow',
    tags: ['Круглая форма', '360 г', 'GripGlow Texture'],
    name: 'Glow',
    series: 'Control It',
    route: 'product/glow',
    group: ['start', 'control', 'progress'],
    pitch: 'Круглая форма Control It и шероховатая поверхность GripGlow для освоения вращения.',
    specs: [
      ['Форма', 'Круглая'],
      ['Вес', '360 г'],
      ['Поверхность', 'GripGlow Texture']
    ],
    level: 'Новичок и прогрессирующий (уровни D, D+, C)',
    construction: 'Карбоновая рама, поверхность из фибергласа',
    core: 'EVA Soft Core',
    surface: 'Рельефная GripGlow Texture',
    balanceTuning: false,
    price: 6900,
    clubPrice: 6555,
    variants: [
      { id: 'rose', label: 'Rose', swatch: '#E58FB6', src: 'assets/img/products/glow-rose.webp', alt: 'Ракетка PRONINE Glow Control It в цвете Rose: бело-чёрная с розовыми акцентами' },
      { id: 'mint', label: 'Mint', swatch: '#7FD9A4', src: 'assets/img/products/glow-mint.webp', alt: 'Ракетка PRONINE Glow Control It в цвете Mint: бело-чёрная с мятными акцентами' },
      { id: 'peach', label: 'Peach', swatch: '#F2A988', src: 'assets/img/products/glow-peach.webp', alt: 'Ракетка PRONINE Glow Control It в цвете Peach: бело-чёрная с персиковыми акцентами' }
    ],
    image: { src: 'assets/img/products/glow-rose.webp', alt: 'Ракетка PRONINE Glow Control It в цвете Rose: бело-чёрная с розовыми акцентами' }
  },
  {
    id: 'nexit',
    tags: ['Diamond Hybrid', '12K Carbon', 'Smart Balance'],
    name: 'Nexit',
    series: 'Complete It',
    route: 'product/nexit',
    group: ['progress', 'power'],
    pitch: 'Шаг к атакующему паделу: гибридная ромбовидная форма, карбон 12K и настройка баланса.',
    specs: [
      ['Форма', 'Diamond Hybrid'],
      ['Вес', '360 г'],
      ['Баланс', 'Настраиваемый']
    ],
    level: 'Прогрессирующий игрок',
    construction: 'Карбон 12K',
    core: 'EVA Medium',
    surface: 'Текстура для вращения',
    balanceTuning: true,
    price: 10400,
    clubPrice: 9890,
    image: { src: 'assets/img/products/nexit.webp', alt: 'Ракетка PRONINE Nexit: чёрная карбоновая поверхность с красной надписью PRONINE' }
  },
  {
    id: 'solar',
    tags: ['Алмазная форма', '18K Carbon', '3 цвета'],
    name: 'Solar',
    series: 'Profi Series',
    route: 'product/solar',
    group: ['power'],
    pitch: 'Флагман для игры первым номером: алмазная форма, 18K Carbon и жёсткий сердечник EVA Hard.',
    specs: [
      ['Форма', 'Алмазная'],
      ['Вес', 'около 365 г'],
      ['Баланс', 'В голову, настраиваемый']
    ],
    level: 'Активный любитель, продвинутый игрок',
    construction: '18K Carbon',
    core: 'EVA Hard Core',
    surface: 'Spin Control',
    balanceTuning: true,
    colorsNote: '3 цвета',
    price: 16400,
    clubPrice: 15580,
    image: { src: 'assets/img/products/solar-gold.webp', alt: 'Ракетка PRONINE Solar Profi Series в цвете Gold: чёрный карбон с золотыми лучами' }
  }
];

export const filters = [
  { id: 'all', label: 'Все модели' },
  { id: 'start', label: 'Для старта' },
  { id: 'progress', label: 'Для прогресса' },
  { id: 'power', label: 'Для атаки' }
];

export const compareRows = [
  ['Серия', p => p.series],
  ['Для кого', p => p.level],
  ['Форма', p => p.specs[0][1]],
  ['Конструкция', p => p.construction],
  ['Сердечник', p => p.core],
  ['Поверхность', p => p.surface],
  ['Настройка баланса', p => (p.balanceTuning ? 'Smart Balance' : 'Нет, баланс низкий')],
  ['Цена', p => formatPrice(p.price)]
];

export function formatPrice(value) {
  return new Intl.NumberFormat('ru-RU').format(value).replace(/ /g, ' ') + ' ₽';
}
