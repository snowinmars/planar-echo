# planar-echo

[\[Русский\]](README.ru.md) · **English**

planar-echo is an independent, open-source tech preview for locally converting
and inspecting PST:EE data. The current product is the conversion pipeline and
browser workbench. The multiplayer mod runtime is being rebuilt from a clean
architecture and is not currently available.

This is an active, source-built tech preview, not a complete replacement game. **Planescape: Torment: Enhanced Edition (PST:EE) is the only current and reference profile.** Other Infinity Engine games need dedicated adapters and are not currently supported.

## Available now

- Convert a legally obtained PST:EE installation locally with Prism and WeiDU into Ghost data, generated modules, and browser-ready assets.
- Browse and search converted resources in the browser workbench, inspect game structures and media, and explore dialogue paths.
- See the explicit rebuild status at [`/play`](http://localhost:3000/play) and [`/mods`](http://localhost:3000/mods); neither route currently runs a game or manages mods.
- Keep source game files and converted output on your own machine; planar-echo does not upload them.

## Current limitations

- Complete vanilla behavioral parity and full playability have not been reached.
- Multiplayer is not available.
- Play, the daemon runtime, and mod composition are unavailable during the clean-slate rebuild.
- There are no packaged installers; the preview must be built from source.
- Docker files exist for development, but Docker is not currently a supported player path.
- PST:EE is the only game profile. Other Infinity Engine games are not supported yet.

## Direction

These are goals, not claims about the current build:

- Server-authoritative multiplayer sessions with one daemon and one frozen exact modpack lock.
- Mod-defined, versioned protocol tables/resources and atomic transactions instead of fixed game-specific core entities.
- Replaceable commands, systems, capabilities, presentation, and game policy without changing kernel, daemon, gateway, or base Shell.
- Locally installed client code and game artifacts for remote sessions; a remote server never supplies executable bundles or original game content.
- A permanent multiplayer conformance modpack followed by the Mortuary-to-Sigil IE proof flow.
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
3. If paths do not resolve, open **Settings** and verify the backend URL and Ghost output directory.
4. Use **Workbench** for resource and dialogue exploration. **Play** and **Mods** currently show the runtime-rebuild status only.

Docker is not currently a supported alternative to this player flow.

## Mods and trust

The target runtime executes mod JavaScript without a sandbox: server code will
inherit daemon Node.js permissions and client code will run with the Shell
origin's browser privileges. **Install only mods from sources you trust.**
Versions, signatures, and hashes can identify artifacts but cannot make them
safe. Milestone 0 ships no runtime mod bundles.

Mods distributed for use with planar-echo are expected to use GPL-compatible license terms and preserve applicable third-party notices.

## Languages

The current UI and PST:EE conversion language selector expose Czech, English, French, German, Korean, Polish, and Russian.

## Legal

planar-echo is independent and is not affiliated with or endorsed by the owners, publishers, or developers of Infinity Engine games. The repository and project releases do not ship the original game's data or asset files; users supply their own legally acquired copy.

The maintainer currently does not sell planar-echo or operate a paid planar-echo service. This is a project practice, not a restriction on the rights granted by the GPL, which permits commercial redistribution under its terms.

The GNU GPL applies to planar-echo project source, not to third-party game content or locally generated output. Third-party rights remain with their respective owners. See [LEGAL.md](LEGAL.md) for the full project and content policy.

---

[Contributing](CONTRIBUTING.md) · [License](LICENSE) · [Third-party notices](THIRD_PARTY_NOTICES.md) · [Legal and content policy](LEGAL.md) · [Security](SECURITY.md) · [Issues](https://github.com/snowinmars/planar-echo/issues)
