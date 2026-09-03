import { useCallback, useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import { resolveCreDlg } from '../dlgResolution/resolveCreDlg';
import { useCreStore } from './store/creStore';

export const useCreTalk = (): Readonly<{
  startTalk: () => Promise<void>;
  talking: boolean;
}> => {
  const navigate = useNavigate();
  const [talking, setTalking] = useState(false);

  const {
    currentCreId,
    serverUrl,
    ghostDir,
    gameLanguage,
  } = useCreStore(useShallow(state => ({
    currentCreId: state.currentCreId,
    serverUrl: state.serverUrl,
    ghostDir: state.ghostDir,
    gameLanguage: state.gameLanguage,
  })));

  const startTalk = useCallback(async () => {
    if (!currentCreId || talking) return;

    setTalking(true);
    try {
      const { dlgId, stateId } = await resolveCreDlg({
        serverUrl,
        ghostDir,
        gameLanguage,
        creId: currentCreId,
      });

      navigate({
        pathname: '/dlg',
        search: createSearchParams({
          dlgId,
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
  }, [currentCreId, talking, serverUrl, ghostDir, gameLanguage, navigate]);

  return { startTalk, talking };
};
