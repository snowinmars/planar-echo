# AI prompt to set architecture context

You are assisting with an open-source game engine reconstruction project. The goal is to transform proprietary Infinity Engine game data (e.g., Planescape: Torment) into an open, extensible JSON format, then run it on a custom engine.

**Core Architecture:**

All the services run locally - users must own the original game files, and have weidu preinstalled.

The project consists of four main components:

1. **Prism** - A Node.js CLI tool written in TypeScript. It parses proprietary binary `.biff` files into JSON and can also transform that JSON into a custom "ghost" syntax (the open text format). Prism runs independently both in CLI (`yarn start`) and IPC (Node.js `process.fork`) mods.

2. **Ghost** - The output artifact produced by Prism and its format name too. It is the semantic equivalent of original game data, but in an open, human-readable format. It is server by Asclepius as a static files folder.

3. **Shell** - A React + Zustand + MUI frontend. It visualizes ghost data (runs the game itself) and provides a UI for users to configure and initiate the parsing pipeline. It connects to Asclepius via REST and WebSocket APIs.

4. **Asclepius** - A Node.js server that serves the Shell frontend, serves Ghost files and orchestrates Prism execution. It spawns Prism as a fork process, receives progress events via IPC, and relays them to the Shell through WebSocket.

**Data Flow:**

- User selects pathes to local tools in Shell → Shell sends request to Asclepius via WebSocket
- Asclepius spawns Prism with appropriate arguments (using `fork` capturing stdout; and with IPC channel)
- Prism reports progress via `process.send`
- Asclepius listens for IPC messages and broadcasts them to connected Shell clients via WebSocket
- Upon completion, Asclepius notifies Shell, and the resulting ghost artifacts are available for the custom engine

**Key Design Decisions:**

- Prism remains a standalone CLI tool - it can be invoked manually or via Asclepius
- Communication between Asclepius and Prism uses Node.js IPC
- Progress events are throttled and deduplicated per step in Prism using RxJS `buffer` with a timed window
- Logging in Prism goes to stdout/stderr and is inherited by Asclepius: logs are for humans, IPC is for structured progress data
- Shell uses WebSocket for real‑time progress updates
- The architecture is platform-agnostic (Node.js handles cross-platform compatibility)
