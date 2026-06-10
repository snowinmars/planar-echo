import { create } from 'zustand';
import { nothing } from '@planar/shared';
import { client } from '@/swagger/client/client.gen';
import { postApiGhostDialogue } from '@/swagger/client';
import planarLocalStorage from '@/shared/planarLocalStorage';
import { chooseStartingStateId, isDestructor } from './helpers';
import { loadTranslatedDialogue } from './dialogueApi';

import type { Maybe, TranslatedNpcDialogue, StateId } from '@planar/shared';
import type { GameLanguage } from '@/swagger/client';

export type DialogueStore = Readonly<{
  serverUrl: string;
  ghostPath: string;
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
  ghostPath: planarLocalStorage.get('ghostPath')!,
  gameLanguage: planarLocalStorage.get<GameLanguage>('gameLanguage')!,
  loading: false,

  dialogues: [],
  tree: nothing(),

  currentDialogueId: '',
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
      const { serverUrl, ghostPath } = get();
      const { error, data } = await postApiGhostDialogue({
        client,
        baseURL: serverUrl,
        body: { ghostDir: ghostPath }, // may use server filter here, but nah
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
        ghostPath,
        gameLanguage,
      } = get();
      const t = await loadTranslatedDialogue({
        serverUrl,
        ghostPath,
        gameLanguage,
        dialogueId,
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
