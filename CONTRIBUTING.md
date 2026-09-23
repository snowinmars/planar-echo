# Contributing to planar-echo

planar-echo welcomes focused fixes, tests, documentation, and implementation work that respect the project's package boundaries and local-data policy. Use [GitHub Issues](https://github.com/snowinmars/planar-echo/issues) for bug reports and design discussion. Report security-sensitive problems through [SECURITY.md](SECURITY.md), not a public issue.

## Prerequisites and setup

- Git.
- [Node.js 24 LTS](https://nodejs.org/) recommended.
- Corepack and the repository-pinned Yarn 4 release.
- Windows is the primary development environment; Linux and macOS are best-effort and experimental.
- Conversion work also requires a legally acquired PST:EE installation with `CHITIN.KEY`, WeiDU, and sufficient local disk space.

From the repository root:

```bash
corepack enable
yarn
yarn build
```

Start the development backend and UI with:

```bash
yarn start
```

The UI runs at `http://localhost:3000` and the backend at `http://localhost:3003`.

## Workspace map

The [modular runtime architecture](docs/architecture/modular-runtime.md) is the canonical source for stable boundaries, current-state labels, and target invariants. Follow the closest package guide:

- [`@planar/shared`](planar-shared/AGENTS.md) — browser-safe contracts and the explicit Node export.
- [`@planar/kernel`](planar-kernel/AGENTS.md) — policy-free World data and deterministic transforms.
- [`@planar/daemon`](planar-daemon/AGENTS.md) — authoritative World owner and server-mod host.
- [`@planar/mods`](planar-mods/AGENTS.md) — replaceable default PST:EE client/server mod composition.
- [`@planar/prism`](planar-prism/AGENTS.md) — standalone conversion CLI and fork/IPC worker.
- [`@planar/asclepius`](planar-asclepius/AGENTS.md) — HTTP, WebSocket, artifacts, defaults, and child-process orchestration.
- [`@planar/shell`](planar-shell/AGENTS.md) — browser UI, replicated view, rendering, input, and client mods.

## Root commands

- `yarn build` — run `yarn gen`, then build every workspace.
- `yarn start` — start the Asclepius and Shell development processes.
- `yarn lint` — run each workspace's lint script.
- `yarn test` — run the Kernel, Prism, and Shell test suites.
- `yarn gen` — regenerate and copy the Shell client from the maintained OpenAPI input.
- `yarn serve` — serve an already built Asclepius application.

Package-specific build, start, lint, and test commands are listed in each package guide and manifest.

## Tests: humans and coding agents

Human contributors may run the relevant tests whenever useful:

```bash
yarn test
yarn workspace @planar/kernel test
yarn workspace @planar/prism test
yarn workspace @planar/shell test
```

The repository's coding-agent policy is separate: coding agents must not run tests without explicit user permission. That restriction does not apply to human contributors. In a pull request, state which build, lint, and test commands you ran and note anything you could not run.

## Contracts and API changes

REST or Zod changes must be atomic across:

1. implementation and shared contract types;
2. runtime validation;
3. OpenAPI output;
4. the generated Shell client;
5. every affected call site.

Refresh the maintained OpenAPI document, then run `yarn gen` after contract changes. Do not hand-edit generated client files. Exact endpoint paths and payloads are active migration surfaces, so verify current source rather than treating old documentation as an API specification.

## Current state versus direction

Label statements as **verified current state** or **normative target architecture** when the distinction matters. A target, enum value, route name, or package name is not evidence of implemented behavior or coverage. PST:EE is the only current parser/reference profile; another Infinity Engine game requires an explicit adapter.

## Generated and local content

Do not commit:

- original game files or copyrighted game data;
- generated `planar-ghost/` output;
- the locally installed `planar-mods-runtime/`;
- the local `planar-weidu/` installation;
- machine-specific paths, local defaults, caches, or secrets.

Do not edit generated build output as source. Regenerate tracked clients and artifacts through their owning scripts. Game-derived fixtures or media require explicit repository and legal approval before inclusion.

Preserve copyright, license, and provenance notices when adapting third-party material. Add or update [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) and the affected file-level notice in the same change.

## Mods and trust

Runtime `client.js` and `server.js` bundles are trusted executable code with no sandbox. Server mods inherit the daemon's ambient Node.js permissions; client mods run with the Shell origin's browser privileges. Review mod sources, install only trusted mods, and do not describe manifest validation, versions, or hashes as proof of safety.

Keep authoritative World mutation in the daemon through validated `WorldEffect` requests. Default PST:EE behavior belongs in replaceable mods rather than privileged engine code.

Distributed mods intended for planar-echo must use GPL-compatible license terms and preserve applicable third-party notices. Manifest validation does not validate licenses.

## Pull request checklist

- Keep the change focused and explain its user-visible or architectural effect.
- Follow the root guide, the closest package guide, and the architecture boundaries.
- Update contracts, validation, generated clients, and call sites together.
- Add cleanup for every new listener, timer, socket, process, subscription, or browser resource.
- Account for concurrent process, IPC, WebSocket, and UI lifecycle transitions.
- Keep original, generated game-derived, and machine-local content out of the diff.
- Preserve and document the source and license of every adapted third-party file.
- Distinguish current behavior from future direction in code comments and documentation.
- Report the build, lint, and test commands run, including any known gaps.
- Confirm that you have the right to contribute every submitted file and that it contains no copied game data.
