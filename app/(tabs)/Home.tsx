import React from 'react';
import { StyleSheet, Image, ScrollView } from 'react-native'; 
import { useTheme } from '@/context/ThemeContext';
import { View, Text } from '@/components/Themed';
import { router } from 'expo-router';
import WelcomeCard from '@/components/Cards/WelcomeCard'; 

export default function HomeScreen() {
  const { themeColors } = useTheme();

  return (
    <ScrollView
        style={[styles.scrollView, { backgroundColor: themeColors.background }]}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
    >
      {/* Chef Image */}
      <View style={styles.chefContainer}>
        <Image
          source={require('@/assets/images/chef1.jpg')}
          style={[styles.chefImage, { borderColor: themeColors.primary }]}
          resizeMode="cover" // Ensure image covers the area
        />
      </View>

      {/* Welcome Section */}
      <WelcomeCard
        title="Welcome to HM Chef!"
        description="Discover delicious recipes and bring out the chef in you. Let's make cooking fun and easy!"
        buttonText="Explore Recipes"
        onPress={() => router.navigate('/Search')}
        style={{ backgroundColor: themeColors.primaryLight, marginHorizontal: 0 }}
      />

      {/* Quote Section */}
      <View style={[
          styles.quoteCard, // Use a card-like style
          {
              backgroundColor: themeColors.primaryLight,
              borderLeftColor: themeColors.primary,
              shadowColor: themeColors.shadowColor || '#000',
          }
      ]}>
        <Text style={[styles.quote, { color: themeColors.text }]}>
          "The only thing I like better than talking about food is eating.”
        </Text>
        <Text style={[styles.author, { color: themeColors.secondary }]}>- John Walters</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center', 
  },
  chefContainer: {
    alignItems: 'center',
    marginBottom: 30, // Increased space below image
  },
  chefImage: {
    width: 200, // smaller image
    height: 200,
    borderRadius: 100,
    borderWidth: 6,
  },
  
  quoteCard: { // quote section like a card
    width: '100%', 
    padding: 20,
    borderLeftWidth: 6,
    borderRadius: 15, 
    marginBottom: 20, 
    // Shadow/Elevation
    elevation: 3,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quote: {
    fontStyle: 'italic',
    fontSize: 18, 
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 24,
  },
  author: {
    fontSize: 14, 
    textAlign: 'right',
    opacity: 0.8,
  },
});