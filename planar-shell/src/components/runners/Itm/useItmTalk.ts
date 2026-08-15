import { useCallback, useState } from 'react';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { useItmStore } from './store/itmStore';
import { resolveItmDlg } from '../dlgResolution/resolveItmDlg';

export const useItmTalk = (): Readonly<{
  startTalk: () => Promise<void>;
  checkCanTalk: () => Promise<boolean>;
  talking: boolean;
}> => {
  const navigate = useNavigate();
  const [talking, setTalking] = useState(false);

  const {
    currentItmId,
    serverUrl,
    ghostDir,
    gameLanguage,
  } = useItmStore(useShallow(state => ({
    currentItmId: state.currentItmId,
    serverUrl: state.serverUrl,
    ghostDir: state.ghostDir,
    gameLanguage: state.gameLanguage,
  })));

  const startTalk = useCallback(async () => {
    if (!currentItmId || talking) return;

    setTalking(true);
    try {
      const { dlgId, stateId } = await resolveItmDlg({
        serverUrl,
        ghostDir,
        gameLanguage,
        itmId: currentItmId,
      });

      navigate({
        pathname: '/dlg',
        search: createSearchParams({
          dlgId: dlgId,
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
  }, [currentItmId, talking, serverUrl, ghostDir, gameLanguage, navigate]);

  const checkCanTalk = useCallback(async () => {
    if (!currentItmId) return false;

    try {
      await resolveItmDlg({
        serverUrl,
        ghostDir,
        gameLanguage,
        itmId: currentItmId,
      });

      return true;
    }
    catch {
      return false;
    }
  }, [currentItmId, talking, serverUrl, ghostDir, gameLanguage, navigate]);

  return { startTalk, checkCanTalk, talking };
};
