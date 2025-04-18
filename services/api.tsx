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
    const results = await Promise.all(promises);
    return results.map(r => r.meals && r.meals[0]).filter(Boolean);
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