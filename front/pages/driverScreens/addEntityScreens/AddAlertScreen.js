import React, {useContext, useState} from 'react';
import {ImageBackground, Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import {NotificationContext} from "../../../components/notification/NotificationContext";
import InputText from "../../../components/InputText";

export function AddAlertScreen({ navigation, route }) {
    const [message, setMessage] = useState('');
    const { family, email, username } = route.params;
    const { showNotification, setColor } = useContext(NotificationContext);

    const addAlert = async () => {
        try {
            const response = await fetch(`http://localhost:9002/alertas/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    apellido: family.surname,
                    username: username,
                }),
            });

            if (response.ok) {
                setColor('#32cd32')
                showNotification('Alert added successfully');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'UnlockedScreenDriver', params: { email: email }}],
                });
            } else {
                setColor('red')
                showNotification('Failed to add alert');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>New Alert Description</Text>
            </View>
            <InputText
                label="Message"
                value={message}
                onChangeText={setMessage}
                placeholder="Enter message"
            />
            <Pressable style={styles.addAlertButton} onPress={addAlert}>
                <Text style={styles.addAlertText}>Add alert</Text>
            </Pressable>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    addAlertButton: {
        width: '30%',
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginVertical: 10,
        backgroundColor: '#32cd32',
        borderRadius: 20,
        alignSelf: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    addAlertText: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500',
        textAlign: 'center',
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
    label: {
        alignSelf: 'flex-start',
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 3,
    },
    input: {
        height: 40,
        width: '100%',
        margin: 12,
        borderWidth: 1,
        padding: 10,
        backgroundColor: 'white',
    },
    inputTextholder: {
        width: '100%',
        color: 'white',
        borderColor: 'gray',
        padding: 10,
        borderRadius: 2,
        borderWidth: 1,
    },
});