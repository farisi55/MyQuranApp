import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getBookmarkList, updateBookmarkStatus } from '../utils/database';

const BookmarkListScreen = () => {
    const navigation = useNavigation();
    const [bookmarkList, setBookmarkList] = useState([]);
    const [selectedBookmark, setSelectedBookmark] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchBookmarks();
    }, []);

    const fetchBookmarks = () => {
        getBookmarkList((data) => {
            if (Array.isArray(data)) {
                setBookmarkList(data);
            } else {
                setBookmarkList([]); // Pastikan bookmarkList tetap array
            }
        });
    };

    const handleOpenMenu = (bookmark) => {
        setSelectedBookmark(bookmark);
        setModalVisible(true);
    };

    const handleViewAyat = () => {
        if (selectedBookmark) {
            navigation.navigate('SurahDetail', {
                surah: {
                    number: selectedBookmark.surah,
                    name: selectedBookmark.name_surah,
                    translation: selectedBookmark.translation
                }
            });
        }
        setModalVisible(false);
    };


    const handleDeleteBookmark = () => {
        if (selectedBookmark) {
            updateBookmarkStatus(selectedBookmark.id, 0, () => {
                Alert.alert("Sukses", "Bookmark berhasil dihapus.");
                fetchBookmarks(); // Refresh data setelah dihapus
            });
        }
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Daftar Bookmark</Text>

            {Array.isArray(bookmarkList) && bookmarkList.length === 0 ? (
                <Text style={styles.emptyText}>Belum ada ayat yang ditandai.</Text>
            ) : (
                <FlatList
                    data={bookmarkList}
                    keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.itemContainer} onPress={() => handleOpenMenu(item)}>
                            <Text style={styles.surahText}>
                                📖 {item.name_surah} - Ayat {item.ayah}
                            </Text>
                            <Text style={styles.bookmarkText}>🔖 {item.name_bookmark}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}

            {/* Tombol kembali ke Home */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
                <Text style={styles.backButtonText}>Kembali ke Home</Text>
            </TouchableOpacity>

            {/* Modal Popup */}
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.modalItem} onPress={handleViewAyat}>
                            <Text>📖 View Ayat</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalItem} onPress={handleDeleteBookmark}>
                            <Text>🗑 Hapus Bookmark</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalItem} onPress={() => setModalVisible(false)}>
                            <Text>❌ Batal</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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

    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 8, width: 250, alignItems: 'center' },
    modalItem: { padding: 10, width: '100%', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#ddd' }
});

export default BookmarkListScreen;
