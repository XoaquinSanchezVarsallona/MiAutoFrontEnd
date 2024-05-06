import React, {useEffect, useState} from 'react';
import { StyleSheet, View, Text, ImageBackground, ScrollView, TextInput } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import StyledButton2 from "../../../components/StyledButton2";

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

export function EditProfile({  }) {
    //const userToken  = AsyncStorage.getItem("userToken"); // agarro el token del authContext (si esta loggineado, lo va a tener)

    const [inputs, setInputs] = useState({
        userID: '',
        username: '',
        domicilio: '',
        name: '',
        surname: '',
        email: '',
    });
    const [canFetchProfile, setCanFetchProfile] = useState(false);

    // This effect runs once and fetches the token and user ID
    useEffect(() => {
        async function loadUserProfile() {
            const token = await AsyncStorage.getItem('userToken');
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
                        username: data.username,
                    }));
                    setCanFetchProfile(true); // Enable fetching more details
                } else {
                    console.error('Token validation failed:', data.message);
                    setCanFetchProfile(false);
                }
            }
        }
        loadUserProfile().then(r => console.log(r));
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
                        domicilio: data.domicilio,
                        name: data.name,
                        surname: data.surname,
                        email: data.email,
                    }));
                } catch (error) {
                    console.error('Error:', error);
                }
            }
            fetchAndSetUser().then(r => console.log(r));
        }
    }, [canFetchProfile, inputs.userID]); // Depend on canFetchProfile



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
                <View style={styles.columnsContainer}>
                    <View style={styles.column}>
                        {fields.slice(0, 3).map((field, index) => (
                            <View key={index} style={styles.inputContainer}>
                                <Text style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
                                <View style={styles.inputRow}>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={(text) => handleInputChange(field, text)}
                                        value={inputs[field]}
                                        placeholder={inputs[field]}
                                    />
                                    <StyledButton2
                                        icon={icons[`Edit ${field}`]}
                                        onPress={() => handleSave(field)}
                                    />
                                </View>
                            </View>
                        ))}
                    </View>
                    <View style={styles.column}>
                        {fields.slice(3, 6).map((field, index) => (
                            <View key={index} style={styles.inputContainer}>
                                <Text style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
                                <View style={styles.inputRow}>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={(text) => handleInputChange(field, text)}
                                        value={inputs[field]}
                                        placeholder={inputs[field]}
                                    />
                                    <StyledButton2
                                        icon={icons[`Edit ${field}`]}
                                        onPress={() => handleSave(field)}
                                    />
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
    },
    columnsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    column: {
        flexDirection: 'column',
        width: '50%',
        padding: 25,
    },
    scrollContainer: {
        alignItems: 'center',
    },
    label: {
        alignSelf: 'flex-start',
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 2,
    },
    inputContainer: {
        flexDirection: 'column',
        width: '25%',
        alignItems: 'center',
    },
    inputRow: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
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
});


