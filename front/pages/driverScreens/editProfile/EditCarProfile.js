import React, {useContext, useState} from 'react';
import { StyleSheet, View, Text, ImageBackground, ScrollView, TextInput } from 'react-native';
import StyledButton from "../../../components/StyledButton";
import StyledButton3 from "../../../components/StyleButton3";
import {NotificationContext} from "../../../components/notification/NotificationContext";

const icons = {
    'Edit username': require('../../../assets/pencil.png'),
    'Edit name': require('../../../assets/pencil.png'),
    'Edit password': require('../../../assets/pencil.png'),
    'Edit email': require('../../../assets/pencil.png'),
    'Edit surname': require('../../../assets/pencil.png'),
    'Edit domicilio': require('../../../assets/pencil.png'),

};

const fields = [
    'marca', 'modelo', 'fechaVencimientoSeguro', 'fechaVencimientoVTV','ano', 'kilometraje', 'patente'
];

export function EditCarProfile({ navigation , route}) {

    //esto tendrá los valores de los inputs
    const [inputs, setInputs] = useState({
        marca: '',
        fechaVencimientoSeguro: '',
        fechaVencimientoVTV: '',
        ano: '',
        kilometraje: '',
        patente: '',
    });
    const { showNotification, setColor } = useContext(NotificationContext);

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
        const patente = route.params.patente;
        console.log(`Attempting to save ${field} with value: ${newValue}`);
        console.log(`Patente is ${patente}`)


        try {
            const response = await fetch('http://localhost:9002/editCarProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    patente: patente,
                    field: field,
                    value: newValue,
                }),
            });

            console.log('Server response:', response);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json(); // Assuming the server responds with JSON
            console.log(`Server response: `, data);

            // Update UI or notify user based on success
            setColor('#32cd32')
            showNotification(`Updated ${field} successfully!`);
        } catch (error) {
            console.error('Error updating profile:', error);
            setColor('red')
            showNotification('Failed to update profile. Please try again.');
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
                        <StyledButton3
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
