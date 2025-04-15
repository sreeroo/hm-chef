const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export async function getMealsByName(name: string) {
  const res = await fetch(`${BASE_URL}/search.php?s=${name}`);
  const data = await res.json();
  return data.meals || [];
}

export async function getMealsByCategory(category: string) {
  const res = await fetch(`${BASE_URL}/filter.php?c=${category}`);
  const data = await res.json();
  return data.meals || [];
}

export async function getRandomMeals(count: number = 10) {
  // The API only provides one random meal per call, so we fetch multiple times
  const promises = Array.from({ length: count }, () =>
    fetch(`${BASE_URL}/random.php`).then(res => res.json())
  );
  const results = await Promise.all(promises);
  // Flatten and filter out nulls
  return results.map(r => r.meals && r.meals[0]).filter(Boolean);
}