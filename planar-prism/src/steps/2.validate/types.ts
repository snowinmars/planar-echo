export type WeiduValidateResult
  = | 'ok'
    | 'cannot'
;
export type GameFolderValidateResult
  = | 'ok'
    | 'cannot'
;
export type ValidationResult = Readonly<{
  weidu: WeiduValidateResult;
  gameFolder: GameFolderValidateResult;
}>;
