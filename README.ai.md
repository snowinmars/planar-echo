# Planar Game Engine – Architecture & Technical Reference

> This document is intended for LLMs and developers who need a complete understanding of the project without direct access to the source code. It combines high‑level architectural descriptions with low‑level implementation details.

## Project Goal

This is an open‑source game engine reconstruction project. The goal is to transform proprietary **Infinity Engine** game data (e.g., *Planescape: Torment*) into an open, extensible JSON format, then run that data on a custom engine. All services run locally – users **must own the original game** files and have **WeiDU** pre‑installed.

---

## Core Components (Overview)

| Component     | Role                                                                                                                                                                                                                                            |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Prism**     | Node.js CLI tool (TypeScript) that parses proprietary binary `.biff` files into JSON and can transform that JSON into a custom “ghost” syntax (the open text js format). Runs independently (`yarn start`) or as an IPC child (`process.fork`). |
| **Ghost**     | The output artifact produced by Prism, and also the name of the format. It is the semantic equivalent of original game data, but in an open, human‑readable format. Served by Asclepius as a static files folder.                               |
| **Shell**     | React + Zustand + MUI frontend. Visualises ghost data (runs the game itself) and provides a UI for users to configure and initiate the parsing pipeline. Connects to Asclepius via REST and WebSocket APIs.                                     |
| **Asclepius** | Node.js server that serves the Shell frontend, serves Ghost files, and orchestrates Prism execution. Spawns Prism as a fork process, receives progress events via IPC, and relays them to the Shell through WebSocket.                          |

---

## High‑Level Data Flow

1. User selects paths to local tools (WeiDU, game data, ghost output) in **Shell**.
2. Shell sends a request to **Asclepius** via WebSocket.
3. Asclepius spawns **Prism** with appropriate arguments (using `fork`, capturing stdout, and establishing an IPC channel).
4. Prism reports progress via `process.send`.
5. Asclepius listens for IPC messages and broadcasts them to connected Shell clients via WebSocket.
6. Upon completion, Asclepius notifies Shell. The resulting ghost artifacts are then available for the custom engine.

---

## Key Design Decisions

- **Prism remains a standalone CLI tool** – it can be invoked manually or orchestrated by Asclepius.
- **Communication between Asclepius and Prism** uses Node.js IPC (not HTTP or stdio parsing).
- **Progress events are throttled and deduplicated** per step in Prism using RxJS `buffer` with a timed window (every 250 ms).
- **Logging in Prism** goes to stdout/stderr and is inherited by Asclepius: logs are for humans, IPC is for structured progress data.
- **Shell uses WebSocket** for real‑time progress updates.
- The architecture is **platform‑agnostic** (Node.js handles cross‑platform compatibility).
- **All filesystem access** happens on the user’s machine – no game assets are stored in the repository.

---

## Detailed Technical Reference

### Paths & Folder Structure (Asclepius)

Asclepius resolves paths relative to itself: `../../../planar-ghost`, `../../../planar-shell`, `../../../planar-prism` (`planar-asclepius/src/shared/folders.ts`). Missing dirs → exit code 17.

---

### Prism pipeline (`planar-prism/src/index.ts`)

Sequential steps:

1. **createPathes** — output dirs under user `ghost` path; `weiduExe`, `chitinKey`, `gameLanguage`, `gameName`.
2. **validate** — WeiDU executable reachable; game/key paths.
3. **decompileBiffs** — WeiDU `--list-biffs` / `--biff-get`; cache in output; progress step `decompileBiffs`.
4. **biffs2json** — binary → JSON per resource (`pstee/`: cre, dlg, eff, ini, itm, tlk, ids, …).
5. **json2Ghost** — JSON → TypeScript Ghost modules (discoverer registers resources).
6. **saveDiscovered** — persist discovery metadata.

**Modes**

- **CLI**: `yarn start` → compile + `node dist/index.js`; interactive confirm unless dev flags; hardcoded defaults in `index.ts` when not IPC.
- **IPC**: child of Asclepius; `process.on('message')` handles `{ type: 'start', data }`; silent, no confirm; progress via `process.send`.

**Progress reporting** (`planar-prism/src/shared/report.ts`): RxJS `buffer` flushed every **250ms**; dedupe latest per `ProgressStep` from `@planar/shared` (`prismIndexStartMessage.ts`).

---

### `planar-shared` (build before others)

- IPC types: `PrismIndexStartMessage`, progress/complete/error/ready messages, `progressSteps`.
- `gameName` / `gameLanguage` enums (UI lists many games; **implemented parsers** are pstee-centric in Prism).
- **dialogueEngine**: `registerNpcDialogue`, `translateNpcDialogue`, `createDialogueLogic` — used by Shell and Ghost bundles.
- **Node-only**: `@planar/shared/node` (`fileExists`, etc.) for Asclepius/Prism.

Install pattern: `yarn --cwd planar-shared start` then `yarn add file:../planar-shared --force` in other packages (see `README.md`, `_dev/reinstall-shared.*`).

---

### Ghost (`planar-ghost/**`)

- **Not a single text DSL**: intermediate **JSON** or **JS** on disk; shipped runtime is **bundled JS** under `planar-ghost/ghost/{creatures,dialogues,items}/dist`.
- **compile-ghost** (`planar-prism/package.json`): esbuild bundles `../planar-ghost/ghost/**/*.ts` with `@planar/shared` alias.
- Asclepius serves bundles: `app.use('/ghost', express.static(join(ghostDir, 'dist')))`.

---

### Asclepius (`planar-asclepius/src/index.ts`)

- **Port**: `process.env.PORT` or **3003**.
- **Static**: Shell production build at `/`; SPA fallback for non-API routes.
- **REST** (`controllers/router.ts`):
  - `POST /api/fs/validate/chitinKeyPath`, `POST /api/fs/validate/ghostPath`, `POST /api/fs/validate/weiduPath`
  - `GET /api/ping`
  - `GET /api/ghost/dialogue`, `GET /api/ghost/dialogue/{dialogueId}/skeleton`, `/api/ghost/dialogue/{dialogueId}/{gameLanguage}`
  - `GET /api/ghost/creature`, `GET /api/ghost/creature/{creatureId}/skeleton`, `GET /api/ghost/creature/{creatureId}/{gameLanguage}`
  - `GET /api/openApi` — live OpenAPI from Zod registry
- **Swagger UI**: `/api/swagger`
- **WebSocket**: `ws` on path **`/api/prism/index`** (`wsController/router.ts`).

**Prism index orchestration** (`wsController/prism/runIndex.ts`):

1. `yarn --cwd planar-prism compile` (step `compilePrism`)
2. `fork(prism/dist/index.js)` with IPC `{ type: 'start', data }` — stdout/stderr piped to Asclepius process
3. `yarn --cwd planar-prism compile-ghost` (step `dlg_json2ghost_compilation`)

Client messages: JSON `start` with same fields as `PrismIndexStartMessage['data']`; server sends `ready`, then `progress` | `error` | `complete`.

**OpenAPI client**: `yarn gen` in Asclepius → `push-client` copies `src/swagger` to `planar-shell/src/swagger` (axios SDK).

---

### Shell (`planar-shell`)

- **Routes** (`src/router/router.tsx`): `/`, `/details`, `/convert`, `/run`, `/settings`.
- **Convert** (`components/Convert`): multi-step wizard; **step 6** opens WebSocket to `{serverUrl}/api/prism/index` (`store/step6.ts`).
- **Run** (`components/Run`): loads dialogue via REST ghost APIs + `@planar/shared` dialogue engine; renderers: pstee, narrat, mobile (localStorage `dialogueRenderer`).
- **Settings**: backend URL default `http://localhost:3003`.
- **Dev**: `yarn start` → Vite **3000**; point UI at Asclepius **3003**.

---

## End-to-end data flow

1. User configures **WeiDU path**, **CHITIN.KEY / game folder**, **ghost output folder**, language, game in Shell (localStorage + REST validation).
2. User starts conversion → Shell **WebSocket** `start` → Asclepius compiles Prism, **forks** `index.js`, runs **compile-ghost**.
3. Prism: WeiDU extract → parse → write JSON + Ghost TS → IPC progress → Asclepius → WS → Shell UI.
4. User opens **Run** → Shell fetches Ghost dialogue/creature via **REST** → renders with shared dialogue logic.

All filesystem access is on the user machine; no game assets in the repo.

---

## Run / develop

| Mode        | Command                                     | URL                                                 |
| ----------- | ------------------------------------------- | --------------------------------------------------- |
| Docker      | `docker compose build && docker compose up` | `http://localhost:3003` (all-in-one)                |
| Dev helper  | `_dev/start.ps1` or `_dev/start.sh`         | Builds prism + shell, starts Asclepius (see script) |
| Manual      | Asclepius `yarn start`; Shell `yarn start`  | Backend **3003**, frontend **3000**                 |
| Prism alone | `yarn --cwd planar-prism start`             | CLI only                                            |

Prism tests: `yarn --cwd planar-prism test` (Mocha). Shell: Vitest.

---

## Conventions for contributors

- **ESM** (`"type": "module"`), TypeScript, path aliases via `tsc-alias`.
- Typo **pathes** is intentional in Prism step code (`createPathes`, etc.).
- **GPL-3.0-or-later** on repo packages; Ghost **content** may fall under original game license (see `README.md`).
- **DO NOT COMMIT COPYRIGHTED GAME FILES OR FILES FROM PLANAR-GHOST DIRECTORY.**
- When changing REST routes, regenerate OpenAPI + Shell client (`planar-asclepius` `yarn gen`).
