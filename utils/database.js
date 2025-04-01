import SQLite from 'react-native-sqlite-storage';

// Membuka atau membuat database
const db = SQLite.openDatabase(
  { name: 'quran.db', location: 'default' },
  () => console.log('Database connected'),
  (error) => console.error('Database error:', error)
);

// Membuat tabel jika belum ada
export const initDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS quran_bookmark (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        surah INTEGER,
        name_surah TEXT,
        ayah INTEGER,
        type_bookmark TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );`,
      [],
      () => console.log('Table created'),
      (error) => console.error('Error creating table:', error)
    );
  });
};

// Fungsi untuk menandai terakhir dibaca
export const saveLastRead = (surah, name_surah, ayah, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      `DELETE FROM quran_bookmark WHERE type_bookmark = 'lastread';`,
      [],
      () => {
        tx.executeSql(
          `INSERT INTO quran_bookmark (surah, name_surah, ayah, type_bookmark) VALUES (?, ?, ?, 'lastread');`,
          [surah, name_surah, ayah],
          () => callback('success'),
          (error) => console.error('Error inserting last read:', error)
        );
      },
      (error) => console.error('Error deleting previous last read:', error)
    );
  });
};

// Fungsi untuk mengambil ayat terakhir dibaca
export const getLastRead = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT surah, name_surah, ayah FROM quran_bookmark WHERE type_bookmark = 'lastread';`,
      [],
      (_, result) => {
        callback(result.rows.length > 0 ? result.rows.item(0) : null);
      },
      (error) => console.error('Error fetching last read:', error)
    );
  });
};
