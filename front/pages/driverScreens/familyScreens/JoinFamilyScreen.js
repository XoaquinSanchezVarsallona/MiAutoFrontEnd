import React, {useContext, useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, ImageBackground, Pressable} from 'react-native';
import {NotificationContext} from "../../../components/notification/NotificationContext";
import InputText from "../../../components/InputText";
import AddButton from "../../../components/AddButton";

function JoinFamilyScreen({ navigation, route }) {
    const [surname, setSurname] = useState('');
    const [password, setPassword] = useState('');
    const { username, email } = route.params;
    const { showNotification, setColor } = useContext(NotificationContext);

    const joinToFamily = async () => {
        try {
            const response = await fetch(`http://localhost:9002/user/${username}/joinToFamily`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ surname, password }),
            });
            if (response.ok) {

                const familias = await response.json(); // Parse the JSON response from the server

                setColor('#32cd32')
                showNotification('Joined to added successfully');

                navigation.navigate('FamilyProfile', { email: email, families: familias, username: username });

            } else if (response.status === 404) {
                showNotification("Family doesn't exist");
            } else if (response.status === 400) {
                showNotification("You are already in that family");
            } else if (response.status === 401) {
                showNotification("Incorrect password");
            } else {
                showNotification('Failed to join to family. Please try again.');
            }
            setColor('red')
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.container}>
                <Text style={styles.title}>Join to Family</Text>
                <View style={styles.inputContainer}>
                    <InputText
                        label="Surname"
                        value={surname}
                        onChangeText={setSurname}
                        placeholder="Surname"
                    />
                    <InputText
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Password"
                        secureTextEntry
                    />
                </View>
                <AddButton onPress={joinToFamily} text={"Join to Family"} />
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        width: '100%',
    },
    title: {
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingLeft: 10,
    },
    joinFamilyButton: {
        width: '20%',
        paddingVertical: 12, // Increase padding for a larger touch area
        paddingHorizontal: 20,
        marginVertical: 8,
        backgroundColor: '#32cd32', // A vibrant green color
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    },
    joinFamilyText: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500',
        textAlign: 'center',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 10,
    },
});

export default JoinFamilyScreen;