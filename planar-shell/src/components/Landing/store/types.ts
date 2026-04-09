import type {
  GameLanguage,
  GameName,
  Maybe,
  PrismIndexProgressMessage,
  ProgressStep,
} from '@planar/shared';
import { Observable } from 'rxjs';
import type { StateCreator } from 'zustand';

export type ZustandSetType<T> = Parameters<StateCreator<T>>[0];
export type ZustandGetType<T> = Parameters<StateCreator<T>>[1];

export type LandingState
  = & LandingStateStep0
    & LandingStateStep1
    & LandingStateStep2
    & LandingStateStep3
    & LandingStateStep4
    & LandingStateStep5
    & LandingStateStep6;

export type LandingStateStep0 = Readonly<{
  serverUrl: string;
  setServerUrl: (serverUrl: string) => void;
  step0Valid: boolean;
  step0Loading: boolean;
  step0Comment: string;
  step0CommentArgs: Record<string, string>;
  step0ResultType: Maybe<'success' | 'error'>;
  step0Validate: () => Promise<void>;
  step0Destroy: () => void;
}>;

export type LandingStateStep1 = Readonly<{
  step1Loading: boolean;
  gameLanguage: GameLanguage | '';
  setGameLanguage: (gameLanguage: GameLanguage | '') => void;
  gameName: GameName | '';
  setGameName: (gameName: GameName | '') => void;
  step1Valid: boolean;
  step1Destroy: () => void;
}>;

export type LandingStateStep2 = Readonly<{
  weiduExePath: string;
  setWeiduExePath: (weiduExePath: string) => void;
  step2Valid: boolean;
  step2Loading: boolean;
  step2Comment: string;
  step2CommentArgs: Record<string, string>;
  step2ResultType: Maybe<'success' | 'error'>;
  step2Validate: () => Promise<void>;
  step2Destroy: () => void;
}>;

export type LandingStateStep3 = Readonly<{
  chitinKeyPath: string;
  setChitinKeyPath: (chitinKeyPath: string) => void;
  step3Valid: boolean;
  step3Loading: boolean;
  step3Comment: string;
  step3CommentArgs: Record<string, string>;
  step3ResultType: Maybe<'success' | 'error'>;
  step3Validate: () => Promise<void>;
  step3Destroy: () => void;
}>;

export type LandingStateStep4 = Readonly<{
  ghostPath: string;
  setGhostPath: (ghostPath: string) => void;
  step4Valid: boolean;
  step4Loading: boolean;
  step4Comment: string;
  step4CommentArgs: Record<string, string>;
  step4ResultType: Maybe<'success' | 'error'>;
  step4Validate: () => Promise<void>;
  step4Destroy: () => void;
}>;

export type LandingStateStep5 = Readonly<{
  step5Loading: boolean;
  ownGame: boolean;
  setOwnGame: (x: boolean) => void;
  step5Valid: boolean;
  step5Destroy: () => void;
}>;

export type LandingStateStep6 = Readonly<{
  step6Loading: boolean;
  step6Comment: string;
  step6CommentArgs: Record<string, string>;
  step6ResultType: Maybe<'success' | 'error'>;
  step6Valid: boolean;
  progress: Map<ProgressStep, PrismIndexProgressMessage['data']>;
  biff2json: () => Observable<void>;
  step6Destroy: () => void;
}>;
