import React from 'react';
import { StyleSheet, Image, TouchableOpacity, useColorScheme } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';

export default function HomeScreen() {
  // Detect the system's color scheme (light or dark)
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;

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
      <View style={[styles.card, { backgroundColor: themeColors.primaryLight, shadowColor: themeColors.black }]}>
        <Text style={[styles.cardTitle, { color: themeColors.primaryDark }]}>Welcome to HM Chef!</Text>
        <Text style={[styles.cardDescription, { color: themeColors.text }]}>
          Discover delicious recipes and bring out the chef in you. Let's make cooking fun and easy!
        </Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: themeColors.primary }]}>
          <Text style={[styles.buttonText, { color: themeColors.white }]}>Explore Recipes</Text>
        </TouchableOpacity>
      </View>

      {/* Quote Section */}
      <View style={[styles.quoteContainer, { backgroundColor: themeColors.primaryLight, borderLeftColor: themeColors.primary }]}>
        <Text style={[styles.quote, { color: themeColors.primaryDark }]}>
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
  card: {
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 18,
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