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
        name_bookmark TEXT,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME
      );`,
      [],
      () => console.log('Table created'),
      (error) => console.error('Error creating table:', error)
    );
  });
};

// Menyimpan ayat terakhir dibaca (multiple save)
export const saveLastRead = (surah, name_surah, ayah, name_bookmark, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      `INSERT INTO quran_bookmark (surah, name_surah, ayah, type_bookmark, name_bookmark, is_active)
      VALUES (?, ?, ?, 'lastread', ?, 1);`,
      [surah, name_surah, ayah, name_bookmark],
      () => callback('success'),
      (error) => console.error('Error inserting last read:', error)
    );
  });
};

// Mendapatkan daftar ayat terakhir dibaca
export const getLastReadList = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      `SELECT id, surah, name_surah, ayah, name_bookmark FROM quran_bookmark
       WHERE type_bookmark = 'lastread' AND is_active = 1;`,
      [],
      (_, result) => {
        let lastReadList = [];
        for (let i = 0; i < result.rows.length; i++) {
          lastReadList.push(result.rows.item(i));
        }
        callback(lastReadList);
      },
      (_, error) => {
              if (error.message.includes('no such table')) {
                console.warn('Tabel quran_bookmark belum ada. Membuat tabel...');
                initDatabase();
                callback([]); // Kembalikan array kosong agar tidak error di UI
              } else {
                console.error('Error fetching last read list:', error);
                callback([]); // Kembalikan array kosong sebagai default
              }
       }
    );
  });
};

// Memperbarui ayat terakhir dibaca berdasarkan ID bookmark
export const updateLastRead = (id, ayah, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      `UPDATE quran_bookmark SET ayah = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?;`,
      [ayah, id],
      () => callback('updated'),
      (error) => console.error('Error updating last read:', error)
    );
  });
};


//save bookmark
export const saveBookmark = (surahNumber, surahName, ayahNumber, bookmarkName, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      `INSERT INTO quran_bookmark (surah, name_surah, ayah, type_bookmark, name_bookmark, is_active)
       VALUES (?, ?, ?, 'bookmark', ?, 1)`,
      [surahNumber, surahName, ayahNumber, bookmarkName],
      (_, result) => callback('success'),
      (_, error) => {
        console.error('Gagal menyimpan bookmark:', error);
        callback('error');
      }
    );
  });
};

