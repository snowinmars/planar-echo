# `@planar/shell` agent guide

Scope: closest guidance for `planar-shell/**`; inherit the root guide.

## Status and ownership

- **VERIFIED CURRENT STATE:** own landing, conversion, Workbench inspectors,
	stores, settings, localization, and browser persistence.
- **VERIFIED CURRENT STATE:** `/play` and `/mods` render an explicit unavailable
	page. Legacy replica, Pixi runtime, client-mod loader, and mod editor were
	removed in Milestone 0.
- **NORMATIVE TARGET:** own the local client-mod host, read-only projected
	replica, presentation, UI/input, and semantic command formation.

Use the URL as source of truth for selected resources and route-visible state;
do not create a competing global selection authority.

## Authority and trust boundaries

- Shell never mutates or advances authoritative state.
- Do not import `@planar/shared/node`, kernel implementation, daemon, server
	mods, filesystem APIs, or Asclepius internals.
- Future client entries may read replicas, render, load local artifacts, collect
	input, and form commands only.
- `clientOrigin` and `sessionOrigin` are separate target concepts. Remote
	servers must never supply executable client code or user-owned content.
- Client mods are trusted code in the Shell origin, not sandboxed extensions.

## Current sources

- Browser entry/providers: [`src/index.tsx`](src/index.tsx)
- Routes: [`src/router/router.tsx`](src/router/router.tsx)
- Workbench: [`src/components/Workbench/`](src/components/Workbench/)
- Conversion: [`src/components/Convert/`](src/components/Convert/)
- Generated REST client: [`src/swagger/client/`](src/swagger/client/)
- Locales: [`src/i18n/`](src/i18n/)

Generated clients must be regenerated from Asclepius, never hand-edited.
Manual fetch helpers and generated clients may coexist only where current code
requires them; do not create a third contract copy.

## Cleanup and races

- Every effect that subscribes, opens a socket, creates a timer, registers an
	event, or allocates renderer resources must return cleanup.
- Remove listeners with the same callback identity and dispose
	RxJS/Zustand/browser resources on unmount or failed boot.
- Guard asynchronous boot against disposal before publishing state.
- Sequence debounced writes and ignore stale responses.
- Handle intentionally detached browser promises with explicit `.catch(...)`.
- Keep lifecycle code idempotent under React Strict Mode.

## Workflow

- Start: `yarn workspace @planar/shell start`
- Build: `yarn workspace @planar/shell build`
- Lint: `yarn workspace @planar/shell lint`
- Format check: `yarn workspace @planar/shell format:check`
- Handoff test, only with user permission: `yarn workspace @planar/shell test`

REST/schema changes require an atomic Asclepius OpenAPI refresh, generated
client update, and call-site update. Ghost changes currently require shared,
Prism, Asclepius delivery, and Shell-reader coordination; the target owner is
`@planar/ie`.
