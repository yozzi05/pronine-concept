# Передача контекста (на 8 октября 2026)

## Где что
- Проект: `C:\Users\rutul\.codex\.chatgpt-projects\g-p-695eb5570c948191bf5ead89e3eb3557\pronine-concept`
  (папка `sources/` уровнем выше — только для чтения, см. AGENTS.md).
- Сайт: `dist/` — статика (HTML + CSS + ES-модули), без сборки.
- Публичная ссылка: https://yozzi05.github.io/pronine-concept/ (GitHub Pages, ветка `gh-pages` = содержимое `dist/`).
- Репозиторий: https://github.com/yozzi05/pronine-concept (публичный, ветка `main`).
- Локальный запуск: `node preview.cjs` → http://127.0.0.1:4173
  Node и Python не в PATH: `C:\Users\rutul\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe`
  и `...\dependencies\python\python.exe` (есть Pillow и numpy).

## Git: особенность папки
Папка создана другим пользователем Windows → git ругается на dubious ownership.
Глобальный конфиг не меняли; команды запускать так:
`git -c safe.directory=C:/Users/rutul/.codex/.chatgpt-projects/g-p-695eb5570c948191bf5ead89e3eb3557/pronine-concept ...`
Push: добавить `-c credential.helper= -c "credential.helper=!gh auth git-credential"`.

## Обновить публичный сайт после правок в dist/
1. Закоммитить в `main` и запушить.
2. `SHA=$(git ... subtree split --prefix dist main)` и `git ... push origin "$SHA:refs/heads/gh-pages" --force`.
(Автодеплой через GitHub Actions пока не настроен.)

## Утверждено пользователем
- Дизайн главной утверждён (Unbounded + Golos Text, Pantone 7627 C ≈ #A72B2A, градиент #160505 → #660700 → #A72B2A).
- Все подсказки неактивных элементов: «Здесь стоит заглушка».
- Пошаговый подбор (3 шага, резюме ответов справа, результат слева).
- Ракетка Solar в первом экране: целиком в кадре, покачивание ±2° / ±3,5 px (≤1023 px: ±1° / ±2 px), цикл 18 с, кнопка паузы.
- Схема Control It: 4 растровых слоя (`dist/assets/img/brand/sketch/`), раскрытие 2,1 с, подписи после, «Повторить анимацию».
  Подготовка слоёв: `docs/sketch-layers.py`, `docs/sketch-cut-lines.json`.

## Правила демо (сохранять)
- Только главная реализована; остальные разделы — неактивные элементы без перехода (`routes.js`, все `enabled: false`).
- Никаких ссылок на padel.pronine.ru или сторонние сайты; нет корзины, оплаты, форм, аналитики; `noindex, nofollow`.
- Факты только из источника; спорные значения — `docs/contradictions.md`.
- Перед крупными правками — коммит (раньше версии копировались в `archive/`, он в .gitignore).

## Проверка
Снимки делались headless Chrome (`C:\Program Files\Google\Chrome\Application\chrome.exe --headless=new --screenshot`)
через обёртку с iframe (узкие ширины < 500 px иначе не эмулируются).
