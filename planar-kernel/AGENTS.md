# `@planar/kernel` agent guide

Scope: this file is the closest guidance for `planar-kernel/**`; inherit repository-wide policy from [the root guide](../AGENTS.md).

## Ownership

- Own the small, policy-free `World` data model and deterministic transformations over it.
- Own walk-grid and cell math, including coordinate conversion, passability, painting, and polygon checks.
- Own World construction, authoritative snapshot creation, and client-side patch folding.
- Current verified exports are defined by [`src/index.ts`](src/index.ts); do not infer broader engine coverage from the package name.
- Kernel supplies mechanisms used by daemon and Shell. It does not decide game behavior.

## Hard boundaries

- No clock, process lifecycle, IPC, HTTP, WebSocket, Express, Pixi, filesystem access, or dynamic mod loading.
- No default PST:EE policy, hook ordering, commands, area-loading orchestration, pathfinding policy, or authoritative session ownership.
- Do not import `daemon`, `mods`, `prism`, `asclepius`, or `shell`.
- Keep functions deterministic for the same explicit inputs; do not read ambient time, random state, environment, or global mutable state.
- Mutation is acceptable only where the API explicitly mutates a provided World or typed buffer; avoid hidden aliases and accidental shared state.

## Kernel versus daemon

- Kernel defines World shape and reusable transforms.
- Daemon owns the live World, advances time, validates commands/effects, and is the authoritative writer.
- `foldPatches` updates a replicated snapshot; it is catch-up logic, not client simulation.
- New replaceable game behavior belongs in server mods and reaches World through daemon-applied `WorldEffect`.

## Current sources of truth

- Package surface and commands: [`package.json`](package.json).
- Public exports: [`src/index.ts`](src/index.ts).
- World shape: [`src/world/types.ts`](src/world/types.ts).
- World construction: [`src/world/createWorld.ts`](src/world/createWorld.ts).
- Snapshot creation: [`src/world/snapshotWorld.ts`](src/world/snapshotWorld.ts).
- Patch folding: [`src/world/foldPatches.ts`](src/world/foldPatches.ts).
- Cell and walk-grid operations: [`src/cell/math.ts`](src/cell/math.ts).
- Shared protocol and geometry inputs remain owned by [`@planar/shared`](../planar-shared/AGENTS.md).

## Workflow

- Build: `yarn workspace @planar/kernel build`
- Lint: `yarn workspace @planar/kernel lint`
- Handoff test, only with user permission: `yarn workspace @planar/kernel test`
- Keep unit tests beside source as `src/**/*.spec.ts`.

## Cross-package impact checklist

- For World shape changes, update daemon construction/mutation, snapshot creation, and all kernel consumers.
- For snapshot or patch-folding changes, verify the shared protocol, daemon emitters, and Shell replica together.
- For walk-grid semantics, verify daemon overlays, default pathing/collision mods, and Shell rendering assumptions.
- For public export changes, build dependent workspaces in dependency order.
- Preserve structured cloning or equivalent isolation where snapshots cross authority boundaries.

## Migration hazards

- Do not move a daemon race fix into kernel by adding lifecycle state; fix ownership at the daemon boundary.
- Do not treat currently exported helpers as a complete simulation engine.
- A convenient game constant or special case in kernel becomes unreplaceable policy; keep it in shared contracts only when universal, otherwise in mods.
- Typed-array operations can mutate shared buffers; make copy-versus-view behavior explicit.
