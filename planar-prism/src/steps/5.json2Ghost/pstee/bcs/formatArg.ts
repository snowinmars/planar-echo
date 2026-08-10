import { isNothing, just } from '@planar/shared';
import { ieNameToMethod } from './nameMap.js';

import type { DiscoverNext } from '@/discoverer.types.js';
import type { BcsArg, BcsObjectQuery } from '@/steps/4.biffs2json/pstee/bcs/parseBcs.types.js';

const quote = (s: string): string => `'${s.replaceAll(`'`, `\\'`)}'`;

const PST_FIELDS = ['ea', 'faction', 'team', 'general', 'race', 'class', 'specific', 'gender', 'align'] as const;

/** Legacy IE filter string from pre-query JSON: [0.0.0.0.85] or [0.0.0.0.troco1] */
const parseLegacyFilterString = (raw: string): BcsObjectQuery | null => {
  if (!raw.startsWith('[') || !raw.endsWith(']')) return null;
  const inner = raw.slice(1, -1);
  if (inner === 'pc' || inner === 'anyone') return null;
  const parts = inner.split('.');
  if (parts.length < 2) return null;

  // 5-part filters are the common short form: ea.general.race.class.specific
  // Full PST form is 9-part: ea.faction.team.general.race.class.specific.gender.align
  const fields = parts.length <= 5
    ? (['ea', 'general', 'race', 'class', 'specific'] as const)
    : PST_FIELDS;

  const query: {
    ea?: string;
    faction?: string;
    team?: string;
    general?: string;
    race?: string;
    class?: string;
    specific?: string;
    gender?: string;
    align?: string;
  } = {};
  let any = false;
  for (let i = 0; i < Math.min(parts.length, fields.length); i++) {
    const part = parts[i]!;
    if (part === '0' || part === '') continue;
    query[fields[i]!] = part.toLowerCase();
    any = true;
  }
  return any ? query : null;
};

const formatQuery = (q: BcsObjectQuery, discover: DiscoverNext): string => {
  const parts: string[] = [];
  const add = (key: keyof BcsObjectQuery, category: 'ea' | 'specific' | 'who') => {
    const v = q[key];
    if (isNothing(v)) return;
    discover({ type: category, name: just(v) });
    parts.push(`${key}: ${quote(just(v))}`);
  };
  add('ea', 'ea');
  add('faction', 'who');
  add('team', 'who');
  add('general', 'who');
  add('race', 'who');
  add('class', 'who');
  add('specific', 'specific');
  add('gender', 'who');
  add('align', 'who');
  return `{ ${parts.join(', ')} }`;
};

export const formatArg = (
  arg: BcsArg,
  myselfExpr: string,
  discover: DiscoverNext,
): string => {
  switch (arg.kind) {
    case 'int': {
      if (arg.symbol) {
        const sym = arg.symbol.toLowerCase();
        discover({ type: 'speed', name: sym });
        return quote(sym);
      }
      return String(arg.value);
    }
    case 'string': {
      const v = arg.value.toLowerCase();
      if (v === '[pc]' || v === 'pc' || v === 'protagonist' || /^player\d+$/.test(v)) {
        discover({ type: 'who', name: 'protagonist' });
        return quote('protagonist');
      }
      if (v === 'myself') return myselfExpr;
      const legacy = parseLegacyFilterString(arg.value);
      if (legacy) return formatQuery(legacy, discover);
      return quote(arg.value);
    }
    case 'who': {
      if (arg.value === 'myself') return myselfExpr;
      discover({ type: 'who', name: arg.value });
      return quote(arg.value);
    }
    case 'query':
      return formatQuery(arg.value, discover);
    case 'point':
      return `{ x: ${arg.x}, y: ${arg.y} }`;
    case 'ref':
      return arg.name;
    case 'function': {
      const method = ieNameToMethod(arg.name);
      const args = arg.args.map(a => formatArg(a, myselfExpr, discover)).join(', ');
      return `l.${method}(${args})`;
    }
    default: {
      const _exhaustive: never = arg;
      throw new Error(`Unknown BcsArg kind: ${JSON.stringify(_exhaustive)}`);
    }
  }
};
