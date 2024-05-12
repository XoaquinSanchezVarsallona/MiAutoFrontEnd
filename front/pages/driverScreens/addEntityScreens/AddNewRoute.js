import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, StyleSheet, ImageBackground, Pressable} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

function AddNewRoute({ navigation, route }) {
    const { vehicle, familyId } = route.params;
    const patente = vehicle.patente;
    const [kilometraje, setKilometraje] = useState('');
    const [duration, setDuration] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [userID, setUserID] = useState('');
    const [date, setDate] = useState('');

    // Primero para saber a quién agregarle la route, hago un fetch del usuario
    useEffect(() => {
        async function loadUserProfile() {
            const token = await AsyncStorage.getItem('userToken');
            if (token) {
                const response = await fetch('http://localhost:9002/validateToken', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setUserID(data.userId);
                } else {
                    console.error('Token validation failed:', data.message);
                }
            }
        }
        loadUserProfile().then(r => console.log(r));
    }, []);

    const addRoute = async () => {
        try {
            const response = await fetch(`http://localhost:9002/route/${userID}/addRoute`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ patente, kilometraje, duration, date }),
            });
            if (response.ok) {
                alert('Route added successfully');
                const routes = await response.json();
                console.log('Routes:', routes)
                navigation.navigate('VehicleRoutes', { vehicle : vehicle, familyId : familyId, routesPassed : routes});
            } else if (response.status === 400) {
                const errorMessage = await response.text();
                alert(errorMessage);
            } else {
                console.error('Failed to add vehicle');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage(error.message || 'Add route error. Please try again.')
        }
    };

    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.container}>
                <Text style={styles.title}>Add New Route</Text>
                <TextInput
                    style={styles.input}
                    value={kilometraje}
                    onChangeText={setKilometraje}
                    placeholder="Distance in km"
                />
                <TextInput
                    style={styles.input}
                    value={duration}
                    onChangeText={setDuration}
                    placeholder="Duration"
                />
                <Text style={styles.label}>Route Date</Text>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        value={date ? dayjs(date) : null}
                        onChange={(newValue) => {
                            setDate(newValue ? dayjs(newValue).format('YYYY-MM-DD') : '');
                        }}
                    />
                </LocalizationProvider>
                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : <Text style={styles.errorText}></Text>}
                <Pressable style={styles.addVehicleButton} onPress={() => { addRoute().then() }}>
                    <Text style={styles.addVehicleText}>Add route</Text>
                </Pressable>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 16,
        paddingTop: 30,
    },
    input: {
        color: 'white',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingLeft: 10,
    },
    title: {
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10,
        alignContent: 'center',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
    },
    addVehicleButton: {
        width: '20%',
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
});

export default AddNewRoute;