import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { initDatabase } from '../database/db';

// Navigatorul rădăcină = Stack
// Tab-urile sunt definite în (tabs)/_layout.js (al 2-lea navigator)
export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await initDatabase();
      } catch (e) {
        console.warn('DB init failed', e);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  if (!ready) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#e2725b" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#e2725b' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
        // Pe iOS ascundem textul "(tabs)" de langa sageata back
        headerBackTitle: 'Înapoi',
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="recipe/[id]" options={{ title: 'Detalii rețetă' }} />
      <Stack.Screen name="saved/[id]" options={{ title: 'Rețeta mea' }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});