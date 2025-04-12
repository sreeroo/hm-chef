import React from 'react';
import { StyleSheet, ImageBackground, Image, View as RNView, ScrollView, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';

export default function HomeScreen() {
  return (
    <View style={styles.scrollContainer}>
      <ImageBackground 
        source={require('@/assets/images/chef1.jpg')}
        style={styles.hero}
        imageStyle={{ opacity: 1 }}
        blurRadius={1}
      >
        <Text style={styles.heroTitle}>Crazy HM Recipes</Text>
        <Text style={styles.heroSubtitle}>Unlock Culinary Magic at Home</Text>
      </ImageBackground>

      <View style={styles.container}>
        <Text style={styles.sectionTitle}>✨ Featured Recipe</Text>
        <View style={styles.card}>
          <Image 
            source={require('@/assets/images/chicken_with_cheese.jpg')}
            style={styles.cardImage}
          />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Creamy Tuscan Chicken</Text>
            <Text style={styles.cardDescription}>
              Juicy chicken in a creamy garlic parmesan sauce with sun-dried tomatoes and spinach.
            </Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Cook This</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.quoteContainer}>
          <Text style={styles.quote}>
            "The only thing I like better than talking about food is eating.”
          </Text>
          <Text style={styles.author}>- John Walters</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#fffaf5',
  },
  hero: {
    height: 260,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#ffefd5',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5e3c00',
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#5e3c00',
    marginTop: 8,
    textAlign: 'center',
  },
  container: {
    padding: 20,
    gap: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: 180,
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#402b00',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#ffa500',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fffaf5',
    fontWeight: 'bold',
    fontSize: 14,
  },
  quoteContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff8ec',
    borderLeftWidth: 4,
    borderLeftColor: '#ffa500',
    borderRadius: 10,
  },
  quote: {
    fontStyle: 'italic',
    fontSize: 16,
    color: '#4a3b28',
  },
  author: {
    fontSize: 14,
    color: '#7a5c3b',
    marginTop: 8,
    textAlign: 'right',
  },
});
