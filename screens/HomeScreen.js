import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📖 MyQuranApp</Text>

      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('SurahList')}>
        <Text style={styles.menuText}>📜 Surat Al-Qur'an</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('LastReadList')}>
        <Text style={styles.menuText}>🔖 Lihat Terakhir Dibaca</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('BookmarkList')}>
        <Text style={styles.menuText}>🌟 Bookmark Ayat Penting</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f5e4', // Latar belakang hijau lembut
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2e7d32', // Warna hijau tua khas Quran
    marginBottom: 30,
  },
  menuButton: {
    backgroundColor: '#4CAF50', // Hijau Quran
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 8,
    width: '100%',
    alignItems: 'center',
    elevation: 3, // Efek shadow di Android
    shadowColor: '#000', // Efek shadow di iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  menuText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default HomeScreen;
