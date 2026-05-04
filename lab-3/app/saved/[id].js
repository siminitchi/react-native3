import { useCallback, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getRecipeById, deleteRecipe } from '../../database/db';

// Detalii pentru o rețetă salvată în SQLite
export default function SavedRecipeScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const row = await getRecipeById(Number(id));
          setRecipe(row);
        } catch (e) {
          console.warn(e);
        } finally {
          setLoading(false);
        }
      })();
    }, [id])
  );

  const handleDelete = () => {
    Alert.alert('Ștergere rețetă', `Ștergi "${recipe?.name}"?`, [
      { text: 'Anulează', style: 'cancel' },
      {
        text: 'Șterge',
        style: 'destructive',
        onPress: async () => {
          await deleteRecipe(Number(id));
          router.back();
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#e2725b" />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.center}>
        <Text>Rețeta nu a fost găsită.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: recipe.name }} />
      {recipe.image ? (
        <Image source={{ uri: recipe.image }} style={styles.hero} />
      ) : (
        <View style={[styles.hero, styles.heroPlaceholder]}>
          <Ionicons name="restaurant" size={60} color="#bbb" />
        </View>
      )}
      <View style={styles.body}>
        <Text style={styles.title}>{recipe.name}</Text>

        <Text style={styles.section}>Ingrediente</Text>
        <Text style={styles.text}>{recipe.ingredients}</Text>

        <Text style={styles.section}>Instrucțiuni</Text>
        <Text style={styles.text}>{recipe.instructions}</Text>

        <Pressable style={styles.deleteBtn} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={18} color="#fff" />
          <Text style={styles.deleteBtnText}>Șterge rețeta</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  hero: { width: '100%', height: 240, backgroundColor: '#eee' },
  heroPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  body: { padding: 16 },
  title: { fontSize: 22, fontWeight: '800', color: '#222' },
  section: { fontSize: 17, fontWeight: '700', marginTop: 18, marginBottom: 6, color: '#e2725b' },
  text: { lineHeight: 22, color: '#333' },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c0392b',
    padding: 12,
    borderRadius: 10,
    marginTop: 24,
    gap: 8,
  },
  deleteBtnText: { color: '#fff', fontWeight: '700' },
});
