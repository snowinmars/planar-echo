import { nothing, progressSteps } from '@planar/shared';
import { Observable, Subject } from 'rxjs';
import urlJoin from 'url-join';

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
} from '@planar/shared';

type WebSocketMessage = PrismIndexProgressMessage | PrismIndexCompleteMessage | PrismIndexErrorMessage;

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
          break;
        }
        case 'error': {
          console.error('PrismIndex error:', message.data);
          break;
        }
        default: console.warn('Unknown message type:', message);
      }
    };

    return ws;
  };

  const progress$ = new Subject<void>();
  const observable = progress$
    .pipe();

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
          gameName,
          gameLanguage,
          weiduExePath,
          chitinKeyPath,
          ghostPath,
        } = get();

        const startMsg: PrismIndexStartMessage = {
          type: 'start',
          data: {
            gameName: gameName as GameName,
            gameLanguage: gameLanguage as GameLanguage,
            weiduExe: weiduExePath,
            chitinKey: chitinKeyPath,
            ghost: ghostPath,
          },
        };

        ws.send(JSON.stringify(startMsg));
      };

      return observable;
    },
  };
};
