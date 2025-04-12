import React from 'react';
import { StyleSheet, Image, View as RNView, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Crazy HM Recipes</Text>
        
          <Image 
            source={require('@/assets/images/chef1.jpg')} 
            style={styles.image}
            resizeMode="contain"
          />

        <Text>Unlock Culinary Magic at Home</Text>
        
        <Text>
          Discover mouthwatering recipes that turn
          everyday ingredients into extraordinary meals!
        </Text>
        
        <Text>
          "The only thing I like better than talking about food is eating.” 
          
        </Text>
        
        <Text>- John Walters </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 250,
    marginBottom: 20,
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '100%',
  },
});