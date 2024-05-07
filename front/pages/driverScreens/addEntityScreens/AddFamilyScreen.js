import React, { useState } from 'react';
import {View, Text, TextInput, Button, StyleSheet, ImageBackground, Pressable,} from 'react-native';

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
                    <Text style={styles.label}>Surname</Text>
                    <TextInput
                            style={styles.input}
                            value={surname}
                            onChangeText={setSurname}
                            placeholder="Surname"
                        />
                    <Text style={styles.label}>Password</Text>
                    <TextInput // Add this block
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Password"
                        secureTextEntry={true}
                    />
                    {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : <Text style={styles.errorText}></Text>}
                    <Pressable style={styles.addFamilyButton} onPress={() => { addFamily() }}>
                        <Text style={styles.addFamilyText}>Add new Family</Text>
                    </Pressable>
                </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start', // Start content from the top
        alignItems: 'center', // Center content horizontally
        padding: 16,
    },
    label: {
        alignSelf: 'flex-start',
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 2,
        marginBottom: 3,
    },
    input: {
        width: '100%',
        color: '#FFFFFF80',
        borderColor: 'gray',
        padding: 10,
        borderRadius: 2,
        borderWidth: 1,
        marginBottom: 15,
    },
    title: {
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        paddingBottom: 20,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
    },
    addFamilyButton: {
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
    addFamilyText: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500',
        textAlign: 'center',
    },
});

export default AddFamilyScreen;