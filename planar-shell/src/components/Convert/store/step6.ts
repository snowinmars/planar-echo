import { Subject } from 'rxjs';
import urlJoin from 'url-join';

import { nothing } from '@planar/shared';

import { getProgressMutation, getStartingSteps } from './step6.copypaste';

import type { Observable } from 'rxjs';
import type { StateCreator } from 'zustand';

import type {
  GameLanguage,
  GameName,
  PrismIndexCompleteMessage,
  PrismIndexErrorMessage,
  PrismIndexProgressMessage,
  PrismIndexReadyMessage,
  PrismIndexStartMessage,
} from '@planar/shared';

import type { LandingState, LandingStateStep6 } from './types';

type WebSocketMessage = PrismIndexProgressMessage | PrismIndexCompleteMessage | PrismIndexErrorMessage | PrismIndexReadyMessage;

export const useLandingStoreStep6: StateCreator<LandingState, [], [], LandingStateStep6> = (set, get) => {
  const createWs = (): WebSocket => {
    const { serverUrl } = get();
    const wsUrl = serverUrl.replace('http://', 'ws://').replace('https://', 'wss://');
    const ws = new WebSocket(urlJoin(wsUrl, '/api/prism/index'));

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data as string) as WebSocketMessage;

      switch (message.type) {
        case 'progress': {
          const { progress } = get();

          set({
            progress: {
              ...progress,
              [message.data.step]: getProgressMutation(message.data),
            },
            currentRssBytes: message.data.params.rssBytes,
          });
          break;
        }
        case 'complete': {
          set({ step6Loading: false, step6Valid: true, currentRssBytes: 0 });
          ws.close();
          break;
        }
        case 'error': {
          set({ step6Loading: false, step6Valid: false, currentRssBytes: 0 });
          ws.close();
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
    currentRssBytes: 0,
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
          chitinKeyFile,
          gameLanguage,
          gameName,
        } = get();

        const startMsg: PrismIndexStartMessage = {
          type: 'start',
          data: {
            chitinKeyFile,
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
