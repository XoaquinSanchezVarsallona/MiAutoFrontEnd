import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet, View, Text, ImageBackground, ScrollView, TextInput, Pressable} from 'react-native';
import {Picker} from "react-native-web";
import {NotificationContext} from "../../components/notification/NotificationContext";
import InputText from "../../components/InputText";
import AddButton from "../../components/AddButton";

const fields = [
    'Email', 'StoreName', 'Domicilio', 'TipoDeServicio', 'Description', 'PhoneNumber', 'WebPageLink', 'InstagramLink', 'GoogleMapsLink'
];

export function EditVisualStoreProfile({ navigation , route}) {

    const [inputs, setInputs] = useState({
        Email: route.params.email,
        StoreName: '',
        Domicilio: '',
        TipoDeServicio: '',
        Description: '',
        PhoneNumber: '',
        WebPageLink: '',
        InstagramLink: '',
        GoogleMapsLink: '',
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
                Email: route.params.email,
                StoreName: data.storeName || '',
                Domicilio: data.domicilio || '',
                TipoDeServicio: data.tipoDeServicio || '',
                Description: data.description || '',
                PhoneNumber: data.phoneNumber || '',
                WebPageLink: data.webPageLink || '',
                InstagramLink: data.instagramLink || '',
                GoogleMapsLink: data.googleMapsLink || '',
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
                        {field === 'TipoDeServicio' ? (
                            <Picker
                                selectedValue={inputs[field]}
                                onValueChange={(itemValue) => handleInputChange(field, itemValue)}
                                style={styles.input}
                            >
                                <Picker.Item label="mecanico" value="mecanico" />
                                <Picker.Item label="estacion de servicio" value="estacion de servicio" />
                                <Picker.Item label="lavadero" value="lavadero" />
                            </Picker>
                        ) : field === 'Description' ? (
                            <InputText
                                label={field}
                                value={inputs[field]}
                                onChangeText={(text) => handleInputChange(field, text)}
                                placeholder={`New ${field}`}
                                multiline={true}
                            />
                        ) : (
                            <InputText
                                label={field}
                                value={inputs[field]}
                                onChangeText={(text) => handleInputChange(field, text)}
                                placeholder={`New ${field}`}
                            />
                        )}
                    </View>
                ))}
                <AddButton text={"Save"} onPress={handleSave} />
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
        width: '60%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        flex: 1,
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
    inputTextholder: {
        width: '100%',
        color: 'white',
        borderColor: 'gray',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
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
});