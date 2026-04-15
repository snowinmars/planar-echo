import { create } from 'zustand';
import { useLandingStoreStep0 } from './step0';
import { useLandingStoreStep1 } from './step1';
import { useLandingStoreStep2 } from './step2';
import { useLandingStoreStep3 } from './step3';
import { useLandingStoreStep4 } from './step4';
import { useLandingStoreStep5 } from './step5';
import { useLandingStoreStep6 } from './step6';

import type { LandingState } from './types';

export const useLandingStore = create<LandingState>()((...args) => ({
  ...useLandingStoreStep0(...args),
  ...useLandingStoreStep1(...args),
  ...useLandingStoreStep2(...args),
  ...useLandingStoreStep3(...args),
  ...useLandingStoreStep4(...args),
  ...useLandingStoreStep5(...args),
  ...useLandingStoreStep6(...args),
}));
