import {StyleSheet, View, Text, ImageBackground, TextInput, Button, Pressable} from 'react-native';
import React, {useContext, useState} from "react";
import {NotificationContext} from "../../components/notification/NotificationContext";
import AddButton from "../../components/AddButton";
import InputText from "../../components/InputText";
import Select from "react-select";

export function AddNewStore({ navigation, route }) {
    const { email } = route.params;
    const [storeEmail, setStoreEmail] = useState('');
    const [storeName, setStoreName] = useState('');
    const [domicilio, setDomicilio] = useState('');
    const [tipoDeServicio, setTipoDeServicio] = useState('');
    const { showNotification, setColor } = useContext(NotificationContext);

    const addStore = async () => {
        try {
            console.log(email);
            const response = await fetch(`http://localhost:9002/stores/addStore`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, storeEmail, storeName, domicilio, tipoDeServicio }),
            });
            if (response.ok) {
                setColor('#32cd32');
                showNotification('Store added successfully');
                navigation.navigate('UnlockedScreenService', { email: email });
            } else if (response.status === 400) {
                const errorMessage = await response.text();
                alert(errorMessage);
            } else {
                setColor('red');
                showNotification('Failed to add store');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const serviceOptions = [
        { value: 'mecanico', label: 'Mechanic' },
        { value: 'estacion de servicio', label: 'Service Station' },
        { value: 'lavadero', label: 'Car Wash' }
    ];

    return (
        <ImageBackground source={require('../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <Text style={styles.title}>Add a new Store</Text>
            <View style={[styles.pickerContainer, { overflow: 'visible' }]}>
                <Text style={styles.label}>Service Type</Text>
                <Select
                    options={serviceOptions}
                    value={serviceOptions.find(option => option.value === tipoDeServicio)}
                    onChange={(selectedOption) => setTipoDeServicio(selectedOption.value)}
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
                        }),
                    }}
                />
            </View>
            <InputText
                label={'Store Email'}
                onChangeText={(text) => setStoreEmail(text)}
                value={storeEmail}
                placeholder={'Store Email'}
            />
            <InputText
                label={'Store Name'}
                onChangeText={(text) => setStoreName(text)}
                value={storeName}
                placeholder={'Store Name'}
            />
            <InputText
                label={'Address'}
                onChangeText={(text) => setDomicilio(text)}
                value={domicilio}
                placeholder={'Address'}
            />
            <AddButton onPress={addStore} text={'Add Store'} />
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
    addVehicleText: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500',
        textAlign: 'center',
    },
    input: {
        color: 'white',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingLeft: 10,
    },
    label: {
        alignSelf: 'flex-start',
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    pickerContainer: {
        flex: 1,
        width: '20%',
        marginBottom: 20,
        alignSelf: 'center',
        zIndex: 9999,
    },
});