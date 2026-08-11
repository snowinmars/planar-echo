export const TILE_DIMENSION = 64;
export const PALETTE_TILE_SIZE = 0x1400 as const;
export const PVRZ_TILE_SIZE = 0x000c as const;

export const calcAtlasColumns = (tileCount: number, wedWidth: number | undefined): { columns: number; source: 'wed' | 'fallback' } => {
  if (wedWidth !== undefined && wedWidth > 0) {
    return { columns: wedWidth, source: 'wed' };
  }
  const columns = tileCount < 9 ? tileCount : Math.floor(Math.sqrt(tileCount) * 1.18);
  return { columns: Math.max(1, columns), source: 'fallback' };
};

export const calcAtlasRows = (tileCount: number, columns: number): number => {
  let rows = Math.floor(tileCount / columns);
  if ((tileCount % columns) !== 0) rows = rows + 1;
  return Math.max(1, rows);
};

/**
 * NearInfinity TisV2Decoder:
 * pvrzNameBase = resourceName[0] + resourceName.substring(2, resRef.length)
 */
export const pvrzBaseFromTisName = (tisResourceName: string): string => {
  const lower = tisResourceName.toLowerCase();
  const dot = lower.lastIndexOf('.');
  const resRef = dot >= 0 ? lower.slice(0, dot) : lower;
  if (resRef.length < 2) return resRef;
  return lower.charAt(0) + lower.substring(2, resRef.length);
};

export const pvrzFileNameForPage = (tisResourceName: string, page: number): string => {
  if (page < 0) return '';
  const base = pvrzBaseFromTisName(tisResourceName);
  const pageStr = page.toString().padStart(2, '0');
  return `${base}${pageStr}.pvrz`;
};
