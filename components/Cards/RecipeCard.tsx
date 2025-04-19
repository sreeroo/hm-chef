import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { Recipe, useRecipeContext } from '@/context/RecipeContext';
import RecipeImage from '../RecipeImage';
import Card from './Card'; 

interface RecipeCardProps {
  recipe: Recipe;
  onPressCard: () => void;
  onPressAction: () => void;
  actionIconType: 'favorite' | 'remove';
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onPressCard,
  onPressAction,
  actionIconType,
}) => {
  const { themeColors } = useTheme();
  const { isFavorite: checkIsFavorite } = useRecipeContext();
  const isCurrentlyFavorite = checkIsFavorite(recipe.id);

  const iconName = actionIconType === 'remove'
    ? "delete-forever"
    : (isCurrentlyFavorite ? "favorite" : "favorite-outline");
  const iconColor = actionIconType === 'remove'
    ? themeColors.secondary
    : (isCurrentlyFavorite ? themeColors.primary : themeColors.secondary);

  return (
    // Use the generic Card component as the base container
    <Card style={styles.recipeCardContainer}>
      <TouchableOpacity onPress={onPressCard} activeOpacity={0.8}>
        <RecipeImage uri={recipe.imageUri} height={200} />
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: themeColors.primaryDark }]} numberOfLines={2}>
              {recipe.name}
            </Text>
            {/* Action Buttons Container */}
            <View style={styles.actionButtonsContainer}>

              {/* Favorite/Remove Button */}
              <TouchableOpacity onPress={onPressAction} style={styles.actionButton}>
                <MaterialIcons name={iconName} size={28} color={iconColor} />
              </TouchableOpacity>
            </View>
          </View>
          {recipe.category && (
             <Text style={[styles.category, { color: themeColors.text }]} numberOfLines={3}>
               {recipe.category}
             </Text>
          )}
        </View>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  recipeCardContainer: {
    // Override default Card margin if needed, or add specific styles
    marginHorizontal: 16, // Keep horizontal margin specific to RecipeCard list usage
    marginBottom: 24, // Keep specific bottom margin for lists
  },
  content: {
    padding: 16,
    backgroundColor: 'transparent',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    backgroundColor: 'transparent'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  actionButtonsContainer: {
    flexDirection: 'row', // Arrange icons horizontally
    alignItems: 'center',
    backgroundColor:'transparent'
  },
  actionButton: {
    padding: 4,
  },
  category: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default RecipeCard;