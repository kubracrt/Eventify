import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import { useQuery } from '@tanstack/react-query';


export default function EventDetailScreen({ route }) {
  const { id } = route.params;

 const {data:event,isLoading,isError} = useQuery({
   queryKey: ['event', id],
   queryFn: async () => {
     const response = await axios.get(`http://192.168.1.20:5000/events/${id}`);
     return response.data.data;
   }
 })

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Tarih yok';
    const date = new Date(dateStr);
    return isNaN(date.getTime())
      ? 'Geçersiz Tarih'
      : date.toLocaleDateString('tr-TR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#5C6BC0" />
        <Text style={{ marginTop: 10, color: '#555' }}>Yükleniyor...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#555' }}>Etkinlik bilgileri yüklenemedi.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{event.title}</Text>

      <View style={styles.infoBox}>
        <Feather name="file-text" size={20} color="#5C6BC0" style={styles.icon} />
        <Text style={styles.text}>{event.description}</Text>
      </View>

      <View style={styles.infoBox}>
        <MaterialIcons name="calendar-today" size={20} color="#5C6BC0" style={styles.icon} />
        <Text style={styles.text}>Tarih: {formatDate(event.date)}</Text>
      </View>

      <View style={styles.infoBox}>
        <Feather name="map-pin" size={20} color="#5C6BC0" style={styles.icon} />
        <Text style={styles.text}>Konum: {event.location}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9F9F9',
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  icon: {
    marginRight: 12,
    marginTop: 2,
  },
  text: {
    flex: 1,
    fontSize: 15,
    color: '#444',
  },
});