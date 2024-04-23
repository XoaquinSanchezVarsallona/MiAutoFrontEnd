import React, {useEffect, useState} from 'react';
import { StyleSheet, View, Text, ImageBackground, ScrollView, TextInput } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import StyledButton2 from "../../../components/StyledButton2";
import StyledButton from "../../../components/StyledButton";

const icons = {
    'Edit username': require('../../../assets/pencil.png'),
    'Edit name': require('../../../assets/pencil.png'),
    'Edit password': require('../../../assets/pencil.png'),
    'Edit email': require('../../../assets/pencil.png'),
    'Edit surname': require('../../../assets/pencil.png'),
    'Edit domicilio': require('../../../assets/pencil.png'),
};

const fields = [
    'username', 'domicilio', 'name', 'password', 'email', 'surname'
];

export function EditProfile({ navigation }) {
    //const userToken  = AsyncStorage.getItem("userToken"); // agarro el token del authContext (si esta loggineado, lo va a tener)


    //esto tendrá los valores de los inputs
    const [inputs, setInputs] = useState({
        userID: '',
        domicilio: '',
        name: '',
        password: '',
        email: '',
        surname: '',
        username: '',
    });

    useEffect(() => {
        const loadUserProfile = async () => {
            const token = await AsyncStorage.getItem('userToken');
            if (token) {
                // Send token to your backend to validate and get user details
                const response = await fetch('http://localhost:9002//validateToken', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setInputs({
                        ...inputs,
                        userID: data.userId,  // Assume your backend sends back the userId
                        username: data.username, // And any other fields needed
                    });
                } else {
                    console.error('Token validation failed:', data.message);
                }
            }
        };

        loadUserProfile();
    }, []);


    //función que se encarga de cambiar el valor de los inputs en tiempo real
    const handleInputChange = (field, value) => {
        setInputs(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    //función que se encarga de enviar los datos al backend, y muestra un mensaje de éxito o error
    const handleSave = async (field) => {
        const newValue = inputs[field];
        const {userID, username, name, surname, domicilio, password, email} = inputs;

        if (field === 'email' && !newValue.includes('@')) {
            alert('Please enter a valid email address.');
            return;
        }
        if (field === 'password' && newValue.length < 8) {
            alert('Password must be at least 8 characters.');
            return;
        }
        if (field === 'username' && (username === '' || name === '' || surname === '' || domicilio === '')) {
            alert('Please fill in all fields.');
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
                throw new Error('Network response was not ok');
            }

            const data = await response.json(); // Assuming the server responds with JSON
            console.log(`Server response: `, data);

            // Update UI or notify user based on success
            alert(`Updated ${field} successfully!`);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Edit Profile</Text>
                {fields.map((field, index) => (
                    <View key={index} style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => handleInputChange(field, text)}
                            value={inputs[field]}
                            placeholder={`New ${field}`}
                        />
                        <StyledButton2
                            icon={icons[`Edit ${field}`]}
                            onPress={() => handleSave(field)}
                        />
                    </View>
                ))}
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    scrollContainer: {
        alignItems: 'center',
        paddingTop: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    input: {
        flex: 1,
        height: 40,
        color: 'white',
        borderColor: 'gray',
        borderWidth: 1,
        marginRight: 10,
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    buttonText: {
        fontSize: 16,
        marginLeft: 10,
    },
});
