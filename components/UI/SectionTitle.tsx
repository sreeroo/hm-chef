import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Text } from '../Themed';

const SectionTitle = ({ children }: { children: React.ReactNode }) => {
  const { themeColors } = useTheme();
  return (
    <Text style={[styles.title, { color: themeColors.primaryDark }]}>{children}</Text>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 10,
    letterSpacing: 1,
  },
});

export default SectionTitle;