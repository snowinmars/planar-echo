import { Subject, debounceTime } from 'rxjs';
import { setDbNarrative } from '@/shared/indexedDb';
import { setDbCharacters } from '@/shared/indexedDb';
import { fireWorldStoreBroadcast } from './worldBroadcast';

import type { NarrativeState } from '@/shared/indexedDb';
import type { CharactersState } from '@/shared/indexedDb';

const saveDebounceMs = 500;
const saveTrigger$ = new Subject<void>();

let getNarrativeState: (() => NarrativeState) | null = null;
let getCharactersState: (() => CharactersState) | null = null;

export const registerStores = (
  narrativeGetState: () => NarrativeState,
  charactersGetState: () => CharactersState,
): void => {
  getNarrativeState = narrativeGetState;
  getCharactersState = charactersGetState;
};

const doSave = async (): Promise<void> => {
  if (getNarrativeState) {
    const narrative = getNarrativeState();
    await setDbNarrative(narrative);
  }

  if (getCharactersState) {
    const characters = getCharactersState();
    await setDbCharacters(characters);
  }
};

// TODO [snow]: unsubscribe, but where?
saveTrigger$
  .pipe(debounceTime(saveDebounceMs))
  .subscribe({
    next: () => {
      doSave()
        .then(() => fireWorldStoreBroadcast())
        .catch(console.error);
    },
  });

export const triggerSave = (): void => {
  saveTrigger$.next();
};
