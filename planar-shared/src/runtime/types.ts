export type ReplicateTo = 'session' | 'owner' | 'none';

export type Token = Readonly<{
  id: string;
  version: number;
}>;

export type ProtocolContract = Readonly<{
  kind: 'protocol';
  token: Token;
  replicateTo: ReplicateTo;
}>;

export type ResourceContract = Readonly<{
  kind: 'resource';
  token: Token;
  replicateTo: ReplicateTo;
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
}>;

export type WiredProtocol = WiredToken & Readonly<{
  replicateTo: ReplicateTo;
}>;

export type FrozenLock = Readonly<{
  manifestId: string;
  manifestVersion: string;
  mods: Readonly<{
    id: string;
    version: string
  }>[];
  protocols: WiredProtocol[];
  resources: WiredProtocol[];
  commands: WiredToken[];
  events: WiredToken[];
  capabilities: (WiredToken & Readonly<{ cardinality: 'one' | 'many' }>)[];
  systems: string[];
  seats: Readonly<{ principalId: string; commands: readonly string[] }>[];
  authoritativeDescriptorHash: string;
  lockHash: string;
}>;

export const tokenKey = (token: Token): string => `${token.id}@${token.version}`;

export type ProtocolRow = Readonly<{
  entityId: number;
  key: string;
  value: unknown;
}>;

export type ResourceRow = Readonly<{
  key: string;
  value: unknown;
}>;

export type TransientEvent = Readonly<{
  key: string;
  data: unknown;
}>;

/**
 * Returns from server after client is connected through websocket.
 */
export type SessionFrame_AnnounceSessionLock = Readonly<{
  type: 'announceSessionLock';
  lockHash: string;
  allowedSeats: string[]; /* On which seat you can join */
}>;

export type SessionFrame_JoinedSession = Readonly<{
  type: 'joinedSession';
  sessionId: string;
  lockHash: string;
  principalId: string;
  ownedEntityId: number;
  connectionEpoch: number;
  tick: number;
  checkpoint: string;
  rows: readonly ProtocolRow[];
  resources: readonly ResourceRow[];
}>;

export type SessionFrame_ReplicateTo = Readonly<{
  type: 'replicateTo';
  tick: number;
  checkpoint: string;
  rows: readonly ProtocolRow[];
  resources: readonly ResourceRow[];
  events: readonly TransientEvent[];
}>;

export type SessionFrame_Reject = Readonly<{
  type: 'reject';
  reason: string;
}>;

export type SessionFrame_Bye = Readonly<{
  type: 'bye';
  reason: string;
}>;

export type SessionFrame
  = | SessionFrame_AnnounceSessionLock
  | SessionFrame_JoinedSession
  | SessionFrame_ReplicateTo
  | SessionFrame_Reject
  | SessionFrame_Bye;

export type ClientAnnouncedSessionLock = Readonly<{
  type: 'announcedSessionLock';
  principalId: string;
  lockHash: string;
}>;

export type ClientCommand = Readonly<{
  type: 'command';
  commandId: string;
  connectionEpoch: number;
  payload: unknown;
}>;

export type ClientFrame = ClientAnnouncedSessionLock | ClientCommand;

export type DaemonInbound
  = | Readonly<{ type: 'boot'; lock: FrozenLock; serverModuleUrls: readonly string[] }>
  | Readonly<{ type: 'join'; connectionId: string; principalId: string; lockHash: string }>
  | Readonly<{ type: 'command'; connectionId: string; commandId: string; connectionEpoch: number; payload: unknown }>
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
  schedule: (earliestTick: number, commandId: string, principalId: string, payload: unknown) => void;
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
