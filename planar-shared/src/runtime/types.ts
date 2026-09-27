export type Replication = 'session' | 'owner' | 'none';

export type Token = Readonly<{
  id: string;
  version: number;
}>;

export type ProtocolContract = Readonly<{
  kind: 'protocol';
  token: Token;
  replication: Replication;
}>;

export type ResourceContract = Readonly<{
  kind: 'resource';
  token: Token;
  replication: Replication;
}>;

export type CommandContract = Readonly<{
  kind: 'command';
  token: Token;
}>;

export type EventContract = Readonly<{
  kind: 'event';
  token: Token;
}>;

export type CapabilityContract = Readonly<{
  kind: 'capability';
  token: Token;
  cardinality: 'one' | 'many';
}>;

export type SystemContract = Readonly<{
  id: string;
  after: readonly string[];
  before: readonly string[];
}>;

export type ModContract = Readonly<{
  id: string;
  version: string;
  protocols: readonly ProtocolContract[];
  resources: readonly ResourceContract[];
  commands: readonly CommandContract[];
  events: readonly EventContract[];
  capabilities: readonly CapabilityContract[];
  systems: readonly SystemContract[];
}>;

export type SeatDeclaration = Readonly<{
  principalId: string;
  commands: readonly string[];
}>;

export type ModpackManifest = Readonly<{
  id: string;
  version: string;
  mods: readonly Readonly<{ id: string; version: string }>[];
  seats: readonly SeatDeclaration[];
}>;

export type WiredToken = Readonly<{
  key: string;
  wireId: number;
}>;

export type WiredProtocol = WiredToken & Readonly<{
  replication: Replication;
}>;

export type FrozenLock = Readonly<{
  manifestId: string;
  manifestVersion: string;
  mods: readonly Readonly<{ id: string; version: string }>[];
  protocols: readonly WiredProtocol[];
  resources: readonly WiredProtocol[];
  commands: readonly WiredToken[];
  events: readonly WiredToken[];
  capabilities: readonly (WiredToken & Readonly<{ cardinality: 'one' | 'many' }>)[];
  systems: readonly string[];
  seats: readonly Readonly<{ principalId: string; commands: readonly number[] }>[];
  authoritativeDescriptorHash: string;
  lockHash: string;
}>;

export const tokenKey = (token: Token): string => `${token.id}@${token.version}`;

export type ProtocolRow = Readonly<{
  entityId: number;
  wireId: number;
  value: unknown;
}>;

export type ResourceRow = Readonly<{
  wireId: number;
  value: unknown;
}>;

export type TransientEvent = Readonly<{
  wireId: number;
  data: unknown;
}>;

export type SessionFrame
  = | Readonly<{
    type: 'offer';
    lockHash: string;
    moveWireId: number;
    seats: readonly string[];
  }>
  | Readonly<{
    type: 'welcome';
    sessionId: string;
    lockHash: string;
    principalId: string;
    ownedEntityId: number;
    connectionEpoch: number;
    tick: number;
    checkpoint: string;
    rows: readonly ProtocolRow[];
    resources: readonly ResourceRow[];
  }>
  | Readonly<{
    type: 'replication';
    tick: number;
    checkpoint: string;
    rows: readonly ProtocolRow[];
    resources: readonly ResourceRow[];
    events: readonly TransientEvent[];
  }>
  | Readonly<{
    type: 'reject';
    reason: string;
  }>
  | Readonly<{
    type: 'bye';
    reason: string;
  }>;

export type ClientHello = Readonly<{
  type: 'hello';
  principalId: string;
  lockHash: string;
}>;

export type ClientCommand = Readonly<{
  type: 'command';
  commandWireId: number;
  connectionEpoch: number;
  payload: unknown;
}>;

export type ClientFrame = ClientHello | ClientCommand;

export type DaemonInbound
  = | Readonly<{ type: 'boot'; lock: FrozenLock; serverModuleUrl: string }>
    | Readonly<{ type: 'join'; connectionId: string; principalId: string; lockHash: string }>
    | Readonly<{ type: 'command'; connectionId: string; commandWireId: number; connectionEpoch: number; payload: unknown }>
    | Readonly<{ type: 'leave'; connectionId: string }>
    | Readonly<{ type: 'shutdown' }>;

export type DaemonOutbound
  = | Readonly<{ type: 'ready'; sessionId: string; lockHash: string }>
    | Readonly<{ type: 'fatal'; message: string }>
    | Readonly<{ type: 'deliver'; connectionId: string; frame: SessionFrame }>
    | Readonly<{ type: 'broadcast'; frame: SessionFrame }>;

export type CommandContext = Readonly<{
  principalId: string;
  payload: unknown;
  entityForPrincipal: (principalId: string) => number | null;
  readProtocol: (entityId: number, token: string) => unknown;
  writeProtocol: (entityId: number, token: string, value: unknown) => void;
  readResource: (token: string) => unknown;
  writeResource: (token: string, value: unknown) => void;
}>;

export type SystemContext = Readonly<{
  tick: number;
  prng: (name: string) => number;
  readProtocol: (entityId: number, token: string) => unknown;
  writeProtocol: (entityId: number, token: string, value: unknown) => void;
  readResource: (token: string) => unknown;
  writeResource: (token: string, value: unknown) => void;
  emit: (token: string, data: unknown) => void;
  schedule: (earliestTick: number, commandWireId: number, principalId: string, payload: unknown) => void;
}>;

export type ServerHost = Readonly<{
  lock: FrozenLock;
  boot: (write: (ctx: {
    createEntity: () => number;
    bindSeat: (principalId: string, entityId: number) => void;
    readProtocol: (entityId: number, token: string) => unknown;
    writeProtocol: (entityId: number, token: string, value: unknown) => void;
    readResource: (token: string) => unknown;
    writeResource: (token: string, value: unknown) => void;
  }) => void) => void;
  onCommand: (token: string, handler: (ctx: CommandContext) => void) => void;
  onSystem: (systemId: string, handler: (ctx: SystemContext) => void) => void;
  onEvent: (token: string, handler: (ctx: { tick: number; data: unknown }) => void) => void;
}>;

export type ClientMountHost = Readonly<{
  canvas: HTMLCanvasElement;
  principalId: string;
  ownedEntityId: number;
  sendMove: (dx: number, dy: number) => void;
  readTransforms: () => readonly Readonly<{ entityId: number; x: number; y: number }>[];
}>;

export type ClientMount = (host: ClientMountHost) => () => void;
