# `@planar/shell` agent guide

Scope: this file is the closest guidance for `planar-shell/**`; inherit repository-wide policy from [the root guide](../AGENTS.md).

## Ownership

- Own the browser UI, routes, replicated World view, rendering, user input, commands, and client-mod loading.
- Current route categories include landing, workbench resource inspectors, conversion, play, mods, settings, and stores.
- Use the URL as the source of truth for selected resources and route-visible state; do not create a competing global selection authority.
- Own browser persistence through Zustand, IndexedDB/local storage adapters, and explicit providers.
- Own Pixi presentation and camera/input integration, not authoritative simulation.

## Authority boundaries

- Fold daemon snapshots and patches into a client replica; never advance or mutate authoritative World state locally.
- Client mods may render, present UI, read the replica, collect input, and help form commands only.
- Send typed commands through play WebSocket; a client command is a request, not proof of validity.
- Do not import `@planar/shared/node`, daemon implementation, server mods, filesystem APIs, or Asclepius internals.
- Keep default PST:EE presentation replaceable through client mods rather than hard-coding it into Shell infrastructure.

## Routes and boot

- Browser entry and top-level providers: [`src/index.tsx`](src/index.tsx).
- Route source of truth: [`src/router/router.tsx`](src/router/router.tsx).
- Workbench route params and dialogue query state must remain deep-linkable.
- Play component: [`src/components/Play/Play.tsx`](src/components/Play/Play.tsx).
- WebSocket/session lifecycle: [`src/components/Play/engine/createPlaySession.ts`](src/components/Play/engine/createPlaySession.ts).
- Pixi view, replica folding, and hook invocation: [`src/components/Play/engine/attachPlayView.ts`](src/components/Play/engine/attachPlayView.ts).
- Client-mod validation/import and hook order from `clientHooks`: [`src/components/Play/mods/bootClientMods.ts`](src/components/Play/mods/bootClientMods.ts).
- Client host authority surface: [`src/components/Play/mods/createClientHost.ts`](src/components/Play/mods/createClientHost.ts).

## State, APIs, and localization

- Shared app-store lifecycle lives under [`src/engine/store/`](src/engine/store/); keep leases/providers balanced.
- Generated REST client lives under [`src/swagger/client/`](src/swagger/client/) and must be regenerated, not hand-edited.
- [`src/shared/modsApi.ts`](src/shared/modsApi.ts) and defaults/mod screens are current migration call sites; do not assume generated coverage is complete.
- Mods editor source: [`src/components/Mods/Mods.tsx`](src/components/Mods/Mods.tsx).
- Localization setup and locale resources live under [`src/i18n/`](src/i18n/).
- Add user-visible strings through i18n; preserve `en_US` fallback and locale key parity.

## Cleanup and race rules

- Every React effect that subscribes, opens a socket, creates a timer, registers an event, or allocates Pixi resources must return cleanup.
- Unsubscribe RxJS/Zustand subscriptions and remove DOM/Pixi listeners with the same callback identity.
- Destroy play views, assets, tickers, viewports, and sockets on unmount or failed boot.
- Guard async boot against unmount/disposal before publishing state.
- Sequence debounced saves and ignore stale responses; do not let older defaults/mod responses overwrite newer edits.
- Handle detached browser promises with explicit `.catch(...)`.

## Workflow

- Start Vite: `yarn workspace @planar/shell start`
- Build: `yarn workspace @planar/shell build`
- Lint: `yarn workspace @planar/shell lint`
- Format check: `yarn workspace @planar/shell format:check`
- Handoff test, only with user permission: `yarn workspace @planar/shell test`

## Cross-package impact checklist

- REST/Zod changes require an atomic Asclepius OpenAPI refresh, client regeneration, and call-site update.
- Play protocol changes require shared, daemon, Asclepius relay, replica, and UI updates.
- Client host/hook changes require shared contracts and all affected client mods.
- Ghost type or artifact changes require shared, Prism, Asclepius delivery, and Shell reader updates.
- Route changes require links/navigation, deep-link behavior, and relevant localization updates.

## Migration hazards

- Defaults and mod endpoint paths, DTOs, and error shapes are active migration surfaces; verify Asclepius schemas and generated output.
- Manual `fetch` code and generated clients currently coexist; avoid silently creating a third contract copy.
- Client-loaded mods are trusted code in the Shell origin, not sandboxed extensions.
- React Strict Mode can expose duplicate boot/cleanup bugs; lifecycle code must remain idempotent.
