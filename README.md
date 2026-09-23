# planar-echo

[\[Русский\]](README.ru.md) · **English**

planar-echo is an independent, open-source tech preview for locally converting and inspecting PST:EE data. The current product is the conversion pipeline and browser workbench; the experimental runtime is the strategic direction toward an Infinity Engine-compatible platform.

This is an active, source-built tech preview, not a complete replacement game. **Planescape: Torment: Enhanced Edition (PST:EE) is the only current and reference profile.** Other Infinity Engine games need dedicated adapters and are not currently supported.

## Available now

- Convert a legally obtained PST:EE installation locally with Prism and WeiDU into Ghost data, generated modules, and browser-ready assets.
- Browse and search converted resources in the browser workbench, inspect game structures and media, and explore dialogue paths.
- Try the experimental [`/play`](http://localhost:3000/play) runtime. It demonstrates current area rendering and runtime work; it is not a complete playthrough experience.
- Install the default replaceable PST:EE mods and edit the active composition through the experimental [`/mods`](http://localhost:3000/mods) screen.
- Keep source game files and converted output on your own machine; planar-echo does not upload them.

## Current limitations

- Complete vanilla behavioral parity and full playability have not been reached.
- Multiplayer is not available.
- Play and mods are experimental. Mod changes are not applied live and may require restarting `/play`.
- There are no packaged installers; the preview must be built from source.
- Docker files exist for development, but Docker is not currently a supported player path.
- PST:EE is the only game profile. Other Infinity Engine games are not supported yet.

## Direction

These are goals, not claims about the current build:

- Observable vanilla behavioral parity; differences within verified coverage are treated as bugs.
- A minimally playable vanilla composition supplied through replaceable required-slot mods.
- Every required mod replaceable without editing the engine.
- Future networked multiplayer with server-authoritative sessions and server-pinned mod IDs, versions, and hashes. Matching artifacts establishes identity, not safety.
- More Infinity Engine profiles through explicit adapters.
- Packaged releases when the project is ready for them.

## Requirements

- **Platform:** Windows is the primary development and player environment. Linux and macOS are best-effort and experimental.
- A legally obtained PST:EE installation containing `CHITIN.KEY`.
- [Node.js 24 LTS](https://nodejs.org/) recommended.
- Corepack and the repository-pinned Yarn 4 release.
- [WeiDU](https://github.com/WeiDU/weidu); provide a local executable or use the conversion screen's downloader.
- A modern browser and enough local disk space for dependencies, conversion caches, and Ghost output.
- Git, if you are obtaining the source from the repository.

## Source quick start

From the repository root:

```bash
corepack enable
yarn
yarn build
yarn start
```

Open the UI at [http://localhost:3000](http://localhost:3000). The local backend runs at [http://localhost:3003](http://localhost:3003).

1. Open **Convert**. Select PST:EE and its language, choose the WeiDU executable, point to the game's `CHITIN.KEY`, and select an empty output directory.
2. Confirm that you are using a legally obtained copy and start conversion. Leave the process running until the UI reports completion.
3. If paths do not resolve, open **Settings** and verify the backend URL, Ghost output directory, and mods directory.
4. Use **Workbench** for resource and dialogue exploration. Use **Play** and **Mods** only as experimental surfaces; restart `/play` after changing the active mod composition.

Docker is not currently a supported alternative to this player flow.

## Mods and trust

Runtime mods are executable JavaScript, not data-only packages. `client.js` and `server.js` run without a sandbox; server mods inherit the local daemon's Node.js permissions, while client mods run with the application's browser-origin privileges. **Install only mods from sources you trust.**

The current runtime keeps authoritative World mutation in the local daemon. That boundary is not a claim of hardened security or multiplayer readiness.

Mods distributed for use with planar-echo are expected to use GPL-compatible license terms and preserve applicable third-party notices.

## Languages

The current UI and PST:EE conversion language selector expose Czech, English, French, German, Korean, Polish, and Russian.

## Legal

planar-echo is independent and is not affiliated with or endorsed by the owners, publishers, or developers of Infinity Engine games. The repository and project releases do not ship the original game's data or asset files; users supply their own legally acquired copy.

The maintainer currently does not sell planar-echo or operate a paid planar-echo service. This is a project practice, not a restriction on the rights granted by the GPL, which permits commercial redistribution under its terms.

The GNU GPL applies to planar-echo project source, not to third-party game content or locally generated output. Third-party rights remain with their respective owners. See [LEGAL.md](LEGAL.md) for the full project and content policy.

---

[Contributing](CONTRIBUTING.md) · [License](LICENSE) · [Third-party notices](THIRD_PARTY_NOTICES.md) · [Legal and content policy](LEGAL.md) · [Security](SECURITY.md) · [Issues](https://github.com/snowinmars/planar-echo/issues)
