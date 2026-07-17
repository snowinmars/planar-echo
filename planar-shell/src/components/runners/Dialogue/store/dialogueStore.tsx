import { create } from 'zustand';
import { nothing } from '@planar/shared';
import { client } from '@/swagger/client/client.gen';
import { postApiGhostDialogue } from '@/swagger/client';
import planarLocalStorage from '@/shared/planarLocalStorage';
import { chooseStartingStateId, isDestructor } from './helpers';
import { loadTranslatedDialogue } from './dialogueApi';
import { getZustandNarrative, getZustandCharacter } from '@/engine/store/worldStores';

import type { Maybe, TranslatedNpcDialogue, StateId } from '@planar/shared';
import type { GameLanguage } from '@/swagger/client';

export type DialogueStore = Readonly<{
  serverUrl: string;
  ghostDir: string;
  gameLanguage: GameLanguage;
  loading: boolean;

  dialogues: string[];
  tree: Maybe<TranslatedNpcDialogue>;
  currentDialogueId: Maybe<string>;
  setCurrentDialogueId: (dialogueId: string) => void;

  currentStateId: Maybe<StateId>;
  setCurrentStateId: (targetStateId: StateId) => void;

  loadDialogues: () => Promise<void>;
  loadDialogue: (dialogueId: string, targetState?: Maybe<StateId>) => Promise<void>;
  disposeDialogue: () => void;
}>;

export const useDialogueStore = create<DialogueStore>((set, get) => ({
  serverUrl: planarLocalStorage.get('serverUrl')!,
  ghostDir: planarLocalStorage.get('ghostDir')!,
  gameLanguage: planarLocalStorage.get<GameLanguage>('gameLanguage')!,
  loading: false,

  dialogues: [],
  tree: nothing(),

  currentDialogueId: nothing(),
  setCurrentDialogueId: (dialogueId: string) => set({ currentDialogueId: dialogueId }),

  currentStateId: nothing(),
  setCurrentStateId: (targetStateId: StateId) => {
    if (isDestructor(targetStateId)) set({ tree: nothing(), currentStateId: nothing() });
    else set({ currentStateId: targetStateId });
  },

  loadDialogues: async (): Promise<void> => {
    set({
      loading: true,
    });

    try {
      const { serverUrl, ghostDir } = get();
      const { error, data } = await postApiGhostDialogue({
        client,
        baseURL: serverUrl,
        body: { ghostDir: ghostDir }, // may use server filter here, but nah
      });

      if (error) {
        console.error(error);
        set({
          dialogues: [],
        });
      }
      else {
        set({
          dialogues: data,
        });
      }
    }
    catch (e: unknown) {
      console.error(e);
    }
    finally {
      set({
        loading: false,
      });
    }
  },

  loadDialogue: async (dialogueId: string, initialStateId?: Maybe<StateId>): Promise<void> => {
    set({
      loading: true,
    });

    try {
      const {
        serverUrl,
        ghostDir,
        gameLanguage,
      } = get();

      const narrative = getZustandNarrative();
      const character = getZustandCharacter();

      if (!narrative || !character) {
        throw new Error('World stores were not initialized');
      }

      const t = await loadTranslatedDialogue({
        serverUrl,
        ghostDir,
        gameLanguage,
        dialogueId,
        narrative,
        character,
      });

      set({
        tree: t,
        currentDialogueId: dialogueId,
        currentStateId: initialStateId ?? chooseStartingStateId(t),
      });
    }
    catch (e: unknown) {
      console.error(e);
      set({
        currentDialogueId: nothing(),
        tree: nothing(),
        currentStateId: nothing(),
      });
    }
    finally {
      set({
        loading: false,
      });
    }
  },

  disposeDialogue: () => set({ tree: nothing(), currentStateId: nothing(), currentDialogueId: nothing() }),
}));
