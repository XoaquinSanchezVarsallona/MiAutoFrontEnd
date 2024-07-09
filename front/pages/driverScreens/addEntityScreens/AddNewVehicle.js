import {StyleSheet, View, Text, ImageBackground, TextInput, Pressable} from 'react-native';
import React, {useContext, useState} from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import {NotificationContext} from "../../../components/notification/NotificationContext";
import InputText from "../../../components/InputText";
import AddButton from "../../../components/AddButton";

export function AddNewVehicle({ navigation, route }) {
    const { familySurname, familyId } = route.params;
    const [patente, setPatente] = useState('');
    const [ano, setAno] = useState('');
    const [fechaVencimientoSeguro, setFechaVencimientoSeguro] = useState(null);
    const [fechaVencimientoVTV, setFechaVencimientoVTV] = useState(null);
    const [kilometraje, setKilometraje] = useState('');
    const [marca, setMarca] = useState('');
    const [modelo, setModelo] = useState('');
    const { showNotification, setColor } = useContext(NotificationContext);


    const addVehicle = async () => {
        try {
            const response = await fetch(`http://localhost:9002/car/${familyId}/addVehicle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ patente, ano, fechaVencimientoSeguro, fechaVencimientoVTV, kilometraje, marca, modelo }),
            });
            console.log(response)
            if (response.ok) {
                setColor('#32cd32')
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
            <Text style={styles.title}>Add new Vehicle</Text>
                <View style={styles.row}>
                    <InputText
                        value={patente}
                        onChangeText={setPatente}
                        placeholder="License Plate"
                        label={"License Plate"}
                    />
                    <InputText
                        value={ano}
                        onChangeText={setAno}
                        placeholder="Year"
                        label={"Year"}
                        number={true}
                    />
                    <InputText
                        value={kilometraje}
                        onChangeText={setKilometraje}
                        placeholder="Mileage"
                        label={"Mileage"}
                        number={true}
                    />
                </View>
                <View style={styles.row}>
                    <InputText
                        value={marca}
                        onChangeText={setMarca}
                        placeholder="Brand"
                        label={"Brand"}
                    />
                    <InputText
                        value={modelo}
                        onChangeText={setModelo}
                        placeholder="Model"
                        label={"Model"}
                    />
                </View>
                <View style={styles.row}>
                    <View>
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
                    <View>
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
            <AddButton onPress={addVehicle} text={"Add vehicle"}/>
        </ImageBackground>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        paddingBottom: 20,
    },
    row: {
        width: '60%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    column: {
        width: '50%',
        padding: 15,
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
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
});
