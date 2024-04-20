import React, {useEffect} from 'react';
import {StyleSheet, View, Text, ImageBackground, Pressable} from 'react-native';

export function VehiclesScreen({ navigation, route }) {
    const { familySurname, familyId } = route.params;
    const [patentesData, setPatentes] = React.useState([]);
    const [vehiclesData, setVehicles] = React.useState([]);

    const fetchPatentes = async (familySurname) => {
        try {
            const response = await fetch(`http://localhost:9002/vehicles/family/${familyId}`);
            if (response.ok) {
                return await response.json();
            } else {
                console.log(`Failed to fetch cars for family: ${familySurname}`);
                return null;
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchVehicles = async (patentesData) => {
        try {
            return await Promise.all(patentesData.map(async (patente) => {
                const response = await fetch(`http://localhost:9002/car/${patente}`);
                if (response.ok) {
                    return await response.json();
                } else {
                    console.log(`Failed to fetch car with patente: ${patente}`);
                    return null;
                }
            }))
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Primero busco las patentes de la familia
    useEffect(() => {
        fetchPatentes(familySurname)
            .then(fetchedPatentes => {
                console.log('Fetched patentes:', fetchedPatentes);
                setPatentes(fetchedPatentes);
            })
            .catch(error => console.error('Error:', error));
    }, [familySurname]);

    // Luego busco los autos en base a las patentes
    useEffect(() => {
        fetchVehicles(patentesData)
            .then(fetchedVehicles => {
                console.log('Fetched vehicles:', fetchedVehicles);
                setVehicles(fetchedVehicles);
            })
            .catch(error => console.error('Error:', error));
    }, [patentesData]);

    return (
        <ImageBackground source={require('../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Autos de la familia { familySurname }</Text>
                {vehiclesData.length > 0 ? (
                    vehiclesData.map((vehicle, index) => (
                        vehicle && ( // Check if family is not null
                            <Pressable
                                key={index}
                                style={styles.vehicleButton}
                                onPress={() => {
                                    console.log(`Pressed: ${vehicle.patente}`);
                                }}
                            >
                                <Text style={styles.vehicleText}>Year: {vehicle.ano}</Text>
                                <Text style={styles.vehicleText}>Insurance Expiry: {vehicle.fechaVencimientoSeguro}</Text>
                                <Text style={styles.vehicleText}>VTV Expiry: {vehicle.fechaVencimientoVTV}</Text>
                                <Text style={styles.vehicleText}>Mileage: {vehicle.kilometraje}</Text>
                                <Text style={styles.vehicleText}>Brand: {vehicle.marca}</Text>
                                <Text style={styles.vehicleText}>Model: {vehicle.modelo}</Text>
                                <Text style={styles.vehicleText}>License Plate: {vehicle.patente}</Text>
                            </Pressable>
                        )
                    ))
                ) : (
                    <Text>No vehicles available</Text>
                )}
            </View>
            <Pressable style={styles.addVehicleButton} onPress={() => navigation.navigate('AddNewVehicle', { familySurname: familySurname, familyId: familyId })}>
                <Text style={styles.addVehicleText}>Add a new vehicle</Text>
            </Pressable>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    addVehicleButton: {
        width: '40%',
        paddingVertical: 12, // Increase padding for a larger touch area
        paddingHorizontal: 20,
        marginVertical: 8,
        backgroundColor: '#32cd32', // A vibrant green color
        borderRadius: 20,
        elevation: 4, // Adds a subtle shadow effect on Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 }, // Shadow for iOS
        shadowOpacity: 0.25, // Shadow for iOS
        shadowRadius: 3.84, // Shadow for iOS
    },
    addVehicleText: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500',
        textAlign: 'center',
    },
    vehicleButton: {
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 12,
        backgroundColor: '#1e90ff',
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        alignItems: 'center',
    },
    vehicleText: {
        fontSize: 14,
        color: 'white',
        fontWeight: '500',
    },
});