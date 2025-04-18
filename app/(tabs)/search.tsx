import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { SearchBar } from '@rneui/themed';
import { useTheme } from '@/context/ThemeContext';
import { getMealsByName, getRandomMeals, getCategories, getMealsByCategory } from '@/services/api';
import RecipeCardSkeleton from '@/components/RecipeCardSkeleton'; // Import the skeleton

const { width } = Dimensions.get('window');

export default function SearchScreen() {
  const { themeColors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedRecipes, setDisplayedRecipes] = useState<any[]>([]); // Recipes shown (featured, search, or category)
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [isSearching, setIsSearching] = useState(false); // To differentiate between initial load and search load
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch initial featured recipes and categories
  useEffect(() => {
    let isMounted = true;
    setLoadingRecipes(true);
    setLoadingCategories(true);

    Promise.all([getRandomMeals(5), getCategories()])
      .then(([featuredData, categoryData]) => {
        if (isMounted) {
          setDisplayedRecipes(featuredData); // Show featured initially
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

  // Handle Search Input
  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    setSelectedCategory(null); // Clear category selection when searching
    if (query.trim() === "") {
      setIsSearching(false);
      setLoadingRecipes(true);
      // Optionally, reload featured recipes or show nothing
      getRandomMeals(5).then(data => setDisplayedRecipes(data)).finally(() => setLoadingRecipes(false));
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

    if(selectedCategory && selectedCategory == categoryName){
      setSelectedCategory(null);
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
  }, []);

  // Render Recipe Item (used for featured and results)
  const renderRecipeItem = ({ item, horizontal = false }: { item: any, horizontal?: boolean }) => (
    <TouchableOpacity style={[horizontal ? styles.featuredCard : styles.searchCard, { backgroundColor: themeColors.primaryLight }]}>
      <Image source={{ uri: item.strMealThumb }} style={horizontal ? styles.featuredImage : styles.searchImage} />
      <View style={horizontal ? styles.featuredCardContent : styles.searchCardContent}>
        <Text style={[horizontal ? styles.featuredTitle : styles.searchTitle, { color: themeColors.primaryDark }]} numberOfLines={horizontal ? 1 : 2}>{item.strMeal}</Text>
        {!horizontal && item.strCategory && ( // Show category only in vertical list
          <Text style={[styles.searchCategory, { color: themeColors.secondary }]}>{item.strCategory}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  // Render Category Item
  const renderCategoryItem = ({ item }: { item: any }) => (
    <TouchableOpacity
        style={[styles.categoryChip, { backgroundColor: selectedCategory === item.strCategory ? themeColors.primary : themeColors.primaryLight }]}
        onPress={() => handleSelectCategory(item.strCategory)}
    >
      <Text style={[styles.categoryText, { color: selectedCategory === item.strCategory ? themeColors.white : themeColors.primaryDark }]}>{item.strCategory}</Text>
    </TouchableOpacity>
  );

  // Render skeleton loaders
  const renderSkeleton = (horizontal = false) => (
    <RecipeCardSkeleton horizontal={horizontal} />
  );

  const getSectionTitle = () => {
      if (searchQuery.trim()) return "Search Results";
      if (selectedCategory) return `Recipes in ${selectedCategory}`;
      return "Featured Recipes";
  }

  return (
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
            <Text style={[styles.sectionTitle, { color: themeColors.primaryDark }]}>Categories</Text>
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
                    ListEmptyComponent={<Text style={{ color: themeColors.text }}>No categories found.</Text>}
                />
            )}
        </View>

        {/* Recipes Section (Featured/Search/Category Results) */}
        <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: themeColors.primaryDark }]}>{getSectionTitle()}</Text>
            {loadingRecipes ? (
                // Show skeletons based on context (e.g., 1 vertical skeleton)
                <View style={{alignItems: 'center'}}>
                    {Array(2).fill(0).map((_, index) => renderSkeleton(true))}
                </View>
            ) : (
                <FlatList
                    data={displayedRecipes}
                    renderItem={(props) => renderRecipeItem({ ...props, horizontal: false })} // Always vertical here
                    keyExtractor={item => `recipe-${item.idMeal}`}
                    scrollEnabled={false} // Disable scrolling as ScrollView handles it
                    ListEmptyComponent={
                        <Text style={{ color: themeColors.text, textAlign: 'center', marginTop: 20 }}>
                            No recipes found.
                        </Text>
                    }
                />
            )}
        </View>
    </ScrollView>
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
    marginBottom: 15, // Space between sections
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 10,
  },
  // Categories
  categoryListContainer: {
    paddingVertical: 5,
  },
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
  },
  // Featured Card (Horizontal) - for potential future use, 
  featuredCard: {
    borderRadius: 18,
    marginRight: 16,
    width: width * 0.6,
    overflow: 'hidden',
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8,
  },
  featuredImage: {
    width: '100%', height: 120,
  },
  featuredCardContent: {
    padding: 12,
  },
  featuredTitle: {
    fontSize: 16, fontWeight: 'bold',
  },
  // Search/Recipe Card (Vertical)
  searchCard: {
    borderRadius: 18,
    marginBottom: 24,
    overflow: 'hidden',
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8,
  },
  searchImage: {
    width: '100%', height: 200,
  },
  searchCardContent: {
    padding: 16,
  },
  searchTitle: {
    fontSize: 20, fontWeight: 'bold', marginBottom: 6,
  },
  searchCategory: {
    fontSize: 14, fontWeight: '600',
  },
});