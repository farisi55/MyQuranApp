import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Impor file JSON lokal
import surahData from '../data/list_surah.json';

const SurahListScreen = () => {
  const navigation = useNavigation();
  const [surahs, setSurahs] = useState([]);

  useEffect(() => {
    setSurahs(surahData); // Langsung set data tanpa fetch
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('SurahDetail', { surah: item })}
    >
      <Text style={styles.surahNumber}>{item.number}. </Text>
      <Text style={styles.surahName}>{item.name}</Text>
      <Text style={styles.surahTranslation}>({item.translation})</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daftar Surah</Text>
      <FlatList
        data={surahs}
        keyExtractor={(item) => item.number.toString()}
        renderItem={renderItem}
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
    marginBottom: 16,
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  surahNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  surahName: {
    fontSize: 18,
    marginLeft: 8,
  },
  surahTranslation: {
    fontSize: 16,
    marginLeft: 8,
    color: 'gray',
  },
});

export default SurahListScreen;