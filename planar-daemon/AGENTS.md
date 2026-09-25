# `@planar/daemon` agent guide

Scope: closest guidance for `planar-daemon/**`; inherit the root guide.

## Status

- **VERIFIED CURRENT STATE:** the executable is an explicit
  runtime-unavailable stub. Legacy Ghost loading, hooks, queries, effects, and
  session code were removed in Milestone 0.
- **NORMATIVE TARGET:** one process hosts exactly one authoritative session
  using one frozen lock and authoritative descriptor.
- Do not restore the removed API or add a temporary adapter.

## Target ownership

- Load and validate a resolved execution plan and frozen registry.
- Admit authenticated semantic commands.
- Execute `commands → sequential systems DAG → read-only post-commit events →
  projected replication`.
- Own session lifecycle, persistence, per-principal projections, reconnect
  epochs, and structured IPC.
- Run the kernel transaction engine as the sole mechanical writer.

## Hard boundaries

- IPC is the process boundary. No HTTP, WebSocket, Express, browser UI, Pixi,
  or local presentation-artifact delivery.
- Do not statically depend on or import first-party `@planar/mods`.
- Do not know ARE, CRE, doors, pathing, PST rules, or other game mechanics.
- Never parse stdout/stderr as protocol; use structured IPC.
- Runtime handlers are synchronous. Async artifact preparation happens outside
  ticks and crosses an explicit barrier.
- Treat server mods as trusted executable Node code, not sandboxed input.
- Every child listener, IPC listener, timer, and resource needs deterministic
  teardown.

## Workflow

- Build: `yarn workspace @planar/daemon build`
- Lint: `yarn workspace @planar/daemon lint`
- `yarn workspace @planar/daemon start` intentionally exits with an unavailable
  message until the networked-conformance milestone.
