# `@planar/shared` agent guide

Scope: closest guidance for `planar-shared/**`; inherit the root guide.

## Status and ownership

- **VERIFIED CURRENT STATE:** own browser-safe Ghost contracts, Prism IPC
  messages, dialogue/resource helpers, `Maybe`, geometry, and general
  cross-package utilities.
- **VERIFIED CURRENT STATE:** the legacy play protocol, host, effects, and mod
  composition contracts were removed in Milestone 0.
- **NORMATIVE TARGET:** own game-neutral contract tokens, canonical codecs,
  wire envelopes, modpack-lock types, and browser-safe runtime utilities.
- Ghost contracts remain here temporarily and move to `@planar/ie` in the
  dedicated IE artifact milestone.

The public `.` export must stay browser-safe. Node filesystem, process, and
package-location helpers belong only behind `@planar/shared/node`.

## Hard boundaries

- Do not import kernel, IE implementation, daemon, mods, Prism, Asclepius, or
  Shell.
- Do not restore `Envelope`, `WorldEffect`, hooks, queries, radio slots,
  `active.json`, or another central game-specific union.
- Shared runtime contracts describe mechanisms only. ARE/CRE/PST policy belongs
  in `@planar/ie` or `@planar/mods`.
- Do not duplicate a genuinely cross-package wire or Ghost shape in consumers.
- Preserve `.js` specifiers in TypeScript ESM imports.
- `Maybe` preserves `false`, `0`, and `''`; never replace its checks with
  truthiness.

## Sources of truth

- Package exports: [`package.json`](package.json)
- Browser-safe barrel: [`src/index.ts`](src/index.ts)
- Node-only barrel: [`src/node.ts`](src/node.ts)
- Temporary Ghost types: [`src/ghost/`](src/ghost/)
- Prism IPC/progress: [`src/prismIndexStartMessage.ts`](src/prismIndexStartMessage.ts)
  and [`src/progress.ts`](src/progress.ts)

## Workflow

- Build: `yarn workspace @planar/shared build`
- Lint: `yarn workspace @planar/shared lint`
- Add a barrel export only when it is an intentional cross-package surface.
- Build shared before manually building a dependent workspace.

## Cross-package changes

- Ghost changes currently require coordinated Prism writers and
  Asclepius/Shell readers. The future move to `@planar/ie` must be atomic.
- Prism IPC/progress changes require coordinated Prism and Asclepius updates.
- Future wire/schema changes must update runtime validation, canonical codecs,
  daemon/gateway/Shell consumers, OpenAPI where relevant, and generated clients
  in one change.
