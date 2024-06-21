import React, {useState, useEffect, useContext} from 'react';
import {StyleSheet, View, Text, ImageBackground, ScrollView, TextInput, Pressable} from 'react-native';
import {Picker} from "react-native-web";
import Select from 'react-select';

import {NotificationContext} from "../../components/notification/NotificationContext";
import InputText from "../../components/InputText";
import AddButton from "../../components/AddButton";

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

    const serviceOptions = [
        { value: 'mecanico', label: 'Mechanic' },
        { value: 'estacion de servicio', label: 'Service Station' },
        { value: 'lavadero', label: 'Car Wash' }
    ];

    return (
        <ImageBackground source={require('../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <Text style={styles.title}>Edit Profile</Text>
            <View style={styles.row}>
                <InputText
                    label={"Email"}
                    onChangeText={(text) => handleInputChange("Email", text)}
                    value={inputs["Email"]}
                    placeholder={inputs["Email"]}
                />
                <InputText
                    label={"StoreName"}
                    onChangeText={(text) => handleInputChange("StoreName", text)}
                    value={inputs["StoreName"]}
                    placeholder={inputs["StoreName"]}
                />
                <InputText
                    label={"Address"}
                    onChangeText={(text) => handleInputChange("Domicilio", text)}
                    value={inputs["Domicilio"]}
                    placeholder={inputs["Domicilio"]}
                />
            </View>
            <View style={styles.row}>
                <View style={styles.pickerContainer}>
                    <Text style={styles.label}>Service Type</Text>
                    <Select
                        options={serviceOptions}
                        value={serviceOptions.find(option => option.value === inputs["TipoDeServicio"])}
                        onChange={(selectedOption) => handleInputChange("TipoDeServicio", selectedOption.value)}
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                backgroundColor: 'transparent',
                                color: 'white',
                                borderColor: 'gray',
                                borderWidth: 1,
                                borderRadius: 5,
                            }),
                            singleValue: (provided) => ({
                                ...provided,
                                color: 'white',
                            }),
                            menu: (provided) => ({
                                ...provided,
                                color: 'black',
                                zIndex: 9999,
                                position: 'relative',
                            })
                        }}
                    />
                </View>
                <InputText
                    label={"Description"}
                    value={inputs["Description"]}
                    onChangeText={(text) => handleInputChange("Description", text)}
                    placeholder={inputs["Description"]}
                    multiline={true}
                />
                <InputText
                    label={"Phone Number"}
                    onChangeText={(text) => handleInputChange("PhoneNumber", text)}
                    value={inputs["PhoneNumber"]}
                    placeholder={inputs["PhoneNumber"]}
                />
            </View>
            <View style={styles.row}>
                <InputText
                    label={"WebPage Link"}
                    onChangeText={(text) => handleInputChange("WebPageLink", text)}
                    value={inputs["WebPageLink"]}
                    placeholder={inputs["WebPageLink"]}
                />
                <InputText
                    label={"Instagram Link"}
                    onChangeText={(text) => handleInputChange("InstagramLink", text)}
                    value={inputs["InstagramLink"]}
                    placeholder={inputs["InstagramLink"]}
                />
                <InputText
                    label={"GoogleMaps Link"}
                    onChangeText={(text) => handleInputChange("GoogleMapsLink", text)}
                    value={inputs["GoogleMapsLink"]}
                    placeholder={inputs["GoogleMapsLink"]}
                />
            </View>
            <AddButton text={"Save"} onPress={handleSave} />
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
    row: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-around',
        width: '80%',
    },
    picker: {
        height: 40,
        width: '100%',
        color: 'white',
        marginRight: 10,
        backgroundColor: 'transparent',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
    },
    title: {
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    pickerItem: {
        color: 'black',
        backgroundColor: 'transparent',
    },
    label: {
        alignSelf: 'flex-start',
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    pickerContainer: {
        width: '20%',
        marginBottom: 20,
        alignSelf: 'center',
    },
});