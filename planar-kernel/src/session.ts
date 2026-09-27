import { canonicalHash } from '@planar/shared';

import { NamedPrng, seedFromHash } from './prng.js';

import type { FrozenLock, ProtocolRow, ResourceRow, TransientEvent } from '@planar/shared';

export type AdmittedCommand = Readonly<{
  commandWireId: number;
  principalId: string;
  payload: unknown;
}>;

export type ScheduledCommand = AdmittedCommand & Readonly<{ earliestTick: number }>;

export type CommandHandler = (input: Readonly<{
  principalId: string;
  payload: unknown;
  readProtocol: (entityId: number, wireId: number) => unknown;
  writeProtocol: (entityId: number, wireId: number, value: unknown) => void;
  readResource: (wireId: number) => unknown;
  writeResource: (wireId: number, value: unknown) => void;
  createEntity: () => number;
}>) => void;

export type SystemHandler = (input: Readonly<{
  tick: number;
  prng: (name: string) => number;
  readProtocol: (entityId: number, wireId: number) => unknown;
  writeProtocol: (entityId: number, wireId: number, value: unknown) => void;
  readResource: (wireId: number) => unknown;
  writeResource: (wireId: number, value: unknown) => void;
  emit: (wireId: number, data: unknown) => void;
  schedule: (earliestTick: number, command: AdmittedCommand) => void;
}>) => void;

export type TickResult = Readonly<{
  tick: number;
  checkpoint: string;
  rows: readonly ProtocolRow[];
  resources: readonly ResourceRow[];
  events: readonly TransientEvent[];
  rejected: readonly string[];
}>;

type Staged = {
  creates: number[];
  protocols: Map<string, unknown>;
  resources: Map<number, unknown>;
  events: TransientEvent[];
  seats: Map<string, number>;
};

const cell = (entityId: number, wireId: number): string => `${entityId}:${wireId}`;

const cloneData = (value: unknown): unknown => {
  if (value === undefined) throw new Error('Undefined is not world data');
  return JSON.parse(JSON.stringify(value)) as unknown;
};

export class SessionKernel {
  private tick = 0;
  private nextEntity = 1;
  private readonly alive = new Set<number>();
  private readonly protocols = new Map<string, unknown>();
  private readonly resources = new Map<number, unknown>();
  private readonly protocolReplication = new Map<number, FrozenLock['protocols'][number]['replication']>();
  private readonly resourceReplication = new Map<number, FrozenLock['resources'][number]['replication']>();
  private readonly commandHandlers = new Map<number, CommandHandler>();
  private readonly systems: { id: string; handler: SystemHandler | null }[];
  private readonly scheduled: ScheduledCommand[] = [];
  private readonly seats = new Map<string, number>();
  private readonly prng: NamedPrng;
  private current: Staged | null = null;

  public constructor(private readonly lock: FrozenLock) {
    for (const protocol of lock.protocols) this.protocolReplication.set(protocol.wireId, protocol.replication);
    for (const resource of lock.resources) this.resourceReplication.set(resource.wireId, resource.replication);
    this.systems = lock.systems.map(id => ({ id, handler: null }));
    this.prng = new NamedPrng(seedFromHash(lock.lockHash));
  }

  public get currentTick(): number {
    return this.tick;
  }

  public registerCommand(wireId: number, handler: CommandHandler): void {
    if (![...this.lock.commands].some(command => command.wireId === wireId)) {
      throw new Error(`Unknown command wire ${wireId}`);
    }
    if (this.commandHandlers.has(wireId)) throw new Error(`Command wire ${wireId} already has a handler`);
    this.commandHandlers.set(wireId, handler);
  }

  public registerSystem(id: string, handler: SystemHandler): void {
    const node = this.systems.find(system => system.id === id);
    if (!node) throw new Error(`System "${id}" is not in the lock`);
    if (node.handler) throw new Error(`System "${id}" already has a handler`);
    node.handler = handler;
  }

  public assertHandlers(): void {
    for (const system of this.systems) {
      if (!system.handler) throw new Error(`System "${system.id}" has no handler`);
    }
  }

  public transact(run: () => void): void {
    const stage = this.openStage();
    this.current = stage;
    try {
      run();
      this.commit(stage);
    }
    finally {
      this.current = null;
    }
  }

  public createEntity(): number {
    return this.stageCreate(this.mustStage());
  }

  public readProtocol(entityId: number, wireId: number): unknown {
    return this.readStagedProtocol(this.mustStage(), entityId, wireId);
  }

  public writeProtocol(entityId: number, wireId: number, value: unknown): void {
    this.stageProtocol(this.mustStage(), entityId, wireId, value);
  }

  public readResource(wireId: number): unknown {
    const stage = this.mustStage();
    return stage.resources.get(wireId) ?? this.resources.get(wireId);
  }

  public writeResource(wireId: number, value: unknown): void {
    this.stageResource(this.mustStage(), wireId, value);
  }

  public bindSeat(principalId: string, entityId: number): void {
    const stage = this.mustStage();
    if (!this.lock.seats.some(seat => seat.principalId === principalId)) {
      throw new Error(`Unknown principal "${principalId}"`);
    }
    if (!this.entityVisible(stage, entityId)) throw new Error(`Unknown entity ${entityId}`);
    stage.seats.set(principalId, entityId);
  }

  public entityForSeat(principalId: string): number | null {
    const staged = this.current?.seats.get(principalId);
    if (staged !== undefined) return staged;
    return this.seats.get(principalId) ?? null;
  }

  public runTick(commands: readonly AdmittedCommand[]): TickResult {
    const rejected: string[] = [];
    const events: TransientEvent[] = [];
    const due = this.scheduled.filter(command => command.earliestTick <= this.tick + 1);
    this.scheduled.splice(0, this.scheduled.length, ...this.scheduled.filter(command => command.earliestTick > this.tick + 1));
    const batch = [
      ...due.map(command => ({ commandWireId: command.commandWireId, principalId: command.principalId, payload: command.payload })),
      ...commands,
    ];
    for (const command of batch) {
      const failure = this.applyCommand(command, events);
      if (failure) rejected.push(failure);
    }
    for (const system of this.systems) {
      const handler = system.handler;
      if (!handler) throw new Error(`System "${system.id}" has no handler`);
      const stage = this.openStage();
      try {
        handler({
          tick: this.tick + 1,
          prng: name => this.prng.next(name),
          readProtocol: (entityId, wireId) => this.readStagedProtocol(stage, entityId, wireId),
          writeProtocol: (entityId, wireId, value) => this.stageProtocol(stage, entityId, wireId, value),
          readResource: wireId => stage.resources.get(wireId) ?? this.resources.get(wireId),
          writeResource: (wireId, value) => this.stageResource(stage, wireId, value),
          emit: (wireId, data) => stage.events.push({ wireId, data: cloneData(data) }),
          schedule: (earliestTick, scheduled) => {
            if (earliestTick <= this.tick + 1) throw new Error('Scheduled command must target a future tick');
            this.scheduled.push({ ...scheduled, earliestTick });
          },
        });
        events.push(...stage.events);
        this.commit(stage);
      }
      catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'system failed';
        const failure = new Error(`System "${system.id}" failed: ${message}`);
        (failure as Error & { cause: unknown }).cause = error;
        throw failure;
      }
    }
    this.tick += 1;
    return {
      tick: this.tick,
      checkpoint: this.checkpoint(),
      rows: this.projectedProtocols(),
      resources: this.projectedResources(),
      events,
      rejected,
    };
  }

  public checkpoint(): string {
    return canonicalHash({
      tick: this.tick,
      entities: [...this.alive].sort((left, right) => left - right),
      protocols: [...this.protocols.entries()].sort(([left], [right]) => left.localeCompare(right)),
      resources: [...this.resources.entries()].sort(([left], [right]) => left - right),
      prng: this.prng.exportState(),
      seats: [...this.seats.entries()].sort(([left], [right]) => left.localeCompare(right)),
      scheduled: this.scheduled,
    });
  }

  public projectedProtocols(): ProtocolRow[] {
    const rows: ProtocolRow[] = [];
    for (const [key, value] of this.protocols) {
      const [entityText, wireText] = key.split(':');
      const entityId = Number(entityText);
      const wireId = Number(wireText);
      if (this.protocolReplication.get(wireId) === 'none') continue;
      rows.push({ entityId, wireId, value });
    }
    rows.sort((left, right) => left.entityId - right.entityId || left.wireId - right.wireId);
    return rows;
  }

  public projectedResources(): ResourceRow[] {
    const rows: ResourceRow[] = [];
    for (const [wireId, value] of this.resources) {
      if (this.resourceReplication.get(wireId) === 'none') continue;
      rows.push({ wireId, value });
    }
    rows.sort((left, right) => left.wireId - right.wireId);
    return rows;
  }

  public ownedEntity(principalId: string): number | null {
    return this.seats.get(principalId) ?? null;
  }

  private applyCommand(command: AdmittedCommand, events: TransientEvent[]): string | null {
    const handler = this.commandHandlers.get(command.commandWireId);
    if (!handler) return `no handler for command ${command.commandWireId}`;
    const stage = this.openStage();
    try {
      handler({
        principalId: command.principalId,
        payload: command.payload,
        readProtocol: (entityId, wireId) => this.readStagedProtocol(stage, entityId, wireId),
        writeProtocol: (entityId, wireId, value) => this.stageProtocol(stage, entityId, wireId, value),
        readResource: wireId => stage.resources.get(wireId) ?? this.resources.get(wireId),
        writeResource: (wireId, value) => this.stageResource(stage, wireId, value),
        createEntity: () => this.stageCreate(stage),
      });
      events.push(...stage.events);
      this.commit(stage);
      return null;
    }
    catch (error: unknown) {
      return error instanceof Error ? error.message : 'command failed';
    }
  }

  private openStage(): Staged {
    return { creates: [], protocols: new Map(), resources: new Map(), events: [], seats: new Map() };
  }

  private stageCreate(stage: Staged): number {
    const entityId = this.nextEntity + stage.creates.length;
    stage.creates.push(entityId);
    return entityId;
  }

  private entityVisible(stage: Staged, entityId: number): boolean {
    return this.alive.has(entityId) || stage.creates.includes(entityId);
  }

  private stageProtocol(stage: Staged, entityId: number, wireId: number, value: unknown): void {
    if (!this.protocolReplication.has(wireId)) throw new Error(`Unknown protocol wire ${wireId}`);
    if (!this.entityVisible(stage, entityId)) throw new Error(`Unknown entity ${entityId}`);
    stage.protocols.set(cell(entityId, wireId), cloneData(value));
  }

  private stageResource(stage: Staged, wireId: number, value: unknown): void {
    if (!this.resourceReplication.has(wireId)) throw new Error(`Unknown resource wire ${wireId}`);
    stage.resources.set(wireId, cloneData(value));
  }

  private readStagedProtocol(stage: Staged, entityId: number, wireId: number): unknown {
    return stage.protocols.get(cell(entityId, wireId)) ?? this.protocols.get(cell(entityId, wireId));
  }

  private commit(stage: Staged): void {
    for (const entityId of stage.creates) {
      this.alive.add(entityId);
      this.nextEntity = Math.max(this.nextEntity, entityId + 1);
    }
    for (const [key, value] of stage.protocols) this.protocols.set(key, value);
    for (const [wireId, value] of stage.resources) this.resources.set(wireId, value);
    for (const [principalId, entityId] of stage.seats) this.seats.set(principalId, entityId);
  }

  private mustStage(): Staged {
    if (!this.current) throw new Error('Write outside a transaction');
    return this.current;
  }
}
