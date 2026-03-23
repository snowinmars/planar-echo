import { create } from 'zustand';

import { ValidationState } from './types';

const useConverterStore = create<ValidationState>(set => ({
  status: 'normal',
  setStatus: (status: ValidationState['status']) => {
    set({ status });
  },
}));

export default useConverterStore;
