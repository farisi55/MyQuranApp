import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getLastReadList } from '../utils/database';

const LastReadListScreen = () => {
    const navigation = useNavigation();
    const [lastReadList, setLastReadList] = useState([]);

    useEffect(() => {
        getLastReadList((data) => setLastReadList(data));
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Daftar Terakhir Dibaca</Text>

            {lastReadList.length === 0 ? (
                <Text style={styles.emptyText}>Belum ada ayat yang ditandai.</Text>
            ) : (
                <FlatList
                    data={lastReadList}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.itemContainer}>
                            <Text style={styles.surahText}>
                                📖 {item.name_surah} - Ayat {item.ayah}
                            </Text>
                            <Text style={styles.bookmarkText}>🔖 {item.name_bookmark}</Text>
                        </View>
                    )}
                />
            )}

            {/* Tombol kembali ke Home */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
                <Text style={styles.backButtonText}>Kembali ke Home</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
    emptyText: { fontSize: 16, textAlign: 'center', color: 'gray', marginTop: 20 },
    itemContainer: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#ddd' },
    surahText: { fontSize: 16, fontWeight: 'bold' },
    bookmarkText: { fontSize: 14, color: 'gray' },
    backButton: { marginTop: 20, backgroundColor: '#007bff', padding: 12, borderRadius: 5, alignItems: 'center' },
    backButtonText: { color: 'white', fontWeight: 'bold' },
});

export default LastReadListScreen;
