import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import CreateEventScreen from '../screens/CreateEventScreen';
import UserScreen from '../screens/UserScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 20,
                    left: '45%',
                    right: '45%',
                    elevation: 10,
                    backgroundColor: '#ffffff',
                    borderRadius: 30,
                    height: 50,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                },
                tabBarItemStyle: {
                    marginTop: 6,
                },
            }}
        >


            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <AntDesign name="home" size={26} color={focused ? '#5C6BC0' : '#999'} />
                    ),
                }}
            />
            <Tab.Screen
                name="UserProfile"
                component={UserScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <AntDesign name="user" size={26} color={focused ? '#5C6BC0' : '#999'} />
                    ),
                }}
            />

        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Home"
                component={MyTabs}
                options={{ headerShown: false }}
            />
            <Stack.Screen name="EventDetail" component={EventDetailScreen}
                options={{
                    title: 'Etkinlik Detayı',
                    headerStyle: {
                        backgroundColor: '#5C6BC0',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }} />
            <Stack.Screen name="CreateEvent" component={CreateEventScreen}
                options={{
                    title: 'Etkinlik Oluşturma',
                    headerStyle: {
                        backgroundColor: '#5C6BC0',
                    },
                    headerTintColor: '#fff', 
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }} />
            <Stack.Screen name="UserProfile" component={UserScreen}
                options={{
                    title: 'Kullanıcı',
                    headerStyle: {
                        backgroundColor: '#5C6BC0',
                    },
                    headerTintColor: '#fff', 
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    }
                }} />
        </Stack.Navigator >
    );
}
