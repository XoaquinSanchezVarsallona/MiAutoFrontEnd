import React, {useContext, useEffect, useState} from 'react';
import { StyleSheet, View, Text, ImageBackground, ScrollView, TextInput } from 'react-native';
import StyledButton3 from "../../../components/StyleButton3";
import {NotificationContext} from "../../../components/notification/NotificationContext";
import InputText from "../../../components/InputText";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import AddButton from "../../../components/AddButton";

export function EditCarProfile({ route }) {
    const patente = route.params.patente

    const [inputs, setInputs] = useState({
        marca: '',
        fechaVencimientoSeguro: '',
        fechaVencimientoVTV: '',
        ano: '',
        kilometraje: '',
        patente: '',
        modelo: '',
    });

    const { showNotification, setColor } = useContext(NotificationContext);
    const [fields, setFields] = useState([]);

    // Función que se encarga de buscar la información actual del auto
    const getCarInfo = async () => {
        try {
            const response = await fetch(`http://localhost:9002/car/${patente}/getInfo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setInputs(prevInputs => ({
                ...prevInputs,
                marca: data.marca,
                fechaVencimientoSeguro: data.fechaVencimientoSeguro,
                fechaVencimientoVTV: data.fechaVencimientoVTV,
                ano: data.ano,
                kilometraje: data.kilometraje,
                patente: data.patente,
                modelo: data.modelo,
            }));
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Función que se encarga de cambiar el valor de los inputs en tiempo real
    const handleInputChange = (field, value) => {
        setFields(prevFields => Array.from(new Set([...prevFields, field])));
        console.log(fields)
        setInputs(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    //función que se encarga de enviar los datos al backend, y muestra un mensaje de éxito o error
    const handleSave = async (field) => {
        const newValue = inputs[field];
        const patente = route.params.patente;
        console.log(`Attempting to save ${field} with value: ${newValue}`);

        try {
            const response = await fetch('http://localhost:9002/editCarProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    patente: patente,
                    field: field,
                    value: newValue,
                }),
            });

            console.log('Server response:', response);

            if (!response.ok) {
                console.error('Network response was not ok');
            }

            const data = await response.json(); // Assuming the server responds with JSON
            console.log(`Server response: `, data);

            // Update UI or notify user based on success
            setColor('#32cd32')
            showNotification(`Updated ${field} successfully!`);
        } catch (error) {
            console.error('Error updating profile:', error);
            setColor('red')
            showNotification('Failed to update profile. Please try again.');
        }
    };

    // Función que se encarga de guardar los cambios en cada campo
    const handleEachSave = async () => {
        for (const field of fields) {
            await handleSave(field);
        }
    };

    useEffect(() => {
        getCarInfo().then();
    }, []);

    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <Text style={styles.title}>Edit Vehicle</Text>
            <View style={styles.row}>
                <InputText
                    value={inputs["patente"]}
                    onChangeText={(text) => handleInputChange("patente", text)}
                    placeholder="License Plate"
                    label={"License Plate"}
                />
                <InputText
                    value={inputs["ano"]}
                    onChangeText={(text) => handleInputChange("ano", text)}
                    placeholder="Year"
                    label={"Year"}
                />
                <InputText
                    value={inputs["kilometraje"]}
                    onChangeText={(text) => handleInputChange("kilometraje", text)}
                    placeholder="Mileage"
                    label={"Mileage"}
                />
            </View>
            <View style={styles.row}>
                <InputText
                    value={inputs["marca"]}
                    onChangeText={(text) => handleInputChange("marca", text)}
                    placeholder="Brand"
                    label={"Brand"}
                />
                <InputText
                    value={inputs["modelo"]}
                    onChangeText={(text) => handleInputChange("modelo", text)}
                    placeholder="Model"
                    label={"Model"}
                />
            </View>
            <View style={styles.row}>
                <View>
                    <Text style={styles.label}>Insurance Expiry</Text>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            value={inputs["fechaVencimientoSeguro"] ? dayjs(inputs["fechaVencimientoSeguro"]) : null}
                            onChange={(newValue) => {
                                handleInputChange("fechaVencimientoSeguro",newValue ? dayjs(newValue).format('YYYY-MM-DD') : '');
                            }}
                        />
                    </LocalizationProvider>
                </View>
                <View>
                    <Text style={styles.label}>VTV Expiry</Text>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            value={inputs["fechaVencimientoVTV"] ? dayjs(inputs["fechaVencimientoVTV"]) : null}
                            onChange={(newValue) => {
                                handleInputChange("fechaVencimientoVTV",newValue ? dayjs(newValue).format('YYYY-MM-DD') : '');
                            }}
                        />
                    </LocalizationProvider>
                </View>
            </View>
            <AddButton onPress={handleEachSave} text={"Save"}/>
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
