
# Aplicație de Rețete Culinare (Cook Book)

## Cerințe Generale
![Example](./example.gif)

Creează o aplicație mobilă de tip "Cook Book" unde utilizatorii pot explora rețete online și își pot salva propriile rețete local.
### Configurare Proiect
- Creează un proiect nou `React Native` cu `Expo`.
- Implementează navigația folosind `Expo Router` (minimum 2 rute și 2 routeri).
- Configurează și utilizează `expo-sqlite` pentru a gestiona baza de date locală.
- Folosește API-ul public **TheMealDB** pentru a prelua rețete: `https://www.themealdb.com/api.php`
### Stilizare & Interfață Utilizator (UI)

- Implementează stilizarea folosind `StyleSheet` sau oricare altă librărie externă de stilizare.
- Folosește componente de bază `React Native`: `View`, `Text`, `FlatList`, `Pressable`, `Image`, `ScrollView`, `TextInput`, etc.

---
## Funcționalități

### 1. Explorare Rețete (API)
Utilizatorii pot:
- Căuta rețete după nume.
- Vizualiza o listă de rețete (ex: o categorie la alegere).
- Accesa o pagină de detalii pentru fiecare rețetă, unde sunt afișate ingredientele și cantitătățile, instrucțiunile și o imagine.
### 2. Adăugare Rețete Personale
- Utilizatorii trebuie să aibă un ecran dedicat cu un formular pentru a adăuga o rețetă nouă.
- Formularul trebuie să fie controlat (controlled components) și să conțină câmpuri pentru:
    - Numele rețetei
    - Ingrediente
    - Instrucțiuni
    - O imagine (selectată din galeria telefonului sau adăugată prin URL).
### 3. Gestiune Rețete Salvate (SQLite)
- Rețetele adăugate prin formular sunt salvate permanent în baza de date **SQLite** a dispozitivului.
- Într-un ecran separat, utilizatorul poate vizualiza lista tuturor rețetelor personale salvate.
- La selectarea unei rețete salvate, se afișează detaliile acesteia.

| **Punctaj** | **Sarcina**                                                                                                                                              |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.5p        | Crearea corectă a proiectului cu React Native și Expo.                                                                                                    |
| 1.0p        | Configurarea și implementarea corectă a navigației cu `Expo Router` (minimum 2 rute și 2 navigatori).                                                     |
| 1.5p        | Integrarea cu API-ul `TheMealDB` (căutare, afișare listă și detalii).                                                                                     |
| 2.0p        | Crearea formularului controlat pentru adăugarea de rețete noi (inclusiv gestionarea input-urilor - validare, salvare in AsyncStorage și a imaginii).      |
| 2.0p        | Implementarea corectă a funcționalităților CRUD (Create, Read) cu `expo-sqlite` pentru salvarea, actualizarea, afișarea și ștergerea rețetelor personale. |
| 1.0p        | Utilizarea eficientă a state-ului, efectelor secundare și a componentelor de bază React Native.                                                           |
| 1.0p        | Stilizarea aplicației folosind `StyleSheet` sau o librărie pentru o interfață atractivă și intuitivă.                                                     |
| 1.0p        | Structura generală a codului, claritate și organizare                                                                                                     |

