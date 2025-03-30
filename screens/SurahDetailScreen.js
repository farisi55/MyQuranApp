import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { surahData } from '../data/surahData'; // Impor objek JSON

const SurahDetailScreen = () => {
  const route = useRoute();
  const { surah } = route.params;
  const [surahDetail, setSurahDetail] = useState(null);

  useEffect(() => {
    // Ambil data dari objek yang sudah diimpor
    const data = surahData[surah.number];
    setSurahDetail(data);
  }, [surah]);

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
          <View style={styles.ayahContainer}>
            <Text style={styles.ayahNumber}>{item.number.inSurah}.</Text>
            <Text style={styles.arabic}>{item.arab}</Text>
            <Text style={styles.translation}>{item.translation}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: 'gray',
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  ayahContainer: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  ayahNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  arabic: {
    fontSize: 22,
    textAlign: 'right',
    marginTop: 4,
  },
  translation: {
    fontSize: 16,
    color: 'gray',
    marginTop: 4,
  },
});

export default SurahDetailScreen;
