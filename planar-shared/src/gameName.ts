export type GameName
  = | 'bg1ee'
    | 'bg2ee'
    | 'iwdee'
    | 'iwd2'
    | 'pstee';
;

export const gameNames: Record<GameName, string> = {
  bg1ee: 'landing.step1.gameNames.bg1ee',
  bg2ee: 'landing.step1.gameNames.bg2ee',
  iwdee: 'landing.step1.gameNames.iwdee',
  iwd2: 'landing.step1.gameNames.iwd2',
  pstee: 'landing.step1.gameNames.pstee',
} as const; ;
