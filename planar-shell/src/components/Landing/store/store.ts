import { create } from 'zustand';

import type { LandingState } from './types';
import { useLandingStoreStep1 } from './step1';
import { useLandingStoreStep2 } from './step2';
import { useLandingStoreStep3 } from './step3';
import { useLandingStoreStep4 } from './step4';
import { useLandingStoreStep5 } from './step5';

export const useLandingStore = create<LandingState>()((...args) => ({
  ...useLandingStoreStep1(...args),
  ...useLandingStoreStep2(...args),
  ...useLandingStoreStep3(...args),
  ...useLandingStoreStep4(...args),
  ...useLandingStoreStep5(...args),
}));
