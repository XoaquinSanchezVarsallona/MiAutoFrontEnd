import {StyleSheet, View, Text, ImageBackground, TextInput, Pressable} from 'react-native';
import React, {useContext, useState} from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import {NotificationContext} from "../../../components/notification/NotificationContext";

export function AddNewVehicle({ navigation, route }) {
    const { familySurname, familyId } = route.params;
    const [patente, setPatente] = useState('');
    const [ano, setAno] = useState('');
    const [fechaVencimientoSeguro, setFechaVencimientoSeguro] = useState(null);
    const [fechaVencimientoVTV, setFechaVencimientoVTV] = useState(null);
    const [kilometraje, setKilometraje] = useState('');
    const [marca, setMarca] = useState('');
    const [modelo, setModelo] = useState('');
    const { showNotification } = useContext(NotificationContext);

    const addVehicle = async () => {
        try {
            const response = await fetch(`http://localhost:9002/car/${familyId}/addVehicle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ patente, ano, fechaVencimientoSeguro, fechaVencimientoVTV, kilometraje, marca, modelo }),
            });
            if (response.ok) {
                showNotification("Vehicle added successfully")
                let isUpdated = true
                navigation.navigate('VehiclesScreen', { familySurname: familySurname, familyId: familyId, isUpdated : isUpdated });
            } else if (response.status === 400) {
                const errorMessage = await response.text();
                alert(errorMessage);
            } else {
                console.error('Failed to add vehicle');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Add new Vehicle to the {familySurname} family</Text>
                </View>
            <View style={styles.columnsContainer}>
                <View style={styles.column}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>License Plate</Text>
                        <TextInput
                            style={styles.input}
                            value={patente}
                            onChangeText={setPatente}
                            placeholder="License Plate"
                            placeholderTextColor="#FFFFFF80"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Year</Text>
                        <TextInput
                            style={styles.input}
                            value={ano}
                            onChangeText={setAno}
                            placeholder="Year"
                            placeholderTextColor="#FFFFFF80"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Mileage</Text>
                        <TextInput
                            style={styles.input}
                            value={kilometraje}
                            onChangeText={setKilometraje}
                            placeholder="Mileage"
                            placeholderTextColor="#FFFFFF80"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Brand</Text>
                        <TextInput
                            style={styles.input}
                            value={marca}
                            onChangeText={setMarca}
                            placeholder="Brand"
                            placeholderTextColor="#FFFFFF80"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Model</Text>
                        <TextInput
                            style={styles.input}
                            value={modelo}
                            onChangeText={setModelo}
                            placeholder="Model"
                            placeholderTextColor="#FFFFFF80"
                        />
                    </View>
                </View>
                <View style={styles.column}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Insurance Expiry</Text>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={fechaVencimientoSeguro ? dayjs(fechaVencimientoSeguro) : null}
                                onChange={(newValue) => {
                                    setFechaVencimientoSeguro(newValue ? dayjs(newValue).format('YYYY-MM-DD') : '');
                                }}
                            />
                        </LocalizationProvider>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>VTV Expiry</Text>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={fechaVencimientoSeguro ? dayjs(fechaVencimientoVTV) : null}
                                onChange={(newValue) => {
                                    setFechaVencimientoVTV(newValue ? dayjs(newValue).format('YYYY-MM-DD') : '');
                                }}
                            />
                        </LocalizationProvider>
                    </View>
                </View>
            </View>
            <Pressable style={styles.addVehicleButton} onPress={() => { addVehicle().then(navigation.navigate('VehiclesScreen', { familySurname, familyId })) }}>
                <Text style={styles.addVehicleText}>Add vehicle</Text>
            </Pressable>
        </ImageBackground>
);
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start', // Start content from the top
        alignItems: 'center', // Center content horizontally
        padding: 16,
        paddingTop: 30, // Adjust padding top to give space for the title
    },
    headerContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 10, // Space below the header
    },
    title: {
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
    },
    columnsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center', // Center the columns within the container
        alignItems: 'flex-start', // Align items to the start of their container
        width: '100%',
    },
    column: {
        width: '20%', // Adjust width to bring columns closer
        padding: 15,
    },
    inputContainer: {
        width: '90%', // Full width to align inputs properly within the columns
        marginBottom: 10, // Space between each input
    },
    input: {
        width: '100%',
        color: 'white',
        borderColor: 'gray',
        padding: 10,
        borderRadius: 2,
        borderWidth: 1,
    },
    label: {
        alignSelf: 'flex-start',
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 3,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    },
    addVehicleText: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500',
        textAlign: 'center',
    },
});
