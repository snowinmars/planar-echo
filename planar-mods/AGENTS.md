# `@planar/mods` agent guide

Scope: this file is the closest guidance for `planar-mods/**`; inherit repository-wide policy from [the root guide](../AGENTS.md).

## Ownership

- Own the default PST:EE reference composition as replaceable client and server mods.
- Each source mod lives in `<mod-id>/`, declares `mod.json`, and may provide `src/client.ts`, `src/server.ts`, or both according to its declared sides.
- [`factory-active.json`](factory-active.json) selects default slot providers and ordered server/client hooks plus queries.
- Default mods demonstrate and supply game policy; they are not privileged engine internals.
- A different valid mod may replace an exclusive capability provider without changing kernel or daemon policy.

## Source, build, and runtime

- `planar-mods/` is authored source.
- `planar-mods/dist/` is generated build output containing `factory-active.json`, copied manifests, and side-specific bundles.
- `planar-mods-runtime/` is the installed, user-local runtime consumed by daemon and Shell; it is not this workspace.
- Do not edit `dist` or runtime bundles as source and do not add agent guidance under either artifact tree.
- [`build.mjs`](build.mjs) is the current bundle list and build source of truth.
- Client entries bundle as browser ESM `client.js`; server entries bundle as Node ESM `server.js`.

## Composition rules

- A manifest's sides, slots, hooks, queries, and dependencies must match its actual exports.
- Current required client slots are `areaRender` and `actorRender`; the exact slot set and validation remain authoritative in [`@planar/shared`](../planar-shared/src/play/modManifest.ts).
- `factory-active.json` should resolve a coherent default composition, including deterministic `serverHooks`/`clientHooks`/query ordering.
- Stackable diagnostics need no exclusive slot; mutually exclusive policy providers do.
- Two-sided mods remain separate bundles sharing one manifest; the client bundle has no direct channel to authoritative World mutation.
- Server mutation requests must be returned as `WorldEffect` for daemon validation/application.

## Trust and authority

- Mods are trusted executable code with no sandbox.
- `server.js` receives the daemon process's ambient Node privileges.
- `client.js` receives application-origin browser privileges and Shell host APIs.
- Manifest validation, versions, and side declarations do not establish safety.
- Client mods are presentation, UI/input, and command-forming code only.

## Current sources of truth

- Package scripts and dependencies: [`package.json`](package.json).
- Build and bundle mapping: [`build.mjs`](build.mjs).
- Factory composition: [`factory-active.json`](factory-active.json).
- Per-mod declarations: each `<mod-id>/mod.json`.
- Per-mod implementation: each `<mod-id>/src/client.ts` and/or `<mod-id>/src/server.ts`.
- Shared host, manifest, active-composition, and effect contracts: [`@planar/shared`](../planar-shared/AGENTS.md).

## Workflow

- Build/typecheck/bundle: `yarn workspace @planar/mods build`
- Lint: `yarn workspace @planar/mods lint`
- Rebuild after changing any mod source, manifest, factory composition, or shared host contract.
- Install defaults through Asclepius rather than copying source folders manually.

## Cross-package impact checklist

- For manifest vocabulary or slot changes, update shared parsing/validation, Asclepius schemas/services, Shell editor/boot, daemon boot, and factory data.
- For client hooks, update shared host types and Shell invocation/cleanup.
- For server hooks, queries, or effects, update shared contracts and daemon validation/application.
- For Ghost assumptions, coordinate with shared Ghost types and Prism output.
- Confirm every declared side produces its required bundle.

## Migration hazards

- Installing defaults copies built mod directories but preserves an existing runtime `active.json`; factory active is only a bootstrap.
- Never make daemon import this workspace to obtain default behavior.
- Session composition should be resolved at boot; runtime installation edits must not silently alter a live session.
- Do not mistake trusted code for safe or sandboxed code.
