import type { CreatureV10, CreatureV12, CreatureV22, CreatureV90 } from '@/steps/4.biffs2json/cre/index.js';
import type { GameLanguage } from '@planar/shared';

export type GhostCreatureV10 = CreatureV10 & Readonly<{
  header: CreatureV10['header'] & Readonly<{
    longNameTlk: string;
    shortNameTlk: string;
  }>;
}>;

export type GhostCreatureV12 = CreatureV12 & Readonly<{
  header: CreatureV12['header'] & Readonly<{
    longNameTlk: string;
    shortNameTlk: string;
  }>;
}>;

export type GhostCreatureV22 = CreatureV22 & Readonly<{
  header: CreatureV22['header'] & Readonly<{
    longNameTlk: string;
    shortNameTlk: string;
  }>;
}>;

export type GhostCreatureV90 = CreatureV90 & Readonly<{
  header: CreatureV90['header'] & Readonly<{
    longNameTlk: string;
    shortNameTlk: string;
  }>;
}>;

export type GhostDlg = Readonly<{
  resourceName: string;
  skeleton: string;
  translations: Map<GameLanguage, string>;
  types: string;
}>;
