# `@planar/ie` agent guide

## Status

- **VERIFIED CURRENT STATE:** this Milestone 0 workspace contains reusable pure
  IE-oriented helpers only. Ghost contracts still live in `@planar/shared`.
- **NORMATIVE TARGET:** this package owns Infinity Engine/Ghost contracts,
  adapters, dependency extraction, deterministic content transforms, geometry,
  grids, and reusable format algorithms.
- A type or helper here does not imply parser, runtime, or game coverage.

## Boundaries

- Keep this package independent of daemon, Asclepius, Shell, Pixi, React,
  process lifecycle, HTTP, WebSocket, and mutable runtime directories.
- Keep game-format knowledge out of `@planar/kernel`; place reusable IE
  interpretation here and profile policy in `@planar/mods`.
- Prefer pure transforms over ambient filesystem access. Prism or an offline
  artifact builder owns I/O and supplies explicit inputs.
- Do not introduce session authority, live World mutation, commands, systems,
  or replication here.
- Ghost remains the canonical local IE artifact format. Move existing Ghost
  contracts here only as an atomic migration with Prism, Asclepius, Shell, and
  generated API call sites.
- Preserve `.js` specifiers in TypeScript ESM imports.

## Current exports

- `WalkGrid` and walk-grid constants.
- Cell/map coordinate helpers.
- Pure A* walk-path search.
- IE animation-ID formatting.

These exports are reusable libraries, not the replacement runtime API.

## Commands

- Build: `yarn workspace @planar/ie build`
- Lint: `yarn workspace @planar/ie lint`
