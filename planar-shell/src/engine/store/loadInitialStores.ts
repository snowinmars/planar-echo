import { nothing } from '@planar/shared';

import type {
  NumberVariableId,
  BooleanVariableId,
  KeyId,
  Maybe,
  CharacterNarrativeProps,
} from '@planar/shared';

export type InitialStores = Readonly<{
  number: Record<NumberVariableId, number>;
  boolean: Record<BooleanVariableId, number>;
  keys: Record<KeyId, number>;
  character: Record<string, CharacterNarrativeProps>;
}>;

let initialStores: Maybe<InitialStores> = nothing();

export const loadInitialStores = async (serverUrl: string): Promise<InitialStores> => {
  if (initialStores) return initialStores;

  const variableModule = await import(/* @vite-ignore */ `${serverUrl}/ghost/ghost/stores/dist/variable.js`);
  const keysModule = await import(/* @vite-ignore */ `${serverUrl}/ghost/ghost/stores/dist/key.js`);
  const characterModule = await import(/* @vite-ignore */ `${serverUrl}/ghost/ghost/stores/dist/character.js`);
  initialStores = {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    number: variableModule.initialNumberStore as Record<NumberVariableId, number>,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    boolean: variableModule.initialBooleanStore as Record<BooleanVariableId, number>,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    keys: keysModule.initialKeysStore as Record<KeyId, number>,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    character: characterModule.initialCharacterStore as Record<string, CharacterNarrativeProps>,
  };
  return initialStores;
};

export const resetStoresCache = (): void => {
  initialStores = null;
};
