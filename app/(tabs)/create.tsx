import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Image } from 'expo-image';
import ImagePicker from 'expo-image-picker';
import { useTheme } from '@/context/ThemeContext';
import { useRecipeContext, Recipe } from '@/context/RecipeContext';
import { MaterialIcons } from '@expo/vector-icons'; 
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function CreateRecipeScreen() {
  const { themeColors } = useTheme();
  // --- Get updateRecipe and getRecipeById ---
  const { addRecipe, updateRecipe, getRecipeById } = useRecipeContext();
  const router = useRouter();
  // --- Get recipeId from params ---
  const params = useLocalSearchParams<{ recipeId?: string }>();
  const editingRecipeId = params.recipeId;
  const isEditing = !!editingRecipeId; // Check if we are in edit mode

  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [category, setCategory] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

    // --- Load recipe data if editing ---
    useEffect(() => {
      if (isEditing && editingRecipeId) {
        const recipeToEdit = getRecipeById(editingRecipeId);
        if (recipeToEdit) {
          setName(recipeToEdit.name);
          setCategory(recipeToEdit.category || '');
          setInstructions(recipeToEdit.instructions || '');
          setImageUri(recipeToEdit.imageUri);
        } else {
          // Handle case where recipe ID is invalid or not found
          Alert.alert("Error", "Could not find the recipe to edit.", [
            { text: "OK", onPress: () => router.back() } // Go back if recipe not found
          ]);
        }
      }
    }, [editingRecipeId, isEditing, getRecipeById, router]); // Add dependencies
    
  // Function to pick an image
  const pickImage = async () => {
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

  // --- handleSaveRecipe for both create and update ---
  const handleSaveRecipe = () => {
    if (!name.trim() || !category.trim() || !imageUri) {
      Alert.alert('Missing Information', 'Please fill in name, category, and select an image.');
      return;
    }

    const recipeData: Recipe = {
      // Use existing ID if editing, generate new one if creating
      id: isEditing && editingRecipeId ? editingRecipeId : `custom-${Date.now().toString()}`,
      name,
      category,
      instructions,
      imageUri,
      // Ensure ingredients is handled if needed, default to empty array if not editing
      ingredients: isEditing ? getRecipeById(editingRecipeId!)?.ingredients || [] : [],
    };

    if (isEditing) {
      updateRecipe(recipeData); // Call update function
      Alert.alert('Success', 'Recipe updated successfully!');
      router.back(); // Go back after updating
    } else {
      addRecipe(recipeData); // Call add function
      // Clear form only when creating new
      setName('');
      setInstructions('');
      setCategory('');
      setImageUri(null);
      Alert.alert('Success', 'Recipe saved successfully!');
      // Optionally navigate away or stay
    }
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
      >
        {/* --- Change button text based on mode --- */}
        <Text style={[styles.buttonText, { color: themeColors.white }]}>
          {isEditing ? 'Update Recipe' : 'Save Recipe'}
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
