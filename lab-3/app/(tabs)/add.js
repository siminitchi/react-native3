import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { insertRecipe } from '../../database/db';

export default function AddRecipeScreen() {
  const router = useRouter();

  // Componente controlate (controlled components)
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [image, setImage] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [saving, setSaving] = useState(false);

  // Selectează imagine din galerie
  const pickFromGallery = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permisiune refuzată', 'Avem nevoie de acces la galerie.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!res.canceled && res.assets?.length) {
      setImage(res.assets[0].uri);
    }
  };

  // Folosește un URL extern ca imagine
  const useUrl = () => {
    if (!imageUrlInput.trim()) return;
    setImage(imageUrlInput.trim());
  };

  // Validări simple înainte de salvare
  const validate = () => {
    if (!name.trim()) return 'Numele rețetei este obligatoriu.';
    if (name.trim().length < 3) return 'Numele trebuie să aibă cel puțin 3 caractere.';
    if (!ingredients.trim()) return 'Ingredientele sunt obligatorii.';
    if (!instructions.trim()) return 'Instrucțiunile sunt obligatorii.';
    if (instructions.trim().length < 10)
      return 'Instrucțiunile trebuie să fie mai detaliate (min. 10 caractere).';
    return null;
  };

  const handleSave = async () => {
    const err = validate();
    if (err) {
      Alert.alert('Date incomplete', err);
      return;
    }
    setSaving(true);
    try {
      await insertRecipe({
        name: name.trim(),
        ingredients: ingredients.trim(),
        instructions: instructions.trim(),
        image: image || null,
      });
      Alert.alert('Succes', 'Rețeta a fost salvată!', [
        {
          text: 'OK',
          onPress: () => {
            // Resetează formularul și navighează la lista de rețete salvate
            setName('');
            setIngredients('');
            setInstructions('');
            setImage('');
            setImageUrlInput('');
            router.push('/saved');
          },
        },
      ]);
    } catch (e) {
      Alert.alert('Eroare', e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Numele rețetei *</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Ex: Spaghete carbonara"
      />

      <Text style={styles.label}>Ingrediente *</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        value={ingredients}
        onChangeText={setIngredients}
        placeholder="Câte un ingredient pe rând: ex 200g spaghete..."
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Instrucțiuni *</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        value={instructions}
        onChangeText={setInstructions}
        placeholder="Pas 1, pas 2..."
        multiline
        numberOfLines={6}
      />

      <Text style={styles.label}>Imagine</Text>
      <View style={styles.imageRow}>
        <Pressable style={styles.smallBtn} onPress={pickFromGallery}>
          <Text style={styles.smallBtnText}>Din galerie</Text>
        </Pressable>
      </View>
      <View style={styles.imageRow}>
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 8 }]}
          value={imageUrlInput}
          onChangeText={setImageUrlInput}
          placeholder="...sau introdu un URL"
          autoCapitalize="none"
        />
        <Pressable style={styles.smallBtn} onPress={useUrl}>
          <Text style={styles.smallBtnText}>Folosește</Text>
        </Pressable>
      </View>

      {image ? (
        <Image source={{ uri: image }} style={styles.preview} resizeMode="cover" />
      ) : null}

      <Pressable
        style={[styles.saveBtn, saving && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.saveBtnText}>{saving ? 'Se salvează...' : 'Salvează rețeta'}</Text>
      </Pressable>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fafafa' },
  label: { fontWeight: '700', marginTop: 12, marginBottom: 6, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  textarea: { minHeight: 90, textAlignVertical: 'top' },
  imageRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  smallBtn: {
    backgroundColor: '#e2725b',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  smallBtnText: { color: '#fff', fontWeight: '700' },
  preview: { width: '100%', height: 200, borderRadius: 10, marginTop: 12 },
  saveBtn: {
    backgroundColor: '#2a9d8f',
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
