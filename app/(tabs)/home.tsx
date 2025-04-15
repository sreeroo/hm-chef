import React from 'react';
import { StyleSheet, Image, View, Text } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { router } from 'expo-router';
import WelcomeCard from '@/components/Card';

export default function HomeScreen() {
  const { themeColors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Chef Image */}
      <View style={styles.chefContainer}>
        <Image 
          source={require('@/assets/images/chef1.jpg')}
          style={[styles.chefImage, { borderColor: themeColors.primary }]}
        />
      </View>

      {/* Welcome Section */}
      <WelcomeCard
        title="Welcome to HM Chef!"
        description="Discover delicious recipes and bring out the chef in you. Let's make cooking fun and easy!"
        buttonText="Explore Recipes"
        onPress={() => router.navigate('/search')}
        style={{ backgroundColor: themeColors.primaryLight }}
        titleStyle={{ color: themeColors.primaryDark }}
        descriptionStyle={{ color: themeColors.text }}
        buttonStyle={{ backgroundColor: themeColors.primary }}
        buttonTextStyle={{ color: themeColors.white }}
      />

      {/* Quote Section */}
      <View style={[styles.quoteContainer, { backgroundColor: themeColors.primaryLight, borderLeftColor: themeColors.primary }]}>
        <Text style={[styles.quote, { color: themeColors.text }]}>
          "The only thing I like better than talking about food is eating.”
        </Text>
        <Text style={[styles.author, { color: themeColors.secondary }]}>- John Walters</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  chefContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  chefImage: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 6,
  },
  quoteContainer: {
    padding: 20,
    borderLeftWidth: 6,
    borderRadius: 15,
  },
  quote: {
    fontStyle: 'italic',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
  author: {
    fontSize: 16,
    textAlign: 'right',
  },
});