import React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Chef Image */}
      <View style={styles.chefContainer}>
        <Image 
          source={require('@/assets/images/chef1.jpg')}
          style={styles.chefImage}
        />
      </View>

      {/* Welcome Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Welcome to HM Chef!</Text>
        <Text style={styles.cardDescription}>
          Discover delicious recipes and bring out the chef in you. Let's make cooking fun and easy!
        </Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Explore Recipes</Text>
        </TouchableOpacity>
      </View>

      {/* Quote Section */}
      <View style={styles.quoteContainer}>
        <Text style={styles.quote}>
          "The only thing I like better than talking about food is eating.”
        </Text>
        <Text style={styles.author}>- John Walters</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background, 
    padding: 20,
    justifyContent: 'space-between',
  },
  chefContainer: {
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    marginBottom: 20,
  },
  chefImage: {
    width: 250, 
    height: 250,
    borderRadius: 125, 
    borderWidth: 6,
    borderColor: Colors.light.primary, 
  },
  card: {
    backgroundColor: Colors.light.primaryLight,
    borderRadius: 20,
    padding: 30, 
    alignItems: 'center',
    shadowColor: Colors.light.black, 
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 26, 
    fontWeight: 'bold',
    color: Colors.light.primaryDark, 
    marginBottom: 15,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.light.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
  quoteContainer: {
    padding: 20,
    backgroundColor: Colors.light.primaryLight,
    borderLeftWidth: 6,
    borderLeftColor: Colors.light.primary,
    borderRadius: 15,
  },
  quote: {
    fontStyle: 'italic',
    fontSize: 20, 
    color: Colors.light.primaryDark,
    textAlign: 'center',
    marginBottom: 10,
  },
  author: {
    fontSize: 16, 
    color: Colors.light.secondary, 
    textAlign: 'right',
  },
});