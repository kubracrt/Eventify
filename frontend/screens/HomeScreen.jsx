import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const fetchEvents = async ({ queryKey }) => {
  const [_key, page] = queryKey;
  const token = await AsyncStorage.getItem('token');
  const res = await axios.get(`http://192.168.1.20:5000/events?page=${page}&limit=10`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; 
};

export default function HomeScreen() {
  const navigation = useNavigation();
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ['events', page],
    queryFn: fetchEvents,
    keepPreviousData: true,
  });

  const events = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const Item = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('EventDetail', { id: item.id })}
    >
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardText}>{new Date(item.date).toLocaleDateString()}</Text>
      <Text style={styles.cardText}>{item.location}</Text>
      <Text style={styles.cardText}>{item.description}</Text>
    </TouchableOpacity>
  );

  const renderPagination = () => (
    <View style={styles.paginationWrapper}>
      <TouchableOpacity
        onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
        disabled={page === 1}
        style={[styles.navButton, page === 1 && styles.disabledButton]}
      >
        <Text style={styles.navText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.pageIndicator}>{page} / {totalPages}</Text>

      <TouchableOpacity
        onPress={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={page === totalPages}
        style={[styles.navButton, page === totalPages && styles.disabledButton]}
      >
        <Text style={styles.navText}>→</Text>
      </TouchableOpacity>
    </View>
  );


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <MaterialIcons name="event" size={24} color="white" style={styles.icon} />
          <Text style={styles.headerText}>Etkinlikler</Text>
        </View>
        <AntDesign
          onPress={() => navigation.navigate('CreateEvent')}
          name="pluscircleo"
          size={24}
          color="white"
          style={styles.icon}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : isError ? (
        <Text style={{ textAlign: 'center', color: 'red' }}>Etkinlikler yüklenemedi.</Text>
      ) : (
        <>
          <FlatList
            data={events}
            keyExtractor={(item) => item.id.toString()}
            renderItem={Item}
            contentContainerStyle={{ padding: 16 }}
          />

          {renderPagination()}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F4' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#5C6BC0',
    paddingHorizontal: 20,
    paddingVertical: 15,
    height: "12%"
  },
  icon: {
    marginTop: 50
  },
  headerText: {
    marginTop: 50,
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  cardText: {
    fontSize: 14,
    marginBottom: 3,
    color: '#555',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    gap: 10,
  },
  pageButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 8,
  },
  activePage: {
    marginBottom: 80,
    backgroundColor: '#5C6BC0',
  },
  pageText: {
    color: 'white',
    fontWeight: 'bold',
  },
  paginationWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginBottom: 80,
  },

  navButton: {
    backgroundColor: '#5C6BC0',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
  },

  disabledButton: {
    backgroundColor: '#5C6BC0',
  },

  navText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom:6
  },

  pageIndicator: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

});
