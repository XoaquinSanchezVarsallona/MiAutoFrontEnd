import React, { useState, useEffect } from 'react';
import {StyleSheet, View, Text, ImageBackground, ScrollView, TextInput, Pressable} from 'react-native';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export function EditRoute({ route, navigation }) {
    const { vehicle, familyId, distance } = route.params;
    const [inputs, setInputs] = useState({
        Distance: '',
        Duration: '',
        Date: dayjs().format('YYYY-MM-DD'), // Initialize with today's date
    });

    const routeId = route.params.routeId;

    useEffect(() => {
        fetchAndSetRoute().then();
    }, [routeId]);

    async function fetchAndSetRoute() {
        try {
            const response = await fetch(`http://localhost:9002/route/${routeId}/getRoute`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setInputs(prevInputs => ({
                ...prevInputs,
                Duration: data.duration,
                Distance: data.kilometraje,
                Date: data.date,
            }));
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleInputChange = (field, value) => {
        setInputs(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const handleSave = async () => {
        if (Object.values(inputs).some(value => value === '')) {
            alert('Please fill in all fields.');
            return;
        }

        try {
            const response = await fetch('http://localhost:9002/route/editRoute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    routeId,
                    updates: inputs,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update route');
            }

            navigation.navigate('VehicleRoutes', { vehicle, familyId, routesPassed : routeId, distance : distance });
            alert('Updated successfully!');
        } catch (error) {
            console.error('Error updating route:', error);
            alert('Failed to update route. Please try again.');
        }
    };

    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Edit Route</Text>
                <View style={styles.items}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => handleInputChange('Distance', text)}
                            value={inputs.Distance}
                            placeholder={inputs.Distance}
                        />
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => handleInputChange('Duration', text)}
                            value={inputs.Duration}
                            placeholder={inputs.Duration}
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={dayjs(inputs.Date)}
                                onChange={(newValue) => handleInputChange('Date', newValue ? dayjs(newValue).format('YYYY-MM-DD') : '')}
                                renderInput={(params) => <TextInput {...params} style={styles.input} />}
                            />
                        </LocalizationProvider>
                    </View>
                    <Pressable style={styles.updateRouteButton} onPress={() => { handleSave().then() }}>
                        <Text style={styles.updateRouteText}>Update route</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    items: {
    },
    scrollContainer: {
        width: '100%',
        alignItems: 'center',
    },
    inputContainer: {
        width: '90%',
    },
    input: {
        width: '100%',
        height: 40,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        color: 'white',
    },
    title: {
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    updateRouteButton: {
        width: '100%',
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginVertical: 10,
        backgroundColor: '#1e90ff',
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
    updateRouteText: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500',
        textAlign: 'center',
    },
});
