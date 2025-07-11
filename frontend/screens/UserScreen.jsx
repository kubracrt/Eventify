import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useContext } from 'react';
import { useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AuthContext } from '@/context/AuthContext';
import { Button } from '@react-navigation/elements';

export default function UserScreen() {
    const navigation = useNavigation();

    const fetchEvents = async () => {
        const userId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`http://192.168.1.37:5000/events/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.data;
    };

    const { data: events, isLoading, isError } = useQuery({
        queryKey: ['events'],
        queryFn: fetchEvents,
    });

    const { logout } = useContext(AuthContext);

    const handleLogout = async () => {
        try {
            logout();
            navigation.navigate('Login');
            Alert.alert("Çıkış Başarılı", "Başarıyla çıkış yaptınız.");
        } catch (error) {
            Alert.alert("Hata", "Çıkış yaparken bir sorun oluştu.");
        }
    };

    const { mutate: deleteEvent, isPending: isDeleting } = useMutation({
        mutationFn: async (eventId) => {
            const token = await AsyncStorage.getItem('token');
            const res = await axios.delete(`http://192.168.1.37:5000/events/${eventId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        },
        onSuccess: () => {
            Alert.alert("Başarılı", "Etkinlik silindi.");
        },
        onError: () => {
            Alert.alert("Hata", "Etkinlik silinemedi.");
        }
    });

    const Item = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <TouchableOpacity onPress={() => deleteEvent(item.id)}>
                    <MaterialIcons name="delete" size={22} color="#D32F2F" />
                </TouchableOpacity>
            </View>
            <Text style={styles.cardText}>{new Date(item.date).toLocaleDateString()}</Text>
            <Text style={styles.cardText}>{item.location}</Text>
            <Text style={styles.cardText}>{item.description}</Text>
            <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('EditEventScreen', { id: item.id })}
            >
                <Text style={styles.editButtonText}>Düzenle</Text>
            </TouchableOpacity>
        </View >
    );

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
                <Text style={{ color: '#555' }}>Kullanıcının etkinlik bilgileri yüklenemedi.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Profil Bilgileri</Text>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <MaterialIcons name="logout" size={20} color="white" />
                    <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.sectionHeader}>
                <Text style={styles.title}>Etkinliklerim</Text>
            </View>
            <FlatList
                data={events}
                keyExtractor={(item) => item.id.toString()}
                renderItem={Item}
                contentContainerStyle={{ padding: 16 }}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        backgroundColor: '#5C6BC0',
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 16,
    },
    headerText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    title: {
        color: '#5C6BC0',
        fontSize: 18,
        fontWeight: 'bold',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ecab53',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 6,
    },
    logoutButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        marginLeft: 6,
    },
    sectionHeader: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    card: {
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 12,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#333',
    },
    cardText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
    },
    editButton: {
        marginTop: 10,
        alignSelf: 'flex-start',
        backgroundColor: '#5C6BC0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    editButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
