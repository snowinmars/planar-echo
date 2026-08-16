import { join, basename } from 'path';
import { readFile } from 'fs/promises';
import iterate from '@/steps/iterate.js';
import { entryExists } from '@/shared/customFs.js';
import { reportProgress } from '@/shared/report.js';
import { just, nothing } from '@planar/shared';
import createReader from '@/shared/bufferReader.js';
import { walkFiles } from '../shared/walkFiles.js';

import type { Paths } from '@/steps/1.createPaths/index.js';
import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawMus, RawMusSegment } from './parseMuss.types.js';

const silenceAcm = 'spc1';
const parseMusText = (reader: BufferReader, resourceName: string): RawMus => {
  let subfolder = '';
  let count = 0;
  const segments: RawMusSegment[] = [];

  for (const line of reader.readLineByLine()) {
    if (line.startsWith('#')) continue;

    if (!subfolder) {
      subfolder = line;
      continue;
    }

    if (!count) {
      count = Number.parseInt(line, 10);
      continue;
    }

    const tokens = line.split(' ').filter(x => x);
    const emptyLine = !tokens.length;
    if (emptyLine) continue;

    const entry = just(tokens[0]);
    const isSilence = entry === silenceAcm;

    const [head, tail] = line
      .slice(entry.length)
      .split('@')
      .map(x => x.trim());

    let next: RawMusSegment['next'] = nothing();
    let tag: RawMusSegment['tag'] = nothing();

    if (tail) {
      const tailParts = tail.split(/\s+/);
      if (tailParts.length >= 2) tag = { entry: just(tailParts[1]) }; // tailParts[0] is 'tag'
      else throw new Error(`Unexpected line '${line}' for resource '${resourceName}'`);
    }

    if (head) {
      const headParts = head.split(/\s+/).filter(Boolean);
      if (headParts.length === 1) next = { subfolder: nothing(), entry: just(headParts[0]) };
      else if (headParts.length >= 2) next = { subfolder: just(headParts[0]), entry: just(headParts[1]) };
    }

    segments.push({
      entry,
      isSilence,
      next,
      tag,
    });
  }

  return {
    resourceName,
    subfolder,
    count,
    segments,
  };
};

type MusFile = Readonly<{
  resourceName: string;
  absPath: string;
}>;
const collectMusFiles = async (musicDir: string): Promise<MusFile[]> => {
  const files = await walkFiles(musicDir);
  return files
    .filter(path => path.toLowerCase().endsWith('.mus'))
    .map((absPath) => {
      return {
        resourceName: basename(absPath),
        absPath,
      };
    });
};

export const parseMuss = async (
  paths: Paths,
): Promise<AsyncIterableIterator<RawMus>> => {
  const musicDir = join(paths.gameDir, 'music');
  const exists = await entryExists(musicDir);
  if (!exists) throw new Error(`Music directory '${musicDir}' is not found.`);
  const files = exists ? await collectMusFiles(musicDir) : [];

  return iterate<MusFile, RawMus>(
    files,
    async (file, i) => {
      const buffer = await readFile(file.absPath);
      const reader = createReader(buffer);

      const mus = parseMusText(reader, file.resourceName);

      const percent = Math.round((i + 1) * 100 / files.length);
      reportProgress({
        value: percent,
        step: 'mus_raw2json',
        params: { resourceName: file.resourceName },
      });

      return mus;
    },
  );
};
