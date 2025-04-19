import React from 'react';
import {StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { View, Text} from '../Themed';

const ListEmpty = ({ message }: { message: string }) => {
  const { themeColors } = useTheme();
  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: themeColors.secondary }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginTop: 40, paddingHorizontal: 20 },
  text: { fontSize: 16, textAlign: 'center' },
});

export default ListEmpty;