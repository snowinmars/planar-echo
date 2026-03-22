import { create } from 'zustand';

import { Language, ValidationState } from './types';

const useConverterStore = create<ValidationState>((set, get) => ({
  status: 'loading',
  setStatus: (status: ValidationState['status']) => {
    set({ status });
  },
}));

export default useConverterStore;
