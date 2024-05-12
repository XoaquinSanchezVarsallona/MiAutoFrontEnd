import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ImageBackground, ScrollView, TextInput } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import StyledButton2 from "../../../components/StyledButton2";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const icons = {
    pencil: require('../../../assets/pencil.png'),
};

export function EditRoute({ route }) {
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
            const token = await AsyncStorage.getItem('userToken');
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

            const data = await response.json(); // Assuming the server responds with JSON
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
                <StyledButton2
                    icon={icons.pencil}
                    onPress={handleSave}
                />
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
        backgroundColor: 'transparent',  // Ensures ImageBackground is visible
    },
    scrollContainer: {
        width: '100%',  // Ensures ScrollView can contain all elements properly
        alignItems: 'center',
    },
    inputContainer: {
        width: '90%',  // More appropriate for various device sizes
    },
    input: {
        width: '100%',  // Ensures the input takes full width of the container
        height: 40,
        marginVertical: 8,  // Adds space between inputs
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,  // Padding inside the input
        color: 'white',
    },
    title: {
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10,
    },
});
