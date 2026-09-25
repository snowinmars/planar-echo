# `@planar/asclepius` agent guide

Scope: closest guidance for `planar-asclepius/**`; inherit the root guide.

## Status and ownership

- **VERIFIED CURRENT STATE:** own HTTP/REST, live and stored OpenAPI, Shell and
  Ghost delivery, defaults/paths, Prism WebSocket orchestration, and the Prism
  child process.
- **VERIFIED CURRENT STATE:** there is no play WebSocket, daemon spawn, mod
  composition API, or runtime-mod static route after Milestone 0.
- **NORMATIVE TARGET:** compose explicit local client-host, remote
  session-gateway, or combined solo roles without simulating.

## Hard boundaries

- No authoritative World mutation, command handling, game policy, or
  simulation.
- Start workers through `process.fork` and structured IPC; stdout/stderr remain
  human logs.
- Keep Prism independently executable; do not turn it into an in-process
  converter.
- Preserve root confinement, file checks, and allowlists on every artifact
  route.
- Keep user paths, defaults, Ghost output, WeiDU, and installed artifacts local
  and out of git.
- Do not reintroduce legacy `/api/play`, `/api/mods*`, `/mods/*`, or
  `active.json` behavior.

## HTTP, paths, and WebSocket

- HTTP composition root: [`src/createApp.ts`](src/createApp.ts)
- REST/OpenAPI registration: [`src/controllers/router.ts`](src/controllers/router.ts)
- WebSocket upgrade router: [`src/wsController/router.ts`](src/wsController/router.ts)
- Prism orchestration: [`src/wsController/prism/`](src/wsController/prism/)
- Path schema and one-shot load: [`src/shared/createPaths.types.ts`](src/shared/createPaths.types.ts)
  and [`src/shared/pathsStore.ts`](src/shared/pathsStore.ts). The process reads
  `asclepius.defaults.json` beside the entry before `listen` and never writes it.
- Request path attachment: [`src/middleware/attachPlanarDirs.ts`](src/middleware/attachPlanarDirs.ts)
  assigns that snapshot. There is no cookie override and no PUT/PATCH of paths.

Retained daemon/kernel/mod path fields are migration scaffolding, not a current
runtime. `POST /api/fs/validate/modsDir` validates a configured directory only;
it does not install or compose mods.

## API discipline

- Update implementation, Zod validation, OpenAPI registration, stored
  `swagger.json`, generated Asclepius/Shell clients, and call sites atomically.
- Generate clients with `yarn gen`; never hand-edit generated files.
- Exact endpoint DTOs are active migration surfaces; inspect source.
- Keep every WebSocket server in `noServer` mode and route upgrades through the
  single router.
- Serialize child/socket lifecycle transitions and remove all listeners during
  teardown.

## Workflow

- Start: `yarn workspace @planar/asclepius start`
- Build: `yarn workspace @planar/asclepius build`
- Serve built output: `yarn workspace @planar/asclepius serve`
- Generate API clients: `yarn workspace @planar/asclepius gen`
- Lint: `yarn workspace @planar/asclepius lint`

Prism IPC changes require coordinated shared and Prism changes. Ghost layout or
types require coordinated Prism, shared/IE, delivery, and Shell-reader changes.
