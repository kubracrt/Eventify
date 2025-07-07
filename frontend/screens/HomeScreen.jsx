import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [allEvents, setAllEvents] = useState([]);
  const [visibleEvents, setVisibleEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const perPage = 10;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get('http://192.168.1.20:5000/events', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const events = response.data.data;
        setAllEvents(events);
        setVisibleEvents(events.slice(0, perPage));
        setLoading(false);
      } catch (error) {
        console.log('Veri çekme hatası:', error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const totalPages = Math.ceil(allEvents.length / perPage);

  const goToPage = (pageNum) => {
    const start = (pageNum - 1) * perPage;
    const end = start + perPage;
    setVisibleEvents(allEvents.slice(start, end));
    setPage(pageNum);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </TouchableOpacity>
  );

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      {Array.from({ length: totalPages }, (_, i) => (
        <TouchableOpacity
          key={i}
          style={[styles.pageButton, page === i + 1 && styles.activePage]}
          onPress={() => goToPage(i + 1)}
        >
          <Text style={styles.pageText}>{i + 1}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1976d2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Etkinlikler</Text>
      <FlatList
        data={visibleEvents}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={renderItem}
        ListFooterComponent={renderPagination()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 10,
  },
  pageButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#888',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  activePage: {
    backgroundColor: '#4CAF50',
  },
  pageText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
