import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, ImageBackground, Pressable, ScrollView} from 'react-native';
import StyledButton2 from "../../components/StyledButton2";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingScreen from "../LoadingScreen";
import {useIsFocused} from "@react-navigation/native";

export function UnlockedScreenService({ navigation, route }) {
    // Me llega el email del usuario
    const [email, setEmail] = useState('');
    const [stores, setStores] = useState([]);
    const [serviceName, setServiceName] = useState('');
    const [isLoading, setLoading] = useState(true);
    const isFocused = useIsFocused();

    // Get the service id from the token
    const loadServiceId = async () => {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
            // Send token to your backend to validate and get user details
            const response = await fetch('http://localhost:9002/validateToken', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (response.ok) {
                return data.userId;
            } else {
                console.error('Token validation failed:', data.message);
            }
        }
    };

    // Get the email of the service
    const loadServiceEmail = async () => {
        const userId = await loadServiceId();
        if (userId) {
            const response = await fetch(`http://localhost:9002/user/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (response.ok) {
                setEmail(data.email);
                setServiceName(data.username)
                return data.email;
            } else {
                console.error('Error fetching service email:', data.message);
            }
        }
    }


    const fetchStores = async (email_fetched) => {
        try {
            const response = await fetch('http://localhost:9002/stores/fetchStores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email_fetched }),
            });
            const data = await response.json();
            setStores(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        loadServiceEmail().then(r => fetchStores(r).then(r => setLoading(false)));
    }, []);

    useEffect(() => {
        loadServiceEmail().then(r => fetchStores(r).then(r => setLoading(false)));
    }, [isFocused]);

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <ImageBackground source={require('../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>{serviceName}'s Stores</Text>
                <StyledButton2
                    style={styles.configurationButton}
                    icon={require('../../assets/configuration.png')}
                    onPress={() => navigation.navigate('ServiceConfigurationScreen')}
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
                                <Text style={styles.vehicleText}>{store.storeName}</Text>
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
