import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  SectionList,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Tour, groupByCity, formatDate } from './utils/tour';
import TourItem from './components/TourItem';

// Thay bằng endpoint của bạn trên mockapi.io
const API_URL = 'https://6ac9d0b93115bcc958200204.mockapi.io/tours'; 

export default function App() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Lấy dữ liệu API (GET)
  const fetchTours = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTours(data);
    } catch {
      Alert.alert('Lỗi', 'Không thể tải danh sách tour');
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchTours().finally(() => setLoading(false));
  }, [fetchTours]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTours();
    setRefreshing(false);
  }, [fetchTours]);

  // Nhấn vào Tour hiển thị Alert
  const handlePressTour = useCallback((tour: Tour) => {
    Alert.alert(
      'Chi tiết Tour',
      `Tên: ${tour.name}\nKhởi hành: ${formatDate(tour.departure)}\nThời gian: ${tour.days} ngày\nGiá: ${tour.price?.toLocaleString('vi-VN')} ₫`
    );
  }, []);

  // Cập nhật yêu thích (PUT) với Cập nhật lạc quan
  const handleToggleFavorite = useCallback(async (id: string, next: boolean) => {
    // 1. Cập nhật lạc quan trong state
    setTours(prev =>
      prev.map(t => (t.id === id ? { ...t, isFavorite: next } : t))
    );

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: next }),
      });

      if (!res.ok) throw new Error();
    } catch {
      // Hoàn tác lại khi lỗi
      setTours(prev =>
        prev.map(t => (t.id === id ? { ...t, isFavorite: !next } : t))
      );
      Alert.alert('Lỗi', 'Không thể cập nhật yêu thích');
    }
  }, []);

  // Danh sách tour yêu thích (không ảnh hưởng bởi ô tìm kiếm)
  const favoriteTours = useMemo(() => {
    return tours.filter(t => t.isFavorite);
  }, [tours]);

  // Lọc và nhóm tour theo thành phố bằng useMemo
  const sections = useMemo(() => {
    const trimmed = searchText.trim().toLowerCase();
    const filtered = tours.filter(t =>
      t.name.toLowerCase().includes(trimmed)
    );
    return groupByCity(filtered);
  }, [tours, searchText]);

  // Header danh sách ngang: Tour yêu thích
  const renderListHeader = () => (
    <View style={styles.favoriteContainer}>
      <Text style={styles.sectionHeaderTitle}>
        Tour yêu thích ({favoriteTours.length})
      </Text>
      {favoriteTours.length === 0 ? (
        <Text style={styles.emptyText}>Chưa có tour yêu thích</Text>
      ) : (
        <FlatList
          horizontal
          // Đề bài yêu cầu showsHorizontalScrollIndicator={false} để ẩn thanh cuộn xấu,
          // Nếu bạn muốn HIỆN thanh cuộn thì đổi thành true:
          showsHorizontalScrollIndicator={true}
          data={favoriteTours}
          keyExtractor={item => item.id}
          // Thêm khoảng cách giữa các thẻ tour theo đề bài Câu 4c
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          contentContainerStyle={{ paddingVertical: 4, paddingHorizontal: 2 }}
          renderItem={({ item }) => (
            <TourItem
              tour={item}
              compact={true}
              onPress={handlePressTour}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
        />
      )}
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Câu 1: Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{"Tour Việt"}</Text>
          <Text style={styles.studentInfo}>MSSV: {"23644821 - Phạm Nhựt Tân"}</Text>
          <TextInput
            style={styles.searchBar}
            placeholder="Tìm tour theo tên..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Loading Spinner */}
        {loading ? (
          <ActivityIndicator size="large" color="#0066cc" style={styles.loading} />
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={item => item.id}
            stickySectionHeadersEnabled
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListHeaderComponent={renderListHeader}
            ListEmptyComponent={
              <Text style={styles.emptyCenter}>Không tìm thấy tour phù hợp</Text>
            }
            renderSectionHeader={({ section: { title, data } }) => (
              <View style={styles.cityHeader}>
                <Text style={styles.cityHeaderTitle}>
                  {title} · {data.length} tour
                </Text>
              </View>
            )}
            renderItem={({ item }) => (
              <TourItem
                tour={item}
                onPress={handlePressTour}
                onToggleFavorite={handleToggleFavorite}
              />
            )}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  studentInfo: {
    fontSize: 14,
    color: '#555',
    marginVertical: 4,
  },
  searchBar: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  loading: {
    marginTop: 40,
  },
  favoriteContainer: {
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  cityHeader: {
    backgroundColor: '#e9ecef',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  cityHeaderTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#495057',
  },
  emptyText: {
    color: '#777',
    fontStyle: 'italic',
    paddingVertical: 10,
  },
  emptyCenter: {
    textAlign: 'center',
    marginTop: 30,
    color: '#777',
    fontSize: 15,
  },
});