import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface Ingredient {
    id: string;
    name: string;
    measure: string;
  }

export interface Recipe {
  id: string; 
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string;
  imageUri: string | null; 
  isFavorite: boolean;
}

// Interface for recipes and its functions
interface RecipeContextType {
  recipes: Recipe[];
  addRecipe: (recipe: Omit<Recipe, 'id'>) => void; 
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

// Recipe Provider component
export const RecipeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const addRecipe = (newRecipeData: Omit<Recipe, 'id'>) => {
    const newRecipe: Recipe = {
      ...newRecipeData,
      id: Date.now().toString(), // Simple unique ID using timestamp
    };
    setRecipes(prevRecipes => [...prevRecipes, newRecipe]);
  };

  return (
    <RecipeContext.Provider value={{ recipes, addRecipe }}>
      {children}
    </RecipeContext.Provider>
  );
};

// Custom hook to use the Recipe context
export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
};