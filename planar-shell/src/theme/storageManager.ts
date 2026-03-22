/* eslint-disable @typescript-eslint/no-explicit-any */ // because of mui type it this way
import type { StorageManager } from '@mui/material/styles';

const storageManager: StorageManager = (options: {
  key: string;
  storageWindow?: Window | null;
}) => {
  const storage = options.storageWindow?.localStorage ?? window.localStorage;

  return ({
    get: (defaultValue: any): any => {
      try {
        const saved = storage.getItem(options.key);
        if (!saved) return defaultValue;
        return JSON.parse(saved);
      }
      catch {
        return defaultValue;
      }
    },

    set: (value: any): void => {
      try {
        storage.setItem(options.key, JSON.stringify(value));
      }
      catch (error) {
        console.error('Failed to save to localStorage:', error);
      }
    },

    subscribe: (handler: (value: any) => void): () => void => {
      const storageHandler = (event: StorageEvent) => {
        if (event.key === options.key && event.newValue) {
          try {
            handler(JSON.parse(event.newValue));
          }
          catch {
            handler(null);
          }
        }
      };

      window.addEventListener('storage', storageHandler);

      return () => {
        window.removeEventListener('storage', storageHandler);
      };
    },
  });
};

export default storageManager;
