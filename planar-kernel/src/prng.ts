const mix = (seed: number, name: string): number => {
  let state = seed >>> 0;
  for (let index = 0; index < name.length; index += 1) {
    state = Math.imul(state ^ name.charCodeAt(index), 0x01000193) >>> 0;
  }
  return state === 0 ? 0x6d2b79f5 : state;
};

export class NamedPrng {
  private readonly streams = new Map<string, number>();

  public constructor(private readonly seed: number) {}

  public next(name: string): number {
    const current = this.streams.get(name) ?? mix(this.seed, name);
    let state = current >>> 0;
    state = (state + 0x6d2b79f5) >>> 0;
    let mixed = state;
    mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
    this.streams.set(name, state);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  }

  public exportState(): Readonly<Record<string, number>> {
    return Object.fromEntries([...this.streams.entries()].sort(([left], [right]) => left.localeCompare(right)));
  }

  public importState(state: Readonly<Record<string, number>>): void {
    this.streams.clear();
    for (const [name, value] of Object.entries(state)) this.streams.set(name, value >>> 0);
  }
}

export const seedFromHash = (hash: string): number => {
  const slice = hash.slice(0, 8);
  const parsed = Number.parseInt(slice, 16);
  return Number.isFinite(parsed) ? parsed >>> 0 : 1;
};
