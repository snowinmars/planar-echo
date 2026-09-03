import { externalOffsetMap } from '@/shared/extendedMap.js';

import type { BufferReader } from '@/shared/bufferReader.js';

import type { RawIds } from '../../ids/index.js';
import type { RawAreSongV10 } from './17.parseSong.types.js';

type ParseSongProps = Readonly<{
  reader: BufferReader;
  ids: Map<string, RawIds>;
}>;
export const parseSong = ({
  reader,
  ids,
}: ParseSongProps): RawAreSongV10 => {
  const daySong = reader.map.int(x => externalOffsetMap.parseExternal(x, ids.get('songlist.ids')!.entries));
  const nightSong = reader.map.int(x => externalOffsetMap.parseExternal(x, ids.get('songlist.ids')!.entries));
  const winSong = reader.map.int(x => externalOffsetMap.parseExternal(x, ids.get('songlist.ids')!.entries));
  const battleSong = reader.map.int(x => externalOffsetMap.parseExternal(x, ids.get('songlist.ids')!.entries));
  const loseSong = reader.map.int(x => externalOffsetMap.parseExternal(x, ids.get('songlist.ids')!.entries));
  const altMusic1 = reader.map.int(x => externalOffsetMap.parseExternal(x, ids.get('songlist.ids')!.entries));
  const altMusic2 = reader.map.int(x => externalOffsetMap.parseExternal(x, ids.get('songlist.ids')!.entries));
  const altMusic3 = reader.map.int(x => externalOffsetMap.parseExternal(x, ids.get('songlist.ids')!.entries));
  const altMusic4 = reader.map.int(x => externalOffsetMap.parseExternal(x, ids.get('songlist.ids')!.entries));
  const altMusic5 = reader.map.int(x => externalOffsetMap.parseExternal(x, ids.get('songlist.ids')!.entries));
  const mainDayAmbient1 = reader.string(8);
  const mainDayAmbient2 = reader.string(8);
  const mainDayAmbientVolume = reader.uint();
  const mainNightAmbient1 = reader.string(8);
  const mainNightAmbient2 = reader.string(8);
  const mainNightAmbientVolume = reader.uint();
  const reverb = reader.int();
  reader.skip.custom(60);

  const song: RawAreSongV10 = {
    daySong,
    nightSong,
    winSong,
    battleSong,
    loseSong,
    altMusic1,
    altMusic2,
    altMusic3,
    altMusic4,
    altMusic5,
    mainDayAmbient1,
    mainDayAmbient2,
    mainDayAmbientVolume,
    mainNightAmbient1,
    mainNightAmbient2,
    mainNightAmbientVolume,
    reverb,
  };

  return song;
};
