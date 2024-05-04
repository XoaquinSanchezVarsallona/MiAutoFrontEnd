import React from 'react';
import {Image, View, Text, StyleSheet, ImageBackground, TouchableOpacity} from 'react-native';

export function VehicleProfile({ navigation, route }) {
    const { vehicle, familySurname } = route.params;
    const carName = vehicle.marca + ' ' + vehicle.modelo;

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
            <View style={styles.content}>
                <View>
                    <Text style={styles.title}>Information in case of accident</Text>
                    <Text style={styles.detail}>Expiry: {vehicle.fechaVencimientoSeguro}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={styles.notifyButton} >
                            <Text style={styles.buttonText}>Notify Accident</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modifyInfoButton} >
                            <Text style={styles.buttonText}>Modify Info</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <Image source={require('../../../assets/carcrash.png')} style={styles.crashicon} />
                </View>
            </View>
            <View style={styles.content}>
                <View>
                    <Text style={styles.title}>Usage of car</Text>
                    <Text style={styles.detail}>Add / Modify / Delete / View routes from {carName}</Text>
                    <TouchableOpacity style={styles.routesButton} onPress={() => navigation.navigate('VehicleRoutes', { vehicle })}>
                        <Text style={styles.buttonText}>View routes</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <Image source={require('../../../assets/statistics.png')} style={styles.statIcon} />
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
        marginTop: 15,
        padding: 15,
        margin: 2,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        width: '60%',
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
    notifyButton: {
        width: '50%',
        paddingVertical: 6,
        paddingHorizontal: 10,
        marginVertical: 5,
        marginRight: 10,
        top: 5,
        backgroundColor: 'red',
        borderRadius: 10,
    },
    modifyInfoButton: {
        width: '50%',
        paddingVertical: 6,
        paddingHorizontal: 10,
        marginVertical: 5,
        marginRight: 10,
        top: 5,
        backgroundColor: 'orange',
        borderRadius: 10,
    },
    routesButton: {
        width: '30%',
        paddingVertical: 6,
        paddingHorizontal: 10,
        marginVertical: 5,
        marginRight: 10,
        top: 5,
        backgroundColor: '#1e90ff',
        borderRadius: 10,
    },
    crashicon: {
        height: 100,
        width: 400,
    },
    statIcon: {
        height: 100,
        width: 100,
    }
});

export default VehicleProfile;