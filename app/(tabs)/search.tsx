import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, View } from '@/components/Themed';
import { SearchBar } from '@rneui/themed';
import { useTheme } from '@/context/ThemeContext';
import { getMealsByName, getRandomMeals } from '@/services/api';

export default function SearchScreen() {
  const { themeColors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Show some recipes initially
  useEffect(() => {
    setLoading(true);
    getRandomMeals(8).then(setRecipes).finally(() => setLoading(false));
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setLoading(true);
    if (query.trim() === '') {
      // Show random meals if search is cleared
      getRandomMeals(8).then(setRecipes).finally(() => setLoading(false));
    } else {
      getMealsByName(query).then(setRecipes).finally(() => setLoading(false));
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <SearchBar
        placeholder="Search for recipes..."
        value={searchQuery}
        onChangeText={handleSearch}
        platform="default"
        containerStyle={{
          backgroundColor: 'transparent',
          padding: 0,
        }}
        inputContainerStyle={{
          backgroundColor: themeColors.primaryLight,
          borderRadius: 12,
        }}
        inputStyle={{
          color: themeColors.text,
        }}
        placeholderTextColor={themeColors.secondary}
        round
      />

      {loading ? (
        <ActivityIndicator size="large" color={themeColors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={item => item.idMeal}
          contentContainerStyle={{ paddingVertical: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.card, { backgroundColor: themeColors.primaryLight }]}>
              <Image source={{ uri: item.strMealThumb }} style={styles.image} />
              <View style={styles.cardContent}>
                <Text style={[styles.title, { color: themeColors.primaryDark }]}>{item.strMeal}</Text>
                {item.strCategory && (
                  <Text style={[styles.category, { color: themeColors.secondary }]}>{item.strCategory}</Text>
                )}
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={{ color: themeColors.text, textAlign: 'center', marginTop: 40 }}>
              No recipes found.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 18,
    marginBottom: 24,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  image: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  category: {
    fontSize: 14,
    fontWeight: '600',
  },
});