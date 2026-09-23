# `@planar/daemon` agent guide

Scope: this file is the closest guidance for `planar-daemon/**`; inherit repository-wide policy from [the root guide](../AGENTS.md).

## Ownership

- Own the authoritative live `World`, its 30 Hz clock, command handling, snapshots, patches, and daemon IPC.
- Own server-mod boot, ordered hook/query execution, host implementation, and effect validation/application.
- Boot from local Ghost ARE modules plus the referenced `assets/are/*.walk` data.
- Maintain one resolved active mod composition for the life of a session.
- Emit authoritative state; never delegate simulation authority to Asclepius, Shell, or client mods.

## Hard boundaries

- IPC is the daemon transport boundary. Do not add HTTP, WebSocket, Express, browser UI, or Pixi here.
- Do not statically depend on `@planar/mods`; load enabled runtime `server.js` bundles from the supplied mods directory.
- Server mods request writes only through `WorldEffect`; [`src/mods/applyEffects.ts`](src/mods/applyEffects.ts) is the sole mod-requested World writer.
- Queries derive views such as walk overlays and must not become mutation phases.
- Default PST:EE behavior belongs in replaceable mods, not daemon conditionals.
- Treat mod code as trusted executable Node code, not sandboxed input.

## Boot and hook rules

- Fail closed before session start if `active.json`, manifests, declared bundles, dependencies, slots, hooks, or queries are invalid.
- Use `serverHooks` / `clientHooks` arrays as hook order and `queries` as query order; do not substitute filesystem, import, or map iteration order.
- Validate hook return shapes before applying effects.
- Stop or serialize world replacement while area unload/load hooks and Ghost loading run.
- Preserve the distinction between commands, hook effects, pull queries, patches, and snapshots.

## Current sources of truth

- Process/IPC entry: [`src/index.ts`](src/index.ts).
- Session boot, clock, commands, and hook ordering: [`src/boot.ts`](src/boot.ts).
- Session/IPC construction: [`src/createSession.ts`](src/createSession.ts).
- Initial Ghost ARE and walk loading: [`src/initializeWorld.ts`](src/initializeWorld.ts).
- Ghost loaders: [`src/loadGhost/`](src/loadGhost/).
- Fail-closed composition boot: [`src/mods/failClosed.ts`](src/mods/failClosed.ts).
- Server host and queries: [`src/mods/createServerHost.ts`](src/mods/createServerHost.ts).
- Effect boundary: [`src/mods/applyEffects.ts`](src/mods/applyEffects.ts).
- Shared protocol, hosts, and effects: [`@planar/shared`](../planar-shared/AGENTS.md).

## Workflow

- Build: `yarn workspace @planar/daemon build`
- Start directly: `yarn workspace @planar/daemon start`
- Lint: `yarn workspace @planar/daemon lint`
- For integrated play, build daemon and default mods before starting Asclepius/Shell.

## Race and lifecycle checklist

- Do not overlap async area replacement with ticks or commands; maintain explicit blocked/state transitions.
- Do not mutate shared session collections from concurrent async branches without serialization.
- Keep IPC listener ownership single and remove listeners on disconnect or replacement.
- Clear the clock and release process resources on disconnect.
- Route detached async failures to an IPC error or explicit logger; never leave rejected work unobserved.

## Cross-package impact checklist

- Protocol changes require coordinated `shared`, Asclepius relay, and Shell updates.
- Host/effect changes require coordinated `shared` and server-mod updates.
- Ghost loading changes require coordinated shared Ghost contracts and Prism output changes.
- Composition changes require coordinated validation in shared, Asclepius, Shell, and default mod data.
- Clock or patch semantics affect kernel snapshots/folding and Shell rendering.

## Migration hazards

- Current play transport has no hardened multiplayer security or mod-hash handshake; do not imply either.
- Asclepius may reconnect clients around a daemon lifecycle; daemon state must not leak across processes.
- A direct World mutation outside the daemon's owned command/effect flow can bypass patches and desynchronize clients.
