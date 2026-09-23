# planar-echo agent guide

## Scope and authority

- This file applies repository-wide. An `AGENTS.md` applies to its directory subtree; the closest file is authoritative for package-local guidance while this root file supplies universal policy.
- For volatile details such as routes, DTOs, schemas, paths, and exports, current manifests and implementation are authoritative.
- [Modular runtime architecture](docs/architecture/modular-runtime.md) owns stable package boundaries, authority rules, and target invariants.
- Keep **VERIFIED CURRENT STATE** separate from **NORMATIVE TARGET ARCHITECTURE**. A target is not evidence of implementation or coverage.

## Purpose and status

- **VERIFIED CURRENT STATE:** planar-echo is a GPL-3.0-or-later, local-first TypeScript monorepo that converts user-owned game data (currently PST:EE only) and runs a browser-based runtime.
- **VERIFIED CURRENT STATE:** it is an active tech preview; Prism currently implements PST:EE only.
- **NORMATIVE TARGET ARCHITECTURE:** it is an independent Infinity Engine-compatible platform with PST:EE as the reference profile and replaceable game policy.
- Adding an enum value or target statement does not add parser support, parity, or verified coverage.

## Workspace index

- [`@planar/shared`](planar-shared/AGENTS.md) — browser-safe contracts plus an explicit Node export.
- [`@planar/kernel`](planar-kernel/AGENTS.md) — policy-free World data and deterministic transforms.
- [`@planar/daemon`](planar-daemon/AGENTS.md) — authoritative 30 Hz World owner and server-mod host.
- [`@planar/mods`](planar-mods/AGENTS.md) — replaceable default PST:EE client/server mod composition.
- [`@planar/prism`](planar-prism/AGENTS.md) — standalone conversion CLI and fork/IPC worker.
- [`@planar/asclepius`](planar-asclepius/AGENTS.md) — HTTP, WebSocket, artifacts, defaults, and child-process orchestration.
- [`@planar/shell`](planar-shell/AGENTS.md) — React UI, replicated view, rendering, input, and client mods.

## Local non-workspace directories

- `planar-ghost/` is generated Ghost data and assets from the user's game.
- `planar-mods-runtime/` is the installed, locally mutable mod runtime.
- `planar-weidu/` is the user's local WeiDU installation.
- These directories, original game files, generated game-derived assets, local defaults, and machine-specific paths must not be committed.
- Do not add `AGENTS.md` files or implementation source under artifact directories.

## Universal implementation policy

- Use TypeScript, ESM, and Node.js conventions already established by the owning package; retain `.js` specifiers in TypeScript ESM imports.
- Use Yarn 4 workspaces and `workspace:*` for internal package dependencies.
- Keep changes SOLID and focused; prefer explicit data flow over hidden mutable state.
- Follow the repository [Maybe rule](.cursor/rules/maybe.mdc) for project-owned optional values without sweeping unrelated code.
- Use exhaustive `switch` handling for discriminated unions and multi-branch protocol logic.
- Catch errors as `unknown`, normalize intentionally, and do not discard rejected promises; use an explicit `.catch(...)` where work is intentionally detached.
- Prevent races across fork/IPC, WebSocket, timers, async boot, and shared mutable state. Serialize lifecycle transitions or guard them with explicit state.
- Every subscription, listener, timer, socket, child process, and Pixi/browser resource must have a matching cleanup path.

## Cross-package invariants

- Asclepius starts Prism and daemon through `process.fork` and structured IPC; stdout/stderr are human logs, not protocol.
- Daemon is the sole authoritative live `World` owner and writer. Asclepius relays play traffic and must not simulate.
- Server mods request mutation through `WorldEffect`; daemon validates and applies effects at that boundary.
- Client mods may render, present UI, collect input, and form commands; they never mutate authoritative state.
- Default PST:EE behavior belongs in replaceable mods, not privileged kernel or daemon policy.
- Kernel stays deterministic, policy-free, and free of process, filesystem, HTTP, WebSocket, and renderer concerns.
- Prism remains usable without Asclepius.
- User-owned game data, WeiDU, Ghost output, and runtime mods remain local.

## API and schema changes

- REST and Zod changes are atomic across implementation/shared types, runtime validation, OpenAPI output, generated Shell client, and all call sites.
- Generate clients with `yarn gen`; do not hand-edit generated files.
- Exact API payloads and endpoint paths are active migration surfaces: verify source instead of copying inventories into documentation.

## Commands

- Install: `yarn`
- Full generation and build: `yarn build`
- Generate OpenAPI client: `yarn gen`
- Start backend and frontend: `yarn start`
- Start one surface: `yarn start:asclepius`, `yarn start:shell`, or `yarn start:prism`
- Serve built Asclepius: `yarn serve`

## Tests and commits

- Do not create commits unless the user explicitly asks.
- Do not run tests without user permission.
- Handoff commands: `yarn test`, `yarn workspace @planar/kernel test`, `yarn workspace @planar/prism test`, and `yarn workspace @planar/shell test`.

## Documentation roles

- [README](README.md) and player-facing docs describe status, setup, and user behavior.
- Human contribution workflow lives in [CONTRIBUTING.md](CONTRIBUTING.md).
- `AGENTS.md` files contain operational guidance for coding agents, not product promises or frozen API documentation.
- Tooling and context rules live in [`.cursor/rules/`](.cursor/rules/); do not duplicate them here.
