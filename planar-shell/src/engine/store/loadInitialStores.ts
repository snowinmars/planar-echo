import { nothing } from '@planar/shared';

import type {
  BooleanVariableId,
  CharacterNarrativeProps,
  KeyId,
  Maybe,
  NumberVariableId,
} from '@planar/shared';

export type InitialStores = Readonly<{
  number: Record<NumberVariableId, number>;
  boolean: Record<BooleanVariableId, number>;
  keys: Record<KeyId, number>;
  character: Record<string, CharacterNarrativeProps>;
}>;

let initialStores: Maybe<InitialStores> = nothing();

type GhostIife = {
  initialNumberStore?: Record<NumberVariableId, number>;
  initialBooleanStore?: Record<BooleanVariableId, number>;
  initialKeysStore?: Record<KeyId, number>;
  initialCharacterStore?: Record<string, CharacterNarrativeProps>;
};

const isGhostIife = (x: unknown): x is GhostIife => Boolean(x) && typeof x === 'object';

const evalGhostIife = async (url: string): Promise<GhostIife> => {
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error(`GET ${url} ${res.status}`);
  const src = await res.text();
  const result: unknown = (0, eval)(src);
  if (typeof result === 'function') {
    // IIFE / factory from esbuild ghost bundle
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const out: unknown = result();
    if (isGhostIife(out)) return out;
  }
  if (isGhostIife(result)) return result;
  return (globalThis as { ghost?: GhostIife }).ghost ?? {};
};

export const loadInitialStores = async (serverUrl: string): Promise<InitialStores> => {
  if (initialStores) return initialStores;

  const variableModule = await evalGhostIife(`${serverUrl}/ghost/ghost/stores/dist/variable.js`);
  const keysModule = await evalGhostIife(`${serverUrl}/ghost/ghost/stores/dist/key.js`);
  const characterModule = await evalGhostIife(`${serverUrl}/ghost/ghost/stores/dist/character.js`);
  initialStores = {
    number: variableModule.initialNumberStore as Record<NumberVariableId, number>,
    boolean: variableModule.initialBooleanStore as Record<BooleanVariableId, number>,
    keys: keysModule.initialKeysStore as Record<KeyId, number>,
    character: characterModule.initialCharacterStore as Record<string, CharacterNarrativeProps>,
  };
  return initialStores;
};

export const resetStoresCache = (): void => {
  initialStores = null;
};
