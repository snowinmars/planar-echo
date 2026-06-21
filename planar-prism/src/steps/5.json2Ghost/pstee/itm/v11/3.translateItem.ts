import createWriter from '@/shared/writer.js';
import { escapeSingleQuote } from '@/steps/5.json2Ghost/shared.js';

import type { GhostItemV10 } from '../../../types.js';

const createNpcLowercaseId = (resourceName: string): string => {
  const candidate = resourceName.split('.')[0]!.replace(`'`, ``);
  // @ts-expect-error : js is a meme, but efficient meme
  const isDigit = candidate[0] > -1;
  if (isDigit) return `_${candidate}`;
  return candidate;
};

export const translateItem = (itm: GhostItemV10): string => {
  const npcLowercaseId = createNpcLowercaseId(itm.resourceName);

  const writer = createWriter();
  writer.writeLine(`import type { UntranslatedItem, TranslatedItem } from '@planar/shared';`);
  writer.br();
  writer.writeLine('/**');
  writer.writeLine(` * Original source: ${itm.resourceName}`);
  writer.writeLine(' */');
  writer.writeLine(`const ${npcLowercaseId}Item = (${npcLowercaseId}ItemSkeleton: UntranslatedItem): TranslatedItem => {`);
  writer.writeLine(`return {`, 2);
  writer.writeLine(`...${npcLowercaseId}ItemSkeleton,`, 4);

  writer.writeLine(`unidentifiedNameTlk: '${escapeSingleQuote(itm.header.unidentifiedNameTlk)}',`, 4);
  writer.writeLine(`identifiedNameTlk: '${escapeSingleQuote(itm.header.identifiedNameTlk)}',`, 4);
  writer.writeLine(`unidentifiedDescriptionTlk: '${escapeSingleQuote(itm.header.unidentifiedDescriptionTlk.replaceAll('\n', '\\n'))}',`, 4);
  writer.writeLine(`identifiedDescriptionTlk: '${escapeSingleQuote(itm.header.identifiedDescriptionTlk.replaceAll('\n', '\\n'))}',`, 4);

  writer.writeLine(`};`, 2);
  writer.writeLine('};');
  writer.writeLine(`export default ${npcLowercaseId}Item;`);

  return writer.done();
};
