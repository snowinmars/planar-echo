import { useCallback, useState } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { useCreatureStore } from './store/creatureStore';
import { resolveCreatureDialogue } from '../dialogueResolution/resolveCreatureDialogue';

export const useCreatureTalk = (): Readonly<{
  startTalk: () => Promise<void>;
  talking: boolean;
}> => {
  const navigate = useNavigate();
  const [talking, setTalking] = useState(false);

  const {
    currentCreatureId,
    serverUrl,
    ghostPath,
    gameLanguage,
  } = useCreatureStore(useShallow(state => ({
    currentCreatureId: state.currentCreatureId,
    serverUrl: state.serverUrl,
    ghostPath: state.ghostPath,
    gameLanguage: state.gameLanguage,
  })));

  const startTalk = useCallback(async () => {
    if (!currentCreatureId || talking) return;

    setTalking(true);
    try {
      const { dialogueId, stateId } = await resolveCreatureDialogue({
        serverUrl,
        ghostPath,
        gameLanguage,
        creatureId: currentCreatureId,
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
  }, [currentCreatureId, talking, serverUrl, ghostPath, gameLanguage, navigate]);

  return { startTalk, talking };
};
