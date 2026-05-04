import * as SQLite from 'expo-sqlite';

// Deschide / creează baza de date locală
let dbPromise;

const getDb = async () => {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('cookbook.db');
  }
  return dbPromise;
};

// Inițializează tabela "recipes" la prima rulare
export const initDatabase = async () => {
  const db = await getDb();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      ingredients TEXT NOT NULL,
      instructions TEXT NOT NULL,
      image TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

// CREATE - inserează o rețetă nouă
export const insertRecipe = async ({ name, ingredients, instructions, image }) => {
  const db = await getDb();
  const result = await db.runAsync(
    'INSERT INTO recipes (name, ingredients, instructions, image) VALUES (?, ?, ?, ?);',
    [name, ingredients, instructions, image || null]
  );
  return result.lastInsertRowId;
};

// READ - listează toate rețetele
export const getAllRecipes = async () => {
  const db = await getDb();
  const rows = await db.getAllAsync('SELECT * FROM recipes ORDER BY created_at DESC;');
  return rows;
};

// READ - obține o rețetă după id
export const getRecipeById = async (id) => {
  const db = await getDb();
  const row = await db.getFirstAsync('SELECT * FROM recipes WHERE id = ?;', [id]);
  return row;
};

// UPDATE - actualizează o rețetă existentă
export const updateRecipe = async (id, { name, ingredients, instructions, image }) => {
  const db = await getDb();
  await db.runAsync(
    'UPDATE recipes SET name = ?, ingredients = ?, instructions = ?, image = ? WHERE id = ?;',
    [name, ingredients, instructions, image || null, id]
  );
};

// DELETE - șterge o rețetă după id
export const deleteRecipe = async (id) => {
  const db = await getDb();
  await db.runAsync('DELETE FROM recipes WHERE id = ?;', [id]);
};
