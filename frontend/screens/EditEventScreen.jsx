import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function EditEventScreen() {
    const [eventData, setEventData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
    });

    const navigation = useNavigation();
    const route = useRoute();
    const { id } = route.params;

    useEffect(() => {
        const fetchEvent = async () => {
            const token = await AsyncStorage.getItem('token');
            const res = await axios.get(`http://192.168.1.37:5000/events/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEventData(res.data.data);
        };
        fetchEvent();
    }, [id]);

    const { mutate, isPending } = useMutation({
        mutationFn: async (updatedData) => {
            const token = await AsyncStorage.getItem('token');
            const res = await axios.put(`http://192.168.1.37:5000/events/${id}`, updatedData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        },
        onSuccess: () => {
            Alert.alert('Başarılı', 'Etkinlik güncellendi.');
            navigation.goBack();
        },
        onError: (error) => {
            console.error("Güncelleme hatası:", error);
            Alert.alert('Hata', 'Etkinlik güncellenemedi.');
        },
    });

    const handleUpdate = () => {
        mutate(eventData);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Etkinlik Başlığı</Text>
            <TextInput
                style={styles.input}
                value={eventData.title}
                onChangeText={(text) => setEventData({ ...eventData, title: text })}
            />

            <Text style={styles.label}>Açıklama</Text>
            <TextInput
                style={styles.input}
                value={eventData.description}
                onChangeText={(text) => setEventData({ ...eventData, description: text })}
            />

            <Text style={styles.label}>Tarih</Text>
            <TextInput
                style={styles.input}
                value={eventData.date}
                onChangeText={(text) => setEventData({ ...eventData, date: text })}
            />

            <Text style={styles.label}>Konum</Text>
            <TextInput
                style={styles.input}
                value={eventData.location}
                onChangeText={(text) => setEventData({ ...eventData, location: text })}
            />

            <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={isPending}>
                {isPending ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={styles.buttonText}>Güncelle</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 6,
        color: '#333',
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 },
        elevation: 1,
    },
    button: {
        backgroundColor: '#5C6BC0',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
