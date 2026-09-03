import type { RawPvrRgbaImage } from '@/steps/4b.raw2assets/algo/pvrz/index.js';

import type { PackedPvrz, PvrzSabTable } from './pool.types.js';

export const packPvrzSab = (index: Map<string, RawPvrRgbaImage>): PackedPvrz => {
  const table: Record<string, { offset: number; width: number; height: number }> = {};
  let total = 0;

  for (const [name, image] of index) {
    table[name] = {
      offset: total,
      width: image.width,
      height: image.height,
    };
    total = total + image.width * image.height * 4;
  }

  const sab = new SharedArrayBuffer(total);
  const dest = new Uint8Array(sab);

  for (const [name, image] of index) {
    const entry = table[name];
    if (!entry) throw new Error(`Missing pvrz table entry '${name}'`);
    dest.set(image.data, entry.offset);
  }

  return {
    sab,
    table,
  };
};

export const pvrzIndexFromSab = (sab: SharedArrayBuffer, table: PvrzSabTable): Map<string, RawPvrRgbaImage> => {
  const index = new Map<string, RawPvrRgbaImage>();

  for (const [name, entry] of Object.entries(table)) {
    const byteLength = entry.width * entry.height * 4;
    index.set(name, {
      width: entry.width,
      height: entry.height,
      data: new Uint8Array(sab, entry.offset, byteLength),
    });
  }

  return index;
};
