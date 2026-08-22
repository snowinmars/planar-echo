export type AssetType = 'acm' | 'are' | 'bam' | 'bmp' | 'mos' | 'tis' | 'wav';

export const assetUrl = (serverUrl: string, type: AssetType, fileName: string): string =>
  `${serverUrl}/api/assets/${encodeURIComponent(`${type}/${fileName}`)}`;
