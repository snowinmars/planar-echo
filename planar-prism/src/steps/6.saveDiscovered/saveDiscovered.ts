import { allCategories } from '@/discoverer.types.js';
import createWriter from '@/shared/writer.js';
import { join } from 'path';
import { saveToFile } from '@/shared/customFs.js';
import { nothing } from '@planar/shared';

import type { Discovered, StoreDiscoveredType, VariableInfo } from '@/discoverer.types.js';
import type { Pathes } from '../1.createPathes/index.js';
import type { CharacterNarrativeProps, ClassId, Maybe } from '@planar/shared';
import type { AllPsteeJsons } from '../4.biffs2json/types.js';
import type { CreatureV10, CreatureV11 } from '../4.biffs2json/pstee/cre/types.js';
type Creature = CreatureV10 | CreatureV11;

const isNpc = (x: string): boolean => {
  switch (x) {
    case 'morte':
    case 'annah':
    case 'dakkon':
    case 'grace':
    case 'nordom':
    case 'ignus':
    case 'vhailor':
    case 'transcendent':
    case 'deionarra':
    case 'ravel':
    case 'pharod':
    case 'harlot':
    case 'lothar':
    case '2Devils':
    case 'adyzoel':
    case 'aelwyn':
    case 'angyar':
    case 'armoire':
    case 'asonje':
    case 'await':
    case 'acaste':
    case 'adahn':
    case 'baen':
    case 'baria':
    case 'byron':
    case 'carl':
    case 'coaxmetal':
    case 'anskull':
    case 'aoskar':
    case 'ojo':
    case 'doll':
    case 'craddock':
    case 'crier':
    case 'deathad':
    case 'deva':
    case 'eli':
    case 'eivene':
    case 'ghysis':
    case 'githzerai':
    case 'diligence':
    case 'dolora':
    case 'ecco':
    case 'elyce':
    case 'fell':
    case 'fhjull':
    case 'finam':
    case 'finger':
    case 'fleece':
    case 'gaoha':
    case 'giscorl':
    case 'goncalves':
    case 'good_incarnation':
    case 'paranoid_incarnation':
    case 'practical_incarnation':
    case 'hail_mad':
    case 'hargrimm':
    case 'iannis':
    case 'ingress':
    case 'jumble':
    case 'justifier':
    case 'kesai':
    case 'kimasxi':
    case 'marissa':
    case 'nenny':
    case 'sadjuli':
    case 'vivian':
    case 'yves':
    case 'grosuk':
    case 'kellera':
    case 'emoric':
    case 'malmaner':
    case 'mochai':
    case 'vris':
    case 'vaxis':
    case 'qui':
    case 'anazi':
    case 'alais':
    case 'marta':
    case 'o':
    case 'salabesh':
    case 'saros':
    case 'tiresias':
    case 'lady':
    case 'mao':
    case 'marrow':
    case 'mebbeth':
    case 'mertwyn':
    case 'mob':
    case 'ebb':
    case 'montague':
    case 'mortai':
    case 'mourns':
    case 'nemelle':
    case 'noname':
    case 'penn':
    case 'phineas':
    case 'pillar':
    case 'pestle':
    case 'quell':
    case 'candri':
    case 'oinosian':
    case 'quint':
    case 'porphiron':
    case 'reekwind':
    case 'pox':
    case 'ratbone':
    case 'dimtree':
    case 'sarhava':
    case 'sarossa':
    case 'sere':
    case 'sevtai':
    case 'sheryl':
    case 'bedai':
    case 'ghrist':
    case 'soego':
    case 'spirit':
    case 'sybil':
    case 'thorncombe':
    case 'trias':
    case 'trist':
    case 'udesire':
    case 'uhir':
    case 'ulthera':
    case 'veil':
    case 'weskull':
    case 'quisai':
    case 'xachariah':
    case 'xixi':
    case 'yoboy':
    case 'yvana':
    case 'death_of_names':
    case 'dhall':
    case 'able':
    case 'aethel':
    case 'agril':
    case 'berrog':
    case 'burt':
    case 'cube':
    case 'burgher':
    case 'chekka':
    case 'crumple':
    case 'jasilya':
    case 'kester':
    case 'sandoz':
    case 'skatch':
    case 'woff1':
    case 'zm782':
    case 'ashmantle':
    case 'shiland':
    case 'sharegrave':
    case 'roberta':
    case 'bei':
    case 'bish':
    case 'chad':
    case 'poet':
    case 'corvus':
    case 'crispy':
    case 'codexi':
    case 'coppereyes':
    case 'damsel':
    case 'dabus':
    case 'deran':
    case 'actor':
    case 'pestal':
    case 'puzskel':
    case 'xander':
    case 'evskull':
    case 'fguard':
    case 'karina':
    case 'glyve':
    case 'jhelai':
    case 'vlask':
    case 'stale_mary':
    case 'gris':
    case 'hamrys':
    case 'ilquix':
    case 'test':
    case 'kiina':
    case 'anamoli':
    case 'abishai':
    case 'hermit':
    case 'caretkr':
    case 'lenny':
    case 'lowden':
    case 'mantuok':
    case 'rubikon':
    case 'tek':
    case 'xanthia':
    case 'yiminn':
    case '1201_note':
    case 'mooch':
    case 'lingash':
    case 'norochj':
    case 'mar':
    case 'barr':
    case 'zm1664':
    case 'quentin':
    case 'creed':
    case 'rauk':
    case 'mmourn':
    case 'wilder':
    case 'sabast':
    case 'silent_king':
    case 'splinter':
    case 'sskull':
    case 'zm985': return true;
    default: return false;
  }
};
const noQuotes = (x: string): string => {
  return x.replaceAll('\'', '\\\'');
};
// TODO [snow]: this function may have a bug: the nameless one level calculates wrong, because docs do not have rules for that
export const calculateLevel = (character: Pick<CharacterNarrativeProps, 'levelFirstClass' | 'levelSecondClass' | 'levelThirdClass' | 'theClass'>): number => {
  if (character.theClass === 'cleric') return character.levelFirstClass;
  if (character.theClass === 'cleric_mage') return character.levelFirstClass + character.levelSecondClass;

  if (character.theClass === 'fighter') return character.levelFirstClass;
  if (character.theClass === 'fighter_mage') return character.levelFirstClass + character.levelSecondClass;
  if (character.theClass === 'fighter_thief') return character.levelFirstClass + character.levelSecondClass;

  if (character.theClass === 'mage') return character.levelFirstClass;

  if (character.theClass === 'no_class') return character.levelFirstClass;

  if (character.theClass === 'thief') return character.levelFirstClass;

  throw new Error(`Unknown class '${character.theClass}'`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
};

const detectVariableType = (variable: string, variableInfo: Maybe<VariableInfo>): Maybe<string> => {
  if (isNpc(variable)) return 'number';

  if (!variableInfo || !variableInfo?.spectre || variableInfo.spectre.size === 0) return nothing();
  const types = new Set([...variableInfo.spectre].map(v => typeof v));
  if (types.size > 1) {
    const x = [...types].join(', ');
    throw new Error(`Variable '${variable}' cannot exists in several types: ${x}`);
  }

  if (variableInfo.forceType === 'string') return 'string';
  if (variableInfo.forceType === 'number') return 'number';
  if (variableInfo.forceType === 'boolean') return 'boolean';

  const firstType = [...types][0];
  if (firstType === 'string') {
    return 'string';
  }

  if (firstType === 'number') {
    const values = [...variableInfo.spectre] as number[];
    const onlyZeroOne = values.every(v => v === 0 || v === 1);
    return onlyZeroOne ? 'boolean' : 'number';
  }

  throw new Error(`Variable '${variable}' has unknown type '${firstType}'`);
};

const serializeVariables = (variables: string[], variableInfos: Map<string, VariableInfo>) => {
  const numberWriter = createWriter();
  const numberInitialStoreWriter = createWriter();
  const booleanWriter = createWriter();
  const booleanInitialStoreWriter = createWriter();
  // const stringWriter = createWriter(); // no string are found

  numberWriter.writeLine('export type NumberVariableId');
  numberInitialStoreWriter.writeLine('import { NumberVariableId, BooleanVariableId } from "@planar/shared";');
  numberInitialStoreWriter.br();
  numberInitialStoreWriter.writeLine('export const initialNumberStore: Record<NumberVariableId, number> = {');
  booleanWriter.writeLine('export type BooleanVariableId');
  booleanInitialStoreWriter.writeLine('export const initialBooleanStore: Record<BooleanVariableId, number> = {');

  let foundNumberVariable = false;
  let foundBooleanVariable = false;
  for (const variable of variables) {
    const variableInfo = variableInfos.get(variable);
    if (!variableInfo || !variableInfo?.spectre || variableInfo.spectre.size === 0) {
      console.warn(`Why there is an empty spectre for variable '${variable}'?`);
    }

    const variableType = detectVariableType(variable, variableInfo);

    if (!foundNumberVariable && variableType === 'number') {
      foundNumberVariable = true;
      numberWriter.writeLine(`  = | '${variable}'`);
      numberInitialStoreWriter.writeLine(`  '${variable}': 0,`);
      continue;
    }
    if (!foundBooleanVariable && variableType === 'boolean') {
      foundBooleanVariable = true;
      booleanWriter.writeLine(`  = | '${variable}'`);
      booleanInitialStoreWriter.writeLine(`  '${variable}': 0,`);
      continue;
    }

    if (variableType === 'number') {
      numberWriter.writeLine(`    | '${variable}'`);
      numberInitialStoreWriter.writeLine(`  '${variable}': 0,`);
    }
    if (variableType === 'boolean') {
      booleanWriter.writeLine(`    | '${variable}'`);
      booleanInitialStoreWriter.writeLine(`  '${variable}': 0,`);
    }
  }

  numberWriter.writeLine(';');
  numberInitialStoreWriter.writeLine('};');
  booleanWriter.writeLine(';');
  booleanInitialStoreWriter.writeLine('};');

  return {
    types: `/* Autogenerated file */\n\n${numberWriter.done()}\n${booleanWriter.done()}export type VariableId = NumberVariableId | BooleanVariableId;\n`,
    stores: `/* Autogenerated file */\n\n${numberInitialStoreWriter.done()}\n${booleanInitialStoreWriter.done()}`,
  };
};

const serializeKeys = (keys: string[], variableInfos: Map<string, VariableInfo>) => {
  const writer = createWriter();
  const initialStoreWriter = createWriter();

  writer.writeLine('export type KeyId');
  initialStoreWriter.writeLine('import { KeyId } from "@planar/shared";');
  initialStoreWriter.br();
  initialStoreWriter.writeLine('export const initialKeysStore: Record<KeyId, number> = {');

  let foundKey = false;
  for (const key of keys) {
    const variableInfo = variableInfos.get(key);
    if (!variableInfo || !variableInfo?.spectre || variableInfo.spectre.size === 0) {
      console.warn(`Why there is an empty spectre for key '${key}'?`);
    }

    const variableType = detectVariableType(key, variableInfo);

    if (!foundKey && variableType === 'number') {
      foundKey = true;
      writer.writeLine(`  = | '${key}'`);
      initialStoreWriter.writeLine(`  ${key}: 0,`);
      continue;
    }

    if (variableType === 'number') {
      writer.writeLine(`    | '${key}'`);
      initialStoreWriter.writeLine(`  ${key}: 0,`);
    }
  }

  writer.writeLine(';');
  writer.br();
  initialStoreWriter.writeLine('};');

  return {
    types: `/* Autogenerated file */\n\n${writer.done()}`,
    stores: `/* Autogenerated file */\n\n${initialStoreWriter.done()}`,
  };
};

const serializeCharacters = (cres: Creature[]) => {
  const writer = createWriter();
  const initialStoreWriter = createWriter();

  writer.writeLine('import type { ClassId, StatId } from \'@planar/shared\';');
  writer.br();
  writer.writeLine('export type CharacterNarrativeProps = Record<StatId, number> & Readonly<{');
  writer.writeLine('theClass: ClassId;', 2);
  writer.writeLine('levelFirstClass: number;', 2);
  writer.writeLine('levelSecondClass: number;', 2);
  writer.writeLine('levelThirdClass: number;', 2);
  writer.writeLine('}>;');
  writer.br();
  writer.writeLine('export type CharacterStore = Readonly<{');

  for (const cre of cres) writer.writeLine(`  '${cre.resourceName.replaceAll('.cre', '').replaceAll('\'', '\\\'')}': CharacterNarrativeProps;`);

  writer.writeLine('}>;');
  writer.br();

  initialStoreWriter.writeLine('import type { CharacterStore } from \'@planar/shared\';');

  initialStoreWriter.writeLine('export const initialCharacterStore: CharacterStore = {');
  initialStoreWriter.br();

  for (const cre of cres) {
    initialStoreWriter.writeLine(`'${cre.resourceName.replaceAll('.cre', '').replaceAll('\'', '\\\'')}': {`, 2);
    initialStoreWriter.writeLine(`armorclass: ${cre.header.effectiveAc},`, 4);
    initialStoreWriter.writeLine(`chr: ${cre.header.charisma},`, 4);
    initialStoreWriter.writeLine(`con: ${cre.header.constitution},`, 4);
    initialStoreWriter.writeLine(`damagebonus: ${cre.header.strengthPercentageBonus},`, 4);
    initialStoreWriter.writeLine(`dex: ${cre.header.dexterity},`, 4);
    initialStoreWriter.writeLine(`int: ${cre.header.intelligence},`, 4);
    initialStoreWriter.writeLine(`level: ${calculateLevel({
      levelFirstClass: cre.header.levelFirstClass,
      levelSecondClass: cre.header.levelSecondClass,
      levelThirdClass: cre.header.levelThirdClass,
      theClass: cre.header.theClass as ClassId,
    })},`, 4);
    initialStoreWriter.writeLine(`levelFirstClass: ${cre.header.levelFirstClass},`, 4);
    initialStoreWriter.writeLine(`levelSecondClass: ${cre.header.levelSecondClass},`, 4);
    initialStoreWriter.writeLine(`levelThirdClass: ${cre.header.levelThirdClass},`, 4);
    initialStoreWriter.writeLine(`lockpicking: ${cre.header.lockpicking},`, 4);
    initialStoreWriter.writeLine(`luck: ${cre.header.luck},`, 4);
    initialStoreWriter.writeLine(`maxhitpoints: ${cre.header.maximumHp},`, 4);
    initialStoreWriter.writeLine(`pickpocket: ${cre.header.pickPockets},`, 4);
    initialStoreWriter.writeLine(`resistfire: ${cre.header.fireResistance},`, 4);
    initialStoreWriter.writeLine(`resistmagicfire: ${cre.header.magicFireResistance},`, 4);
    initialStoreWriter.writeLine(`stealth: ${cre.header.moveSilently},`, 4);
    initialStoreWriter.writeLine(`str: ${cre.header.strength},`, 4);
    initialStoreWriter.writeLine(`theClass: '${cre.header.theClass}',`, 4);
    initialStoreWriter.writeLine(`traps: ${cre.header.findOrDisarmTraps},`, 4);
    initialStoreWriter.writeLine(`wis: ${cre.header.wisdom},`, 4);
    initialStoreWriter.writeLine(`},`, 2);
  }

  initialStoreWriter.writeLine('};');

  return {
    types: `/* Autogenerated file */\n\n${writer.done()}`,
    stores: `/* Autogenerated file */\n\n${initialStoreWriter.done()}`,
  };
};

const serializeType = (name: string, items: string[]) => {
  const uppercaseName = name[0]!.toUpperCase() + name.slice(1);
  const writer = createWriter();

  writer.writeLine('/* Autogenerated file */');
  writer.br();
  writer.writeLine(`export type ${uppercaseName}Id`);
  writer.writeLine(`  = | '${noQuotes(items[0]!)}'`);
  for (const item of items.slice(1)) writer.writeLine(`    | '${noQuotes(item)}'`);
  writer.writeLine(';');
  return writer.done();
};

type SerializeResult = {
  types: string;
  stores?: string;
};

const serialize = (category: StoreDiscoveredType, items: string[], discovered: Discovered): SerializeResult => {
  switch (category) {
    case 'variable':
      return serializeVariables(items.sort(), discovered.variableInfos);
    case 'key' :
      return serializeKeys(items.sort(), discovered.variableInfos);
    default:
      return { types: serializeType(category, items.sort()) };
  }
};

const saveDiscovered = async (discovered: Discovered, pathes: Pathes, allJsons: AllPsteeJsons): Promise<void> => {
  for (const category of allCategories) {
    const items = discovered.variables.get(category)!;
    const result = serialize(category, items, discovered);
    const targetFile = join(pathes.ghostDir.sharedEnums, `${category}.ts`);
    await saveToFile(targetFile, result.types, true);

    if (result.stores) {
      const storesFile = join(pathes.ghostDir.stores, `${category}.ts`);
      await saveToFile(storesFile, result.stores, true);
    }
  }

  // TODO [snow]: Что-то тут не то...
  const result = serializeCharacters(allJsons.cres);
  const storeTargetFile = join(pathes.ghostDir.stores, 'character.ts');
  const typesTargetFile = join(pathes.ghostDir.sharedEnums, `character.ts`);
  await saveToFile(typesTargetFile, result.types, true);
  await saveToFile(storeTargetFile, result.stores, true);
};

export default saveDiscovered;
