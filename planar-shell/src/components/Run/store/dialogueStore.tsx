import { create } from 'zustand';
import { createDialogueLogic, nothing } from '@planar/shared';
import { client } from '@/swagger/client/client.gen';
import {
  postApiGhostDialogueByDialogueIdSkeleton,
  postApiGhostDialogueByDialogueIdByGameLanguage,
  postApiGhostDialogue,
} from '@/swagger/client';
import planarLocalStorage from '@/shared/planarLocalStorage';

import type { UntranslatedNpcDialogue } from '@planar/shared';
import type { Maybe, NpcDialogue, StateId } from '@planar/shared';
import type { GameLanguage } from '@/swagger/client';
import { chooseStartingStateId, isDestructor } from './helpers';
import { getDialogue, setDialogue } from './dialogueDb';

type Skeleton = <T>(dialogueLogic: T) => UntranslatedNpcDialogue;
export const getSkeleton = async (serverUrl: string, ghostPath: string, dialogueId: string): Promise<string> => {
  const skeletonResponse = await postApiGhostDialogueByDialogueIdSkeleton({
    client,
    baseURL: serverUrl,
    body: { ghostDir: ghostPath },
    path: { dialogueId: dialogueId },
  });

  if (skeletonResponse.error) {
    console.error(skeletonResponse.error);
    throw new Error(skeletonResponse.error.error.message);
  }
  else {
    return skeletonResponse.data.data.content;
  }
};

type Translation = (untranslatedNpcDialogue: UntranslatedNpcDialogue) => NpcDialogue;
export const getTranslation = async (serverUrl: string, ghostPath: string, dialogueId: string, gameLanguage: GameLanguage): Promise<string> => {
  const translationResponse = await postApiGhostDialogueByDialogueIdByGameLanguage({
    client,
    baseURL: serverUrl,
    body: { ghostDir: ghostPath },
    path: { dialogueId, gameLanguage },
  });
  if (translationResponse.error) {
    console.error(translationResponse.error);
    throw new Error(translationResponse.error.error.message);
  }
  else {
    return translationResponse.data.data.content;
  }
};

export type DialogueStore = {
  serverUrl: string;
  ghostPath: string;
  gameLanguage: GameLanguage;
  loading: boolean;

  dialogues: string[];
  tree: Maybe<NpcDialogue>;
  currentDialogueId: Maybe<string>;
  setCurrentDialogueId: (dialogueId: string) => void;

  currentStateId: Maybe<StateId>;
  setCurrentStateId: (targetStateId: StateId) => void;

  loadDialogues: () => Promise<void>;
  setDialogue: (dialogueId: string, targetState?: Maybe<StateId>) => Promise<void>;
  disposeDialogue: () => void;
};

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

  setDialogue: async (currentDialogueId: string, initialStateId?: Maybe<StateId>): Promise<void> => {
    set({
      loading: true,
    });

    try {
      const dbDialogue = await getDialogue(currentDialogueId);
      let skeleton: Skeleton;
      let translation: Translation;

      if (dbDialogue) {
        skeleton = (eval(dbDialogue.skeleton));
        translation = (eval(dbDialogue.translation));
      }
      else {
        const {
          serverUrl,
          ghostPath,
          gameLanguage,
        } = get();
        const skeletonContent = await getSkeleton(serverUrl, ghostPath, currentDialogueId);
        const translationContent = await getTranslation(serverUrl, ghostPath, currentDialogueId, gameLanguage);
        await setDialogue(currentDialogueId, skeletonContent, translationContent);
        skeleton = (eval(skeletonContent));
        translation = (eval(translationContent));
      }

      const l = createDialogueLogic();
      const s = skeleton(l);
      const t = translation(s);

      set({
        tree: t,
        currentDialogueId: currentDialogueId,
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
      set({ loading: false });
    }
  },

  disposeDialogue: () => set({ tree: null, currentStateId: null, currentDialogueId: null }),
}));
