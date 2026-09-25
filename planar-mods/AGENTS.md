# `@planar/mods` agent guide

Scope: closest guidance for `planar-mods/**`; inherit the root guide.

## Status

- **VERIFIED CURRENT STATE:** this workspace is an intentionally empty package
  shell. All authored legacy mods, `mod.json` files, `factory-active.json`, and
  the old bundler were removed in Milestone 0.
- **NORMATIVE TARGET:** own permanent multiplayer conformance mods and
  replaceable first-party PST:EE profile mods.
- Do not restore hooks, queries, radio slots, `WorldEffect`, `active.json`, or
  legacy client/server host APIs.

## Target mod rules

- Mods expose explicit side-neutral `contract`, authoritative `server`,
  presentation `client`, and offline `data` entries as needed.
- Cross-mod imports target contract entries only; one mod does not import
  another mod's server/client implementation.
- Game behavior and default PST policy live here, not in kernel, daemon,
  Asclepius, or base Shell.
- A provider is selected by the resolved modpack lock, never import/filesystem
  order.
- System order comes from real DAG constraints, not numeric priorities or a
  manually maintained hook list.
- Server state changes use target atomic transactions. Client entries only
  render, present UI, read replicas, load local artifacts, and form semantic
  commands.

## Trust and artifacts

- Mod code is trusted executable code and is not sandboxed.
- Remote servers never distribute client executables or user-owned content.
- Source belongs in this workspace; generated bundles and installed local
  modpacks do not.
- The conformance modpack is a permanent executable SDK specification, not
  throwaway demo code.

## Workflow

- Build: `yarn workspace @planar/mods build`
- Lint: `yarn workspace @planar/mods lint`
- Milestone 0 produces only an empty package export. Do not claim a default
  composition exists.
