import React, {useEffect} from 'react';
import {StyleSheet, View, Text, ImageBackground, Pressable, ScrollView} from 'react-native';
import CustomScrollBar from "../../../components/CustomScrollBar";
import AddButton from "../../../components/AddButton";

export function VehiclesScreen({ navigation, route }) {
    let { familySurname, familyId, isUpdated } = route.params;
    const [vehiclesData, setVehicles] = React.useState([]);

    const fetchPatentes = async (data) => {
        try {
            const response = await fetch(`http://localhost:9002/vehicles/family/${familyId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
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

    useEffect(
        () => {
            const fetchAndSetPatentes = async () => {
                return await fetchPatentes(familySurname);
            };
            const fetchAndSetVehicles = async (patentesData) => {
                const fetchedVehicles = await fetchVehicles(patentesData);
                setVehicles(fetchedVehicles);
            };

            fetchAndSetPatentes().then(r => fetchAndSetVehicles(r));
            isUpdated = false
        }, [familySurname, isUpdated]
    );

    let colors = {
        'Verde': '#32cd32',
        'Amarillo': '#ffd700',
        'Rojo': '#ff0000',
    }

    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <Text style={styles.title}>{familySurname}'s vehicles</Text>
            <View style={styles.scrollBarContainer}>
                <CustomScrollBar>
                    {vehiclesData != null && vehiclesData.length > 0 ? (
                        vehiclesData.map((vehicle, index) => (
                            vehicle && ( // Check if family is not null
                                <Pressable
                                    key={index}
                                    style={styles.vehicleButton}
                                    onPress={() => {navigation.navigate('VehicleProfile', { vehicle: vehicle, familySurname: familySurname, familyId: familyId });}}
                                >
                                    <View style={styles.rowContainer}>
                                        <Text style={styles.vehicleText}>{vehicle.marca} {vehicle.modelo} - {vehicle.patente}</Text>
                                        <View style={styles.stateStyle}>
                                            <View style={[styles.stateIndicator, {backgroundColor: colors[vehicle.estadoActual], borderRadius: 4}]}/>
                                        </View>
                                    </View>
                                </Pressable>
                            )
                        ))
                    ) : (
                        <Text style={styles.noVehiclesText}>No vehicles available</Text>
                    )}
                </CustomScrollBar>
            </View>
            <AddButton onPress={() => navigation.navigate('AddNewVehicle', { familySurname, familyId })} text={"Add a new vehicle"}/>
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
    scrollBarContainer: {
        flex: 1,
        width: '60%',
        paddingBottom: 20,
    },
    title: {
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        alignSelf: 'center',
        paddingBottom: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    vehicleButton: {
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 12,
        backgroundColor: '#1e90ff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    },
    vehicleText: {
        fontSize: 30,
        color: 'white',
        fontWeight: '500',
    },
    noVehiclesText: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        marginTop: 20,
    },
    stateIndicator: {
        height: 40,
        width: 40,
        padding: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    },
    stateStyle: {
        flexDirection: 'row',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
});