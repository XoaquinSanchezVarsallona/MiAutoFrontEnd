import React, { useState } from 'react';
import { Button, ImageBackground, StyleSheet, Text, TextInput, View } from 'react-native';

export function AddAlertScreen({ navigation, route }) {
    const [message, setMessage] = useState('');
    const [apellido, setApellido] = useState('');
    const { email, username } = route.params;

    const addAlert = async () => {
        try {
            const response = await fetch(`http://localhost:9002/alerts/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    apellido: apellido,
                    username: username,
                }),
            });

            if (response.ok) {
                console.log('Alert added successfully');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'UnlockedScreenDriver', params: { email: email }}],
                });
            } else {
                console.log('Failed to add alert');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <ImageBackground source={require('../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Add Alert</Text>

                <TextInput
                    style={styles.input}
                    onChangeText={setMessage}
                    value={message}
                    placeholder="Enter message"
                />

                <TextInput
                    style={styles.input}
                    onChangeText={setApellido}
                    value={apellido}
                    placeholder="Enter family's apellido"
                />

                <Button title="Add Alert" onPress={addAlert} />
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    headerContainer: {
        width: '80%',
        alignItems: 'center',
    },
    title: {
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        height: 40,
        width: '100%',
        margin: 12,
        borderWidth: 1,
        padding: 10,
        backgroundColor: 'white',
    },
});