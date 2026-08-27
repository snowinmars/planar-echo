import createWriter from '@/shared/writer.js';
import { escapeSingleQuote, writeFlags } from '@/steps/5.json2Ghost/shared.js';
import { withoutExtension } from '@planar/shared';

import type { GhostEffV20 } from '@planar/shared';

export const buildEffSkeleton = (eff: GhostEffV20): string => {
  const writer = createWriter();
  const id = withoutExtension(eff.resourceName);

  writer.writeLine(`import type { GhostEffV20 } from '@planar/shared';`);
  writer.br();
  writer.writeLine('/**');
  writer.writeLine(` * Original source: ${eff.resourceName}`);
  writer.writeLine(' */');
  writer.writeLine(`const _${id}EffSkeleton = () => {`);
  writer.writeLine(`const eff: GhostEffV20 = {`, 2);

  writer.writeLine(`resourceName: '${escapeSingleQuote(eff.resourceName)}',`, 4);
  writer.writeLine(`signature: '${eff.signature}',`, 4);
  writer.writeLine(`version: '${eff.version}',`, 4);
  writer.writeLine(`externalEffectsSignature: '${escapeSingleQuote(eff.externalEffectsSignature)}',`, 4);
  writer.writeLine(`externalEffectsVersion: '${escapeSingleQuote(eff.externalEffectsVersion)}',`, 4);
  writer.writeLine(`type: '${escapeSingleQuote(eff.type)}',`, 4);
  writer.writeLine(`target: ${eff.target},`, 4);
  writer.writeLine(`power: ${eff.power},`, 4);
  writer.writeLine(`parameter1: ${eff.parameter1},`, 4);
  writer.writeLine(`parameter2: ${eff.parameter2},`, 4);
  writer.writeLine(`timingMode: '${escapeSingleQuote(eff.timingMode)}',`, 4);
  writer.writeLine(`duration: ${eff.duration},`, 4);
  writer.writeLine(`probability1: ${eff.probability1},`, 4);
  writer.writeLine(`probability2: ${eff.probability2},`, 4);
  writer.writeLine(`resRef: '${escapeSingleQuote(eff.resRef)}',`, 4);
  writer.writeLine(`diceThrown: ${eff.diceThrown},`, 4);
  writer.writeLine(`diceSides: ${eff.diceSides},`, 4);
  writeFlags(writer, eff.savingThrowType, 'savingThrowType', 4);
  writer.writeLine(`saveBonus: ${eff.saveBonus},`, 4);
  writer.writeLine(`special: ${eff.special},`, 4);
  writer.writeLine(`primaryTypeSchool: ${eff.primaryTypeSchool},`, 4);
  if (eff.minimumLevel) writer.writeLine(`minimumLevel: ${eff.minimumLevel},`, 4);
  if (eff.maximumLevel) writer.writeLine(`maximumLevel: ${eff.maximumLevel},`, 4);
  writeFlags(writer, eff.dispelOrResistance, 'dispelOrResistance', 4);
  writer.writeLine(`parameter3: ${eff.parameter3},`, 4);
  writer.writeLine(`parameter4: ${eff.parameter4},`, 4);
  if (eff.parameter5) writer.writeLine(`parameter5: ${eff.parameter5},`, 4);
  if (eff.timeApplied) writer.writeLine(`timeApplied: ${eff.timeApplied},`, 4);
  writer.writeLine(`resource2Ref: '${escapeSingleQuote(eff.resource2Ref)}',`, 4);
  writer.writeLine(`resource3Ref: '${escapeSingleQuote(eff.resource3Ref)}',`, 4);
  writer.writeLine(`casterXcoordinate: ${eff.casterXcoordinate},`, 4);
  writer.writeLine(`casterYcoordinate: ${eff.casterYcoordinate},`, 4);
  writer.writeLine(`targetXcoordinate: ${eff.targetXcoordinate},`, 4);
  writer.writeLine(`targetYcoordinate: ${eff.targetYcoordinate},`, 4);
  writer.writeLine(`parentResourceType: '${escapeSingleQuote(eff.parentResourceType)}',`, 4);
  writer.writeLine(`parentResourceRef: '${escapeSingleQuote(eff.parentResourceRef)}',`, 4);
  writeFlags(writer, eff.parentResourceFlags, 'parentResourceFlags', 4);
  writer.writeLine(`projectile: ${eff.projectile},`, 4);
  writer.writeLine(`parentResourceSlot: ${eff.parentResourceSlot},`, 4);
  writer.writeLine(`variableName: '${escapeSingleQuote(eff.variableName)}',`, 4);
  writer.writeLine(`casterLevel: ${eff.casterLevel},`, 4);
  writer.writeLine(`firstApply: ${eff.firstApply},`, 4);
  writer.writeLine(`secondaryType: ${eff.secondaryType},`, 4);

  writer.writeLine('};', 2);
  writer.writeLine('return eff;', 2);
  writer.writeLine('};');
  writer.writeLine(`export default _${id}EffSkeleton;`);

  return writer.done();
};
