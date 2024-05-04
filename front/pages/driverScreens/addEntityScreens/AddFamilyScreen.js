import React, { useState } from 'react';
import {View, Text, TextInput, Button, StyleSheet, ImageBackground,} from 'react-native';

function AddFamilyScreen({ navigation, route }) {
    const [surname, setSurname] = useState('');
    const [password, setPassword] = useState(''); // Add this line
    const { username, email } = route.params;
    const [errorMessage, setErrorMessage] = useState('');

    const addFamily = async () => {
        try {
            const response = await fetch(`http://localhost:9002/user/${username}/addFamily`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ surname, password }),
            });
            if (response.ok) {
                const familias = await response.json(); // Parse the JSON response from the server

                alert('Family added successfully');

                navigation.navigate('FamilyProfile', { email: email, families: familias, username: username });
            } else if (response.status === 400) {
                alert("Family already exists");
            } else {
                console.error('Failed to add family');
            }
        } catch (error) {
            setErrorMessage(error.message || 'Login error. Please try again.')
            console.error('Error:', error);
        }
    };

    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.container}>
                    <Text style={styles.title}>Add New Family</Text>
                    <TextInput
                        style={styles.input}
                        value={surname}
                        onChangeText={setSurname}
                        placeholder="Surname"
                    />
                    <TextInput // Add this block
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Password"
                        //secureTextEntry
                    />
                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : <Text style={styles.errorText}></Text>}
                <Button title="Agregar familia nueva" onPress={addFamily} />
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
        color: 'white',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingLeft: 10,
    },
    title: {
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10,
        alignContent: 'center',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
    },
});

export default AddFamilyScreen;