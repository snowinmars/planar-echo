export type RawAreRestInterruptionsV10 = Readonly<{
  name: string;
  explanationRefs: number[];
  creatures: string[];
  creaturesCount: number;
  difficulty: number;
  removalTime: number;
  wanderDistance: number;
  followDistance: number;
  maxCreatures: number;
  enabled: boolean;
  probabilityDay: number;
  probabilityNight: number;
}>;
