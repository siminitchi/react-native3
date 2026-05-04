import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { getMealById, extractIngredients } from '../../api/mealdb';

// Detalii pentru o rețetă din TheMealDB (rută dinamică)
export default function RecipeDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMealById(id);
        setMeal(data);
      } catch (e) {
        console.warn(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#e2725b" />
      </View>
    );
  }

  if (!meal) {
    return (
      <View style={styles.center}>
        <Text>Rețeta nu a fost găsită.</Text>
      </View>
    );
  }

  const ingredients = extractIngredients(meal);

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: meal.strMeal }} />
      <Image source={{ uri: meal.strMealThumb }} style={styles.hero} />
      <View style={styles.body}>
        <Text style={styles.title}>{meal.strMeal}</Text>
        <Text style={styles.meta}>
          {meal.strCategory} · {meal.strArea}
        </Text>

        <Text style={styles.section}>Ingrediente</Text>
        {ingredients.map((ing, idx) => (
          <View key={idx} style={styles.ingRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.ingText}>
              <Text style={{ fontWeight: '700' }}>{ing.measure}</Text>
              {ing.measure ? ' ' : ''}
              {ing.name}
            </Text>
          </View>
        ))}

        <Text style={styles.section}>Instrucțiuni</Text>
        <Text style={styles.body2}>{meal.strInstructions}</Text>

        {meal.strYoutube ? (
          <Text style={styles.link}>YouTube: {meal.strYoutube}</Text>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  hero: { width: '100%', height: 240 },
  body: { padding: 16 },
  title: { fontSize: 22, fontWeight: '800', color: '#222' },
  meta: { color: '#888', marginTop: 4 },
  section: { fontSize: 17, fontWeight: '700', marginTop: 18, marginBottom: 8, color: '#e2725b' },
  ingRow: { flexDirection: 'row', marginBottom: 4 },
  bullet: { width: 16, color: '#e2725b' },
  ingText: { flex: 1, color: '#333' },
  body2: { lineHeight: 22, color: '#333' },
  link: { marginTop: 16, color: '#2a9d8f' },
});
