# `@planar/asclepius` agent guide

Scope: this file is the closest guidance for `planar-asclepius/**`; inherit repository-wide policy from [the root guide](../AGENTS.md).

## Ownership

- Own the HTTP server, REST registration, live OpenAPI document, WebSocket routing, static artifact delivery, defaults/paths, and child-process orchestration.
- Compose Shell, Ghost, runtime mods, Prism, and daemon without moving their domain responsibilities into this package.
- Start Prism and daemon through `process.fork` plus structured IPC.
- Relay play messages between WebSocket clients and daemon; do not interpret them as simulation instructions.
- Own server-side active paths/composition resolution used to start a session.

## Hard boundaries

- No authoritative `World` mutation or simulation.
- Do not parse stdout/stderr as Prism or daemon protocol.
- Do not import lower-package internals when an exported contract exists.
- Do not turn Prism into an in-process or Asclepius-dependent converter.
- Keep user paths, defaults files, Ghost output, and runtime mods local.

## HTTP and artifact surfaces

- [`src/createApp.ts`](src/createApp.ts) is the HTTP composition root.
- Dynamic Ghost list/search/skeleton controllers replace per-resource route inventories; exact paths and DTOs remain source-defined.
- Mods list, active composition, default installation, and static client bundle delivery are active migration surfaces.
- Preserve traversal checks and explicit static allowlists. Runtime mod delivery currently permits only `client.js` and `mod.json`; never expose `server.js`.
- Shell SPA, Ghost files/assets, and mod files have distinct roots and validation services.
- Keep controller schemas, services, OpenAPI registration, and error responses aligned.

## Paths, defaults, and cookies

- [`src/shared/createPaths.ts`](src/shared/createPaths.ts) derives package and local artifact locations.
- [`src/shared/createPaths.types.ts`](src/shared/createPaths.types.ts) is the current Zod/type source for the paths object.
- [`src/shared/pathsStore.ts`](src/shared/pathsStore.ts) persists and validates file defaults.
- [`src/helpers/cookie.ts`](src/helpers/cookie.ts) parses and writes per-client path overrides.
- [`src/middleware/attachPlanarDirs.ts`](src/middleware/attachPlanarDirs.ts) resolves cookie paths versus server defaults for each request.
- Defaults and paths are migrating contracts; verify current schemas and Shell call sites before changing them.

## WebSocket and process rules

- [`src/wsController/router.ts`](src/wsController/router.ts) is the single HTTP `upgrade` router.
- Keep each `WebSocketServer` in `noServer` mode and dispatch by pathname from that one router.
- Prism orchestration belongs under [`src/wsController/prism/`](src/wsController/prism/).
- Play lifecycle and daemon relay belong in [`src/wsController/play/attachPlayWs.ts`](src/wsController/play/attachPlayWs.ts).
- Prism fork/IPC helper: [`src/shared/runPrismScript.ts`](src/shared/runPrismScript.ts).
- Daemon fork/IPC helper: [`src/shared/spawnDaemon.ts`](src/shared/spawnDaemon.ts).
- Serialize daemon idle/live/dying transitions and remove child/socket listeners during teardown.

## Current sources of truth

- Process entry: [`src/index.ts`](src/index.ts).
- REST/OpenAPI registration: [`src/controllers/router.ts`](src/controllers/router.ts).
- Dynamic Ghost controllers: [`src/controllers/ghost/`](src/controllers/ghost/).
- Mods controllers and schemas: [`src/controllers/mods/`](src/controllers/mods/).
- Static allowlist services: [`src/services/assets/file/action.ts`](src/services/assets/file/action.ts) and [`src/services/mods/file/action.ts`](src/services/mods/file/action.ts).
- Stored OpenAPI input for generation: [`src/swagger/swagger.json`](src/swagger/swagger.json).
- Client generator configuration: [`openapi-ts.config.ts`](openapi-ts.config.ts).

## Workflow

- Start development server: `yarn workspace @planar/asclepius start`
- Build: `yarn workspace @planar/asclepius build`
- Serve built output: `yarn workspace @planar/asclepius serve`
- Generate and copy the Shell API client: `yarn workspace @planar/asclepius gen`
- Lint: `yarn workspace @planar/asclepius lint`

## API change checklist

- Update route/service behavior and shared contract types.
- Update Zod runtime validation and OpenAPI registration.
- Refresh the stored OpenAPI document used by the generator.
- Regenerate the Shell client and update every Shell call site atomically.
- Recheck defaults and mod DTOs in particular; current manual and generated consumers may coexist during migration.

## Cross-package impact and hazards

- Prism IPC changes affect shared contracts and Prism.
- Play IPC changes affect shared, daemon, and Shell even when the relay stays opaque.
- Artifact layout changes affect Prism output, daemon loaders, and Shell readers.
- Static delivery changes are security-sensitive: retain root confinement, file checks, and allowlists.
- Current session orchestration is not evidence of hardened multiplayer security or sandboxing.
