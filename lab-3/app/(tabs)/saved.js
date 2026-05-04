import { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getAllRecipes, deleteRecipe } from '../../database/db';

export default function SavedRecipesScreen() {
  const router = useRouter();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const rows = await getAllRecipes();
      setRecipes(rows);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  // Reîncarcă lista de fiecare dată când ecranul devine activ
  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const handleDelete = (id, name) => {
    Alert.alert('Ștergere rețetă', `Ștergi "${name}"?`, [
      { text: 'Anulează', style: 'cancel' },
      {
        text: 'Șterge',
        style: 'destructive',
        onPress: async () => {
          await deleteRecipe(id);
          load();
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <Pressable
      style={styles.row}
      onPress={() => router.push(`/saved/${item.id}`)}
    >
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.thumb} />
      ) : (
        <View style={[styles.thumb, styles.thumbPlaceholder]}>
          <Ionicons name="restaurant" size={28} color="#bbb" />
        </View>
      )}
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.title} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {item.ingredients}
        </Text>
      </View>
      <Pressable onPress={() => handleDelete(item.id, item.name)} hitSlop={10}>
        <Ionicons name="trash-outline" size={22} color="#c0392b" />
      </Pressable>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#e2725b" />
      </View>
    );
  }

  if (recipes.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons name="bookmark-outline" size={48} color="#bbb" />
        <Text style={styles.emptyText}>Nu ai salvat încă nicio rețetă.</Text>
        <Pressable style={styles.cta} onPress={() => router.push('/add')}>
          <Text style={styles.ctaText}>Adaugă prima rețetă</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={recipes}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={() => <View style={styles.sep} />}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 12, backgroundColor: '#fafafa' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 1,
  },
  thumb: { width: 64, height: 64, borderRadius: 8, backgroundColor: '#eee' },
  thumbPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  title: { fontWeight: '700', fontSize: 16, color: '#222' },
  subtitle: { fontSize: 13, color: '#666', marginTop: 2 },
  sep: { height: 8 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyText: { color: '#666', marginTop: 10, marginBottom: 16 },
  cta: { backgroundColor: '#e2725b', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 8 },
  ctaText: { color: '#fff', fontWeight: '700' },
});
