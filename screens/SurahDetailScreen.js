import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { surahData } from '../data/surahData';
import { initDatabase, saveLastRead, getLastRead } from '../utils/database';

const SurahDetailScreen = () => {
  const route = useRoute();
  const { surah } = route.params;
  const [surahDetail, setSurahDetail] = useState(null);
  const [selectedAyah, setSelectedAyah] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isTafsirVisible, setTafsirVisible] = useState(false);
  const [lastRead, setLastRead] = useState(null);

  useEffect(() => {
    initDatabase(); // Inisialisasi database saat screen pertama kali dimuat
    const data = surahData[surah.number];
    setSurahDetail(data);

    // Ambil data terakhir dibaca dari database
    getLastRead((data) => {
      if (data) {
        setLastRead(data);
      }
    });
  }, [surah]);

  const handleLongPress = (ayah) => {
    setSelectedAyah(ayah);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleMarkLastRead = () => {
    if (selectedAyah) {
      saveLastRead(surah.number, surah.name, selectedAyah.number.inSurah, (status) => {
        if (status === 'success') {
          Alert.alert('Berhasil', `Ayat ${selectedAyah.number.inSurah} ditandai sebagai terakhir dibaca.`);
          setLastRead({ surah: surah.number, name_surah: surah.name, ayah: selectedAyah.number.inSurah });
        }
      });
    }
    handleCloseModal();
  };

  const handleBookmark = () => {
    console.log(`Menambahkan ke Bookmark: Ayat ${selectedAyah.number.inSurah}`);
    handleCloseModal();
  };

  const handleViewTafsir = () => {
    setTafsirVisible(true);
    handleCloseModal();
  };

  const handleCloseTafsir = () => {
    setTafsirVisible(false);
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

      {lastRead && lastRead.surah === surah.number && (
        <TouchableOpacity style={styles.lastReadContainer}>
          <Text style={styles.lastReadText}>
            🔖 Terakhir Dibaca: Ayat {lastRead.ayah}
          </Text>
        </TouchableOpacity>
      )}

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
      <Modal isVisible={isModalVisible} onBackdropPress={handleCloseModal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            Pilihan Ayat {selectedAyah?.number.inSurah}
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
      <Modal isVisible={isTafsirVisible} onBackdropPress={handleCloseTafsir}>
        <View style={styles.modalTafsir}>
          <Text style={styles.modalTitle}>
            Tafsir Ayat {selectedAyah?.number.inSurah}
          </Text>
          <ScrollView>
            <Text style={styles.tafsirText}>
              {selectedAyah?.tafsir?.kemenag?.short || 'Tafsir tidak tersedia'}
            </Text>
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={handleCloseTafsir}>
            <Text style={styles.closeButtonText}>Tutup</Text>
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
  /* Gaya tetap sama dengan kode Anda */
  lastReadContainer: { padding: 10, backgroundColor: '#eee', marginBottom: 10 },
  lastReadText: { fontSize: 14, fontWeight: 'bold' },
});

export default SurahDetailScreen;