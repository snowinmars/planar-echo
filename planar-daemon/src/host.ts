import { pathToFileURL } from 'node:url';

import { SessionKernel } from '@planar/kernel';

import type { CommandHandler, SystemHandler } from '@planar/kernel';
import type {
  CommandContext,
  FrozenLock,
  ProtocolRow,
  ResourceRow,
  ServerHost,
  SessionFrame,
} from '@planar/shared';

export type JoinResult
  = | { ok: true; frame: Extract<SessionFrame, { type: 'welcome' }> }
    | { ok: false; reason: string };

type Connection = {
  connectionId: string;
  principalId: string;
  epoch: number;
};

const COMMANDS_PER_TICK = 8;

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

export class SessionHost {
  private readonly kernel: SessionKernel;
  private readonly protocolWire = new Map<string, number>();
  private readonly resourceWire = new Map<string, number>();
  private readonly eventWire = new Map<string, number>();
  private readonly connections = new Map<string, Connection>();
  private readonly principalConnection = new Map<string, string>();
  private readonly queued = new Map<string, { commandWireId: number; payload: unknown }[]>();
  private readonly eventHandlers = new Map<number, (data: unknown, tick: number) => void>();
  private booted = false;

  public constructor(
    public readonly sessionId: string,
    private readonly lock: FrozenLock,
  ) {
    this.kernel = new SessionKernel(lock);
    for (const protocol of lock.protocols) this.protocolWire.set(protocol.key, protocol.wireId);
    for (const resource of lock.resources) this.resourceWire.set(resource.key, resource.wireId);
    for (const event of lock.events) this.eventWire.set(event.key, event.wireId);
  }

  public get lockHash(): string {
    return this.lock.lockHash;
  }

  public async loadServer(serverModuleUrl: string): Promise<void> {
    const loaded: unknown = await import(pathToFileURL(serverModuleUrl).href);
    if (!isRecord(loaded) || typeof loaded.register !== 'function') {
      throw new Error('Server module has no register function');
    }
    const register = loaded.register as (host: ServerHost) => void;
    register(this.hostApi());
    this.kernel.assertHandlers();
    this.booted = true;
  }

  public registerInline(register: (host: ServerHost) => void): void {
    register(this.hostApi());
    this.kernel.assertHandlers();
    this.booted = true;
  }

  public join(connectionId: string, principalId: string, lockHash: string): JoinResult {
    if (!this.booted) return { ok: false, reason: 'session is not ready' };
    if (lockHash !== this.lock.lockHash) return { ok: false, reason: 'lock mismatch' };
    const seat = this.lock.seats.find(item => item.principalId === principalId);
    if (!seat) return { ok: false, reason: 'unknown principal' };
    if (this.principalConnection.has(principalId)) return { ok: false, reason: 'principal already connected' };
    const ownedEntityId = this.kernel.ownedEntity(principalId);
    if (ownedEntityId === null) return { ok: false, reason: 'seat has no entity' };
    this.connections.set(connectionId, { connectionId, principalId, epoch: 1 });
    this.principalConnection.set(principalId, connectionId);
    this.queued.set(principalId, []);
    return {
      ok: true,
      frame: {
        type: 'welcome',
        sessionId: this.sessionId,
        lockHash: this.lock.lockHash,
        principalId,
        ownedEntityId,
        connectionEpoch: 1,
        tick: this.kernel.currentTick,
        checkpoint: this.kernel.checkpoint(),
        rows: this.rowsFor(principalId),
        resources: this.resourcesFor(),
      },
    };
  }

  public leave(connectionId: string): void {
    const connection = this.connections.get(connectionId);
    if (!connection) return;
    this.connections.delete(connectionId);
    this.principalConnection.delete(connection.principalId);
    this.queued.delete(connection.principalId);
  }

  public admit(
    connectionId: string,
    commandWireId: number,
    connectionEpoch: number,
    payload: unknown,
  ): string | null {
    const connection = this.connections.get(connectionId);
    if (!connection) return 'unknown connection';
    if (connection.epoch !== connectionEpoch) return 'stale connection epoch';
    const seat = this.lock.seats.find(item => item.principalId === connection.principalId);
    if (!seat || !seat.commands.includes(commandWireId)) return 'command is not granted';
    const queue = this.queued.get(connection.principalId) ?? [];
    if (queue.length >= COMMANDS_PER_TICK) return 'command rate exceeded';
    queue.push({ commandWireId, payload });
    this.queued.set(connection.principalId, queue);
    return null;
  }

  public tick(): SessionFrame {
    const commands = this.lock.seats.flatMap((seat) => {
      const queue = this.queued.get(seat.principalId) ?? [];
      this.queued.set(seat.principalId, []);
      return queue.map(command => ({
        commandWireId: command.commandWireId,
        principalId: seat.principalId,
        payload: command.payload,
      }));
    });
    const result = this.kernel.runTick(commands);
    for (const event of result.events) this.eventHandlers.get(event.wireId)?.(event.data, result.tick);
    return {
      type: 'replication',
      tick: result.tick,
      checkpoint: result.checkpoint,
      rows: result.rows,
      resources: result.resources,
      events: result.events,
    };
  }

  public project(frame: Extract<SessionFrame, { type: 'replication' }>): { connectionId: string; frame: SessionFrame }[] {
    return [...this.connections.values()].map(connection => ({
      connectionId: connection.connectionId,
      frame: {
        ...frame,
        rows: frame.rows.filter(row => this.rowVisibleTo(connection.principalId, row)),
      },
    }));
  }

  private hostApi(): ServerHost {
    const kernel = this.kernel;
    return {
      lock: this.lock,
      boot: (write) => {
        kernel.transact(() => {
          write({
            createEntity: () => kernel.createEntity(),
            bindSeat: (principalId, entityId) => kernel.bindSeat(principalId, entityId),
            readProtocol: (entityId, token) => kernel.readProtocol(entityId, this.mustProtocol(token)),
            writeProtocol: (entityId, token, value) => kernel.writeProtocol(entityId, this.mustProtocol(token), value),
            readResource: token => kernel.readResource(this.mustResource(token)),
            writeResource: (token, value) => kernel.writeResource(this.mustResource(token), value),
          });
        });
      },
      onCommand: (token, handler) => {
        const wireId = this.mustCommand(token);
        const wrapped: CommandHandler = (input) => {
          const ctx: CommandContext = {
            principalId: input.principalId,
            payload: input.payload,
            entityForPrincipal: principalId => kernel.ownedEntity(principalId),
            readProtocol: (entityId, protocol) => input.readProtocol(entityId, this.mustProtocol(protocol)),
            writeProtocol: (entityId, protocol, value) => input.writeProtocol(entityId, this.mustProtocol(protocol), value),
            readResource: resource => input.readResource(this.mustResource(resource)),
            writeResource: (resource, value) => input.writeResource(this.mustResource(resource), value),
          };
          handler(ctx);
        };
        kernel.registerCommand(wireId, wrapped);
      },
      onSystem: (systemId, handler) => {
        const wrapped: SystemHandler = (input) => {
          handler({
            tick: input.tick,
            prng: input.prng,
            readProtocol: (entityId, token) => input.readProtocol(entityId, this.mustProtocol(token)),
            writeProtocol: (entityId, token, value) => input.writeProtocol(entityId, this.mustProtocol(token), value),
            readResource: token => input.readResource(this.mustResource(token)),
            writeResource: (token, value) => input.writeResource(this.mustResource(token), value),
            emit: (token, data) => input.emit(this.mustEvent(token), data),
            schedule: (earliestTick, commandWireId, principalId, payload) => {
              input.schedule(earliestTick, { commandWireId, principalId, payload });
            },
          });
        };
        kernel.registerSystem(systemId, wrapped);
      },
      onEvent: (token, handler) => {
        const wireId = this.mustEvent(token);
        if (this.eventHandlers.has(wireId)) throw new Error(`Event "${token}" already has an observer`);
        this.eventHandlers.set(wireId, (data, tick) => handler({ tick, data }));
      },
    };
  }

  private rowsFor(principalId: string): ProtocolRow[] {
    return this.kernel.projectedProtocols().filter(row => this.rowVisibleTo(principalId, row));
  }

  private resourcesFor(): ResourceRow[] {
    return this.kernel.projectedResources();
  }

  private rowVisibleTo(principalId: string, row: ProtocolRow): boolean {
    const replication = this.lock.protocols.find(item => item.wireId === row.wireId)?.replication;
    if (replication === 'session') return true;
    if (replication === 'owner') return this.kernel.ownedEntity(principalId) === row.entityId;
    return false;
  }

  private mustProtocol(token: string): number {
    const wireId = this.protocolWire.get(token);
    if (wireId === undefined) throw new Error(`Unknown protocol "${token}"`);
    return wireId;
  }

  private mustResource(token: string): number {
    const wireId = this.resourceWire.get(token);
    if (wireId === undefined) throw new Error(`Unknown resource "${token}"`);
    return wireId;
  }

  private mustCommand(token: string): number {
    const command = this.lock.commands.find(item => item.key === token);
    if (!command) throw new Error(`Unknown command "${token}"`);
    return command.wireId;
  }

  private mustEvent(token: string): number {
    const wireId = this.eventWire.get(token);
    if (wireId === undefined) throw new Error(`Unknown event "${token}"`);
    return wireId;
  }
}
