import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { SearchBar } from '@rneui/themed';
import { useTheme } from '@/context/ThemeContext';
import {
  getMealsByName,
  getMealDetailsById,
  parseIngredients,
  getRandomMeals,
  getCategories,
  getMealsByCategory,
} from '@/services/api';
import RecipeCardSkeleton from '@/components/Recipe/RecipeCardSkeleton';
import { useRecipeContext, Recipe } from '@/context/RecipeContext';
import RecipeCard from '@/components/Recipe/RecipeCard';
import SectionTitle from '@/components/UI/SectionTitle';
import ListEmpty from '@/components/UI/ListEmpty';
import SimpleModal from '@/components/UI/SimpleModal';
import RecipeDetailContent from '@/components/Recipe/RecipeDetailContent';

type Category = { strCategory: string };

export default function SearchScreen() {
  const { themeColors } = useTheme();
  const { addRecipe, removeRecipe, isFavorite } = useRecipeContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [displayedRecipes, setDisplayedRecipes] = useState<any[]>([]);
  const [initialFeaturedRecipes, setInitialFeaturedRecipes] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  // Fetch initial featured recipes and categories
  useEffect(() => {
    let isMounted = true;
    setLoadingRecipes(true);
    setLoadingCategories(true);

    Promise.all([getRandomMeals(5), getCategories()])
      .then(([featuredData, categoryData]) => {
        if (isMounted) {
          setInitialFeaturedRecipes(featuredData);
          setDisplayedRecipes(featuredData);
          setCategories(categoryData);
        }
      })
      .catch(e => console.error('Failed to fetch initial data:', e))
      .finally(() => {
        if (isMounted) {
          setLoadingRecipes(false);
          setLoadingCategories(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Search handler
  const handleSearch = useCallback(
    async (query: string) => {
      setSearchQuery(query);
      setSelectedCategory(null);
      if (query.trim() === '') {
        setIsSearching(false);
        setDisplayedRecipes(initialFeaturedRecipes);
        setLoadingRecipes(false);
        return;
      }
      setIsSearching(true);
      setLoadingRecipes(true);
      try {
        const data = await getMealsByName(query);
        setDisplayedRecipes(data);
      } catch (e) {
        console.error('Failed to search recipes:', e);
        setDisplayedRecipes([]);
      } finally {
        setLoadingRecipes(false);
      }
    },
    [initialFeaturedRecipes]
  );

  // Category selection handler
  const handleSelectCategory = useCallback(
    async (categoryName: string) => {
      setSearchQuery('');
      if (selectedCategory === categoryName) {
        setSelectedCategory(null);
        setIsSearching(false);
        setDisplayedRecipes(initialFeaturedRecipes);
      } else {
        setSelectedCategory(categoryName);
        setIsSearching(false);
        setLoadingRecipes(true);
        try {
          const data = await getMealsByCategory(categoryName);
          setDisplayedRecipes(data);
        } catch (e) {
          console.error(`Failed to fetch recipes for category ${categoryName}:`, e);
          setDisplayedRecipes([]);
        } finally {
          setLoadingRecipes(false);
        }
      }
    },
    [selectedCategory, initialFeaturedRecipes]
  );

  // Favorite toggle handler
  const handleToggleFavorite = useCallback(
    async (basicRecipeData: any) => {
      const recipeId = basicRecipeData.idMeal;
      if (isFavorite(recipeId)) {
        removeRecipe(recipeId);
      } else {
        try {
          const fullMealData = await getMealDetailsById(recipeId);
          if (fullMealData) {
            const newFavorite: Recipe = {
              id: fullMealData.idMeal,
              name: fullMealData.strMeal,
              category: fullMealData.strCategory || '',
              imageUri: fullMealData.strMealThumb,
              ingredients: parseIngredients(fullMealData),
              instructions: fullMealData.strInstructions || '',
            };
            addRecipe(newFavorite);
          }
        } catch (error) {
          console.error(`Error fetching details for ${recipeId}:`, error);
        }
      }
    },
    [addRecipe, removeRecipe, isFavorite]
  );

  // Modal open/close handlers
  const handleOpenRecipe = useCallback((recipeId: string) => {
    setSelectedRecipeId(recipeId);
    setIsModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalVisible(false);
    setSelectedRecipeId(null);
  }, []);

  // Section title logic
  const getSectionTitle = useCallback(() => {
    if (searchQuery.trim()) return 'Search Results';
    if (selectedCategory) return `Recipes in ${selectedCategory}`;
    return 'Featured Recipes';
  }, [searchQuery, selectedCategory]);

  // Render category chip
  const renderCategoryItem = useCallback(
    ({ item }: { item: Category }) => (
      <TouchableOpacity
        style={[
          styles.categoryChip,
          {
            backgroundColor:
              selectedCategory === item.strCategory
                ? themeColors.primary
                : themeColors.primaryLight,
            borderColor:
              selectedCategory === item.strCategory
                ? themeColors.primary
                : themeColors.secondary,
          },
        ]}
        onPress={() => handleSelectCategory(item.strCategory)}
      >
        <Text
          style={[
            styles.categoryText,
            {
              color:
                selectedCategory === item.strCategory
                  ? themeColors.white
                  : themeColors.primaryDark,
            },
          ]}
        >
          {item.strCategory}
        </Text>
      </TouchableOpacity>
    ),
    [selectedCategory, themeColors, handleSelectCategory]
  );

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: themeColors.background }]}
        stickyHeaderIndices={[0]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search Bar */}
        <View style={{ backgroundColor: themeColors.background, paddingBottom: 5 }}>
          <SearchBar
            placeholder="Search for recipes..."
            value={searchQuery}
            onChangeText={handleSearch}
            platform="default"
            containerStyle={styles.searchBarContainer}
            inputContainerStyle={[
              styles.searchInputContainer,
              { backgroundColor: themeColors.primaryLight },
            ]}
            inputStyle={{ color: themeColors.text }}
            placeholderTextColor={themeColors.secondary}
            round
            showLoading={isSearching && loadingRecipes}
          />
        </View>

        {/* Categories */}
        <View style={styles.sectionContainer}>
          <SectionTitle>Categories</SectionTitle>
          {loadingCategories ? (
            <ActivityIndicator color={themeColors.primary} style={{ marginVertical: 10 }} />
          ) : (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={item => `category-${item.strCategory}`}
              contentContainerStyle={styles.categoryListContainer}
              ListEmptyComponent={<ListEmpty message="No categories found." />}
            />
          )}
        </View>

        {/* Recipes */}
        <View style={styles.sectionContainer}>
          <SectionTitle>{getSectionTitle()}</SectionTitle>
          <FlatList
            data={loadingRecipes ? Array(3).fill(0) : displayedRecipes}
            renderItem={({ item, index }) => {
              if (loadingRecipes) {
                return <RecipeCardSkeleton key={`skeleton-${index}`} horizontal={false} />;
              } else if (item?.idMeal) {
                const displayRecipe: Recipe = {
                  id: item.idMeal,
                  name: item.strMeal,
                  category: !selectedCategory ? item.strCategory || '' : '',
                  imageUri: item.strMealThumb,
                };
                return (
                  <RecipeCard
                    recipe={displayRecipe}
                    onPressCard={() => handleOpenRecipe(item.idMeal)}
                    onPressAction={() => handleToggleFavorite(item)}
                    actionIconType="favorite"
                  />
                );
              } else {
                return null;
              }
            }}
            keyExtractor={(item, index) =>
              loadingRecipes
                ? `skeleton-${index}`
                : item?.idMeal
                ? `recipe-${item.idMeal}`
                : `recipe-fallback-${index}`
            }
            scrollEnabled={false}
            ListEmptyComponent={
              !loadingRecipes && displayedRecipes.length === 0 ? (
                <ListEmpty message="No recipes found." />
              ) : null
            }
          />
        </View>
      </ScrollView>

      {/* Recipe Detail Modal */}
      <SimpleModal visible={isModalVisible} onClose={handleCloseModal}>
        {selectedRecipeId && <RecipeDetailContent recipeId={selectedRecipeId} />}
      </SimpleModal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBarContainer: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingTop: 10,
    borderBottomWidth: 0,
    borderTopWidth: 0,
  },
  searchInputContainer: { borderRadius: 12 },
  sectionContainer: { paddingHorizontal: 16, marginBottom: 5 },
  categoryListContainer: { paddingVertical: 5, paddingHorizontal: 16 },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'red',
  },
  categoryText: { fontSize: 14, fontWeight: '600' },
});