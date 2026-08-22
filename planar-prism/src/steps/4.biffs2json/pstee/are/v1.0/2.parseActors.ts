import { nothing } from '@planar/shared';
import { parseDirection } from '../../shared/parseDirection.js';
import { extendMap } from './2.parseActors.types.js';
import { externalOffsetMap } from '@/shared/extendedMap.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawAreActorV10 } from './2.parseActors.types.js';
import type { RawIds } from '../../ids/index.js';

type ParseActorProps = Readonly<{
  reader: BufferReader;
  creNames: ReadonlySet<string>;
  resourceName: string;
  ids: Map<string, RawIds>;
}>;
const parseActor = ({
  reader,
  creNames,
  resourceName,
  ids,
}: ParseActorProps): RawAreActorV10 => {
  const name = reader.nullTerminatedString(32); // TODO [snow]: in bytecode there is tail after null terminator. Why?
  const x = reader.ushort();
  const y = reader.ushort();
  const destX = reader.ushort();
  const destY = reader.ushort();
  const flags = reader.map.uint(extendMap.actorFlags.parseFlags);
  const isSpawnedAsRandomMonster = reader.ushort() === 1;
  const creResrefLetter = reader.string(1);
  reader.skip.ubyte();
  const animation = reader.map.uint(x => externalOffsetMap.parseExternal(x, ids.get('animate.ids')!.entries));
  const direction = reader.map.ushort(x => parseDirection(x));
  reader.skip.ushort();
  const expiryTime = reader.int();
  const wanderDistance = reader.ushort();
  const followDistance = reader.ushort();
  const presentedAt = reader.map.uint(extendMap.presentedAtFlags.parseFlags);
  const numTimesTalkedTo = reader.uint();
  const dialog = reader.string(8);
  const scriptOverride = reader.string(8);
  const scriptGeneral = reader.string(8);
  const scriptClass = reader.string(8);
  const scriptRace = reader.string(8);
  const scriptDefault = reader.string(8);
  const scriptSpecifics = reader.string(8);
  const cre = reader.string(8);
  const creOffset = reader.uint();
  const creSize = reader.uint();
  reader.skip.custom(128);

  if (creSize > 0) {
    throw new Error(`Embedded cre not supported for actor '${name}' in are '${resourceName}'`);
  }

  // !cre.startsWith('*')
  if (cre && !creNames.has(cre)) {
    throw new Error(`Cre '${cre}' for actor '${name}' in are '${resourceName}' was not found in cre_raw2json results`);
  }

  const rawAreActorV10: RawAreActorV10 = {
    name,
    at: {
      x,
      y,
    },
    destX,
    destY,
    flags,
    isSpawnedAsRandomMonster,
    creResrefLetter: creResrefLetter ? creResrefLetter : nothing(),
    animation,
    direction,
    expiryTime,
    wanderDistance,
    followDistance,
    presentedAt,
    numTimesTalkedTo,
    dialog: dialog ? dialog : nothing(),
    scriptOverride: scriptOverride ? scriptOverride : nothing(),
    scriptGeneral,
    scriptClass: scriptClass ? scriptClass : nothing(),
    scriptRace: scriptRace ? scriptRace : nothing(),
    scriptDefault: scriptDefault ? scriptDefault : nothing(),
    scriptSpecifics: scriptSpecifics ? scriptSpecifics : nothing(),
    cre,
    creOffset: creOffset ? creOffset : nothing(),
    creSize: creSize ? creSize : nothing(),
  };

  return rawAreActorV10;
};

type ParseActorsProps = Readonly<{
  reader: BufferReader;
  count: number;
  creNames: ReadonlySet<string>;
  resourceName: string;
  ids: Map<string, RawIds>;
}>;
export const parseActors = ({
  reader,
  count,
  creNames,
  resourceName,
  ids,
}: ParseActorsProps): RawAreActorV10[] => {
  const actors: RawAreActorV10[] = [];

  for (let i = 0; i < count; i++) actors.push(parseActor({
    reader,
    creNames,
    resourceName,
    ids,
  }));

  return actors;
};
