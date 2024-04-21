import React from 'react';
import {View, Text, StyleSheet, ImageBackground, TouchableOpacity} from 'react-native';

export function VehicleProfile({ navigation, route }) {
    const { vehicle, familySurname } = route.params;

    const deleteVehicle = async () => {
        try {
            const response = await fetch(`http://localhost:9002/car/${vehicle.patente}/deleteCar`, {
                method: 'DELETE',
            });
            if (response.ok) {
                alert('Vehicle deleted successfully');
                navigation.goBack();
            } else {
                console.error('Failed to delete vehicle');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <ImageBackground source={require('../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>{vehicle.marca} {vehicle.modelo} de los {familySurname}</Text>
                <Text style={styles.detail}>Model: {vehicle.modelo}</Text>
                <Text style={styles.detail}>Year: {vehicle.ano}</Text>
                <Text style={styles.detail}>Brand: {vehicle.marca}</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.deleteButton} onPress={deleteVehicle}>
                        <Text style={styles.buttonText}>Delete Vehicle</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modifyButton} onPress={() => {/* Función de modificación */}}>
                        <Text style={styles.buttonText}>Modify Vehicle Details</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: 20,
        margin: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        width: '80%',
        alignSelf: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 10,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        width: '45%',
    },
    modifyButton: {
        backgroundColor: 'orange',
        padding: 10,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        width: '45%',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    detail: {
        fontSize: 16,
    },
});

export default VehicleProfile;