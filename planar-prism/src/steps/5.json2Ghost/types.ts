import type { CreatureV10, CreatureV11 } from '@/steps/4.biffs2json/pstee/cre/index.js';
import type { ItmV10 } from '@/steps/4.biffs2json/pstee/itm/index.js';
import type { GameLanguage } from '@planar/shared';

type TlkSoundExtension = Readonly<{
  initialMeetingSoundTlk: string;
  moraleSoundTlk: string;
  happySoundTlk: string;
  unhappyAnnoyedSoundTlk: string;
  unhappySeriousSoundTlk: string;
  unhappyBreakingPointSoundTlk: string;
  leaderSoundTlk: string;
  tiredSoundTlk: string;
  boredSoundTlk: string;
  battleCry1SoundTlk: string;
  battleCry2SoundTlk: string;
  battleCry3SoundTlk: string;
  battleCry4SoundTlk: string;
  battleCry5SoundTlk: string;
  attack1SoundTlk: string;
  attack2SoundTlk: string;
  attack3SoundTlk: string;
  attack4SoundTlk: string;
  damageSoundTlk: string;
  dyingSoundTlk: string;
  hurtSoundTlk: string;
  areaForestSoundTlk: string;
  areaCitySoundTlk: string;
  areaDungeonSoundTlk: string;
  areaDaySoundTlk: string;
  areaNightSoundTlk: string;
  selectCommon1SoundTlk: string;
  selectCommon2SoundTlk: string;
  selectCommon3SoundTlk: string;
  selectCommon4SoundTlk: string;
  selectCommon5SoundTlk: string;
  selectCommon6SoundTlk: string;
  selectAction1SoundTlk: string;
  selectAction2SoundTlk: string;
  selectAction3SoundTlk: string;
  selectAction4SoundTlk: string;
  selectAction5SoundTlk: string;
  selectAction6SoundTlk: string;
  selectAction7SoundTlk: string;
  interaction1SoundTlk: string;
  interaction2SoundTlk: string;
  interaction3SoundTlk: string;
  interaction4SoundTlk: string;
  interaction5SoundTlk: string;
  insult1SoundTlk: string;
  insult2SoundTlk: string;
  insult3SoundTlk: string;
  compliment1SoundTlk: string;
  compliment2SoundTlk: string;
  compliment3SoundTlk: string;
  special1SoundTlk: string;
  special2SoundTlk: string;
  special3SoundTlk: string;
  reactToDieGeneralSoundTlk: string;
  reactToDieSpecificSoundTlk: string;
  responseToCompliment1SoundTlk: string;
  responseToCompliment2SoundTlk: string;
  responseToCompliment3SoundTlk: string;
  responseToInsult1SoundTlk: string;
  responseToInsult2SoundTlk: string;
  responseToInsult3SoundTlk: string;
  dialogHostileSoundTlk: string;
  dialogDefaultSoundTlk: string;
  selectRare1SoundTlk: string;
  selectRare2SoundTlk: string;
  criticalHitSoundTlk: string;
  criticalMissSoundTlk: string;
  targetImmuneSoundTlk: string;
  inventoryFullSoundTlk: string;
  pickedPicketSoundTlk: string;
  hiddenInShadowsSoundTlk: string;
  spellDisruptedSoundTlk: string;
  setTrapSoundTlk: string;
  existance4SoundTlk: string;
  bioSoundTlk: string;
  sound1Tlk: string;
  sound2Tlk: string;
  sound3Tlk: string;
  sound4Tlk: string;
  sound5Tlk: string;
  sound6Tlk: string;
  sound7Tlk: string;
  sound8Tlk: string;
  sound9Tlk: string;
  sound10Tlk: string;
  sound11Tlk: string;
  sound12Tlk: string;
  sound13Tlk: string;
  sound14Tlk: string;
  sound15Tlk: string;
  sound16Tlk: string;
  sound17Tlk: string;
  sound18Tlk: string;
  sound19Tlk: string;
  sound20Tlk: string;
  sound21Tlk: string;
  sound22Tlk: string;
  sound23Tlk: string;
  sound24Tlk: string;
  sound25Tlk: string;
}>;

type TlkNameExtension = Readonly<{
  nameTlk: string;
  tooltipTlk: string;
}>;

export type GhostCreatureV10 = CreatureV10 & Readonly<{
  header: CreatureV10['header'] & TlkNameExtension;
}> & Readonly<{
  header: CreatureV10['header'] & TlkSoundExtension;
}>;
export type GhostCreatureV11 = CreatureV11 & Readonly<{
  header: CreatureV11['header'] & TlkNameExtension;
}> & Readonly<{
  header: CreatureV11['header'] & TlkSoundExtension;
}>;
export type GhostItemV10 = ItmV10 & Readonly<{
  header: ItmV10['header'] & Readonly<{
    unidentifiedNameTlk: string;
    identifiedNameTlk: string;
    unidentifiedDescriptionTlk: string;
    identifiedDescriptionTlk: string;
  }>;
}>;

export type GhostDlg = Readonly<{
  resourceName: string;
  skeleton: string;
  translations: Map<GameLanguage, string>;
}>;

export type GhostCreature = Readonly<{
  resourceName: string;
  skeleton: string;
  translations: Map<GameLanguage, string>;
  ghostCreature: GhostCreatureV10 | GhostCreatureV11;
}>;

export type GhostItem = Readonly<{
  resourceName: string;
  skeleton: string;
  translations: Map<GameLanguage, string>;
  ghostItem: GhostItemV10;
}>;
