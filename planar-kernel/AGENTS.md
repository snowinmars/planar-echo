# `@planar/kernel` agent guide

Scope: closest guidance for `planar-kernel/**`; inherit the root guide.

## Status

- **VERIFIED CURRENT STATE:** this is an intentionally empty package shell. The
  fixed legacy World, snapshots, patch folding, and walk-grid helpers were
  removed in Milestone 0.
- **NORMATIVE TARGET:** own the policy-free deterministic runtime substrate
  defined by the canonical architecture.
- Do not reconstruct deleted behavior from git history. New APIs arrive through
  the conformance milestones.

## Target ownership

- Frozen protocol/resource registry and monotonic entity IDs.
- Sparse protocol tables and singleton resources.
- Scoped reads, validated atomic transactions, and canonical commit records.
- Logical tick, sequential execution plan, named PRNG streams, and persisted
  scheduling.
- Snapshots, admitted-input/outcome logs, watermarks, and checkpoint hashes.

## Hard boundaries

- No PST/IE policy, ARE/CRE concepts, walk grids, pathfinding, doors, rendering,
  or default game behavior.
- No process lifecycle, IPC, filesystem, HTTP, WebSocket, Express, browser API,
  Pixi, dynamic imports, or mod installation.
- Do not import daemon, IE, mods, Prism, Asclepius, or Shell.
- Never read ambient time, `Math.random`, environment, or hidden mutable state.
- Do not expose mutable World references. All writes use validated atomic
  transactions.
- Keep authoritative execution synchronous. Asynchronous I/O belongs outside
  kernel and crosses an explicit runtime barrier.

## Workflow

- Build: `yarn workspace @planar/kernel build`
- Lint: `yarn workspace @planar/kernel lint`
- There is no kernel test command in Milestone 0. Add tests with the first real
  runtime primitives; do not claim coverage from the package shell.
