# planar-echo

Документ только для LLM-агентов при написании кода в этом монорепозитории. Обзор для людей: [README.md](README.md). Вызов инструментов контекста (rag-code, lean-ctx): [.cursor/rules/](.cursor/rules/) - здесь не дублировать.

## If you are llm agent

- Language: TypeScript, ESM, Node.js
- Build: `yarn && yarn build`
- Test: `yarn test` (don't run without asking)

## Обязательное поведение

- Не создавать git-коммиты без явной просьбы пользователя.
- Не запускать тесты самостоятельно. Сообщить пользователю команды: `yarn test`, `yarn workspace @planar/prism test`, `yarn workspace @planar/shell test`.
- Код: SOLID. Без гонок данных (fork/IPC, WebSocket, общий mutable state, RxJS-потоки).
- Все пути к игре, WeiDU и ghost - на машине пользователя; в git игровых ассетов быть не должно.
- Функциональный стиль, но без фанатизма.

## Запрещённые паттерны

| Запрет | Требование |
|--------|------------|
| Повторное чтение одного файла | Один проход на задачу (включая разные offset) |
| `ctx_tree` без пути | Только с явным путём от пользователя |
| `hybrid_search` при известном пути к файлу | `ctx_read` или точечный поиск по известному пути |
| Вывод тестов/логов >500 строк | Спросить разрешение до загрузки в контекст |
| Коммит `planar-ghost/**` | Запрещено (конвертированные данные, возможный копирайт игры) |
| Коммит оригинальных игровых файлов | Запрещено |

## Монорепозиторий

| Пакет npm | Каталог | Роль |
|-----------|---------|------|
| `@planar/shared` | `planar-shared/` | Типы IPC, `dialogueEngine`, enums игр/языков, mappers; entry `@planar/shared/node` для Node |
| `@planar/prism` | `planar-prism/` | CLI + IPC: biff → JSON → Ghost TS |
| `@planar/asclepius` | `planar-asclepius/` | Express, static Shell/Ghost, REST, WS, fork Prism |
| `@planar/shell` | `planar-shell/` | React, Zustand, MUI, Vite |
| - | `planar-ghost/` | Артефакт на диске пользователя; **не** Yarn workspace |

- Менеджер: Yarn 4 (`packageManager` в корневом `package.json`).
- Зависимость: `"@planar/shared": "workspace:*"` в потребителях.
- Сборка из корня: `yarn` → `yarn build`.
- `@planar/shared` собирается до prism/asclepius через граф workspace.
- ESM: `"type": "module"`, TypeScript, `tsc-alias`.
- Лицензия исходников репозитория: GPL-3.0-or-later. Контент Ghost - лицензия оригинальной игры.

## Компоненты

- **planar-prism** - Node.js CLI (TypeScript). Парсит `.biff` → JSON → Ghost TS. `yarn start` (build + `node dist/index.js`) или дочерний процесс `process.fork` с IPC.
- **planar-ghost** - формат и каталог вывода: семантический эквивалент данных игры в открытом виде. Раздаётся Asclepius как static под `/ghost`.
- **planar-shell** - фронтенд: мастер конверсии, просмотр ghost (диалоги/существа/предметы), настройки. REST + WebSocket к Asclepius.
- **planar-asclepius** - сервер: serve Shell на `/`, ghost-файлы, оркестрация Prism (build → fork → build-ghost), ретрансляция IPC → WebSocket.
- **planar-shared** - общий код для Prism, Asclepius, Shell и Ghost.

## Поток данных

1. Пользователь задаёт WeiDU, CHITIN.KEY (игру), каталог ghost, язык в Shell (localStorage + REST validate).
2. Конверсия: Shell → WebSocket `/api/prism/index`, сообщение `{ type: 'start', data }` (`PrismIndexStartMessage['data']` из `@planar/shared`).
3. Asclepius: `yarn workspace @planar/prism build` → `fork(prism/dist/index.js)` + IPC → `yarn workspace @planar/prism build-ghost`.
4. Prism: WeiDU extract → parse → JSON + Ghost TS; прогресс через `process.send`; логи в stdout/stderr (наследуются Asclepius).
5. Asclepius шлёт клиенту `ready` | `progress` | `error` | `complete`.
6. Просмотр: Shell → REST `/api/ghost/*` + `@planar/shared` `dialogueEngine` / shell `engine/dialogueLogic.ts`.

Связь Asclepius ↔ Prism: **только Node IPC**, не HTTP и не разбор stdout для прогресса.

## Prism - pipeline

Порядок шагов (`planar-prism/src/steps/`):

1. `1.createPaths` - context for next operations: output dirs, `weiduExe`, `chitinKey`, `gameLanguage`, `gameName`
2. `2.validate` - WeiDU и пути игры
3. `3.decompileBiffs` - run WeiDU, use cache
4. `4.biffs2json` - бинарники → JSON (`pstee/`: cre, dlg, eff, ini, itm, tlk, ids, …)
5. `5.json2Ghost` - JSON → TS Ghost (`discoverer` регистрирует ресурсы)
6. `6.saveDiscovered` - метаданные обнаружения

**Режимы**

- CLI: интерактивное подтверждение (если не dev-флаги); дефолты в `planar-prism/src/index.ts`.
- IPC: `process.on('message')`, `{ type: 'start', data }`; без confirm; прогресс `process.send`.

**Прогресс:** `planar-prism/src/shared/report.ts` - RxJS `buffer` flush **250 ms**; дедупликация последнего по `ProgressStep` (`prismIndexStartMessage.ts`, `progressSteps` в shared).

**Игры:** enum `gameName` шире списка; **реализованы парсеры pstee** (Planescape: Torment EE).

Точка входа: `planar-prism/src/index.ts`. Обнаружение: `discoverer.ts`. Бинарное I/O: `shared/bufferReader.ts`, `shared/writer.ts`.

## Asclepius - оркестратор

- Порт: `process.env.PORT` или **3003**. Shell dev (Vite): **3000**; CORS origin `http://localhost:3000`.
- Fork: `planar-asclepius/src/shared/runPrismScript.ts`.
- Static: production Shell - `/` (SPA fallback вне `/api`). Ghost bundles - запросы `/ghost/*` через `ghostDirAction` (не только `express.static` на один dist).
- Swagger UI: `/api/swagger`. Live OpenAPI JSON: `GET /api/openApi`.

**REST** (`planar-asclepius/src/controllers/router.ts`) - типично JSON body, если нужна схема api - смотри planar-asclepius/src/swagger/swagger.json.

**WebSocket:** path `/api/prism/index` (`wsController/router.ts`). Сервер сразу шлёт `{ type: 'ready' }`. Клиент: `{ type: 'start', data }` с полями `weiduExeDir`, `chitinKeyFile`, `ghostDir`, `prismDir`, `gameLanguage`, `gameName`.

**Оркестрация index** (`wsController/prism/runIndex.ts`): steps `buildPrism` → IPC prism → `dlg_json2ghost_build` (`build-ghost`).

После изменения REST/Zod-роутов **ПОТРЕБУЙ** у пользователя обновить api клиентов в shell вручную.

## Ghost на диске

- Текстовые и бинарные артефакты, not a single text Domain-Specific Language: промежуточный **JSON** и **TS** на диске; runtime для движка - **bundled JS** под `planar-ghost/ghost/{creatures,dialogues,items,...}/dist`.
- `yarn build:ghost` - esbuild по `planar-ghost/ghost/**/*.ts`, alias `@planar/shared`.
- Каталоги вывода: `ghost/`, `json/`, `decompiledBiff/`

## planar-shared - ключевые модули

- `src/dialogueEngine/` - `registerNpcDialogue`, `translateNpcDialogue`, `createDialogueLogic`; enums в `dialogueEngine/enums/` (prism-autogenerated)
- `src/creatureEngine/`, `src/itemEngine/` - translated/untranslated types
- `src/resourceMappers/` - связи creature/dialogue/item
- `src/prismIndexStartMessage.ts` - IPC/WS типы Prism index
- `src/gameName.ts`, `src/gameLanguage.ts`
- `src/db.ts` - IndexedDB (Shell)
- `@planar/shared/node` - `fileExists` и др. только для Node (Asclepius/Prism)

Собирать shared перед зависимыми пакетами при ручной сборке: `yarn workspace @planar/shared build`.

## Навигация по исходникам

### planar-prism/src/

- `index.ts` - CLI / IPC entry
- `steps/1.createPaths` … `6.saveDiscovered`
- `steps/4.biffs2json/pstee/` - `biff2jsonPstee.ts`, `cre/`, `dlg/`, `eff/`, `ids/`, `ini/`, `itm/`, `tlk/`
- `steps/5.json2Ghost/pstee/` - `json2GhostPstee.ts`, `cre/`, `dlg/`, `itm/`
- `shared/` - `report.ts`, `bufferReader.ts`, `writer.ts`
- `discoverer.ts`, `discoverer.types.ts`

### planar-asclepius/src/

- `index.ts` - Express + HTTP server + WS
- `controllers/` - REST (см. таблицу); `fs/validate/`, `ghost/`, `map/`, `settings/`, `ping/`
- `wsController/router.ts`, `wsController/prism/runIndex.ts`
- `services/fs|ghost|map|settings/`
- `swagger/` - сгенерированный spec; `dev/copy-client.js` для Shell

### planar-shell/src/

- `router/router.tsx` - маршруты: `/`, `/details`, `/convert`, `/dialogue`, `/creature`, `/item`, `/settings`, `/stores`
- `components/Convert/` - мастер конверсии; шаг 6 - WS на `{backendUrl}/api/prism/index` (`store/step6.ts`)
- `components/runners/` - Dialogue, Creature, Item; `dialogueResolution/`
- `components/engine/` - `dialogueLogic.ts`, `store/` (Zustand world)
- `components/Settings/children/` - BackendUrl, GhostDir, PrismDir, ShellDir, LanguageSwitcher, DialogueRendererSwitcher, …
- `components/Stores/` - CharactersTab, NarrativeTab
- `swagger/` - сгенерированный axios-клиент
- `i18n/` - en_US, ru_RU, cs_CZ, de_DE, fr_FR, ko_KR, pl_PL
- Default backend URL: `http://localhost:3003`

Рендереры диалогов (localStorage `dialogueRenderer`): pstee, pstee-two-columns, narrat, mobile.

### planar-ghost/

Только пользовательский вывод. В репозитории - минимальные примеры; не индексировать для правок логики.

## Команды (справочник; тесты - только пользователь)

Execute in repo root.

| Действие | Команда |
|----------|---------|
| Установка | `yarn` |
| Полная сборка | `yarn build` |
| OpenAPI → Shell client | `yarn gen` |
| Backend | `yarn start:asclepius` |
| Frontend dev | `yarn start:shell` |
| Оба (workspace) | `yarn start` |
| Prism CLI | `yarn start:prism` |
| Docker | `docker compose build && docker compose up` → http://localhost:3003 |
| Тесты | `yarn test` (prism Mocha + shell Vitest) |

## Правила при изменении кода

- Меняешь REST или Zod-контракты в Asclepius → **ТРЕБУЕШЬ** у пользователя обновить api клиентов в shell вручную.
- Prism остаётся автономным CLI; не вшивать обязательную зависимость от Asclepius внутри prism.
- Прогресс Prism: structured IPC; человекочитаемые логи - stdout/stderr.
- WeiDU должен быть установлен у пользователя; пути передаются из UI/CLI, не из репозитория.
- Не добавлять copyrighted game data в git.

## Ключевые решения (не нарушать)

- Asclepius ↔ Prism: `process.fork` + IPC (`process.send` / `message`).
- Прогресс Prism: throttle/dedupe 250 ms (RxJS).
- Shell: WebSocket для index pipeline; REST для ghost API и validate.
- Платформа: Node.js; кроссплатформенность на стороне оркестрации, не в бинарных парсерах игры.
