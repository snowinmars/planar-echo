export type WeiduExeDirValidateResult
  = | 'ok'
    | 'cannot'
;
export type GameDirValidateResult
  = | 'ok'
    | 'cannot'
;
export type ValidationResult = Readonly<{
  weiduExeDir: WeiduExeDirValidateResult;
  gameDir: GameDirValidateResult;
}>;
