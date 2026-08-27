import { useEffect, useMemo, useRef, useState } from 'react';
import { just, nothing } from '@planar/shared';
import { createPlaySession } from './createPlaySession.js';

import type { RefObject } from 'react';
import type { Maybe } from '@planar/shared';
import type { PlayBoot } from './playBootFromSearchParams.js';
import type {
  PlaySocketState,
  PlaySessionApi,
} from './types.js';

export type UsePlaySessionResponse = Readonly<{
  tick: number;
  ticksPaused: boolean;
  playSocketState: PlaySocketState;
  errorText: Maybe<string>;
  areId: Maybe<string>;
  setPaused: (paused: boolean) => void;
}>;
export const usePlaySession = (
  renderHostRef: RefObject<HTMLDivElement | null>,
  boot: PlayBoot,
): UsePlaySessionResponse => {
  const [tick, setTick] = useState(0);
  const [ticksPaused, setTicksPaused] = useState(false);
  const [playSocketState, setPlaySocketState] = useState<PlaySocketState>('connecting');
  const [errorText, setErrorText] = useState<Maybe<string>>(nothing());
  const [areId, setAreId] = useState<Maybe<string>>(nothing());
  const playSessionApiRef = useRef<Maybe<PlaySessionApi>>(nothing());

  useEffect(() => { // connect
    const renderHost = just(renderHostRef.current);

    playSessionApiRef.current = createPlaySession({
      renderHost,
      serverUrl: boot.serverUrl,
      ghostDir: boot.ghostDir,
      onHudUpdate: (nextTick, nextPaused, nextAreId) => {
        setTick(nextTick);
        setTicksPaused(nextPaused);
        setAreId(nextAreId);
      },
      onPlaySocketStateChanged: (nextPlaySocketState) => {
        setPlaySocketState(nextPlaySocketState);
        const opened = nextPlaySocketState === 'open';
        if (opened) setErrorText(nothing());
      },
      onError: e => setErrorText(e),
    });

    return () => {
      playSessionApiRef.current?.destroy();
      playSessionApiRef.current = nothing();
    };
  }, []);

  const setPaused = useMemo(() => (nextPaused: boolean): void => {
    playSessionApiRef.current?.setPaused(nextPaused);
  }, [playSessionApiRef.current]);

  return {
    tick,
    ticksPaused,
    playSocketState,
    errorText,
    areId,
    setPaused,
  };
};
