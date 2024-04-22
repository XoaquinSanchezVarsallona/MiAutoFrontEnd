import React, { useState } from 'react';
import {View, Text, TextInput, Button, StyleSheet, ImageBackground} from 'react-native';

function JoinFamilyScreen({ navigation, route }) {
    const [surname, setSurname] = useState('');
    const { username, email } = route.params;

    const joinToFamily = async () => {
        try {
            const response = await fetch(`http://localhost:9002/user/${username}/joinToFamily`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ surname }),
            });
            if (response.ok) {
                alert('Join to family successfully');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'UnlockedScreenDriver', params: { email: email }}],
                });
            } else if (response.status === 404) {
                alert("Family doesn't exist");
            } else if (response.status === 400) {
                alert("You are already in that family");
            } else {
                alert('Failed to join to family. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.container}>
                <Text>Join to Family</Text>
                <TextInput
                    style={styles.input}
                    value={surname}
                    onChangeText={setSurname}
                    placeholder="Surname"
                />
                <Button title="Join to Family" onPress={joinToFamily} />
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingLeft: 10,
    },
});

export default JoinFamilyScreen;