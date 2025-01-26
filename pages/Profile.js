import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';

const Profile = () => {
    const [userName, setUserName] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const user = await AsyncStorage.getItem('user');
                if (user) {
                    const userData = JSON.parse(user);
                    setUserName(userData.user.name);
                }
            } catch (error) {
                console.error('Failed to fetch user name:', error);
            }
        };

        fetchUserName();
    }, []);

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('user');
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                })
            );
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Bienvenido, {userName}.</Text>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    text: {
        fontSize: 16,
    },
    button: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#578e7e',
        borderRadius: 8,
    },
    buttonText: {
        color: '#f5ecd5',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Profile;