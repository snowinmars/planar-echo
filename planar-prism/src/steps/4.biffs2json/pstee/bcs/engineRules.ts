export type PstStringPack = 'plain' | 'halfOfArea6';

export const BCS_REQUIRED_IDS = [
  'action.ids',
  'align.ids',
  'class.ids',
  'ea.ids',
  'gender.ids',
  'general.ids',
  'object.ids',
  'race.ids',
  'specific.ids',
  'trigger.ids',
] as const;

const PST_STRING_PACKS_A: readonly PstStringPack[] = [
  'halfOfArea6',
  'halfOfArea6',
  'plain',
];

const PST_STRING_PACKS_B: readonly PstStringPack[] = [
  'halfOfArea6',
  'halfOfArea6',
  'halfOfArea6',
  'halfOfArea6',
];

export const PST_STRING_PACKS_BY_ID = new Map<number, readonly PstStringPack[]>([
  [0x400F, PST_STRING_PACKS_A],
  [0x4034, PST_STRING_PACKS_A],
  [0x4035, PST_STRING_PACKS_A],
  [0x407F, PST_STRING_PACKS_A],
  [0x4080, PST_STRING_PACKS_A],
  [0x4081, PST_STRING_PACKS_A],
  [0x4095, PST_STRING_PACKS_A],
  [0x409C, PST_STRING_PACKS_A],
  [30, PST_STRING_PACKS_A],
  [109, PST_STRING_PACKS_A],
  [115, PST_STRING_PACKS_A],
  [227, PST_STRING_PACKS_A],
  [228, PST_STRING_PACKS_A],
  [229, PST_STRING_PACKS_A],
  [230, PST_STRING_PACKS_A],
  [231, PST_STRING_PACKS_A],
  [232, PST_STRING_PACKS_A],
  [244, PST_STRING_PACKS_A],
  [245, PST_STRING_PACKS_A],
  [260, PST_STRING_PACKS_A],
  [0x4082, PST_STRING_PACKS_B],
  [0x4083, PST_STRING_PACKS_B],
  [0x4084, PST_STRING_PACKS_B],
  [0x4085, PST_STRING_PACKS_B],
  [0x4086, PST_STRING_PACKS_B],
  [0x4087, PST_STRING_PACKS_B],
  [0x4088, PST_STRING_PACKS_B],
  [202, PST_STRING_PACKS_B],
  [233, PST_STRING_PACKS_B],
  [234, PST_STRING_PACKS_B],
  [235, PST_STRING_PACKS_B],
  [236, PST_STRING_PACKS_B],
  [237, PST_STRING_PACKS_B],
  [238, PST_STRING_PACKS_B],
  [239, PST_STRING_PACKS_B],
  [240, PST_STRING_PACKS_B],
  [241, PST_STRING_PACKS_B],
  [242, PST_STRING_PACKS_B],
  [243, PST_STRING_PACKS_B],
  [261, PST_STRING_PACKS_B],
]);

/** PSTEE uses Engine.EE object layout (BG-style), not classic PST with faction/team. */
export const PSTEE_OBJECT_TARGET_IDS = [
  'ea',
  'general',
  'race',
  'class',
  'specific',
  'gender',
  'align',
] as const;

export const BITWISE_IDS = new Set([
  'areatype', 'areaflag', 'bits', 'classmsk', 'crearefl', 'damages', 'doorflag', 'dmgtype',
  'extstate', 'invitem', 'itemflag', 'jourtype', 'magespec', 'splcast', 'state', 'wmpflag',
]);
