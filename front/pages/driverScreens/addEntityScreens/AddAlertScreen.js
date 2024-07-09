import React, {useContext, useState} from 'react';
import {ImageBackground, Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import {NotificationContext} from "../../../components/notification/NotificationContext";
import InputText from "../../../components/InputText";
import AddButton from "../../../components/AddButton";

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
                navigation.goBack()
            } else {
                setColor('red')
                showNotification('Failed to add alert');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleAddAlert = () => {
        if (message === '') {
            setColor('red')
            showNotification('Please enter a message');
            return;
        }
        addAlert().then()
    }

    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <Text style={styles.title}>New Alert Description</Text>
            <InputText
                label="Message"
                value={message}
                onChangeText={setMessage}
                placeholder="Enter message"
            />
            <AddButton text={"Add alert"} onPress={handleAddAlert} />
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
});