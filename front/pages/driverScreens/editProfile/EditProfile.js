import React, { useState } from 'react';
import { StyleSheet, View, Text, ImageBackground, ScrollView, TextInput } from 'react-native';
import StyledButton from "../../../components/StyledButton";

const icons = {
    'Edit Profile': require('../../../assets/pencil.png'),
    'Edit Domicilio': require('../../../assets/pencil.png'),
    'Edit Name': require('../../../assets/pencil.png'),
    'Edit Password': require('../../../assets/pencil.png'),
    'Edit Email': require('../../../assets/pencil.png'),
    'Edit Surname': require('../../../assets/pencil.png'),
    'Edit Username': require('../../../assets/pencil.png')
};

const fields = [
    'Profile', 'Domicilio', 'Name', 'Password', 'Email', 'Surname', 'Username'
];

export function EditProfile({ navigation }) {
    //esto tendrá los valores de los inputs
    const [inputs, setInputs] = useState({
        Profile: '',
        Domicilio: '',
        Name: '',
        Password: '',
        Email: '',
        Surname: '',
        Username: '',
    });

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
        console.log(`Attempting to save ${field} with value: ${newValue}`);


        try {
            // Performing a POST request to the API endpoint
            const response = await fetch('http://localhost:9002/editProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': 'Bearer yourToken', // Add your auth token or other authentication method
                },
                body: JSON.stringify({
                    field: field,
                    value: newValue,
                }),
            });

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
                        <StyledButton
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
        borderColor: 'gray',
        borderWidth: 1,
        marginRight: 10,
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    buttonText: {
        fontSize: 16,
        marginLeft: 10,
    },
});
