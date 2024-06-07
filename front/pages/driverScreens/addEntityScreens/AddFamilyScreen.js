import React, { useState, useContext } from 'react';
import {View, Text, TextInput, StyleSheet, ImageBackground, Pressable,} from 'react-native';
import {NotificationContext} from "../../../components/notification/NotificationContext";

function AddFamilyScreen({ navigation, route }) {
    const [surname, setSurname] = useState('');
    const [password, setPassword] = useState(''); // Add this line
    const { username, email } = route.params;
    const [errorMessage, setErrorMessage] = useState('');
    const inputStyleSurname = surname.length > 0 ? styles.inputNormal : styles.inputItalic;
    const inputStylePassword = password.length > 0 ? styles.inputNormal : styles.inputItalic;
    const { showNotification, setColor } = useContext(NotificationContext);

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
                navigation.navigate('FamilyProfile', { email: email, families: familias, username: username });
                setColor('#32cd32')
                showNotification("Family added successfully")
            } else if (response.status === 400) {
                setErrorMessage('Family already exists')
                console.error('Family already exists')
            } else {
                setErrorMessage('Failed to add family')
                console.error('Failed to add family');
            }
        } catch (error) {
            setErrorMessage(error.message || 'Add family error. Please try again.')
            console.error('Error:', error);
        }
    };

    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.container}>
                    <Text style={styles.title}>Add New Family</Text>
                    <Text style={styles.label}>Surname</Text>
                    <TextInput
                            style={inputStyleSurname}
                            value={surname}
                            onChangeText={setSurname}
                            placeholder="Surname"
                        />
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={inputStylePassword}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Password"
                        secureTextEntry={true}
                    />
                    {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : <Text style={styles.errorText}></Text>}
                    <Pressable style={styles.addFamilyButton} onPress={() => { addFamily().then() }}>
                        <Text style={styles.addFamilyText}>Add new Family</Text>
                    </Pressable>
                </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
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
    inputNormal: {
        width: '100%',
        color: 'white',
        borderColor: 'gray',
        padding: 10,
        borderRadius: 2,
        borderWidth: 1,
    },
    inputItalic: {
        width: '100%',
        color: '#FFFFFF80',
        borderColor: 'gray',
        padding: 10,
        marginBottom: 5,
        fontStyle: 'italic',
        borderWidth: 1,
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
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    addFamilyText: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500',
        textAlign: 'center',
    },
});

export default AddFamilyScreen;