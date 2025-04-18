import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, Alert } from 'react-native';
import { View } from '@/components/Themed'; // Only View needed from Themed if ListEmpty handles text
import { useTheme } from '@/context/ThemeContext';
import { useRecipes } from '@/context/RecipeContext';
import RecipeCard from '@/components/Cards/RecipeCard';
import ListEmpty from '@/components/ListEmpty'; // Import ListEmpty
import SimpleModal from '@/components/SimpleModal'; // Import the modal
import RecipeDetailContent from '@/components/RecipeDetailContent'; // Import the content component
import { Image } from 'expo-image'; // Import Image for prefetching
import { router } from 'expo-router';

export default function MyRecipesScreen() {
  const { themeColors } = useTheme();
  const { recipes, removeRecipe } = useRecipes();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

    // --- Prefetch images when recipes change ---
    useEffect(() => {
      const imageUris = recipes
        .map(recipe => recipe.imageUri)
        .filter((uri): uri is string => uri !== null); // Filter out null URIs and type guard
  
      if (imageUris.length > 0) {
        Image.prefetch(imageUris);
      }
    }, [recipes]); // Run when the recipes array changes
  

  const handleRemoveFavorite = (recipeId: string) => {
    Alert.alert(
      "Remove Recipe",
      "Are you sure you want to remove this recipe?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", style: "destructive", onPress: () => removeRecipe(recipeId) }
      ]
    );
  };

  const handleEditRecipe = (recipeId: string) => {
    // Navigate to the create screen, passing the recipe ID as a param
    router.push({ pathname: '/(tabs)/create', params: { recipeId: recipeId } });
  };


    // Function to open the modal
    const handleOpenRecipe = (recipeId: string) => {
      setSelectedRecipeId(recipeId);
      setIsModalVisible(true);
    };
  
    // Function to close the modal
    const handleCloseModal = () => {
      setIsModalVisible(false);
      setSelectedRecipeId(null);
    };
  

  return (
    <>
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <FlatList
        data={recipes}
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item}
            onPressCard={() => handleOpenRecipe(item.id)}
            onPressAction={() => handleRemoveFavorite(item.id)}
            actionIconType="remove"
            onPressEdit={() => handleEditRecipe(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
            <ListEmpty message="You haven't saved any recipes yet. Go to the 'Create' or 'Search' tab to add some!" />
        }
      />
    </View>
        {/* --- Recipe Detail Modal --- */}
        <SimpleModal visible={isModalVisible} onClose={handleCloseModal}>
        {selectedRecipeId && <RecipeDetailContent recipeId={selectedRecipeId} />}
      </SimpleModal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  // emptyContainer and emptyText styles removed
});