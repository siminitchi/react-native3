import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { searchMealsByName, getMealsByCategory } from '../../api/mealdb';

const CATEGORIES = ['Beef', 'Chicken', 'Dessert', 'Pasta', 'Seafood', 'Vegetarian'];

export default function ExploreScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Chicken');
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);

  // Încarcă rețetele dintr-o categorie la mount sau când se schimbă categoria
  useEffect(() => {
    if (!query) {
      loadCategory(category);
    }
  }, [category]);

  const loadCategory = async (cat) => {
    setLoading(true);
    try {
      const data = await getMealsByCategory(cat);
      setMeals(data);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      loadCategory(category);
      return;
    }
    setLoading(true);
    try {
      const data = await searchMealsByName(query.trim());
      setMeals(data);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/recipe/${item.idMeal}`)}
    >
      <Image source={{ uri: item.strMealThumb }} style={styles.cardImage} />
      <Text style={styles.cardTitle} numberOfLines={2}>
        {item.strMeal}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Caută rețetă (ex: Arrabiata)..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <Pressable style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchBtnText}>Caută</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
      >
        {CATEGORIES.map((c) => (
          <Pressable
            key={c}
            style={[styles.chip, category === c && styles.chipActive]}
            onPress={() => {
              setQuery('');
              setCategory(c);
            }}
          >
            <Text style={[styles.chipText, category === c && styles.chipTextActive]}>
              {c}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator size="large" color="#e2725b" style={{ marginTop: 30 }} />
      ) : meals.length === 0 ? (
        <Text style={styles.empty}>Nicio rețetă găsită.</Text>
      ) : (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.idMeal}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#fafafa' },
  searchRow: { flexDirection: 'row', marginBottom: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  searchBtn: {
    backgroundColor: '#e2725b',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8,
  },
  searchBtnText: { color: '#fff', fontWeight: '700' },
  chipsRow: { paddingVertical: 6, gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#eee',
    marginRight: 8,
  },
  chipActive: { backgroundColor: '#e2725b' },
  chipText: { color: '#444', fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardImage: { width: '100%', height: 130 },
  cardTitle: { padding: 8, fontSize: 14, fontWeight: '600' },
  empty: { textAlign: 'center', marginTop: 30, color: '#666' },
});
