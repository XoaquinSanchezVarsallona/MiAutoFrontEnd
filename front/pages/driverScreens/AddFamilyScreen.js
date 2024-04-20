import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

function AddFamilyScreen({ navigation }) {
    const [surname, setSurname] = useState('');

    const addFamily = async () => {
        try {
            const response = await fetch('http://localhost:9002/addFamily', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ surname }),
            });
            if (response.ok) {
                alert('Family added successfully');
                navigation.goBack();
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