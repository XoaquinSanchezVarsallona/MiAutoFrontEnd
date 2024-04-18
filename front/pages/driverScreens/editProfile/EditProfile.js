import React, {useContext, useState} from 'react';
import { StyleSheet, View, Text, ImageBackground, ScrollView, TextInput } from 'react-native';
import StyledButton from "../../../components/StyledButton";
import jwtDecode from 'jwt-decode'; //importo decoder de token
import { AuthContext } from "../../AuthContext";
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage"; //importo authContext




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
    const userToken  = asyncStorage.getItem("userToken"); // agarro el token del authContext (si esta loggineado, lo va a tener)

    //no es seguro -> hacer en backend
    let decodedToken;
    let userID;

    try {
        decodedToken = jwtDecode(userToken); // decode the token
        userID = decodedToken.id; // get the id from the token
    } catch (error) {
        console.error('Error decoding token:', error);
    }

    //esto tendrá los valores de los inputs
    const [inputs, setInputs] = useState({
        userID: userID,
        domicilio: '',
        name: '',
        password: '',
        email: '',
        surname: '',
        username: '',
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
        const userID = inputs.userID;
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
                    userID: userID,
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
