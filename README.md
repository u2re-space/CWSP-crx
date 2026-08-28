# CWSP-crx

Единственный владелец **Chrome-расширения** (Manifest V3). New Tab берёт среду CWSP-shell; на странице — context menu и CRX Snip.

Не собирать CRX из shell / document / shared: `npm run build:crx` живёт здесь. У shell одноимённый скрипт только вызывает этот пакет.

## Что внутри

- New Tab → Speed Dial / environment-shell.
- Settings из `settings-view`.
- Markdown viewer и инструменты страницы.
- CRX Snip: выделение области, снимок, опционально AI-распознавание (провайдер в Settings).
- Закладки в App Menu (info / правка URL / удаление через `chrome.bookmarks`).

## Сборка

```bash
cd apps/CWSP-crx
npm run build:crx
# Chrome → Расширения → Load unpacked → apps/CWSP-crx/dist
```

`npm run dev` здесь тоже собирает CRX (не Vite-сервер).
