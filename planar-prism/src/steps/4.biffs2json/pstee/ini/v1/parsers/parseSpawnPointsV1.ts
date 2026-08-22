import { parseDecOrThrow } from './shared.js';
import { parseDirection } from '../../../shared/parseDirection.js';

import type { Maybe } from '@planar/shared';
import type { RawIniCreatureIniSpawnPoint } from './parseSpawnPointsV1.types.js';

export const parseSpawnPoint = (s: string): RawIniCreatureIniSpawnPoint => {
  const [coords, directionPart] = s.split(':');
  if (!coords) throw new Error(`Supported format are '[x.y:dir],[x.y:dir],...' / '[x.y:dir][x.y:dir]...', but you passed '${s}'. Why?`);

  const [x, y] = coords.split('.').map(parseDecOrThrow);
  if (x === undefined || y === undefined) throw new Error(`Supported format are '[x.y:dir],[x.y:dir],...' / '[x.y:dir][x.y:dir]...', but you passed '${s}'. Why?`);

  return {
    x,
    y,
    direction: directionPart ? parseDirection(directionPart) : '0=south',
  };
};

const parseCommaSeparatedSpawnPoints = (s: string): RawIniCreatureIniSpawnPoint[] =>
  s.split(',').map(batch => parseSpawnPoint(batch.slice(1, -1)));

const parseBracketSeparatedSpawnPoints = (s: string): RawIniCreatureIniSpawnPoint[] =>
  s.slice(1, -1).split('][').map(parseSpawnPoint);

export const parseSpawnPointsV1 = (s: Maybe<string>): RawIniCreatureIniSpawnPoint[] => {
  if (!s) throw new Error(`Cannot parse SpawnPoint from nothing`);

  const commaSeparatedSyntax = s.includes('],[');
  const nonCommaSeparatedSyntax = s.includes('][');
  if (commaSeparatedSyntax) return parseCommaSeparatedSpawnPoints(s);
  if (nonCommaSeparatedSyntax) return parseBracketSeparatedSpawnPoints(s);
  return [parseSpawnPoint(s.slice(1, -1))];
};
