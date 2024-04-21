import React, {useEffect} from 'react';
import {StyleSheet, View, Text, ImageBackground, Pressable, ScrollView} from 'react-native';

export function VehiclesScreen({ navigation, route }) {
    const { familySurname, familyId } = route.params;
    const [patentesData, setPatentes] = React.useState([]);
    const [vehiclesData, setVehicles] = React.useState([]);

    const fetchPatentes = async (familySurname) => {
        try {
            const response = await fetch(`http://localhost:9002/vehicle/family/${familyId}`);
            if (response.ok) {
                return await response.json();
            } else {
                console.log(`Failed to fetch cars for family: ${familySurname}`);
                return [];
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
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Autos de la familia {familySurname}</Text>
            </View>
            <ScrollView style={styles.vehiclesList}>
                {vehiclesData != null && vehiclesData.length > 0 ? (
                    vehiclesData.map((vehicle, index) => (
                        vehicle && ( // Check if family is not null
                            <Pressable
                                key={index}
                                style={styles.vehicleButton}
                                onPress={() => {
                                    navigation.navigate('VehicleProfile', { vehicle: vehicle, familySurname: familySurname });
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
                    <Text style={styles.noVehiclesText}>No vehicles available</Text>
                )}
            </ScrollView>
            <Pressable style={styles.addVehicleButton} onPress={() => navigation.navigate('AddNewVehicle', { familySurname, familyId })}>
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
    },
    headerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        paddingTop: 40,
        width: '100%',
    },
    vehiclesList: {
        flex: 1,
        width: '50%',
        marginTop: 10,
        marginBottom: 80,
    },
    title: {
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    addVehicleButton: {
        width: '40%',
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginVertical: 10,
        backgroundColor: '#32cd32',
        borderRadius: 20,
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
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
    },
    vehicleText: {
        fontSize: 14,
        color: 'white',
        fontWeight: '500',
    },
    noVehiclesText: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        marginTop: 20, // Add some space at the top of the message
    },
});
