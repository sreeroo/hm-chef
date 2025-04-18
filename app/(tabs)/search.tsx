import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { SearchBar } from '@rneui/themed';
import { Image } from 'expo-image';
import { useTheme } from '@/context/ThemeContext';
import { getMealsByName, getMealDetailsById, parseIngredients, getRandomMeals, getCategories, getMealsByCategory } from '@/services/api';
import RecipeCardSkeleton from '@/components/Cards/RecipeCardSkeleton'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import { useRecipes, Recipe} from '@/context/RecipeContext';
import RecipeCard from '@/components/Cards/RecipeCard';
import { router, useRouter } from 'expo-router'; // Import useRouter
import SectionTitle from '@/components/SectionTitle';
import ListEmpty from '@/components/ListEmpty';
import SimpleModal from '@/components/SimpleModal'; // Import the modal
import RecipeDetailContent from '@/components/RecipeDetailContent'; // Import the content component


const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';


export default function SearchScreen() {
  const { themeColors } = useTheme();
  const { addRecipe, removeRecipe, isFavorite } = useRecipes(); // Get context functions
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedRecipes, setDisplayedRecipes] = useState<any[]>([]);
  const [initialFeaturedRecipes, setInitialFeaturedRecipes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
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
      .catch(e => console.error("Failed to fetch initial data:", e))
      .finally(() => {
        if (isMounted) {
          setLoadingRecipes(false);
          setLoadingCategories(false);
        }
      });

    return () => { isMounted = false; }; 
  }, []);

  const handleToggleFavorite = async (basicRecipeData: any) => { // Make async
    const recipeId = basicRecipeData.idMeal;

    if (isFavorite(recipeId)) {
      // If already favorite, just remove it
      removeRecipe(recipeId);
    } else {
      // If not favorite, fetch full details before adding
      try {
        const fullMealData = await getMealDetailsById(recipeId);
        if (fullMealData) {
          // --- FIX: Construct the complete Recipe object correctly ---
          const newFavorite: Recipe = {
            id: fullMealData.idMeal,
            name: fullMealData.strMeal,
            // Correctly map API fields to Recipe interface fields
            category: fullMealData.strCategory || '',      // Use 'category' field
            imageUri: fullMealData.strMealThumb,
            ingredients: parseIngredients(fullMealData), // Parse ingredients
            instructions: fullMealData.strInstructions || '', 
          };
          addRecipe(newFavorite); // Add the complete recipe to context
        } else {
          console.error(`Failed to fetch details for ${recipeId} before favoriting.`);
          // Optionally show an alert
        }
      } catch (error) {
        console.error(`Error fetching details for ${recipeId}:`, error);
        // Optionally show an alert
      }
    }
  };

  const handleOpenRecipe = (recipeId: string) => {
    setSelectedRecipeId(recipeId);
    setIsModalVisible(true);
  };

    // Function to close the modal
    const handleCloseModal = () => {
      setIsModalVisible(false);
      setSelectedRecipeId(null); // Clear selected ID when closing
    };
  

  // Handle Search Input
  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    setSelectedCategory(null); // Clear category selection when searching
    if (query.trim() === "") {
      setIsSearching(false);
      setDisplayedRecipes(initialFeaturedRecipes); // Reset to initial featured
      setLoadingRecipes(false); // No loading needed for reset
      return;
    }
    setIsSearching(true);
    setLoadingRecipes(true);
    try {
      const data = await getMealsByName(query);
      setDisplayedRecipes(data);
    } catch (e) {
      console.error("Failed to search recipes:", e);
      setDisplayedRecipes([]);
    } finally {
      setLoadingRecipes(false);
    }
  }, []);

  // Handle Category Selection
  const handleSelectCategory = useCallback(async (categoryName: string) => {
    setSearchQuery(''); // Clear search query

    if(selectedCategory === categoryName){
      setSelectedCategory(null);
      setIsSearching(false);
      setDisplayedRecipes(initialFeaturedRecipes); // Reset to initial
    } else {
      setSelectedCategory(categoryName);
      setIsSearching(false); // Not technically searching by name
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
  }, [selectedCategory, initialFeaturedRecipes]);


  // Render Category Item
  const renderCategoryItem = ({ item }: { item: any }) => (
    <TouchableOpacity
        style={[styles.categoryChip, {
            backgroundColor: selectedCategory === item.strCategory ? themeColors.primary : themeColors.primaryLight,
            borderColor: selectedCategory === item.strCategory ? themeColors.primary : themeColors.secondary // Adjust border color
        }]}
        onPress={() => handleSelectCategory(item.strCategory)}
    >
      <Text style={[styles.categoryText, { color: selectedCategory === item.strCategory ? themeColors.white : themeColors.primaryDark }]}>{item.strCategory}</Text>
    </TouchableOpacity>
  );

  const getSectionTitle = () => {
      if (searchQuery.trim()) return "Search Results";
      if (selectedCategory) return `Recipes in ${selectedCategory}`;
      return "Featured Recipes";
  }

  return (
    <>
    <ScrollView
        style={[styles.container, { backgroundColor: themeColors.background }]}
        stickyHeaderIndices={[0]} // Make the SearchBar sticky
        keyboardShouldPersistTaps="handled" // Dismiss keyboard on scroll tap
    >
        {/* Search Bar Container */}
        <View style={{ backgroundColor: themeColors.background, paddingBottom: 5 }}>
            <SearchBar
                placeholder="Search for recipes..."
                value={searchQuery}
                onChangeText={handleSearch} 
                platform="default"
                containerStyle={styles.searchBarContainer}
                inputContainerStyle={[styles.searchInputContainer, { backgroundColor: themeColors.primaryLight }]}
                inputStyle={{ color: themeColors.text }}
                placeholderTextColor={themeColors.secondary}
                round
                showLoading={isSearching && loadingRecipes} // Show loading only when actively searching
            />
        </View>

        {/* Categories Section */}
        <View style={styles.sectionContainer}>
            {/* Use SectionTitle component */}
            <SectionTitle>Categories</SectionTitle>
            {loadingCategories ? (
                <ActivityIndicator color={themeColors.primary} style={{ marginVertical: 10 }}/>
            ) : (
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={categories}
                    renderItem={renderCategoryItem}
                    keyExtractor={item => `category-${item.strCategory}`}
                    contentContainerStyle={styles.categoryListContainer}
                    // Use ListEmpty component
                    ListEmptyComponent={<ListEmpty message="No categories found." />}
                />
            )}
        </View>

        {/* Recipes Section */}
        <View style={styles.sectionContainer}>
             {/* Use SectionTitle component */}
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
                            // isFavorite prop removed
                            onPressCard={() => handleOpenRecipe(item.idMeal)}
                            onPressAction={() => handleToggleFavorite(item)}
                            actionIconType="favorite"
                          />
                        );
                    } else { return null; }
                }}
                keyExtractor={(item, index) => {
                    if (loadingRecipes) return `skeleton-${index}`;
                    return item?.idMeal ? `recipe-${item.idMeal}` : `recipe-fallback-${index}`;
                }}
                scrollEnabled={false}
                // Use ListEmpty component
                ListEmptyComponent={
                    !loadingRecipes && displayedRecipes.length === 0 ? (
                        <ListEmpty message="No recipes found." />
                    ) : null
                }
            />
        </View>
    </ScrollView>


      {/* --- Recipe Detail Modal --- */}
      <SimpleModal visible={isModalVisible} onClose={handleCloseModal}>
        {/* Render content only when modal is intended to show a recipe */}
        {selectedRecipeId && <RecipeDetailContent recipeId={selectedRecipeId} />}
      </SimpleModal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Search Bar
  searchBarContainer: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingTop: 10,
    borderBottomWidth: 0,
    borderTopWidth: 0,
  },
  searchInputContainer: {
    borderRadius: 12,
  },
  // Section
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 5, // Space between sections
  },
  // Categories
  categoryListContainer: { paddingVertical: 5, paddingHorizontal: 16 }, // Add padding here

  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'red'
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  }
});