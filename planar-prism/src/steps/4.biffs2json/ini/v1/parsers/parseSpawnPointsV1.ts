import { parseDecOrThrow } from '../../../../../shared/customParsers.js';
import parseDirectionV1 from './parseDirectionV1.js';

import type { Maybe } from '../../../../../shared/maybe.js';
import type { CreatureIniSpawnPoint } from '../../types.js';

const parseSpawnPoint = (s: string): CreatureIniSpawnPoint => {
  const [coords, directionPart] = s.split(':');
  if (!coords) throw new Error(`Supported format are '[x.y:dir],[x.y:dir],...' / '[x.y:dir][x.y:dir]...', but you passed '${s}'. Why?`);

  const [x, y] = coords.split('.').map(parseDecOrThrow);
  if (x === undefined || y === undefined) throw new Error(`Supported format are '[x.y:dir],[x.y:dir],...' / '[x.y:dir][x.y:dir]...', but you passed '${s}'. Why?`);

  return {
    x,
    y,
    direction: directionPart ? parseDirectionV1(directionPart) : '0=south',
  };
};

const parseCommaSeparatedSpawnPoints = (s: string): CreatureIniSpawnPoint[] =>
  s.split(',').map(batch => parseSpawnPoint(batch.slice(1, -1)));

const parseBracketSeparatedSpawnPoints = (s: string): CreatureIniSpawnPoint[] =>
  s.slice(1, -1).split('][').map(parseSpawnPoint);

const parseSpawnPointsV1 = (s: Maybe<string>): CreatureIniSpawnPoint[] => {
  if (!s) throw new Error(`Cannot parse SpawnPoint from nothing`);

  const commaSeparatedSyntax = s.includes('],[');
  const nonCommaSeparatedSyntax = s.includes('][');
  if (commaSeparatedSyntax) return parseCommaSeparatedSpawnPoints(s);
  if (nonCommaSeparatedSyntax) return parseBracketSeparatedSpawnPoints(s);
  return [parseSpawnPoint(s.slice(1, -1))];
};

export default parseSpawnPointsV1;
