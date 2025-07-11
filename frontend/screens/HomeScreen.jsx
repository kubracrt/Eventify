import React from 'react';
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

const fetchEvents = async () => {
  const token = await AsyncStorage.getItem('token');
  const res = await axios.get('http://192.168.1.37:5000/events?page=1&limit=10', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

export default function HomeScreen() {
  const navigation = useNavigation();

  const { data: events, isLoading, isError } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <MaterialIcons name="event" size={24} color="white" style={styles.icon}
          />
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
        <FlatList
          data={events}
          keyExtractor={(item) => item.id.toString()}
          renderItem={Item}
          contentContainerStyle={{ padding: 16 }}
        />
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
  icon:{
    marginTop:50
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
  profileButton: {
    backgroundColor: '#FF7F50',
    paddingVertical: 12,
    marginHorizontal: 30,
    marginBottom: 20,
    borderRadius: 30,
    alignItems: 'center',
  },
  profileButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
