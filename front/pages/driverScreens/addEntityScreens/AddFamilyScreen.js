import React, { useState, useContext } from 'react';
import {View, Text, TextInput, StyleSheet, ImageBackground, Pressable,} from 'react-native';
import {NotificationContext} from "../../../components/notification/NotificationContext";
import InputText from "../../../components/InputText";
import AddButton from "../../../components/AddButton";

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
                <View style={styles.inputContainer}>
                    <InputText
                        value={surname}
                        onChangeText={setSurname}
                        placeholder="Surname"
                        label={"Surname"}
                    />
                    <InputText
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Password"
                        label={"Password"}
                        secureTextEntry={true}
                    />
                </View>
                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : <Text style={styles.errorText}></Text>}
                <AddButton onPress={addFamily} text={"Add new Family"}/>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: 16,
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
    inputContainer: {
        width: '100%',
        marginBottom: 10,
    }
});

export default AddFamilyScreen;