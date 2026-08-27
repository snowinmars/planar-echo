export type AssetType = 'acm' | 'are' | 'bam' | 'bmp' | 'mos' | 'tis' | 'wav';

export const assetUrl = (serverUrl: string, type: AssetType, fileName: string): string => {
  const filePath = encodeURIComponent(`${type}/${fileName}`);
  return `${serverUrl}/api/assets/${filePath}`;
};
