import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

const ThemeContext = createContext({ themeColors: Colors.light });

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider value={{ themeColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);