export type WeiduValidateResult
  = | 'ok'
    | 'cannot'
;
export type GameFolderValidateResult
  = | 'ok'
    | 'cannot'
;
export type ValidateResult = Readonly<{
  weidu: WeiduValidateResult;
  gameFolder: GameFolderValidateResult;
}>;
