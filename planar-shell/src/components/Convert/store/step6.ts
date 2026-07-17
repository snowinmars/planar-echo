import { just, nothing, progressSteps } from '@planar/shared';
import { Observable, Subject } from 'rxjs';
import urlJoin from 'url-join';
import planarLocalStorage from '@/shared/planarLocalStorage';

import type { LandingState, LandingStateStep6 } from './types';
import type { StateCreator } from 'zustand';
import type {
  GameName,
  GameLanguage,
  ProgressStep,
  PrismIndexStartMessage,
  PrismIndexProgressMessage,
  PrismIndexCompleteMessage,
  PrismIndexErrorMessage,
  PrismIndexReadyMessage,
} from '@planar/shared';

type WebSocketMessage = PrismIndexProgressMessage | PrismIndexCompleteMessage | PrismIndexErrorMessage | PrismIndexReadyMessage;

const getStartingSteps = () => new Map<ProgressStep, PrismIndexProgressMessage['data']>(progressSteps.map(x => [x, { value: 0, step: x }]));

export const useLandingStoreStep6: StateCreator<LandingState, [], [], LandingStateStep6> = (set, get) => {
  const createWs = (): WebSocket => {
    const { serverUrl } = get();
    const wsUrl = serverUrl.replace('http://', 'ws://').replace('https://', 'wss://');
    const ws = new WebSocket(urlJoin(wsUrl, '/api/prism/index'));

    const updateProgress = (step: ProgressStep, value: number) => {
      const { progress } = get();
      progress.set(step, { step, value });
      set({ progress });
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data as string) as WebSocketMessage;

      switch (message.type) {
        case 'progress': {
          const matchedStep = get().progress.get(message.data.step);
          if (matchedStep) {
            updateProgress(message.data.step, message.data.value);
          }
          break;
        }
        case 'complete': {
          set({ step6Loading: false, step6Valid: true });
          ws.close();
          planarLocalStorage.set('storesStatus', 'ready');
          break;
        }
        case 'error': {
          set({ step6Loading: false, step6Valid: false });
          ws.close();
          planarLocalStorage.set('storesStatus', 'empty');
          console.error('PrismIndex error:', message.data);
          // TODO [snow]: show error
          break;
        }
        case 'ready': {
          break;
        }
        default: console.warn('Unknown message type:', message);
      }
    };

    return ws;
  };

  const progress$ = new Subject<void>();
  const observable = progress$.asObservable();

  return {
    step6Loading: false,
    step6Comment: '',
    step6CommentArgs: {},
    step6ResultType: nothing(),
    step6Valid: false,
    progress: getStartingSteps(),
    step6Destroy: () => {},

    biff2json: (): Observable<void> => {
      get().step6Destroy?.();

      const ws = createWs();

      set({
        progress: getStartingSteps(),
        step6Loading: true,
        step6Destroy: () => {
          if (ws.readyState === WebSocket.OPEN) ws.close();
        },
      });

      ws.onopen = () => {
        const {
          weiduExeDir,
          chitinKeyFile,
          ghostDir,
          gameLanguage,
          gameName,
        } = get();

        const prismDir = just(planarLocalStorage.get('prismDir'));

        const startMsg: PrismIndexStartMessage = {
          type: 'start',
          data: {
            weiduExeDir,
            chitinKeyFile,
            ghostDir,
            prismDir,
            gameLanguage: gameLanguage as GameLanguage,
            gameName: gameName as GameName,
          },
        };

        ws.send(JSON.stringify(startMsg));
      };

      return observable;
    },
  };
};
