import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, Alert } from 'react-native';
import { View } from '@/components/Themed';
import { useTheme } from '@/context/ThemeContext';
import { useRecipeContext } from '@/context/RecipeContext';
import RecipeCard from '@/components/Recipe/RecipeCard';
import ListEmpty from '@/components/UI/ListEmpty';
import SimpleModal from '@/components/UI/SimpleModal';
import RecipeDetailContent from '@/components/Recipe/RecipeDetailContent';
import { Image } from 'expo-image';

export default function MyRecipesScreen() {
  const { themeColors } = useTheme();
  const { recipes, removeRecipe } = useRecipeContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  // Prefetch images
  useEffect(() => {
    const imageUris = recipes.map(r => r.imageUri).filter((uri): uri is string => !!uri);
    if (imageUris.length > 0) Image.prefetch(imageUris);
  }, [recipes]);

  // If the selected recipe is removed, close the modal
  useEffect(() => {
    if (selectedRecipeId && !recipes.find(r => r.id === selectedRecipeId)) {
      setIsModalVisible(false);
      setSelectedRecipeId(null);
    }
  }, [recipes, selectedRecipeId]);

  const handleRemoveFavorite = (recipeId: string) => {
    Alert.alert(
      "Remove Recipe",
      "Are you sure you want to remove this recipe?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive", 
          onPress: () => {
            removeRecipe(recipeId);
            // If the removed recipe is open in modal, close it
            if (selectedRecipeId === recipeId) {
              setIsModalVisible(false);
              setSelectedRecipeId(null);
            }
          }
        }
      ]
    );
  };


  const handleOpenRecipe = (recipeId: string) => {
    setSelectedRecipeId(recipeId);
    setIsModalVisible(true);
  };

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
              />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <ListEmpty message="You haven't saved any recipes yet. Go to the 'Create' or 'Search' tab to add some!" />
          }
        />
      </View>
      <SimpleModal visible={isModalVisible} onClose={handleCloseModal}>
        {selectedRecipeId && recipes.find(r => r.id === selectedRecipeId) && (
          <RecipeDetailContent recipeId={selectedRecipeId} />
        )}
      </SimpleModal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContainer: { paddingTop: 16, paddingBottom: 16 },
});