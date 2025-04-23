import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';



export interface Ingredient {
    id: string;
    name: string;
    measure: string;
  }

export interface Recipe {
  id: string; 
  name: string;
  category: string;
  ingredients?: Ingredient[];
  instructions?: string;
  imageUri: string | null; 
}

// Interface for recipes and its functions
interface RecipeContextType {
  recipes: Recipe[];
  addRecipe: (recipe: Recipe) => void; 
  removeRecipe: (recipeID:string) => void;
  isFavorite: (recipeID:string) => boolean;
  getRecipeById: (recipeId: string) => Recipe | undefined; 
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);
const RECIPES_STORAGE_KEY = '@MyRecipes:key'; // Key for AsyncStorage

// Recipe Provider component
export const RecipeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true); 


useEffect(() => {
    const loadRecipes = async () => {
      try {
        const storedRecipes = await AsyncStorage.getItem(RECIPES_STORAGE_KEY);
        if (storedRecipes !== null) {
          setRecipes(JSON.parse(storedRecipes));
        }
      } catch (e) {
        console.error("Failed to load recipes from storage", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadRecipes();
  }, []);

  // Save recipes to storage whenever they change
useEffect(() => {
    const saveRecipes = async () => {
        // Don't save while initially loading
        if (!isLoading) {
            try {
                await AsyncStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(recipes));
            } catch (e) {
                console.error("Failed to save recipes to storage", e);
            }
        }
    };
    saveRecipes();
  }, [recipes, isLoading]); // Depend on recipes and isLoading


  // Function to add a new recipe (ensuring no duplicates)
  const addRecipe = (newRecipe: Recipe) => {
    setRecipes(prevRecipes => {
      // Check if recipe with the same ID already exists to ensure unique recipes in the list
      if (prevRecipes.some(recipe => recipe.id === newRecipe.id)) {
        return prevRecipes; // Don't add if duplicate
      }
      return [...prevRecipes, newRecipe];
    });
  };

    const removeRecipe = (recipeId: string) => {
        setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== recipeId));
      };
    
  const isFavorite = (recipeId: string): boolean => {
    return recipes.some(recipe => recipe.id === recipeId);
  };

    const getRecipeById = (recipeId: string): Recipe | undefined => {
        return recipes.find(recipe => recipe.id === recipeId);
    };

   // Don't render children until recipes are loaded
   if (isLoading) {
    return null;
}


return (
    <RecipeContext.Provider value={{ recipes, addRecipe, removeRecipe, isFavorite, getRecipeById }}>
      {children}
    </RecipeContext.Provider>
  );
};

// Custom hook to use the Recipe context
export const useRecipeContext = () => {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
};