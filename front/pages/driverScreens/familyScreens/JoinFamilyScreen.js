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

                const familias = await response.json();

                setColor('#32cd32')
                showNotification('Joined to family successfully');
                navigation.navigate('FamilyProfile', { email: email, families: familias, username: username });
            } else if (response.status === 404) {
                setColor('red')
                showNotification("Family doesn't exist");
            } else if (response.status === 400) {
                setColor('red')
                showNotification("You are already in that family");
            } else if (response.status === 401) {
                setColor('red')
                showNotification("Incorrect password");
            } else {
                setColor('red')
                showNotification('Failed to join to family. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
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
    inputContainer: {
        width: '100%',
        marginBottom: 10,
    },
});

export default JoinFamilyScreen;