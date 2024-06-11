import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet, View, Text, ImageBackground, ScrollView, TextInput, Pressable} from 'react-native';
import {Picker} from "react-native-web";
import {NotificationContext} from "../../components/notification/NotificationContext";

const fields = [
    'email', 'storeName', 'domicilio', 'tipoDeServicio', 'description', 'phoneNumber', 'webPageLink', 'instagramLink', 'googleMapsLink'
];

export function EditVisualStoreProfile({ navigation , route}) {

    const [inputs, setInputs] = useState({
        email: route.params.email,
        storeName: '',
        domicilio: '',
        tipoDeServicio: '',
        description: '',
        phoneNumber: '',
        webPageLink: '',
        instagramLink: '',
        googleMapsLink: '',
    });
    const { showNotification, setColor } = useContext(NotificationContext);

    const fetchProfileData = async () => {
        try {
            const response = await fetch('http://localhost:9002/getVisualStoreProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: route.params.email,
                }),
            });

            if (response.ok) {
                console.log('Network response was ok');
            } else {
                console.error('Network response was NOT ok')
            }

            const data = await response.json();

            setInputs(prevState => ({
                ...prevState,
                email: route.params.email,
                storeName: data.storeName || '',
                domicilio: data.domicilio || '',
                tipoDeServicio: data.tipoDeServicio || '',
                description: data.description || '',
                phoneNumber: data.phoneNumber || '',
                webPageLink: data.webPageLink || '',
                instagramLink: data.instagramLink || '',
                googleMapsLink: data.googleMapsLink || '',
            }));

        } catch (error) {
            console.error('Error fetching profile data:', error);
        }
    };

    useEffect(() => {
        fetchProfileData().then();
    }, []);

    const handleInputChange = (field, value) => {
        setInputs(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const handleSave = async () => {
        console.log(`Attempting to save new values:`, inputs);

        try {
            const response = await fetch('http://localhost:9002/editVisualStoreProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputs),
            });

            console.log('Server response:', response);

            if (response.ok) {
                console.log('Network response was ok');
            } else {
                console.error('Network response was NOT ok')
            }

            const data = await response.json();
            console.log(`Server response: `, data);

            setColor('#32cd32');
            showNotification(`Updated profile successfully!`);
            navigation.navigate('UnlockedScreenService', { email: inputs.email });
        } catch (error) {
            console.error('Error updating profile:', error);
            setColor('red');
            showNotification('Failed to update profile. Please try again.');
        }
    };

    return (
        <ImageBackground source={require('../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Edit Profile</Text>
                {fields.map((field, index) => (
                    <View key={index} style={styles.inputContainer}>
                        <Text style={styles.fieldText}>{field}</Text>
                        {field === 'tipoDeServicio' ? (
                            <Picker
                                selectedValue={inputs[field]}
                                onValueChange={(itemValue) => handleInputChange(field, itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label="mecanico" value="mecanico" />
                                <Picker.Item label="estacion de servicio" value="estacion de servicio" />
                                <Picker.Item label="lavadero" value="lavadero" />
                            </Picker>
                        ) : field === 'description' ? (
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => handleInputChange(field, text)}
                                value={inputs[field]}
                                placeholder={`New ${field}`}
                                multiline
                            />
                        ) : (
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => handleInputChange(field, text)}
                                value={inputs[field]}
                                placeholder={`New ${field}`}
                            />
                        )}
                    </View>
                ))}
                <Pressable style={styles.addVehicleButton} onPress={handleSave}>
                    <Text style={styles.addVehicleText}>Save</Text>
                </Pressable>
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
        justifyContent: 'space-between',
        marginBottom: 10,
        flex: 1,
    },
    fieldText: {
        width: 120, // Set a fixed width
        marginRight: 10,
        fontSize: 16,
        color: 'white',
    },
    picker: {
        flex: 1,
        height: 40,
        marginRight: 10,
        paddingHorizontal: 10,
        backgroundColor: 'transparent',
        borderColor: 'gray',
        borderWidth: 1,
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
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    buttonText: {
        fontSize: 16,
        marginLeft: 10,
    },
    addVehicleButton: {
        width: '40%',
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginVertical: 10,
        backgroundColor: '#32cd32',
        borderRadius: 20,
        alignSelf: 'center',
    },
    addVehicleText: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500',
        textAlign: 'center',
    },
});