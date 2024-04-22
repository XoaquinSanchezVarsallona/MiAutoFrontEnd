import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet,  } from 'react-native';

function AddFamilyScreen({ navigation, route }) {
    const [surname, setSurname] = useState('');
    const [password, setPassword] = useState(''); // Add this line
    const { username, email } = route.params;

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
            console.error('Error:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text>Add New Family</Text>
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
            <Button title="Add Family" onPress={addFamily} />
        </View>
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

export default AddFamilyScreen;