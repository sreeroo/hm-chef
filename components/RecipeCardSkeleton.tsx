import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

const RecipeCardSkeleton = ({ horizontal = false }: { horizontal?: boolean }) => {
  const { themeColors } = useTheme();
  const cardStyle = horizontal ? styles.horizontalCard : styles.verticalCard;

  return (
    <View style={[cardStyle, { backgroundColor: themeColors.primaryLight, opacity: 0.6 }]}>
      <View style={[styles.imagePlaceholder, { backgroundColor: themeColors.secondary }]} />
      <View style={styles.textContainer}>
        <View style={[styles.textPlaceholder, { width: '70%', height: 20, backgroundColor: themeColors.secondary }]} />
        <View style={[styles.textPlaceholder, { width: '40%', height: 14, backgroundColor: themeColors.secondary }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  verticalCard: {
    borderRadius: 18,
    marginBottom: 24,
    overflow: 'hidden',
  },
  horizontalCard: {
    borderRadius: 18,
    marginRight: 16,
    width: "100%", // Adjust width for horizontal scroll
    overflow: 'hidden',
    margin:10,
  },
  imagePlaceholder: {
    width: '100%',
    height: 150, // Slightly smaller height for skeleton
  },
  textContainer: {
    padding: 16,
  },
  textPlaceholder: {
    borderRadius: 4,
    marginBottom: 8,
  },
});

export default RecipeCardSkeleton;