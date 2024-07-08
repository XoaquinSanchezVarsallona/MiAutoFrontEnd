import React, {useContext, useEffect, useState} from 'react';
import {View, Text, TextInput, StyleSheet, ImageBackground, Pressable} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import {NotificationContext} from "../../../components/notification/NotificationContext";
import InputText from "../../../components/InputText";
import AddButton from "../../../components/AddButton";

function AddNewRoute({ navigation, route }) {
    const { vehicle, familyId } = route.params;
    const patente = vehicle.patente;
    const [kilometraje, setKilometraje] = useState('');
    const [duration, setDuration] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [userID, setUserID] = useState('');
    const [date, setDate] = useState('');
    const { showNotification, setColor } = useContext(NotificationContext);

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
                setColor('#32cd32')
                showNotification("Route added successfully")
                const route = await response.json();
                console.log('Route Created:', route)
                navigation.navigate('VehicleRoutes', { vehicle : vehicle, familyId : familyId, routesPassed : route});
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
            <Text style={styles.title}>Add New Route</Text>
            <View style={styles.inputContainer}>
                <InputText
                    label={"Distance"}
                    value={kilometraje}
                    onChangeText={setKilometraje}
                    placeholder="Distance in kilometres"
                />
                <InputText
                    label={"Duration"}
                    value={duration}
                    onChangeText={setDuration}
                    placeholder="Duration"
                />
                <View style={styles.date}>
                    <Text style={styles.label}>Route Date</Text>
                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                        <DatePicker
                            value={date ? dayjs(date) : null}
                            onChange={(newValue) => {
                                setDate(newValue ? dayjs(newValue).format('YYYY-MM-DD') : '');
                            }}
                        />
                    </LocalizationProvider>
                </View>
                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : <Text style={styles.errorText}></Text>}
            </View>
            <AddButton onPress={addRoute} text={"Add route"}/>
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
    inputContainer: {
        flex: 1,
        width: '100%',
        marginBottom: 10,
    },
    date: {
        flex: 1,
        alignSelf: 'center',
        width: '20%',
        marginBottom: 10,
    },
    title: {
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 20,
        alignContent: 'center',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
    },
    label: {
        alignSelf: 'flex-start',
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
});

export default AddNewRoute;