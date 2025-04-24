import { Ingredient } from "@/context/RecipeContext";

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export async function getMealsByName(name: string) {
  const res = await fetch(`${BASE_URL}/search.php?s=${name}`);
  if (!res.ok) throw new Error('Failed to fetch meals by name');
  const data = await res.json();
  return data.meals || [];
}

export async function getMealsByCategory(category: string) {
  const res = await fetch(`${BASE_URL}/filter.php?c=${category}`);
  if (!res.ok) throw new Error('Failed to fetch meals by category');
  const data = await res.json();
  return data.meals || [];
}

export async function getRandomMeals(count: number = 10) {
  try {
    const promises = Array.from({ length: count }, () =>
      fetch(`${BASE_URL}/random.php`).then(res => {
        if (!res.ok) throw new Error(`Random meal fetch failed with status: ${res.status}`);
        return res.json();
      })
    );

    const result = await Promise.all(promises) // wait for all promises to settle

    const uniqueMealsMap = new Map<string, any>();
    const seenIds = new Set<string>(); // to track unique IDs

    result.forEach(recipe => {
      const meal = recipe?.meals?.[0];
      
      if (meal && meal.idMeal){
        if (!seenIds.has(meal.idMeal)) {
          uniqueMealsMap.set(meal.idMeal, meal);
          seenIds.add(meal.idMeal);
        }
      }
    });
    const uniqueData = Array.from(uniqueMealsMap.values());
    return uniqueData;
  } catch (error) {
    console.error("Error fetching random meals:", error);
    return []; // Return empty array on error
  }
}

//  get categories
export async function getCategories() {
  const res = await fetch(`${BASE_URL}/list.php?c=list`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  const data = await res.json();
  return data.meals || []; // The API returns categories under the 'meals' key
}

export async function getMealDetailsById(id: string) {
    const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
    if (!res.ok) throw new Error('Failed to fetch meal details');
    const data = await res.json();
    return data.meals ? data.meals[0] : null;
}

export const parseIngredients = (mealData: any): Ingredient[] => {
  const ingredients: Ingredient[] = [];
  for (let i = 1; i <= 20; i++) {
      const ingredient = mealData[`strIngredient${i}`];
      const measure = mealData[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== '') {
          ingredients.push({
              id: `ing-${i}`, // Simple ID for the list key
              name: ingredient,
              measure: measure || '',
          });
      } else {
          break; // Stop if no more ingredients
      }
  }
  return ingredients;
};
