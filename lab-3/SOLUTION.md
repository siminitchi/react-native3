# Cook Book — soluție Lab 3 React Native

Aplicație mobilă tip Cook Book construită cu **React Native + Expo + Expo Router + expo-sqlite**, folosind API-ul public **TheMealDB** pentru rețete online și o bază SQLite locală pentru rețetele personale.

## Cum rulezi proiectul

```bash
cd lab-3
npm install
npx expo start
```

Apoi scanează codul QR din Expo Go (Android) sau apasă `i` pentru iOS Simulator.

## Structura proiectului

```
lab-3/
├── app.json                # Config Expo + plugin expo-router & expo-image-picker
├── package.json            # Dependențe
├── babel.config.js
├── api/
│   └── mealdb.js           # Wrapper peste TheMealDB (search, category, lookup)
├── database/
│   └── db.js               # Init SQLite + CRUD pentru tabela "recipes"
└── app/                    # Expo Router (file-based routing)
    ├── _layout.js          # Stack navigator (rădăcină)
    ├── (tabs)/
    │   ├── _layout.js      # Tabs navigator (al 2-lea navigator)
    │   ├── index.js        # Explorare rețete (API)
    │   ├── add.js          # Formular adăugare rețetă
    │   └── saved.js        # Lista rețetelor mele (SQLite)
    ├── recipe/
    │   └── [id].js         # Detalii rețetă din TheMealDB
    └── saved/
        └── [id].js         # Detalii rețetă salvată local
```

## Cum sunt acoperite cerințele

| Cerință | Unde |
|---|---|
| Proiect Expo + React Native | `package.json`, `app.json` |
| Expo Router cu **2 navigatori** | `app/_layout.js` (Stack) + `app/(tabs)/_layout.js` (Tabs) |
| **Minim 2 rute** | `index`, `add`, `saved`, `recipe/[id]`, `saved/[id]` (5 rute) |
| Integrare **TheMealDB** | `api/mealdb.js` + folosit în `index.js` și `recipe/[id].js` |
| Căutare după nume | `index.js` — `searchMealsByName` |
| Listă pe categorie | `index.js` — chip-uri pentru `Beef/Chicken/Dessert/...` |
| Detalii rețetă (ingrediente + cantități + instrucțiuni + imagine) | `recipe/[id].js` cu `extractIngredients` |
| Formular **controlat** pentru rețetă nouă | `add.js` — toate câmpurile sunt `useState` controlate |
| Imagine din galerie sau URL | `add.js` — `expo-image-picker` + input URL |
| Validări | `add.js` — funcția `validate()` |
| Persistență permanentă cu **expo-sqlite** | `database/db.js` — `initDatabase`, `insertRecipe`, `getAllRecipes`, `getRecipeById`, `updateRecipe`, `deleteRecipe` |
| CRUD pe rețetele personale | Create + Read în `add.js` / `saved.js` / `saved/[id].js`; Delete și Update disponibile în `db.js` |
| Listă rețete salvate | `saved.js` — `FlatList` peste rezultatul din SQLite |
| Detalii pentru o rețetă salvată | `saved/[id].js` |
| Componente de bază | `View`, `Text`, `FlatList`, `Pressable`, `Image`, `ScrollView`, `TextInput`, `ActivityIndicator` |
| Stilizare cu `StyleSheet` | În toate ecranele |
| State + efecte secundare | `useState`, `useEffect`, `useFocusEffect` |

## Pași Git pentru livrare

```bash
git checkout -b lab-3-solution
git add .
git commit -m "feat(lab-3): cook book app cu Expo Router, SQLite si TheMealDB"
git push origin lab-3-solution
```

Apoi pe pagina fork-ului tău (`siminitchi/react-native3`) deschide Pull Request către `cristi-usm/lab3-react-native`.

## Notă despre versiuni

Versiunile din `package.json` sunt aliniate cu **Expo SDK 51**, care este compatibil cu Expo Go din 2024–2026. Dacă proiectul existent în repo are deja un `package-lock.json` cu altă versiune SDK, rulează `npx expo install --fix` după `npm install` pentru a alinia automat dependențele.
