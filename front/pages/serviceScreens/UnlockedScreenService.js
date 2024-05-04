import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, ImageBackground, Pressable, ScrollView} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import StyledButton2 from "../../components/StyledButton2";

export function UnlockedScreenService({ navigation, route }) {
    //me llega el email del usuario
    const { email } = route.params;
    const [stores, setStores] = useState([]);

    //LA GLORIA PARA REFETCHEAR - usefocuseffect y callback sin pasar parametro 
    useFocusEffect(
        React.useCallback(() => {
            const fetchStores = async () => {
                try {
                    const response = await fetch('http://localhost:9002/stores/fetchStores', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email }),
                    });
                    const data = await response.json();
                    setStores(data);
                } catch (error) {
                    console.error('Error:', error);
                }
            };

            fetchStores();
        }, [])
    );


    useEffect(() => {
        fetch('http://localhost:9002/stores/fetchStores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        })
            .then(response => response.json())
            .then(data => setStores(data))
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <ImageBackground source={require('../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Sitios del servicio </Text>
                <StyledButton2
                    style={styles.configurationButton}
                    icon={require('../../assets/configuration.png')}
                    onPress={() => navigation.navigate('ConfigurationScreen')}
                />
            </View>
            <ScrollView style={styles.vehiclesList}>
                {stores != null && stores.length > 0 ? (
                    stores.map((store, index) => (
                        store && ( // Check if store is not null
                            <Pressable
                                key={index}
                                style={styles.vehicleButton}
                                onPress={() => {
                                    navigation.navigate('StoreProfile', { store: store });
                                }}
                            >
                                <Text style={styles.vehicleText}>Store Name: {store.storeName}</Text>
                            </Pressable>
                        )
                    ))
                ) : (
                    <Text style={styles.noVehiclesText}>No stores available</Text>
                )}
            </ScrollView>
            <Pressable style={styles.addVehicleButton} onPress={() => navigation.navigate('AddNewStore', {email})}>
                <Text style={styles.addVehicleText}>Add a new store</Text>
            </Pressable>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        paddingTop: 40,
        width: '100%',
    },
    vehiclesList: {
        flex: 1,
        width: '50%',
        marginTop: 10,
        marginBottom: 80,
    },
    title: {
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
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
    addVehicleText: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500',
        textAlign: 'center',
    },
    configurationButton: {
        position: 'absolute',
        right: 0, // Align the button to the right
        top: 0,
        padding: 30,
    },
    vehicleButton: {
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 12,
        backgroundColor: '#1e90ff',
        borderRadius: 10,
    },
    vehicleText: {
        fontSize: 14,
        color: 'white',
        fontWeight: '500',
    },
    noVehiclesText: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        marginTop: 20, // Add some space at the top of the message
    },
});
