import React from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { View } from '@/components/Themed'; // Use Themed View
import { useTheme } from '@/context/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>; // Allow passing additional styles
}

const Card: React.FC<CardProps> = ({ children, style }) => {
  const { themeColors } = useTheme();

  return (
    <View style={[
      styles.card,
      {
        backgroundColor: themeColors.cardBackground || themeColors.primaryLight, // Default background
        shadowColor: themeColors.shadowColor || '#000', // Default shadow
      },
      style // Apply custom styles passed via props
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    overflow: 'hidden', // Ensures content respects border radius
    // Shadow/Elevation
    elevation: 4, // Android shadow
    shadowOffset: { width: 0, height: 2 }, // iOS shadow
    shadowOpacity: 0.15,
    shadowRadius: 6,
    // Default margin (can be overridden by style prop)
    marginBottom: 20,
  },
});

export default Card;