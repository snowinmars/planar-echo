import type { CreatureV10, CreatureV11 } from '../cre/index.js';
import type { Bcs, BcsArg } from './parseBcs.types.js';

type Creature = CreatureV10 | CreatureV11;

const creWhoId = (cre: Creature): string =>
  cre.resourceName.split('.')[0]!.toLowerCase().replaceAll(`'`, '');

/**
 * specific symbol → whoId only when exactly one CRE has that specific.
 */
export const buildUniqueSpecificToWhoId = (cres: Creature[]): Map<string, string> => {
  const buckets = new Map<string, string[]>();

  for (const cre of cres) {
    const specific = String(cre.header.specific ?? '').toLowerCase();
    if (!specific || specific === 'none' || specific === '0') continue;
    const list = buckets.get(specific) ?? [];
    list.push(creWhoId(cre));
    buckets.set(specific, list);
  }

  const unique = new Map<string, string>();
  for (const [specific, whoIds] of buckets) {
    const deduped = [...new Set(whoIds)];
    if (deduped.length === 1) unique.set(specific, deduped[0]!);
  }
  return unique;
};

const upgradeArg = (arg: BcsArg, specificToWhoId: ReadonlyMap<string, string>): BcsArg => {
  if (arg.kind === 'query') {
    const q = arg.value;
    const keys = (['ea', 'faction', 'team', 'general', 'race', 'class', 'specific', 'gender', 'align'] as const)
      .filter(k => q[k]);
    if (keys.length === 1 && keys[0] === 'specific' && q.specific) {
      const whoId = specificToWhoId.get(q.specific);
      if (whoId) return { kind: 'who', value: whoId };
    }
    return arg;
  }
  if (arg.kind === 'function') {
    return {
      kind: 'function',
      name: arg.name,
      args: arg.args.map(a => upgradeArg(a, specificToWhoId)),
    };
  }
  if (arg.kind === 'string') {
    const v = arg.value.toLowerCase();
    if (v === '[pc]' || v === 'pc' || /^player\d+$/.test(v)) return { kind: 'who', value: 'protagonist' };
  }
  return arg;
};

export const resolveBcsObjectWhoIds = (
  bcsList: Bcs[],
  specificToWhoId: ReadonlyMap<string, string>,
): Bcs[] => {
  return bcsList.map((bcs): Bcs => ({
    ...bcs,
    blocks: bcs.blocks.map(block => ({
      condition: {
        ...block.condition,
        temps: block.condition.temps.map(t => ({
          ...t,
          value: upgradeArg(t.value, specificToWhoId),
        })),
        functions: block.condition.functions.map(fn => ({
          ...fn,
          args: fn.args.map(a => upgradeArg(a, specificToWhoId)),
        })),
      },
      actions: block.actions.map(response => ({
        ...response,
        temps: response.temps.map(t => ({
          ...t,
          value: upgradeArg(t.value, specificToWhoId),
        })),
        functions: response.functions.map(fn => ({
          ...fn,
          args: fn.args.map(a => upgradeArg(a, specificToWhoId)),
        })),
      })),
    })),
  }));
};
