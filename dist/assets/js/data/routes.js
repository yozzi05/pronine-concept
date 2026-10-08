/*
 * Карта разделов будущего магазина.
 * В демо реализована только главная: все остальные разделы имеют enabled: false
 * и выводятся в интерфейсе как неактивные элементы без перехода.
 * Заготовки страниц лежат в /future-pages (вне публикуемой папки dist).
 * Чтобы открыть раздел, достаточно добавить страницу и выставить enabled: true.
 */

export const routes = {
  home:        { path: '/',                     title: 'Главная',               enabled: true },

  catalog:     { path: '/catalog/',             title: 'Каталог',               enabled: false },
  rackets:     { path: '/catalog/rackets/',     title: 'Ракетки',               enabled: false },
  balls:       { path: '/catalog/balls/',       title: 'Мячи',                  enabled: false },
  accessories: { path: '/catalog/accessories/', title: 'Аксессуары',            enabled: false },
  apparel:     { path: '/catalog/apparel/',     title: 'Одежда',                enabled: false },
  product:     { path: '/product/:slug/',       title: 'Карточка товара',       enabled: false },

  choose:      { path: '/help/choose/',         title: 'Помощь с выбором',      enabled: false },
  brand:       { path: '/brand/',               title: 'О бренде',              enabled: false },
  technology:  { path: '/technology/',          title: 'Технологии',            enabled: false },
  clubs:       { path: '/clubs/',               title: 'Падел-клубы России',    enabled: false },
  partners:    { path: '/partners/',            title: 'Партнёрская программа', enabled: false },
  wholesale:   { path: '/partners/wholesale/',  title: 'Опт',                   enabled: false },
  ambassadors: { path: '/partners/ambassadors/',title: 'Амбассадоры',           enabled: false },
  blog:        { path: '/blog/',                title: 'Блог',                  enabled: false },

  delivery:    { path: '/help/delivery/',       title: 'Доставка',              enabled: false },
  payment:     { path: '/help/payment/',        title: 'Оплата',                enabled: false },
  warranty:    { path: '/help/warranty/',       title: 'Гарантия',              enabled: false },
  returns:     { path: '/help/returns/',        title: 'Обмен и возврат',       enabled: false },
  contacts:    { path: '/contacts/',            title: 'Контакты',              enabled: false },

  offer:       { path: '/legal/offer/',         title: 'Публичная оферта',      enabled: false },
  privacy:     { path: '/legal/privacy/',       title: 'Политика конфиденциальности', enabled: false },
  terms:       { path: '/legal/terms/',         title: 'Условия покупки',       enabled: false },

  search:      { path: '/search/',              title: 'Поиск',                 enabled: false },
  favorites:   { path: '/favorites/',           title: 'Избранное',             enabled: false },
  account:     { path: '/account/',             title: 'Личный кабинет',        enabled: false },
  cart:        { path: '/cart/',                title: 'Корзина',               enabled: false }
};

export const SOON_LABEL = 'Здесь стоит заглушка';
