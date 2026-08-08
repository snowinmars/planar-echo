export const BCS_REQUIRED_IDS = [
  'action.ids',
  'class.ids',
  'ea.ids',
  'general.ids',
  'object.ids',
  'race.ids',
  'trigger.ids',
] as const;

export type PstStringPack = 'plain' | 'halfOfArea6';

/** NI 0x0001: first physical string = area6+name, second = one plain string. */
const PST_STRING_PACKS_A: readonly PstStringPack[] = [
  'halfOfArea6',
  'halfOfArea6',
  'plain',
];

/** NI 0x0011: both physical strings are area6+name pairs. */
const PST_STRING_PACKS_B: readonly PstStringPack[] = [
  'halfOfArea6',
  'halfOfArea6',
  'halfOfArea6',
  'halfOfArea6',
];

export const PST_STRING_PACKS_BY_ID = new Map<number, readonly PstStringPack[]>([
  [0x400F, PST_STRING_PACKS_A], // Global
  [0x4034, PST_STRING_PACKS_A], // GlobalGT
  [0x4035, PST_STRING_PACKS_A], // GlobalLT
  [0x407F, PST_STRING_PACKS_A], // BitCheck
  [0x4080, PST_STRING_PACKS_A], // GlobalBAND
  [0x4081, PST_STRING_PACKS_A], // BitCheckExact
  [0x4095, PST_STRING_PACKS_A], // Xor
  [0x409C, PST_STRING_PACKS_A], // StuffGlobalRandom
  [30, PST_STRING_PACKS_A], // SetGlobal
  [109, PST_STRING_PACKS_A], // IncrementGlobal
  [115, PST_STRING_PACKS_A], // SetGlobalTimer
  [227, PST_STRING_PACKS_A], // GlobalBAND
  [228, PST_STRING_PACKS_A], // GlobalBOR
  [229, PST_STRING_PACKS_A], // GlobalSHR
  [230, PST_STRING_PACKS_A], // GlobalSHL
  [231, PST_STRING_PACKS_A], // GlobalMAX
  [232, PST_STRING_PACKS_A], // GlobalMIN
  [244, PST_STRING_PACKS_A], // BitSet
  [245, PST_STRING_PACKS_A], // BitClear
  [260, PST_STRING_PACKS_A], // GlobalXOR
  [0x4082, PST_STRING_PACKS_B], // GlobalEqualsGlobal
  [0x4083, PST_STRING_PACKS_B], // GlobalLTGlobal
  [0x4084, PST_STRING_PACKS_B], // GlobalGTGlobal
  [0x4085, PST_STRING_PACKS_B], // GlobalANDGlobal
  [0x4086, PST_STRING_PACKS_B], // GlobalORGlobal
  [0x4087, PST_STRING_PACKS_B], // GlobalBANDGlobal
  [0x4088, PST_STRING_PACKS_B], // GlobalBANDGlobalExact
  [202, PST_STRING_PACKS_B], // IncrementGlobalOnce
  [233, PST_STRING_PACKS_B], // GlobalSetGlobal
  [234, PST_STRING_PACKS_B], // GlobalAddGlobal
  [235, PST_STRING_PACKS_B], // GlobalSubGlobal
  [236, PST_STRING_PACKS_B], // GlobalANDGlobal
  [237, PST_STRING_PACKS_B], // GlobalORGlobal
  [238, PST_STRING_PACKS_B], // GlobalBANDGlobal
  [239, PST_STRING_PACKS_B], // GlobalBORGlobal
  [240, PST_STRING_PACKS_B], // GlobalSHRGlobal
  [241, PST_STRING_PACKS_B], // GlobalSHLGlobal
  [242, PST_STRING_PACKS_B], // GlobalMAXGlobal
  [243, PST_STRING_PACKS_B], // GlobalMINGlobal
  [261, PST_STRING_PACKS_B], // GlobalXORGlobal
]);

export const PST_OBJECT_TARGET_IDS = [
  'ea',
  'faction',
  'team',
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

export type DecompiledBcs = Readonly<{
  resourceName: string;
  blocks: IfBlock[];
}>;

export type IfBlock = Readonly<{
  condition: BlockScope;
  actions: BlockScope[];
}>;

export type BlockScope = Readonly<{
  weight: number;
  temps: TempVariable[];
  functions: BlockFunction[];
}>;

export type TempVariable = Readonly<{
  name: string;
  value: DecompiledArg;
}>;

export type BlockFunction = Readonly<{
  name: string;
  negated: boolean;
  args: DecompiledArg[];
}>;

export type DecompiledArg
  = | Readonly<{ kind: 'int'; value: number; symbol?: string }>
    | Readonly<{ kind: 'string'; value: string }>
    | Readonly<{ kind: 'point'; x: number; y: number }>
    | Readonly<{ kind: 'ref'; name: string }>
    | Readonly<{ kind: 'function'; name: string; args: DecompiledArg[] }>;
