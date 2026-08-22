export type RawAreProjectileTrapV10 = Readonly<{
  projectile: string;
  effectBlockOffset: number;
  effectBlockSize: number;
  missileId: number;
  ticksUntilCheck: number;
  triggersRemaining: number;
  x: number;
  y: number;
  z: number;
  enemyAlly: number;
  indexOfPartyMemberWhoCreatedIt: number;
}>;
