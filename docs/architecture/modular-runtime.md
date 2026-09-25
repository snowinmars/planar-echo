# Modular runtime architecture

This document is the canonical architecture specification for the Planar Echo
runtime rebuild. Code, tests, package guides, and milestone plans must agree
with it. When they do not, either the implementation is wrong or this document
must be changed explicitly at a review gate.

## How to read this document

- **VERIFIED MILESTONE 0 STATE** describes repository structure that exists
  after the clean reset.
- **NORMATIVE TARGET** is binding design intent that may not be implemented yet.
- A target is not evidence of implementation, compatibility, or test coverage.
- Exact volatile DTOs and file layouts remain source-defined unless this
  document explicitly makes them architectural.

## Product definition

### NORMATIVE TARGET

Planar Echo is a server-authoritative multiplayer mod runtime for Infinity
Engine content. It is not a PST:EE clone with a plugin layer added afterward.
Multiplayer and moddability are the primary architecture constraints.

PST:EE is the current conversion target and reference content profile. It is a
proof workload, not privileged policy. Runtime core packages must not know
about ARE, CRE, doors, walk grids, PST rules, or any other game mechanic.

The permanent end-to-end proof is a mod-defined multiplayer flow from the
Mortuary to Sigil. It is built as reviewable vertical slices, not one big-bang
implementation.

## VERIFIED MILESTONE 0 STATE

- There are eight workspaces: `shared`, `ie`, `kernel`, `daemon`, `mods`,
  `prism`, `asclepius`, and `shell`.
- Prism conversion, local Ghost output, Workbench inspectors, stores, settings,
  legal policy, and project tooling remain available.
- Play and mod composition are unavailable. Shell keeps `/play` and `/mods`
  only as explicit unavailable pages.
- Asclepius exposes no legacy play WebSocket, mod-composition REST endpoints,
  or runtime-mod static file route. Prism WebSocket conversion remains.
- `@planar/kernel`, `@planar/daemon`, and `@planar/mods` are intentionally
  non-functional package shells for the rebuild.
- `@planar/ie` exists and temporarily owns only reusable pure IE-oriented
  helpers. Ghost contracts remain physically in `@planar/shared` until the
  dedicated IE artifact migration.
- Existing path/default schemas still contain daemon, kernel, mods, and
  mods-runtime directories. They are retained configuration scaffolding, not
  evidence that a runtime exists.
- The legacy `Envelope`, `WorldEffect`, hooks, queries, `active.json`
  composition, authored runtime mods, and their loaders have been removed.

## Session invariant

### NORMATIVE TARGET

One session consists of:

- exactly one authoritative daemon process;
- exactly one frozen resolved modpack lock;
- exactly one authoritative content descriptor;
- one monotonically advancing logical tick;
- zero or more authenticated principals connected through a gateway.

The registry, mod instances, provider choices, execution plan, schemas, wire
IDs, authoritative artifact hashes, and configuration are immutable for the
session lifetime. Installing or editing files cannot mutate a running session.
A changed composition starts a new session.

Asclepius orchestrates processes and relays canonical protocol frames. It does
not simulate, resolve game rules, or mutate authoritative state.

## World model

### NORMATIVE TARGET

World is a generic deterministic database:

- a monotonic entity-ID registry; an ID is not reused within a session;
- namespaced sparse protocol tables keyed by entity ID;
- namespaced singleton resources for session-wide state.

Examples such as transforms, health, inventory, doors, zones, or dialogue are
registered protocols supplied by mods. They are not fields in a core entity
type and not central TypeScript union members.

Every protocol/resource contract has:

- a globally namespaced, versioned identifier;
- a canonical runtime schema and codec;
- explicit ownership and access grants;
- replication policy;
- canonical bytes suitable for wire frames, snapshots, logs, and hashes.

Registration happens only while resolving and booting a session. Unknown
protocols cannot appear after registry freeze. Wire IDs are lock-derived and
must never depend on JavaScript import order.

Behavioral state that affects future authority belongs in World or in another
kernel-owned persisted primitive. Hidden mutable module state is forbidden.
Disposable caches may exist only when they are fully derivable from persisted
state and cannot affect outcomes.

## Mutation and transactions

### NORMATIVE TARGET

All authoritative writes use atomic transactions against registered tables and
resources. A transaction either validates and commits completely or changes
nothing.

- Mods receive scoped readers and transaction builders, never mutable World
  references.
- Every write is checked against schema, ownership, grants, and session epoch.
- Entity creation and deletion use the core registry through transactions.
- Events are facts derived from a successful commit; they are not a mutation
  escape hatch.
- Replication is derived from committed rows and resources, not from arbitrary
  mod messages.

There is one mechanical writer: the daemon's kernel transaction engine.
Game-policy mods decide what transaction to request; they do not bypass the
engine.

## Execution model

### NORMATIVE TARGET

Each tick has one fixed mechanism-level pipeline:

```text
admitted commands
→ sequential systems DAG
→ read-only post-commit events
→ projected replication
```

### Commands

A command is an authenticated request to one registered owner.

- Raw browser input is translated into semantic commands by client code.
- Admission validates epoch, principal, seat/grants, command schema, rate
  policy, and authoritative descriptor.
- Admitted commands are ordered canonically and logged.
- The owner executes synchronously and may submit an atomic transaction.
- A command is never broadcast to every mod and never proves that an action is
  valid.

Recursive command dispatch in the same tick is forbidden. Deferred work is a
kernel-owned scheduled command with an explicit earliest logical tick.

### Systems DAG

Systems declare real ordering constraints such as `after` and `before`, not
global numeric priorities or administrator-written hook arrays.

- The resolver builds a directed acyclic graph.
- Cycles, missing dependencies, and meaningful undeclared access conflicts are
  boot errors.
- Unconstrained ties use a stable lock-defined order.
- Systems execute sequentially in that order.
- Each system sees commits from earlier nodes and commits atomically.

The DAG leaves room for future proved-safe parallelism, but parallel
authoritative execution is not part of the initial runtime.

### Events

An event is a typed, versioned fact about a completed commit.

- Events are zero-to-many notifications, never request/response.
- Post-commit observers are read-only.
- Observers may schedule work no earlier than the next tick.
- Re-entrant event/effect rounds and mutation during event delivery are
  forbidden.
- Transient client events have explicit projection and delivery semantics and
  are not substitutes for persisted state.

### Capabilities

A capability is a typed synchronous service supplied by resolved providers.
It is used when a caller needs an answer, not a broadcast.

- Cardinality and merge semantics are part of the capability contract.
- Single-provider selection is explicit modpack policy.
- Multi-provider results require a contract-defined deterministic,
  order-independent merge when commutativity is claimed.
- A capability cannot mutate World outside the caller's transaction.

Commands, systems, events, capabilities, transactions, and replication are
different mechanisms. There is deliberately no universal message bus.

## Time, randomness, and determinism

### NORMATIVE TARGET

The kernel owns:

- logical tick and cadence;
- named deterministic PRNG streams;
- scheduled commands and timers;
- admitted-input and outcome logs;
- snapshots, watermarks, and checkpoint hashes.

Authoritative command handlers, systems, event observers, and capabilities are
synchronous. They do not read wall-clock time, call `Math.random`, perform
filesystem/network I/O, await promises, or create unmanaged workers/timers.
Asynchronous loading occurs outside the authoritative tick and crosses an
explicit barrier.

Server mods are trusted JavaScript and initially follow this deterministic
profile by contract, not by a sandbox. Replay and checkpoint hashes detect
violations; they do not make hostile code safe.

## Mod shape and composition

### NORMATIVE TARGET

A mod may expose explicit entries:

- `contract`: side-neutral IDs, schemas, codecs, and public capability types;
- `server`: authoritative commands, systems, capabilities, and event
  observers;
- `client`: presentation, UI, input mapping, replica readers, and local
  artifact loading;
- `data`: deterministic offline transforms, dependency extractors, and roots.

Cross-mod imports target contract entries only. Server and client
implementations do not import each other. Runtime packages do not statically
import the first-party modpack.

A versioned modpack manifest supplies root mods, canonical configs, provider
choices, and server policy. The resolver:

1. resolves one exact artifact version per mod ID;
2. computes and validates the dependency closure;
3. resolves capabilities and optional features;
4. registers contracts and assigns stable wire IDs;
5. validates grants and the systems DAG;
6. hashes configs, executable artifacts, contracts, and authoritative content;
7. emits an immutable lock and execution plan.

Installed folders alone never define a game. Import order never selects a
provider. Administrators do not manually enumerate hook/query order.

## Multiplayer, replication, and reconnect

### NORMATIVE TARGET

The server is authoritative. Clients hold read-only projected replicas and
submit semantic commands.

- Each principal receives only its allowed projection.
- Join uses a snapshot plus a log/patch watermark.
- Catch-up and live queues are bounded; slow clients resync or disconnect by
  explicit policy.
- Reconnect uses session and connection epochs so stale commands cannot affect
  a replacement connection.
- Late join, save/reload, crash recovery, and replay must produce the same
  authoritative state and checkpoint hashes from the same descriptor and log.

Handshake compares exact lock and authoritative content hashes. A hash proves
identity, not trust. Authoritative bytes must match exactly. Locale,
renderer-specific, audio, and other presentation artifacts may differ only
when they satisfy a compatible contract declared by the lock.

## Local artifacts and remote sessions

### NORMATIVE TARGET

Every participant obtains lawful game data and executable mod artifacts
locally:

```text
owned game copy
→ local Prism conversion
→ local modpack install/build
→ local Shell, client code, and presentation artifact store
```

A remote host independently owns compatible authoritative artifacts and runs
the same frozen lock:

```text
local Shell/client artifacts
↔ remote Asclepius gateway
↔ authoritative daemon
```

Remote servers never deliver executable client bundles or copyrighted game
content. The client manually installs the required modpack. Shell therefore
has separate origins:

- `clientOrigin` for local Shell, client entries, and presentation artifacts;
- `sessionOrigin` for the remote gateway and authoritative protocol.

Solo mode may compose both roles in one local Asclepius process, but the
authority boundary remains the same.

## Ghost and offline content

### NORMATIVE TARGET

Ghost is the canonical local IE artifact format. Runtime sessions do not read
mutable Ghost paths during ticks.

An offline builder:

1. starts from declared content roots;
2. discovers and validates the dependency closure;
3. runs a deterministic transform DAG;
4. records provenance and canonical hashes;
5. materializes immutable authoritative and presentation artifact registries.

Content transitions use a two-phase barrier: prepare references, allow required
clients to prefetch local presentation artifacts, then log and atomically
commit the authoritative transition according to timeout policy.

## Package ownership

### NORMATIVE TARGET

- `@planar/shared`: game-neutral contract tokens, canonical codecs, wire
  envelopes, lock types, and browser-safe utilities.
- `@planar/ie`: Ghost/Infinity Engine contracts, adapters, dependency
  extraction, content transforms, geometry, grids, and reusable IE libraries.
- `@planar/kernel`: policy-free deterministic registry, World storage,
  transactions, scheduler, PRNG, snapshots, logs, and hashes.
- `@planar/daemon`: one authoritative session host, resolved-plan loader, tick
  execution, projections, persistence, and structured IPC.
- `@planar/mods`: replaceable first-party conformance and PST:EE modpacks. It is
  policy, never infrastructure.
- `@planar/prism`: standalone conversion CLI/worker from user-owned data to
  Ghost; it remains usable without Asclepius.
- `@planar/asclepius`: local artifact host, remote session gateway, REST/WS,
  defaults, and child-process lifecycle. It never simulates.
- `@planar/shell`: browser UI, local client-mod host, read-only replica,
  presentation, and semantic input.

Allowed dependency pressure is downward:

```text
ie          → shared
kernel      → shared
daemon      → kernel, shared
mods        → ie, shared public contracts
prism       → ie, shared
shell       → shared
asclepius   → shared plus process/artifact entry packages
```

Exact current package dependencies may be narrower during the reset. No lower
package imports Asclepius, Shell, daemon implementation, or first-party policy.

## Security and trust

### NORMATIVE TARGET

- Server and client mods are trusted executable code; no sandbox is promised.
- Server code has the daemon process's ambient privileges unless a future
  security design changes that.
- Client code has the Shell origin's browser privileges.
- Manifests, schemas, signatures, versions, and hashes do not make code safe.
- Remote executable delivery is forbidden by the local-artifact model.
- Authentication, authorization, resource limits, and projection are runtime
  security boundaries; mod identity is not authorization.
- User-owned game data, Ghost output, WeiDU, built artifacts, and local
  settings remain local and must not be committed.

## Clean break from the legacy runtime

### VERIFIED MILESTONE 0 STATE AND NORMATIVE POLICY

There is no compatibility layer for:

- `Envelope` or the old fixed `World`;
- `WorldEffect`, `publish`, or recursive `enqueueCommand`;
- ordered server/client hooks;
- central game-specific queries or radio slots;
- old `mod.json` runtime manifests;
- `active.json` and factory composition;
- legacy play/mod REST, WebSocket, static-file, or Shell APIs.

Old local runtime files are not migrated. New target contracts may reuse pure
algorithms, but not legacy orchestration or vocabulary.

## Architectural fitness criteria

The architecture is not proved by having dynamically imported files. It is
proved when:

- adding a new protocol mechanic changes no central game-specific union;
- replacing movement or another provider changes no kernel, daemon, gateway,
  or base Shell code;
- two principals observe one authoritative session through projections;
- incompatible locks fail before joining;
- late join reconstructs from snapshot plus watermark;
- replay from the same descriptor and admitted log reaches identical hashes;
- client code and presentation data remain local during remote play;
- every listener, timer, socket, child process, renderer, and subscription has
  a matching cleanup path.

The permanent conformance modpack is the executable specification for these
criteria. The Mortuary-to-Sigil flow is the IE integration proof.

## Change discipline

- Architecture changes require an explicit review-gate decision and an update
  here before dependent implementation spreads.
- Keep verified state separate from target intent in docs and reviews.
- API/schema changes are atomic across implementation, validation, OpenAPI,
  generated clients, and call sites.
- Do not add a generic extension point without a concrete conformance use case.
- Do not claim runtime, game, multiplayer, or parity coverage from an enum,
  package shell, target paragraph, or unrun test.
