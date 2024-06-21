import React, {useContext, useEffect, useState} from 'react';
import { StyleSheet, View, Text, ImageBackground, ScrollView, TextInput } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {NotificationContext} from "../../../components/notification/NotificationContext";
import InputText from "../../../components/InputText";
import AddButton from "../../../components/AddButton";


export function ServiceEditProfile({ navigation }) {
    const [inputs, setInputs] = useState({
        userID: '',
        username: '',
        email: '',
    });
    const [fields, setFields] = useState([]);
    const [canFetchProfile, setCanFetchProfile] = useState(false);
    const { showNotification, setColor  } = useContext(NotificationContext);

    // This effect runs once and fetches the token and user ID
    useEffect(() => {
        async function loadUserProfile() {
            const token = await AsyncStorage.getItem('userToken');
            console.log("Antes...")
            if (token) {
                const response = await fetch('http://localhost:9002/validateToken', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setInputs(prevInputs => ({
                        ...prevInputs,
                        userID: data.userId,
                    }));
                    setCanFetchProfile(true); // Enable fetching more details
                } else {
                    console.error('Token validation failed:', data.message);
                    setCanFetchProfile(false);
                }
            }
        }
        loadUserProfile().then();
    }, []);

    // This effect runs only when canFetchProfile is set to true
    useEffect(() => {
        if (canFetchProfile) {
            async function fetchAndSetUser() {
                try {
                    const response = await fetch(`http://localhost:9002/user/${inputs.userID}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await response.json();
                    setInputs(prevInputs => ({
                        ...prevInputs,
                        username: data.username,
                        email: data.email,
                    }));
                } catch (error) {
                    console.error('Error:', error);
                }
            }
            fetchAndSetUser().then();
        }
    }, [canFetchProfile, inputs.userID]); // Depend on canFetchProfile



    // Función que se encarga de cambiar el valor de los inputs en tiempo real
    const handleInputChange = (field, value) => {
        setFields(prevFields => Array.from(new Set([...prevFields, field])));
        setInputs(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    // Función que se encarga de guardar los cambios en cada campo
    const handleEachSave = async () => {
        for (const field of fields) {
            await handleSave(field);
        }
    };

    //función que se encarga de enviar los datos al backend, y muestra un mensaje de éxito o error
    const handleSave = async (field) => {
        const newValue = inputs[field];
        const {userID, username, name, surname, domicilio, password, email} = inputs;

        if (field === 'email' && !newValue.includes('@')) {
            showNotification('Please enter a valid email address.');
            return;
        }
        if (field === 'password' && newValue.length < 8) {
            showNotification('Password must be at least 8 characters.');
            return;
        }
        if (field === 'username' && (username === '' || name === '' || surname === '' || domicilio === '')) {
            showNotification('Please fill in all fields.');
            return;
        }

        console.log(`Attempting to save ${field} with value: ${newValue}`);


        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await fetch('http://localhost:9002/editProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,  // Include the JWT
                },
                body: JSON.stringify({
                    userId: userID,
                    field: field,
                    value: newValue,
                }),
            });

            console.log('Server response:', response);
            console.log('token:' + token);

            if (!response.ok) {
                console.error('Network response was not ok');
                setColor('red')
                showNotification('Failed to update profile. Please try again.');
            }

            setColor('#32cd32')
            showNotification(`Updated profile successfully!`);
            navigation.navigate('UnlockedScreenService')
        } catch (error) {
            console.error('Error updating profile:', error);
            setColor('red')
            showNotification('Failed to update profile. Please try again.');
        }
    }

    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <Text style={styles.title}>Edit Profile</Text>
            <View style={styles.inputs}>
                <InputText
                    label={'Username'}
                    onChangeText={(text) => handleInputChange("username", text)}
                    value={inputs["username"]}
                    placeholder={inputs["username"]}
                />
                <InputText
                    label={'Email'}
                    onChangeText={(text) => handleInputChange("email", text)}
                    value={inputs["email"]}
                    placeholder={inputs["email"]}
                />
            </View>
            <AddButton onPress={handleEachSave} text={'Save'} />
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
        justifyContent: "space-between"
    },
    title: {
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    inputs: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    }
});


