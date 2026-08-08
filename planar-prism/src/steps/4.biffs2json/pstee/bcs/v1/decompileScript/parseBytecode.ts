import { createBcsStream } from '../bcsStream.js';
import {
  isNothing,
  just,
  maybe,
  nothing,
} from '@planar/shared';

import type { BcsStream } from '../bcsStream.types.js';
import type {
  BcsPoint,
  BcsRegion,
  ParsedBcsAction,
  ParsedBcsCr,
  ParsedBcsObject,
  ParsedBcsResponse,
  ParsedBcsScript,
  ParsedBcsTrigger,
} from '../bytecodeTypes.js';
import type { Maybe } from '@planar/shared';

export type ParamKind = 'i' | 's' | 'p' | 'o' | '\0';

export const determineParamType = (sbs: BcsStream): ParamKind => {
  const ch = sbs.peek();
  switch (ch) {
    case '-':
    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9': return 'i';
    case '"': return 's';
    case '[':return 'p';
    case 'o':return 'o';
    default: throw new Error(`Parameter '${ch}' at '${sbs.positionOf()}' is out of type range`);
  }
};

type ParseNumberArrayProps = Readonly<{
  sbs: BcsStream;
  tagOpen: string;
  tagClose: string;
  separator: string;
  amount: number;
}>;
export const parseNumberArray = ({
  sbs,
  tagOpen,
  tagClose,
  separator,
  amount,
}: ParseNumberArrayProps): number[] => {
  const result: number[] = [];

  const wrongOpening = sbs.getByte() !== tagOpen;
  if (wrongOpening) throw new Error(`Expected '${tagOpen}' at position ${sbs.positionOf()}`);

  for (let i = 0; i < amount; i++) {
    const notFoundExpectedSeparator = i > 0 && sbs.getByte() !== separator;
    if (notFoundExpectedSeparator) throw new Error(`Expected '${separator}' at position ${sbs.positionOf()}`);

    const number = parseNumber(sbs);
    result.push(number);
  }

  const wrongClosing = sbs.getByte() !== tagClose;
  if (wrongClosing) throw new Error(`Expected '${tagClose}' at position ${sbs.positionOf()}`);

  return result;
};

export const parseNumber = (sbs: BcsStream): number => {
  const s = sbs.getMatch('-?[0-9]+');
  if (isNothing(s)) throw new Error(`Expected number at position ${sbs.positionOf()}`);

  const number = Number.parseInt(s, 10);
  if (isNaN(number)) throw new Error(`Expected valid number at position ${sbs.positionOf()}`);

  return number;
};

export const parseString = (sbs: BcsStream): string => {
  const s = sbs.getMatch('"[^"]*"');
  if (isNothing(s)) throw new Error(`Expected string at position ${sbs.positionOf()}`);

  const withoutQuotes = s.slice(1, -1);
  return withoutQuotes;
};

export const parsePoint = (sbs: BcsStream): BcsPoint => {
  const values = parseNumberArray({
    sbs,
    tagOpen: '[',
    tagClose: ']',
    separator: ',',
    amount: 2,
  });
  const x = just(values[0]);
  const y = just(values[1]);

  return { x, y };
};

export const parseRectangle = (sbs: BcsStream): BcsRegion => {
  const values = parseNumberArray({
    sbs,
    tagOpen: '[',
    tagClose: ']',
    separator: '.',
    amount: 4,
  });

  const x = just(values[0]);
  const y = just(values[1]);
  const width = just(values[2]);
  const height = just(values[3]);

  return { x, y, width, height };
};

const OB_TOKEN = 'ob';
const AC_TOKEN = 'ac';
const TR_TOKEN = 'tr';
const RE_TOKEN = 're';
const RS_TOKEN = 'rs';
const CO_TOKEN = 'co';
const CR_TOKEN = 'cr';
const SC_TOKEN = 'sc';
/*
 * OB
 * integer: enemy-ally field (EA.IDS)
 * integer: faction (FACTION.IDS)
 * integer: team (TEAM.IDS)
 * integer: general (GENERAL.IDS)
 * integer: race (RACE.IDS)
 * integer: class (CLASS.IDS)
 * integer: specific (SPECIFIC.IDS)
 * integer: gender (GENDER.IDS)
 * integer: alignment (ALIGNMEN.IDS)
 * integer: identifier1 (OBJECT.IDS)
 * integer: identifier2 (OBJECT.IDS)
 * integer: identifier3 (OBJECT.IDS)
 * integer: identifier4 (OBJECT.IDS)
 * integer: identifier5 (OBJECT.IDS)
 * object coordinates  <- tail
 * string: name        <- tail
 * OB
 */
const parseOb = (sbs: BcsStream): ParsedBcsObject => {
  if (!sbs.skipToken(OB_TOKEN)) throw new Error(`Expected '${OB_TOKEN}' at position ${sbs.positionOf()}`);

  const paramTypes: ParamKind[] = [];
  const nums: number[] = [];
  let name: Maybe<string> = nothing();
  let region: Maybe<BcsRegion> = nothing();

  while (!sbs.eos() && !sbs.skipToken(OB_TOKEN)) {
    const ch = determineParamType(sbs);
    switch (ch) {
      case 'i': {
        nums.push(parseNumber(sbs));
        break;
      }
      case 'p': {
        region = parseRectangle(sbs);
        break;
      }
      case 's': {
        name = parseString(sbs);
        break;
      }
      default:
        throw new Error(`Invalid BCS object code '${ch}' at position ${sbs.positionOf()}`);
    }
    paramTypes.push(ch);
  }

  if (isNothing(name) && isNothing(region)) throw new Error('Too few object parameters: at least region or name should be found');

  const objectIdsMaxIdentifiers = 5; // hardcoded in InfinityEngine
  const notEnoughNumberIdentifiers = nums.length < objectIdsMaxIdentifiers;
  if (notEnoughNumberIdentifiers) throw new Error(`Too few numeric parameters: at least ${objectIdsMaxIdentifiers} numbers should be found`);

  const identifier = nums.slice(-objectIdsMaxIdentifiers);
  const target = nums.slice(0, -objectIdsMaxIdentifiers);

  return {
    target,
    identifier,
    region,
    name,
  };
};

/*
 * AC
 * action ID from ACTION.IDS
 * 3 object parameters
 * 1 integer parameters
 * 1 point parameter
 * 2 integer parameters
 * 2 string parameters
 * AC
 */
const parseAc = (sbs: BcsStream): ParsedBcsAction => {
  const maxInts = 6;
  const maxStrings = 2;
  const maxObjects = 3;
  const ints: number[] = [];
  const strings: string[] = [];
  const objects: ParsedBcsObject[] = [];

  while (!sbs.eos() && !sbs.skipToken(AC_TOKEN)) {
    const ch = determineParamType(sbs);
    switch (ch) {
      case 'i': {
        if (ints.length >= maxInts) {
          throw new Error(`Did not expect to find integer at position '${sbs.positionOf()}' after '${ints.length}' integers`);
        }
        ints.push(parseNumber(sbs));
        break;
      }
      case 's': {
        if (strings.length >= maxStrings) {
          throw new Error(`Did not expect to find string at position '${sbs.positionOf()}' after '${strings.length}' strings`);
        }
        strings.push(parseString(sbs));
        break;
      }
      case 'o': {
        if (objects.length >= maxObjects) {
          throw new Error(`Did not expect to find object at position '${sbs.positionOf()}' after '${objects.length}' objects`);
        }
        objects.push(parseOb(sbs));
        break;
      }
      default:
        throw new Error(`Invalid BCS action code at position '${sbs.positionOf()}'`);
    }
  }

  const id = just(ints[0]);
  const a1 = maybe(objects[0]);
  const a2 = maybe(objects[1]);
  const a3 = maybe(objects[2]);
  const a4 = maybe(ints[1]);
  const pointX = maybe(ints[2]);
  const pointY = maybe(ints[3]);
  const a6 = maybe(ints[4]);
  const a7 = maybe(ints[5]);
  const a8 = maybe(strings[0]);
  const a9 = maybe(strings[1]);

  const hasPoint = !isNothing(pointX) && !isNothing(pointY);
  const a5point = hasPoint ? { x: pointX, y: pointY } : nothing();

  return {
    id,
    a1,
    a2,
    a3,
    a4,
    a5point,
    a6,
    a7,
    a8,
    a9,
  };
};

/*
 * TR
 * trigger ID from TRIGGER.IDS
 * 1 integer parameter
 * 1 negate flags dword
 * 1 integer parameter
 * 1 integer
 * 2 string parameters
 * 1 object parameter
 * TR
 */
const parseTr = (sbs: BcsStream): ParsedBcsTrigger => {
  const maxInts = 5;
  const maxStrings = 2;
  const maxObjects = 1;
  const ints: number[] = [];
  const strings: string[] = [];
  const objects: ParsedBcsObject[] = [];

  while (!sbs.eos() && !sbs.skipToken(TR_TOKEN)) {
    const ch = determineParamType(sbs);
    switch (ch) {
      case 'i': {
        if (ints.length >= maxInts) {
          throw new Error(`Did not expect to find integer after '${ints.length}' integers`);
        }
        ints.push(parseNumber(sbs));
        break;
      }
      case 's': {
        if (strings.length >= maxStrings) {
          throw new Error(`Did not expect to find string after '${strings.length}' strings`);
        }
        strings.push(parseString(sbs));
        break;
      }
      case 'o': {
        if (objects.length >= maxObjects) {
          throw new Error(`Did not expect to find object after '${objects.length}' objects`);
        }
        objects.push(parseOb(sbs));
        break;
      }
      default:
        throw new Error(`Invalid BCS trigger code at position '${sbs.positionOf()}`);
    }
  }

  // Map collected values to the output structure
  const id = just(ints[0]);
  const t1 = maybe(ints[1]);
  const t2negated = maybe(ints[2]); // isNothing(ints[2]) ? false : (ints[2] & 1) === 1;
  const t3 = maybe(ints[3]);
  const t4 = maybe(ints[4]);
  const t5 = maybe(strings[0]);
  const t6 = maybe(strings[1]);
  const t7 = maybe(objects[0]);

  return { id, t1, t2negated, t3, t4, t5, t6, t7 };
};

const parseRe = (sbs: BcsStream): ParsedBcsResponse => {
  const weightMatch = sbs.getMatch('-?[0-9]+');
  if (isNothing(weightMatch)) throw new Error(`Expected response weight at position ${sbs.positionOf()}`);

  const weight = Number.parseInt(weightMatch, 10);
  const actions: ParsedBcsAction[] = [];

  while (!sbs.eos() && !sbs.skipToken(RE_TOKEN)) {
    if (sbs.skipToken(AC_TOKEN)) actions.push(parseAc(sbs));
    else sbs.skipByte();
  }

  return { weight, actions };
};

/*
 * RS
 * ..
 */
const parseRs = (sbs: BcsStream): ParsedBcsResponse[] => {
  const responses: ParsedBcsResponse[] = [];
  while (!sbs.eos() && !sbs.skipToken(RS_TOKEN)) {
    if (sbs.skipToken(RE_TOKEN))responses.push(parseRe(sbs));
    else sbs.skipByte();
  }
  return responses;
};

/*
 * CO
 * ..
 * CO
 */
const parseCo = (sbs: BcsStream): ParsedBcsTrigger[] => {
  const triggers: ParsedBcsTrigger[] = [];

  while (!sbs.eos() && !sbs.skipToken(CO_TOKEN)) {
    if (sbs.skipToken(TR_TOKEN)) triggers.push(parseTr(sbs));
    else sbs.skipByte();
  }

  return triggers;
};

/*
 * CR
 * ..
 * CR
 */
const parseCr = (stream: BcsStream): ParsedBcsCr => {
  const triggers: ParsedBcsTrigger[] = [];
  const responses: ParsedBcsResponse[] = [];

  while (!stream.eos() && !stream.skipToken(CR_TOKEN)) {
    if (stream.skipToken(CO_TOKEN)) triggers.push(...parseCo(stream));
    else if (stream.skipToken(RS_TOKEN)) responses.push(...parseRs(stream));
    else stream.skipByte();
  }

  return { triggers, responses };
};

/*
 * SC
 * ..
 * SC
 */
const parseSc = (stream: BcsStream) => {
  const blocks: ParsedBcsCr[] = [];

  const startsWithSc = stream.skipToken(SC_TOKEN);
  if (!startsWithSc) throw new Error(`BCS script must start with '${SC_TOKEN}'`);

  while (!stream.eos() && !stream.skipToken(SC_TOKEN)) {
    if (stream.skipToken(CR_TOKEN)) blocks.push(parseCr(stream));
    else stream.skipByte();
  }

  return blocks;
};

/** Parse BCS bytecode string into structural (SC/CR/CO/TR/RS/RE/AC/OB). */
export const parseBytecode = (code: string): ParsedBcsScript => {
  const stream = createBcsStream(code);

  const blocks = parseSc(stream);

  return { blocks };
};
