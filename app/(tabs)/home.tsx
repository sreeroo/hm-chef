import React from 'react';
import { StyleSheet, Image, View, Text, ScrollView } from 'react-native'; // Import ScrollView
import { useTheme } from '@/context/ThemeContext';
import { router } from 'expo-router';
import WelcomeCard from '@/components/Cards/WelcomeCard'; // Import the new WelcomeCard

export default function HomeScreen() {
  const { themeColors } = useTheme();

  return (
    // Use ScrollView to prevent content overflow on smaller screens
    <ScrollView
        style={[styles.scrollView, { backgroundColor: themeColors.background }]}
        contentContainerStyle={styles.container} // Apply padding etc. here
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

      {/* Welcome Section - Use the new component */}
      <WelcomeCard
        title="Welcome to HM Chef!"
        description="Discover delicious recipes and bring out the chef in you. Let's make cooking fun and easy!"
        buttonText="Explore Recipes"
        onPress={() => router.navigate('/search')} // Use navigate for tab switching
        style={{ backgroundColor: themeColors.primaryLight, marginHorizontal: 0 }} // Remove horizontal margin if container has padding
        // Pass theme colors explicitly if needed, or rely on defaults in WelcomeCard
        // titleStyle={{ color: themeColors.primaryDark }}
        // descriptionStyle={{ color: themeColors.text }}
        // buttonStyle={{ backgroundColor: themeColors.primary }}
        // buttonTextStyle={{ color: themeColors.white }}
      />

      {/* Quote Section */}
      {/* Wrap in a generic View, apply styling directly */}
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
    // Use padding for overall spacing, remove justifyContent
    padding: 20,
    paddingBottom: 40, // Ensure space at the bottom
    alignItems: 'center', // Center items horizontally
  },
  chefContainer: {
    alignItems: 'center',
    marginBottom: 30, // Increased space below image
  },
  chefImage: {
    width: 200, // Slightly smaller image
    height: 200,
    borderRadius: 100, // Keep it circular
    borderWidth: 6,
  },
  // Styles for WelcomeCard are now mostly within its own component
  quoteCard: { // Style the quote section like a card
    width: '100%', // Take full width within padding
    padding: 20,
    borderLeftWidth: 6,
    borderRadius: 15, // Consistent border radius
    marginBottom: 20, // Consistent margin
    // Shadow/Elevation
    elevation: 3,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quote: {
    fontStyle: 'italic',
    fontSize: 18, // Slightly smaller quote
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 24,
  },
  author: {
    fontSize: 14, // Smaller author text
    textAlign: 'right',
    opacity: 0.8,
  },
});