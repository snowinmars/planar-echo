import { useCallback, useState } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { useItemStore } from './store/itemStore';
import { resolveItemDialogue } from '../dialogueResolution/resolveItemDialogue';

export const useItemTalk = (): Readonly<{
  startTalk: () => Promise<void>;
  checkCanTalk: () => Promise<boolean>;
  talking: boolean;
}> => {
  const navigate = useNavigate();
  const [talking, setTalking] = useState(false);

  const {
    currentItemId,
    serverUrl,
    ghostDir,
    gameLanguage,
  } = useItemStore(useShallow(state => ({
    currentItemId: state.currentItemId,
    serverUrl: state.serverUrl,
    ghostDir: state.ghostDir,
    gameLanguage: state.gameLanguage,
  })));

  const startTalk = useCallback(async () => {
    if (!currentItemId || talking) return;

    setTalking(true);
    try {
      const { dialogueId, stateId } = await resolveItemDialogue({
        serverUrl,
        ghostDir,
        gameLanguage,
        itemId: currentItemId,
      });

      navigate({
        pathname: '/dialogue',
        search: createSearchParams({
          dialogueId: dialogueId,
          stateId: stateId,
        }).toString(),
      })?.catch(e => console.error(e));
    }
    catch (e: unknown) {
      console.error(e);
    }
    finally {
      setTalking(false);
    }
  }, [currentItemId, talking, serverUrl, ghostDir, gameLanguage, navigate]);

  const checkCanTalk = useCallback(async () => {
    if (!currentItemId) return false;

    try {
      await resolveItemDialogue({
        serverUrl,
        ghostDir,
        gameLanguage,
        itemId: currentItemId,
      });

      return true;
    }
    catch {
      return false;
    }
  }, [currentItemId, talking, serverUrl, ghostDir, gameLanguage, navigate]);

  return { startTalk, checkCanTalk, talking };
};
