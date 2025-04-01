import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, Alert, TextInput } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { surahData } from '../data/surahData';
import { saveLastRead, getLastReadList, updateLastRead } from '../utils/database';

const SurahDetailScreen = () => {
  const route = useRoute();
  const { surah } = route.params;
  const [surahDetail, setSurahDetail] = useState(null);
  const [selectedAyah, setSelectedAyah] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isTafsirVisible, setTafsirVisible] = useState(false);
  const [lastReadList, setLastReadList] = useState([]);
  const [isLastReadModalVisible, setLastReadModalVisible] = useState(false);
  const [newBookmarkName, setNewBookmarkName] = useState('');

  useEffect(() => {
    const data = surahData[surah.number];
    setSurahDetail(data);

    // Ambil daftar terakhir dibaca
    getLastReadList((data) => setLastReadList(data));
  }, [surah]);

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
    updateLastRead(id, selectedAyah.number.inSurah, (status) => {
      if (status === 'updated') {
        Alert.alert('Berhasil', 'Ayat terakhir dibaca diperbarui.');
        getLastReadList((data) => setLastReadList(data));
        setLastReadModalVisible(false);
      }
    });
  };

  const handleAddLastRead = () => {
    if (!selectedAyah || !newBookmarkName.trim()) {
      Alert.alert('Gagal', 'Nama Terakhir Baca tidak boleh kosong.');
      return;
    }
    saveLastRead(surah.number, surah.name, selectedAyah.number.inSurah, newBookmarkName, (status) => {
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
        data={surahDetail.ayahs}
        keyExtractor={(item) => item.number.inQuran.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onLongPress={() => handleLongPress(item)}>
            <View style={styles.ayahContainer}>
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

      {/* Modal untuk Menambahkan Terakhir Dibaca */}
      <Modal isVisible={isLastReadModalVisible} onBackdropPress={() => setLastReadModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Pilih atau Tambah Terakhir Dibaca</Text>
          <FlatList
            data={lastReadList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.modalItem} onPress={() => handleSelectLastRead(item.id)}>
                <Text>{item.name_bookmark} - Ayat {item.ayah}</Text>
              </TouchableOpacity>
            )}
          />
          <TextInput
            style={styles.input}
            placeholder="Nama Terakhir dibaca baru..."
            value={newBookmarkName}
            onChangeText={setNewBookmarkName}
          />

          {/* Tombol Tambah */}
          <TouchableOpacity style={styles.addButton} onPress={handleAddLastRead}>
            <Text style={styles.addButtonText}>Tambah</Text>
          </TouchableOpacity>

          {/* Tombol Batal */}
          <TouchableOpacity style={styles.cancelButton} onPress={() => setLastReadModalVisible(false)}>
            <Text style={styles.cancelButtonText}>Batal</Text>
          </TouchableOpacity>
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
  arabic: { fontSize: 30, textAlign: 'right', marginTop: 4, fontFamily: 'AmiriQuran-Regular' },
  translation: { fontSize: 12, color: 'gray', marginTop: 4 },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  modalItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  modalTafsir: { backgroundColor: 'white', padding: 20, borderRadius: 10, height: '60%' },
  tafsirText: { fontSize: 16, textAlign: 'justify', marginTop: 10 },
  closeButton: { marginTop: 20, backgroundColor: '#007bff', padding: 10, borderRadius: 5, alignItems: 'center' },
  closeButtonText: { color: 'white', fontWeight: 'bold' },
  cancelButton: {
    marginTop: 10,
    backgroundColor: '#dc3545', // Warna merah untuk tombol batal
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SurahDetailScreen;
