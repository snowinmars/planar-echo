import React, { createContext, useContext, useState, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import lightTheme from './palletes/light';
import darkTheme from './palletes/dark';
import { ThemeMode } from './types';

type ThemeContextType = [ThemeMode, (theme: ThemeMode) => void];
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>('dark');

  const muiTheme = useMemo(
    () => {
      switch (theme) {
        case 'light': {
          return createTheme({
            palette: {
              ...lightTheme.palette,
              mode: theme,
            },
          })
        }
        case 'dark': {
          return createTheme({
            palette: {
              ...darkTheme.palette,
              mode: theme,
            },
          })
        }
        default: throw new Error(`Out of range theme ${theme}`);
      }

    },
    [theme]
  );

  return (
    <ThemeContext.Provider value={[ theme, setTheme ]}>
      <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};
