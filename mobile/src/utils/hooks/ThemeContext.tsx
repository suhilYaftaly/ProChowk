import React, { createContext, useState, useContext, ReactNode } from 'react';
import { lightTheme, darkTheme } from '@constants/colors';
import { useAppDispatch } from './hooks';
import { setColorMode } from '~/src/redux/slices/settingsSlice';
import { getValueFromLocalStorage, saveInLocalStorage } from '../secureStore';
import { THEME_KEY } from '~/src/constants/localStorageKeys';
import { useSettingsStates } from '~/src/redux/reduxStates';

const themeType = getValueFromLocalStorage(THEME_KEY);

const getTheme = (themeType: string) => (themeType === 'light' ? lightTheme : darkTheme);

const ThemeContext = createContext({
  theme: themeType ? getTheme(themeType) : lightTheme,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { colorMode } = useSettingsStates();
  const dispatch = useAppDispatch();
  const [theme, setTheme] = useState(themeType ? getTheme(themeType) : lightTheme);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === lightTheme ? darkTheme : lightTheme));
    saveInLocalStorage(THEME_KEY, themeType === 'light' ? 'dark' : 'light'); // Update theme in local storage for next app restarts
    dispatch(setColorMode(colorMode === 'light' ? 'dark' : 'light'));
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  return context;
};
