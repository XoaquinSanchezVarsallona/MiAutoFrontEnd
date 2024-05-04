import React from 'react';
import {Image, View, Text, StyleSheet, ImageBackground, TouchableOpacity} from 'react-native';

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
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.content}>
                <View>
                    <Text style={styles.title}>{vehicle.marca} {vehicle.modelo} de los {familySurname}</Text>
                    <Text style={styles.detail}>Model: {vehicle.modelo}</Text>
                    <Text style={styles.detail}>Year: {vehicle.ano}</Text>
                    <Text style={styles.detail}>Brand: {vehicle.marca}</Text>
                </View>
                <View>
                    <Image source={require('../../../assets/grayCar.png')} style={styles.icon} />
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.deleteButton} onPress={deleteVehicle}>
                    <Text style={styles.buttonText}>Delete Vehicle</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modifyButton} onPress={() => { navigation.navigate("EditCarProfile", {patente : vehicle.patente} ) }}>
                    <Text style={styles.buttonText}>Modify Vehicle Details</Text>
                </TouchableOpacity>
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
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    icon: {
        height: 100,
        width: 250,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 20,
        justifyContent: 'space-between',
        width: '70%',
    },
    deleteButton: {
        width: '50%',
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginVertical: 10,
        marginRight: 20,
        bottom: 10,
        backgroundColor: 'red',
        borderRadius: 20,
        alignSelf: 'center',
    },
    modifyButton: {
        width: '50%',
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginVertical: 10,
        marginLeft: 20,
        bottom: 10,
        backgroundColor: 'orange',
        borderRadius: 20,
        alignSelf: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
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