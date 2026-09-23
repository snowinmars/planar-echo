# `@planar/shared` agent guide

Scope: this file is the closest guidance for `planar-shared/**`; inherit repository-wide policy from [the root guide](../AGENTS.md).

## Ownership

- Own contracts shared across process and package boundaries, not orchestration or package-specific policy.
- The public `.` export covers browser-safe Ghost types, dialogue helpers, geometry, play protocol, host contracts, mod composition contracts, and general utilities.
- The public `./node` export is the explicit home for filesystem, process, and package-location helpers.
- Own Ghost resource contracts under [`src/ghost/`](src/ghost/).
- Own play IPC and replication contracts in [`src/play/protocol.ts`](src/play/protocol.ts).
- Own client/server mod host surfaces in [`src/play/host.ts`](src/play/host.ts) and the mutation request boundary in [`src/play/worldEffect.ts`](src/play/worldEffect.ts).
- Own manifest and active-composition types, parsing, and validation.
- Own the project `Maybe` implementation in [`src/maybe.ts`](src/maybe.ts).

## Hard boundaries

- `shared` must not import `kernel`, `daemon`, `mods`, `prism`, `asclepius`, or `shell`.
- Keep everything exported from `.` browser-compatible: no `fs`, `path`, Node globals, or Node-only transitive imports.
- Put Node-only helpers behind `@planar/shared/node`; do not make browser consumers depend on that subpath.
- Contracts describe mechanisms. Default PST:EE policy and concrete runtime orchestration belong elsewhere.
- Do not duplicate a wire or Ghost shape in a consumer when the shape is genuinely cross-package.

## Current sources of truth

- Package exports and build surface: [`package.json`](package.json).
- Browser-safe barrel: [`src/index.ts`](src/index.ts).
- Node-only barrel: [`src/node.ts`](src/node.ts).
- Ghost types: [`src/ghost/`](src/ghost/).
- Play protocol: [`src/play/protocol.ts`](src/play/protocol.ts).
- Host interfaces: [`src/play/host.ts`](src/play/host.ts).
- Effects: [`src/play/worldEffect.ts`](src/play/worldEffect.ts).
- Manifest concepts and required slots: [`src/play/modManifest.ts`](src/play/modManifest.ts).
- Strict manifest parser: [`src/play/parseModManifest.ts`](src/play/parseModManifest.ts).
- Active composition validator: [`src/play/validateActiveJsonMods.ts`](src/play/validateActiveJsonMods.ts).
- Prism IPC messages and progress steps: [`src/prismIndexStartMessage.ts`](src/prismIndexStartMessage.ts) and [`src/progress.ts`](src/progress.ts).

## Workflow

- Build: `yarn workspace @planar/shared build`
- Lint: `yarn workspace @planar/shared lint`
- Build `shared` before manually building a dependent workspace.
- Keep exports intentional: add a barrel export only when the symbol is part of a supported cross-package surface.

## Cross-package impact checklist

- For play protocol changes, update daemon send/receive logic, Asclepius relay assumptions, Shell replication, and relevant mods together.
- For `WorldEffect` or host changes, update daemon validation/application and every affected server or client mod.
- For manifest or active-composition changes, update parsers, validation, daemon boot, Asclepius schemas/services, Shell boot/editor, and default mod data.
- For Ghost type changes, update Prism writers and every Asclepius/Shell/daemon reader.
- For Prism IPC/progress changes, update Prism and Asclepius in the same change.
- Confirm public `.` still resolves in browser builds and `./node` remains isolated.

## Migration hazards

- Exact manifest, active JSON, IPC, and REST-adjacent shapes are source-defined migration surfaces; do not freeze copies in documentation.
- `parseModManifest` rejects missing, duplicate, unknown, or side-incompatible declarations; preserve fail-closed behavior.
- `validateActiveJsonMods` encodes composition invariants used by both daemon and Shell; do not fork its logic.
- `Maybe` preserves `false`, `0`, and `''`; do not replace its checks with truthiness.
- A shared type edit can compile locally while breaking generated clients or runtime-loaded mods, so follow the full ripple before handoff.
