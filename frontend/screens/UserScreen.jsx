import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useContext } from 'react';
import { useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '@/context/AuthContext';

export default function UserScreen() {
    const navigation = useNavigation();

    const fetchEvents = async () => {
        const userId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`http://192.168.1.20:5000/events/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log("Gelen Etkinlikler:", response.data.data);
        return response.data.data;

    }

    const { data: events, isLoading, isError } = useQuery({
        queryKey: ['events'],
        queryFn: fetchEvents,
    });

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

    const { logout } = useContext(AuthContext);


    const handleLogout = async () => {
        try {
            logout();
            navigation.navigate('Login');
            Alert.alert("Çıkış Başarılı", "Başarıyla çıkış yaptınız.");
        } catch (error) {
            console.error("Çıkış yaparken hata oluştu:", error);
            Alert.alert("Hata", "Çıkış yaparken bir sorun oluştu.");
        }
    };

    const Item = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('EventDetail', { id: item.id })}
        >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardText}>📅 {new Date(item.date).toLocaleDateString()}</Text>
            <Text style={styles.cardText}>📍 {item.location}</Text>
            <Text style={styles.cardText}>📝 {item.description}</Text>
        </TouchableOpacity>
    );

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
            </View>            <FlatList
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
        alignItems: 'center',
        backgroundColor: '#5C6BC0',
        paddingHorizontal: 20,
        paddingVertical: 15,
        height: "12%"
    },
    headerText: {
        marginTop: 50,
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    title: {
        color: '#5C6BC0',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoutButton: {
        marginTop: 50,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ecab53',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 4,
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
        f: 18,

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
});
