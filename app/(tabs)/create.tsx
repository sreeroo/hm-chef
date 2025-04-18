import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/context/ThemeContext';
import { useRecipes, Recipe } from '@/context/RecipeContext'; // Import Recipe type
import { MaterialIcons } from '@expo/vector-icons'; // Import icons

export default function CreateRecipeScreen() {
  const { themeColors } = useTheme();
  const { addRecipe } = useRecipes(); // Get the addRecipe function

  const [name, setName] = useState('');
  const [category, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  // Function to pick an image
  const pickImage = async () => {
    // Request permission (important for iOS)
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1, 
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Function to handle saving the recipe
  const handleSaveRecipe = () => {
    if (!name.trim() || !category.trim() || !imageUri) {
      Alert.alert('Missing Information', 'Please fill in the name, description, and select an image.');
      return;
    }
        // Create the recipe object with a unique ID
        const newRecipe = {
          id: `custom-${Date.now().toString()}`, // Generate unique ID for custom recipes
          name,
          category,
          imageUri,
        };

    addRecipe(newRecipe);

    // Clear the form
    setName('');
    setDescription('');
    setImageUri(null);

    Alert.alert('Success', 'Recipe saved successfully!');
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: themeColors.background }]}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      {/* Image Picker */}
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} contentFit="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
             <MaterialIcons name="add-photo-alternate" size={50} color={themeColors.secondary} />
             <Text style={[styles.imagePickerText, { color: themeColors.secondary }]}>Tap to select image</Text>
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

      {/* Description Input */}
      <TextInput
        style={[styles.input, styles.textArea, {
          backgroundColor: themeColors.primaryLight,
          color: themeColors.text,
          borderColor: themeColors.secondary
        }]}
        placeholder="Description / Instructions / Notes"
        placeholderTextColor={themeColors.secondary}
        value={category}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: themeColors.primary }]}
        onPress={handleSaveRecipe}
      >
        <Text style={[styles.buttonText, { color: themeColors.white }]}>Save Recipe</Text>
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
  imagePlaceholder: { // Style for the placeholder content
    alignItems: 'center',
    justifyContent: 'center',
    width:'100%',
    height:'100%',
    backgroundColor:'transparent'
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