# `@planar/prism` agent guide

Scope: this file is the closest guidance for `planar-prism/**`; inherit repository-wide policy from [the root guide](../AGENTS.md).

## Ownership

- Own conversion of user-owned Infinity Engine data into local JSON, binary assets, and Ghost TypeScript modules.
- Remain an autonomous Node CLI while also supporting child-process IPC orchestration.
- Current verified parser/profile support is PST:EE only.
- A broader `GameName` type or a new enum member is not implemented game support.
- Own Ghost discovery metadata and Ghost bundle tooling generated from conversion output.

## Conversion pipeline

The current order in [`src/index.ts`](src/index.ts) is mandatory:

1. [`1.createPaths`](src/steps/1.createPaths/) derives and prepares local paths.
2. [`2.validate`](src/steps/2.validate/) checks conversion prerequisites.
3. [`3.decompileBiffs`](src/steps/3.decompileBiffs/) invokes WeiDU and uses its cache.
4. [`4.biffs2json`](src/steps/4.biffs2json/) parses binary structures into intermediate JSON.
5. [`4b.raw2assets`](src/steps/4b.raw2assets/) decodes images/audio and writes derived assets, including ARE walk data.
6. [`5.json2Ghost`](src/steps/5.json2Ghost/) writes Ghost modules from patched JSON.
7. [`6.saveDiscovered`](src/steps/6.saveDiscovered/) records discovery metadata.

- Keep `raw2assets` between JSON parsing and Ghost generation; later stages consume data patched during asset decoding.
- Add another game only through an explicit adapter/profile across relevant stages.

## Process and progress boundaries

- CLI mode reads local defaults and may ask for confirmation.
- IPC mode accepts structured start data and reports structured progress/error/completion through `process.send`.
- Human-readable logging stays on stdout/stderr and must never become the orchestration protocol.
- [`src/shared/report.ts`](src/shared/report.ts) currently flushes every 250 ms and keeps the latest item per progress step; preserve throttling/deduplication semantics.
- Dispose RxJS reporting subscriptions on completion and explicit shutdown paths.
- Do not introduce an Asclepius import or require an HTTP server to run Prism.

## Local data and output

- Inputs include the user's game, CHITIN.KEY-derived paths, TLK data, and local WeiDU; none belongs in git.
- Output under the selected Ghost root includes cache/decompiled data, `json/`, `assets/`, and `ghost/`.
- Ghost is a collection of text modules and binary assets, not one text DSL.
- Keep generated game-derived data and copyrighted assets outside repository history.
- Resource relationships are documented in [`../docs/ie-resource-types.md`](../docs/ie-resource-types.md), but exact parser behavior remains source-defined.

## Current sources of truth

- Package scripts: [`package.json`](package.json).
- CLI/IPC entry and pipeline order: [`src/index.ts`](src/index.ts).
- CLI defaults loading: [`src/loadCliDefaults.ts`](src/loadCliDefaults.ts).
- Path/output layout: [`src/steps/1.createPaths/createPaths.ts`](src/steps/1.createPaths/createPaths.ts).
- PST:EE parsers: [`src/steps/4.biffs2json/pstee/`](src/steps/4.biffs2json/pstee/).
- Asset decoding: [`src/steps/4b.raw2assets/`](src/steps/4b.raw2assets/).
- Ghost writers: [`src/steps/5.json2Ghost/pstee/`](src/steps/5.json2Ghost/pstee/).
- Discovery: [`src/discoverer.ts`](src/discoverer.ts).
- Shared Ghost and IPC contracts: [`@planar/shared`](../planar-shared/AGENTS.md).

## Workflow

- Build: `yarn workspace @planar/prism build`
- Run standalone CLI: `yarn workspace @planar/prism start`
- Bundle generated Ghost modules: `yarn workspace @planar/prism build-ghost`
- Lint: `yarn workspace @planar/prism lint`
- Handoff test, only with user permission: `yarn workspace @planar/prism test`

## Cross-package impact checklist

- For Ghost shape changes, update shared types plus daemon, Asclepius, and Shell readers.
- For progress/start-message changes, update shared contracts and Asclepius orchestration.
- For output layout changes, update daemon loaders, Asclepius file delivery, and Shell asset/Ghost readers.
- For a new resource or game adapter, update all dependent conversion stages and verified support documentation.

## Migration hazards

- Do not claim parser completeness from a directory name, enum, or target architecture statement.
- Preserve autonomous CLI behavior while changing IPC mode.
- Be explicit about cache invalidation when binary parsing or generated formats change.
- Never add original or converted game data as fixtures without explicit legal and repository approval.
