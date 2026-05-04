// Wrapper peste API-ul public TheMealDB
// Documentație: https://www.themealdb.com/api.php
const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

// Caută rețete după nume
export const searchMealsByName = async (query) => {
  const res = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`);
  const json = await res.json();
  return json.meals || [];
};

// Listează rețete dintr-o categorie (ex: "Seafood", "Beef", "Dessert")
export const getMealsByCategory = async (category) => {
  const res = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
  const json = await res.json();
  return json.meals || [];
};

// Detalii pentru o rețetă specifică
export const getMealById = async (id) => {
  const res = await fetch(`${BASE_URL}/lookup.php?i=${encodeURIComponent(id)}`);
  const json = await res.json();
  return json.meals ? json.meals[0] : null;
};

// Listează categoriile disponibile
export const getCategories = async () => {
  const res = await fetch(`${BASE_URL}/categories.php`);
  const json = await res.json();
  return json.categories || [];
};

// Helper - extrage perechile (ingredient, cantitate) dintr-un obiect Meal
export const extractIngredients = (meal) => {
  const items = [];
  for (let i = 1; i <= 20; i++) {
    const name = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (name && name.trim()) {
      items.push({ name: name.trim(), measure: (measure || '').trim() });
    }
  }
  return items;
};
