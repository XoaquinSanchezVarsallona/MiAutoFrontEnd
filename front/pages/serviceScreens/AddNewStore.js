import {StyleSheet, View, Text, ImageBackground, TextInput, Button, Pressable} from 'react-native';
import React, {useState} from "react";

export function AddNewStore({ navigation, route }) {
    const { email } = route.params;
    const [storeEmail, setStoreEmail] = useState('');
    const [storeName, setStoreName] = useState('');
    const [domicilio, setDomicilio] = useState('');
    const [tipoDeServicio, setTipoDeServicio] = useState('');

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
                alert('Store added successfully');
                navigation.navigate('UnlockedScreenService', { email: email });
            } else if (response.status === 400) {
                const errorMessage = await response.text();
                alert(errorMessage);
            } else {
                console.error('Failed to add store');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <ImageBackground source={require('../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Add a new Store</Text>
            </View>
            <TextInput
                style={styles.input}
                value={storeEmail}
                onChangeText={setStoreEmail}
                placeholder="Store Email"
            />
            <TextInput
                style={styles.input}
                value={storeName}
                onChangeText={setStoreName}
                placeholder="Store Name"
            />
            <TextInput
                style={styles.input}
                value={domicilio}
                onChangeText={setDomicilio}
                placeholder="Address"
            />
            <TextInput
                style={styles.input}
                value={tipoDeServicio}
                onChangeText={setTipoDeServicio}
                placeholder="Type of Service"
            />
            <Pressable style={styles.addVehicleButton} onPress={ addStore} >
                <Text style={styles.addVehicleText}>Add store</Text>
            </Pressable>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
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
    addVehicleButton: {
        width: '40%',
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginVertical: 10,
        backgroundColor: '#32cd32',
        borderRadius: 20,
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
    },

});