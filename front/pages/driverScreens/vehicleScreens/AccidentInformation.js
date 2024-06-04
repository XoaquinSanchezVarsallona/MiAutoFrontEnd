import React, {useContext, useEffect} from 'react';
import {View, Text, StyleSheet, ImageBackground, Button, Pressable} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {NotificationContext} from "../../../components/notification/NotificationContext";

export function AccidentInformation({navigation, route}) {
    const { patente } = route.params;
    const [username, setUsername] = React.useState('');
    const { showNotification, setColor } = useContext(NotificationContext);

    useEffect(() => {
        async function loadUserProfile() {
            const token = await AsyncStorage.getItem('userToken');
            if (token) {
                const response = await fetch('http://localhost:9002/validateToken', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setUsername(data.username);
                } else {
                    console.error('Token validation failed:', data.message);
                }
            }
        }
        loadUserProfile().then();
    }, []);

    const sendAlert = async () => {
        try {
            const response = await fetch(`http://localhost:9002/alertas/alertAccident/${username}/${patente}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setColor('#32cd32')
                showNotification('Alert send successfully');
            } else {
                setColor('red')
                showNotification('Failed to send alert');
            }

        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.container}>
                <Text style={styles.title}>Accident Information</Text>
                <Pressable style={styles.confirmButton} onPress={() => { sendAlert().then() }}>
                    <Text style={styles.confirmText}>Confirm Accident</Text>
                </Pressable>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        paddingBottom: 20,
    },
    confirmButton: {
        width: '80%',
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginVertical: 10,
        backgroundColor: '#32cd32',
        borderRadius: 20,
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
    },
    confirmText: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500',
        textAlign: 'center',
    },
});

export default AccidentInformation;