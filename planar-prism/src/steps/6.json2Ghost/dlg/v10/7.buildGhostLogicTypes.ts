import createWriter from '@/shared/writer.js';
import type { NestedDlg } from './4.nestDialogue.types.js';

const buildGhostLogicTypes = (dlg: NestedDlg): string => {
  const npcLowercaseId = dlg.resourceName.split('.')[0]!;
  const npcUppercaseId = npcLowercaseId[0]!.toUpperCase() + npcLowercaseId.slice(1);

  const writer = createWriter();
  writer.writeLine('/**');
  writer.writeLine(` * Original source: ${dlg.resourceName}`);
  writer.writeLine(' */');
  writer.writeLine(`export type ${npcUppercaseId}Logic = Readonly<{`);
  writer.br();
  writer.writeLine('}>;');
  return writer.done();
};

export default buildGhostLogicTypes;
