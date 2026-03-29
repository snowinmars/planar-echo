export type GameName
  = | 'bg1'
    | 'bg1ee'
    | 'bg2'
    | 'bg2ee'
    | 'iwd'
    | 'iwdee'
    | 'iwd2'
    | 'iwd2ee'
    | 'pst'
    | 'pstee';
;

export const gameNames: Record<GameName, string> = {
  bg1: 'landing.step1.gameNames.bg1',
  bg1ee: 'landing.step1.gameNames.bg1ee',
  bg2: 'landing.step1.gameNames.bg2',
  bg2ee: 'landing.step1.gameNames.bg2ee',
  iwd: 'landing.step1.gameNames.iwd',
  iwdee: 'landing.step1.gameNames.iwdee',
  iwd2: 'landing.step1.gameNames.iwd2',
  iwd2ee: 'landing.step1.gameNames.iwd2ee',
  pst: 'landing.step1.gameNames.pst',
  pstee: 'landing.step1.gameNames.pstee',
} as const; ;
