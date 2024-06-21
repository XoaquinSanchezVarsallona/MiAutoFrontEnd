import React, {useContext, useState} from 'react';
import { StyleSheet, View, Text, ImageBackground, ScrollView, TextInput } from 'react-native';
import StyledButton3 from "../../components/StyleButton3";
import {NotificationContext} from "../../components/notification/NotificationContext";

const icons = {
    'Edit email': require('../../assets/pencil.png'),
    'Edit name': require('../../assets/pencil.png'),
    'Edit domicilio': require('../../assets/pencil.png'),
    'Edit serviceType': require('../../assets/pencil.png'),
};

const fields = [
    'email', 'name', 'domicilio', 'serviceType'
];

export function EditStoreProfile({ navigation , route}) {
    const { showNotification, setColor } = useContext(NotificationContext);
    const [inputs, setInputs] = useState({
        email: '',
        name: '',
        domicilio: '',
        serviceType: '',
    });

    const handleInputChange = (field, value) => {
        setInputs(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const handleSave = async (field) => {
        const newValue = inputs[field];
        const email = route.params.email;
        console.log(`Attempting to save ${field} with value: ${newValue}`);
        console.log(`Email is ${email}`)

        try {
            const response = await fetch('http://localhost:9002/editStoreProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    field: field,
                    value: newValue,
                }),
            });

            console.log('Server response:', response);

            if (!response.ok) {
                console.error('Network response was not ok');
                setColor('red')
                showNotification(`Failed to update ${field}. Please try again.`);
            }

            setColor('#32cd32')
            showNotification(`Updated ${field} successfully!`);
            navigation.navigate('UnlockedScreenService', { email: email });
        } catch (error) {
            console.error('Error updating profile:', error);
            showNotification('Failed to update profile. Please try again.');
        }
    };

    return (
        <ImageBackground source={require('../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
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