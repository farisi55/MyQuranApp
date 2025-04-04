import React, { useEffect, useState, useRef  } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, Alert, TextInput } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { surahData } from '../data/surahData';
import { initDatabase, saveLastRead, getLastReadList, updateLastRead, saveBookmark } from '../utils/database';

const SurahDetailScreen = () => {
  const route = useRoute();
  const { surah, surahNumber, ayahNumber = 1 } = route.params;
  const [itemHeights, setItemHeights] = useState({});
  const [surahDetail, setSurahDetail] = useState(null);
  const [selectedAyah, setSelectedAyah] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isTafsirVisible, setTafsirVisible] = useState(false);
  const [lastReadList, setLastReadList] = useState([]);
  const [isLastReadModalVisible, setLastReadModalVisible] = useState(false);
  const [newBookmarkName, setNewBookmarkName] = useState('');
  const [isBookmarkModalVisible, setBookmarkModalVisible] = useState(false);
  const [bookmarkName, setBookmarkName] = useState('');
  const listRef = useRef(null); // Untuk referensi FlatList agar bisa scroll otomatis


  useEffect(() => {
      initDatabase();

      const data = surahData[surah.number]; // Ambil data surah berdasarkan nomor surah
      setSurahDetail(data);

      // Ambil daftar terakhir dibaca
      getLastReadList((data) => setLastReadList(data));



      // Pastikan data dan ayahs tersedia sebelum scrolling
     if (data && data.ayahs && surah.numberAyah) {
             setTimeout(() => {
                 let targetAyahNumber = Number(surah.numberAyah);

                 let index = data.ayahs.findIndex((item) => item.number.inSurah === targetAyahNumber);

                 if (index !== -1 && listRef.current) {
                     try {
                         listRef.current.scrollToIndex({ index, animated: true });
                     } catch (error) {
                         listRef.current.scrollToOffset({ offset: index * 286, animated: true });
                     }
                 } else {
                     console.warn("Ayah tidak ditemukan dalam data!");
                 }
             }, 500);
      }
  }, [surah.number, surah.numberAyah]); // Pastikan dependensi sudah benar


// Fungsi untuk menangani penyimpanan tinggi tiap item
    const handleItemLayout = (event, index) => {
        const { height } = event.nativeEvent.layout;

        setItemHeights(prev => ({
            ...prev,
            [index]: height
        }));
    };

    // Fungsi untuk menghitung offset berdasarkan tinggi item sebelumnya
    const getItemLayout = (data, index) => {
        const heightList = Object.values(itemHeights);

        // Hitung total tinggi item sebelumnya
        const offset = heightList.slice(0, index).reduce((sum, h) => sum + h, 0);

        return {
            length: itemHeights[index] || 50,  // Default tinggi jika belum dihitung
            offset,
            index
        };
    };


  const handleLongPress = (ayah) => {
    setSelectedAyah(ayah);
    setModalVisible(true);
  };

  const handleMarkLastRead = () => {
    setLastReadModalVisible(true);
    setModalVisible(false);
  };

 const handleSelectLastRead = (id) => {
   if (!selectedAyah) return;

   Alert.alert(
     "Konfirmasi Perbarui",
     `Yakin ingin memperbarui ayat terakhir dibaca ke Ayat ${selectedAyah.number.inSurah}?`,
     [
       {
         text: "Batal",
         style: "cancel",
       },
       {
         text: "Perbarui",
         onPress: () => {
           updateLastRead(id, selectedAyah.number.inSurah, (status) => {
             if (status === 'updated') {
               Alert.alert('Berhasil', 'Ayat terakhir dibaca diperbarui.');
               getLastReadList((data) => setLastReadList(data));
               setLastReadModalVisible(false);
             }
           });
         },
         style: "default"
       }
     ],
     { cancelable: true }
   );
 };

  const handleAddLastRead = () => {
    if (!selectedAyah || !newBookmarkName.trim()) {
      Alert.alert('Gagal', 'Nama Terakhir Baca tidak boleh kosong.');
      return;
    }
    saveLastRead(surah.number, surah.name, surah.translation, selectedAyah.number.inSurah, newBookmarkName, (status) => {
      if (status === 'success') {
        Alert.alert('Berhasil', `Bookmark "${newBookmarkName}" ditambahkan.`);
        setNewBookmarkName('');
        getLastReadList((data) => setLastReadList(data));
        setLastReadModalVisible(false);
      }
    });
  };

  const handleViewTafsir = () => {
    setTafsirVisible(true);
    setModalVisible(false);
  };

  const handleBookmark = () => {
    setBookmarkModalVisible(true);
    setModalVisible(false);
  };

  const handleAddBookmark = () => {
    if (!bookmarkName.trim()) {
      Alert.alert('Gagal', 'Nama bookmark tidak boleh kosong.');
      return;
    }

    saveBookmark(surah.number, surah.name, surah.translation, selectedAyah.number.inSurah, bookmarkName, (status) => {
      if (status === 'success') {
        Alert.alert('Berhasil', `Bookmark "${bookmarkName}" ditambahkan.`);
        setBookmarkName('');
        setBookmarkModalVisible(false);
      }
    });
  };


  if (!surahDetail) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Memuat data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{surah.name}</Text>
      <Text style={styles.subtitle}>
        {surah.translation} - {surahDetail.ayahs.length} Ayat
      </Text>

      <FlatList
        ref={listRef}
        data={surahDetail.ayahs}
        keyExtractor={(item) => item.number.inSurah.toString()}
        getItemLayout={getItemLayout}
        renderItem={({ item, index }) => (
          <TouchableOpacity onLongPress={() => handleLongPress(item)}>
            <View
            style={styles.ayahContainer}
            onLayout={(event) => handleItemLayout(event, index)}
            >
                <Text style={styles.ayahNumber}>{item.number.inSurah}.</Text>
                <Text style={styles.arabic}>{item.arab}</Text>
                <Text style={styles.translation}>{item.translation}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Modal untuk Popup Menu */}
      <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            Pilihan Ayat {selectedAyah?.number.inSurah || ''}
          </Text>
          <TouchableOpacity style={styles.modalItem} onPress={handleMarkLastRead}>
            <Text>🔖 Tandai Terakhir Dibaca</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalItem} onPress={handleBookmark}>
            <Text>📌 Tambahkan ke Bookmark</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalItem} onPress={handleViewTafsir}>
            <Text>📖 Lihat Tafsir</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Modal untuk Menampilkan Tafsir */}
      <Modal isVisible={isTafsirVisible} onBackdropPress={() => setTafsirVisible(false)}>
        <View style={styles.modalTafsir}>
          <Text style={styles.modalTitle}>
            Tafsir Ayat {selectedAyah?.number.inSurah || ''}
          </Text>
          <ScrollView>
            <Text style={styles.tafsirText}>
              {selectedAyah?.tafsir?.kemenag?.short || 'Tafsir tidak tersedia'}
            </Text>
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={() => setTafsirVisible(false)}>
            <Text style={styles.closeButtonText}>Tutup</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Modal untuk Menampilkan Bookmark */}
      <Modal isVisible={isBookmarkModalVisible} onBackdropPress={() => setBookmarkModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Tambahkan Bookmark</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan nama bookmark..."
            value={bookmarkName}
            onChangeText={setBookmarkName}
          />

          <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.addButton} onPress={handleAddBookmark}>
                <Text style={styles.addButtonText}>Tambah</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setBookmarkModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
          </View>
        </View>
      </Modal>


      {/* Modal untuk Menambahkan Terakhir Dibaca */}
      <Modal isVisible={isLastReadModalVisible} onBackdropPress={() => setLastReadModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Pilih atau Tambah Terakhir Dibaca</Text>
          {lastReadList.length === 0 ? (
            <Text style={{ textAlign: 'center', color: 'gray' }}>Belum ada ayat yang ditandai sebagai terakhir dibaca.</Text>
          ) : (
          <FlatList
            data={lastReadList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.modalItem} onPress={() => handleSelectLastRead(item.id)}>
                <Text>{item.name_bookmark} - Ayat {item.ayah}</Text>
              </TouchableOpacity>
            )}
           />
          )}
          <TextInput
            style={styles.input}
            placeholder="Nama Terakhir dibaca baru..."
            value={newBookmarkName}
            onChangeText={setNewBookmarkName}
          />
         <View style={styles.buttonContainer}>
              {/* Tombol Tambah */}
              <TouchableOpacity style={styles.addButton} onPress={handleAddLastRead}>
                <Text style={styles.addButtonText}>Tambah</Text>
              </TouchableOpacity>

              {/* Tombol Batal */}
              <TouchableOpacity style={styles.cancelButton} onPress={() => setLastReadModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 18, textAlign: 'center', color: 'gray', marginBottom: 12 },
  loadingText: { fontSize: 18, textAlign: 'center', marginTop: 20 },
  ayahContainer: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  ayahNumber: { fontSize: 12, fontWeight: 'bold' },
  arabic: { fontSize: 30, textAlign: 'right', marginTop: 4, fontFamily: 'LPMQ-IsepMisbah' },
  translation: { fontSize: 12, color: 'gray', marginTop: 4 },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  modalItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  modalTafsir: { backgroundColor: 'white', padding: 20, borderRadius: 10, height: '60%' },
  tafsirText: { fontSize: 16, textAlign: 'justify', marginTop: 10 },
  closeButton: { marginTop: 20, backgroundColor: '#007bff', padding: 10, borderRadius: 5, alignItems: 'center' },
  closeButtonText: { color: 'white', fontWeight: 'bold' },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  addButton: {
    flex: 1,
    backgroundColor: '#28a745', // Warna hijau untuk tombol Tambah
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginRight: 5, // Jarak antar tombol
  },

  cancelButton: {
    flex: 1,
    backgroundColor: '#dc3545', // Warna merah untuk tombol Batal
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginLeft: 5, // Jarak antar tombol
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },

});

export default SurahDetailScreen;
