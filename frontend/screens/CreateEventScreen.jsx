import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import { useMutation } from '@tanstack/react-query';

export default function CreateEventScreen() {
  const navigation = useNavigation();
  const [event, setEvent] = useState({
    user_id: '',
    title: '',
    description: '',
    location: '',
    date: ''
  });

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setEvent((prev) => ({ ...prev, user_id: id }));
    };
    fetchUserId();
  }, []);

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData) => {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.post(`http://192.168.1.37:5000/events`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    onSuccess: () => {
      Alert.alert('Başarılı', 'Etkinlik oluşturuldu.');
      navigation.navigate('Home');
    },
    onError: (error) => {
      console.error('Hata:', error);
      Alert.alert('Hata', 'Etkinlik oluşturulamadı.');
    },
  });

  const handleSubmit = () => {
    const { title, description, location, date, user_id } = event;
    if (!title || !description || !location || !date || !user_id) {
      return Alert.alert('Uyarı', 'Lütfen tüm alanları doldurun.');
    }
    mutate(event);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Etkinlik Oluştur</Text>

      <View style={styles.inputGroup}>
        <FontAwesome name="pencil" size={20} color="#5C6BC0" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Etkinlik Başlığı"
          value={event.title}
          onChangeText={(text) => setEvent({ ...event, title: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Feather name="file-text" size={20} color="#5C6BC0" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Etkinlik Açıklaması"
          value={event.description}
          onChangeText={(text) => setEvent({ ...event, description: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <MaterialIcons name="calendar-today" size={20} color="#5C6BC0" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Tarih (YYYY-MM-DD)"
          value={event.date}
          onChangeText={(text) => setEvent({ ...event, date: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Feather name="map-pin" size={20} color="#5C6BC0" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Etkinlik Konumu"
          value={event.location}
          onChangeText={(text) => setEvent({ ...event, location: text })}
        />
      </View>

      <TouchableOpacity onPress={handleSubmit} style={styles.buttonWrapper} disabled={isPending}>
        <LinearGradient
          colors={['#5C6BC0', '#bfbfff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            {isPending ? 'Kaydediliyor...' : 'Etkinliği Kaydet'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  buttonWrapper: {
    marginTop: 30,
    borderRadius: 12,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});