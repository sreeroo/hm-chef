import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/context/ThemeContext';
import { useRecipeContext, Recipe } from '@/context/RecipeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useNavigation, useFocusEffect } from 'expo-router';

export default function CreateRecipeScreen() {
  const { themeColors } = useTheme();
  const { addRecipe, getRecipeById } = useRecipeContext();
  const router = useRouter();
  const navigation = useNavigation();

  // Form state
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [category, setCategory] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);


  // Reset form function that can be called from multiple places
  const resetForm = useCallback(() => {
    setName('');
    setCategory('');
    setInstructions('');
    setImageUri(null);
  }, []);
  

  // Pick image - fixed with error handling
  const pickImage = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
          return;
        }
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Could not open image picker. Please try again.');
    }
  };

  // Save or update recipe
  const handleSaveRecipe = () => {
    if (!name.trim() || !category.trim() || !imageUri) {
      Alert.alert('Missing Information', 'Please fill in name, category, and select an image.');
      return;
    }
    
    const recipeData: Recipe = {
      id: `custom-${Date.now()}`,
      name,
      category,
      instructions,
      imageUri,
      ingredients: [],
    };
    
      addRecipe(recipeData);
      resetForm();
      Alert.alert('Success', 'Recipe saved successfully!');
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: themeColors.background }]}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      {/* Image Picker */}
      <TouchableOpacity 
        style={styles.imagePicker} 
        onPress={pickImage}
        activeOpacity={0.7}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} contentFit="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <MaterialIcons name="add-photo-alternate" size={50} color={themeColors.secondary} />
            <Text style={[styles.imagePickerText, { color: themeColors.secondary }]}>
              Tap to select image
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Name Input */}
      <TextInput
        style={[styles.input, {
          backgroundColor: themeColors.primaryLight,
          color: themeColors.text,
          borderColor: themeColors.secondary
        }]}
        placeholder="Recipe Name"
        placeholderTextColor={themeColors.secondary}
        value={name}
        onChangeText={setName}
      />

      {/* Category Input */}
      <TextInput
        style={[styles.input, {
          backgroundColor: themeColors.primaryLight,
          color: themeColors.text,
          borderColor: themeColors.secondary
        }]}
        placeholder="Category"
        placeholderTextColor={themeColors.secondary}
        value={category}
        onChangeText={setCategory}
      />

      {/* Description Input */}
      <TextInput
        style={[styles.input, styles.textArea, {
          backgroundColor: themeColors.primaryLight,
          color: themeColors.text,
          borderColor: themeColors.secondary
        }]}
        placeholder="Instructions / Notes"
        placeholderTextColor={themeColors.secondary}
        value={instructions}
        onChangeText={setInstructions}
        multiline
        numberOfLines={4}
      />

      {/* Save/Update Button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: themeColors.primary }]}
        onPress={handleSaveRecipe}
        activeOpacity={0.8}
      >
        <Text style={[styles.buttonText, { color: themeColors.white }]}>
          Save Recipe
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { padding: 20, alignItems: 'center' },
  imagePicker: {
    width: '100%', height: 200, borderRadius: 15, borderWidth: 2,
    borderStyle: 'dashed', borderColor: '#ccc', justifyContent: 'center',
    alignItems: 'center', marginBottom: 20, backgroundColor: '#f0f0f0',
    overflow: 'hidden',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent'
  },
  imagePreview: { width: '100%', height: '100%' },
  imagePickerText: { fontSize: 16, marginTop: 10 },
  input: {
    width: '100%', borderWidth: 1, borderRadius: 10, paddingHorizontal: 15,
    paddingVertical: 12, fontSize: 16, marginBottom: 15,
  },
  textArea: { height: 120, textAlignVertical: 'top' },
  button: {
    width: '100%', paddingVertical: 15, borderRadius: 10,
    alignItems: 'center', marginTop: 10,
  },
  buttonText: { fontSize: 18, fontWeight: 'bold' },
});