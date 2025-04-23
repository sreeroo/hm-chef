import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useTheme } from '@/context/ThemeContext';
import { getMealDetailsById, parseIngredients } from '@/services/api'; // Use API functions
import { Recipe, Ingredient, useRecipeContext } from '@/context/RecipeContext'; // Import types
import RecipeImage from './RecipeImage';
import SectionTitle from '../UI/SectionTitle';
import ListEmpty from '../UI/ListEmpty';
import { MaterialIcons } from '@expo/vector-icons';

// --- Reusable Ingredient Chip (Copied from previous detail screen) ---
const IngredientItem: React.FC<{ item: Ingredient }> = ({ item }) => {
    const { themeColors } = useTheme();
    return (
        <View style={[styles.ingredientChip, { backgroundColor: themeColors.primaryLight }]}>
            <Text style={[styles.ingredientName, { color: themeColors.primaryDark }]}>{item.name}</Text>
            {item.measure && (
                <Text style={[styles.ingredientMeasure, { color: themeColors.secondary }]}>{item.measure}</Text>
            )}
        </View>
    );
};

// Reusable Instruction Step 
const InstructionStep: React.FC<{ text: string; index: number }> = ({ text, index }) => {
    const { themeColors } = useTheme();
    return (
      <View style={styles.instructionStep}>
        <View style={[styles.stepNumber, { backgroundColor: themeColors.primary }]}>
          <Text style={[styles.stepNumberText, { color: themeColors.white }]}>{index + 1}</Text>
        </View>
        <Text style={[styles.instructionsText, { color: themeColors.text }]}>
          {text}
        </Text>
      </View>
    );
  };


interface RecipeDetailContentProps {
  recipeId: string | null; // ID passed from parent screen
}

const RecipeDetailContent: React.FC<RecipeDetailContentProps> = ({ recipeId }) => {
  const { themeColors } = useTheme();

  const { getRecipeById } = useRecipeContext();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!recipeId) {
        setError("No recipe selected.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setRecipe(null); // Clear previous recipe
      // --- Step 1: Try getting from Context first ---
      const recipeFromContext = getRecipeById(recipeId);

      if (recipeFromContext) {
        // Found in context (likely a favorite or locally created)
        // Ensure it has necessary fields, even if empty arrays/strings
        setRecipe({
            ...recipeFromContext,
            ingredients: recipeFromContext.ingredients || [], // Default to empty array if missing
            instructions: recipeFromContext.instructions || '', // Default to empty string if missing
        });
        setLoading(false);
      } else {
        // --- Step 2: Not in context, try fetching from API ---
        try {
          const mealData = await getMealDetailsById(recipeId);
          if (mealData) {
            const fetchedRecipe: Recipe = {
              id: mealData.idMeal,
              name: mealData.strMeal,
              category: mealData.strCategory || '', // Use category from API
              imageUri: mealData.strMealThumb,
              ingredients: parseIngredients(mealData),
              instructions: mealData.strInstructions || '', // Use instructions from API
            };
            setRecipe(fetchedRecipe);
          } else {
            setError("Recipe details not found.");
          }
        } catch (e) {
          console.error("Failed to fetch recipe details:", e);
          setError("Could not load recipe details.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDetails();
  }, [recipeId, getRecipeById]); // Re-fetch when recipeId changes

  // --- Loading State ---
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={themeColors.primary} />
        <Text style={{ marginTop: 10, color: themeColors.secondary }}>Loading Recipe...</Text>
      </View>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <View style={styles.centered}>
         <MaterialIcons name="error-outline" size={40} color={themeColors.secondary} style={{ marginBottom: 10 }}/>
        <Text style={{ color: themeColors.secondary, textAlign: 'center' }}>{error}</Text>
      </View>
    );
  }

  // --- No Recipe Data State ---
  if (!recipe) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: themeColors.secondary }}>Recipe data unavailable.</Text>
      </View>
    );
  }

  // --- Prepare Instructions ---
  const instructionSteps = (recipe.instructions || '')
    .split('\n')
    .map(step => step.trim())
    .filter(step => step !== '');

  const hasIngredients = recipe.ingredients && recipe.ingredients.length > 0;

  // --- Render Recipe Details ---
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Image */}
      <RecipeImage uri={recipe.imageUri} height={200} />

      {/* Title */}
      <Text style={[styles.title, { color: themeColors.primaryDark }]}>{recipe.name}</Text>

      {/* Category */}
      <View style={styles.categoryContainer}>
        <MaterialIcons name="category" size={16} color={themeColors.secondary} />
        <Text style={[styles.category, { color: themeColors.secondary }]}>
          {recipe.category || 'Uncategorized'}
        </Text>
      </View>

      {/* Ingredients Section */}
      <View style={styles.section}>
        {hasIngredients && (
          <>
          <SectionTitle>Ingredients</SectionTitle>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={recipe.ingredients}
            renderItem={({ item }) => <IngredientItem item={item} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.ingredientsListContainer}
          />
        </>
      )}
      </View>

      {/* Instructions Section */}
      <View style={styles.section}>
        <SectionTitle>Instructions</SectionTitle>
        {instructionSteps.length > 0 ? (
          instructionSteps.map((step, index) => (
            <InstructionStep key={`step-${index}`} text={step} index={index} />
          ))
        ) : (
          <ListEmpty message="No instructions provided." />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centered: { // For loading/error states
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    minHeight: 200, // Ensure it takes some space
  },
  title: {
    fontSize: 24, // Slightly smaller for modal
    fontWeight: 'bold',
    marginTop: 15, // Space after image
    marginBottom: 5,
    textAlign: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    opacity: 0.8,
  },
  category: {
    fontSize: 14, // Smaller category text
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 5,
  },
  section: {
    marginBottom: 25,
  },
  ingredientsListContainer: {
    paddingVertical: 5,
  },
  ingredientChip: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 18,
    marginRight: 10,
    minWidth: 90,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  ingredientName: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  ingredientMeasure: {
    fontSize: 12,
    marginTop: 3,
    textAlign: 'center',
  },
  instructionStep: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 24, // Smaller step number
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 14, // Smaller text
    fontWeight: 'bold',
  },
  instructionsText: {
    fontSize: 15, // Slightly smaller instructions
    lineHeight: 22, // Adjust line height
    flex: 1,
  },
});

export default RecipeDetailContent;