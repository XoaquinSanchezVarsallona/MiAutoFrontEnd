import React, {useEffect} from 'react';
import {Image, View, Text, StyleSheet, ImageBackground, TouchableOpacity} from 'react-native';

export function VehicleProfile({ navigation, route }) {
    const { vehicle, familySurname, familyId } = route.params;
    const carName = vehicle.marca + ' ' + vehicle.modelo;
    const [vehicleFetched, setVehicle] = React.useState([]);

    const fetchVehicle = async () => {
        try {
            const response = await fetch(`http://localhost:9002/car/${vehicle.patente}`);
            if (response.ok) {
                const data = await response.json();
                setVehicle(data);
            } else {
                console.log(`Failed to fetch vehicle with patente: ${vehicle.patente}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const deleteVehicle = async () => {
        try {
            const response = await fetch(`http://localhost:9002/car/${vehicle.patente}/deleteCar`, {
                method: 'DELETE',
            });
            if (response.ok) {
                alert('Vehicle deleted successfully');
                let isUpdated = null;
                navigation.navigate('VehiclesScreen', { familySurname, familyId, isUpdated });
            } else {
                console.error('Failed to delete vehicle');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchVehicle().then();
    }, [vehicle]);

    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.content}>
                <View>
                    <Text style={styles.title}>{vehicleFetched.marca} {vehicleFetched.modelo} de los {familySurname}</Text>
                    <View style={styles.columnsContainer}>
                        <View style={styles.column}>
                            <View style={styles.detailContainer}>
                                <Text style={styles.detail}><Text style={styles.bold}>License Plate:</Text> {vehicleFetched.patente}</Text>
                                <Text style={styles.detail}><Text style={styles.bold}>Year:</Text> {vehicleFetched.ano}</Text>
                                <Text style={styles.detail}><Text style={styles.bold}>Mileage:</Text> {vehicleFetched.kilometraje}</Text>
                            </View>
                        </View>
                        <View style={styles.column}>
                            <View style={styles.detailContainer}>
                                <Text style={styles.detail}><Text style={styles.bold}>Insurance Expiry:</Text> {vehicle.fechaVencimientoSeguro}</Text>
                                <Text style={styles.detail}><Text style={styles.bold}>VTV Expiry:</Text> {vehicle.fechaVencimientoVTV}</Text>
                                <View style={styles.stateStyle}>
                                    <Text style={styles.detail}><Text style={styles.bold}>State:</Text></Text>
                                    <View style={[styles.stateIndicator, {backgroundColor: '#32cd32', borderRadius: 4, padding: 3,}]}/>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View>
                    <Image source={require('../../../assets/grayCar.png')} style={styles.icon} />
                </View>
            </View>
            <View style={styles.content}>
                <View>
                    <Text style={styles.title}>Information in case of accident</Text>
                    <Text style={styles.detail}>Expiry: {vehicleFetched.fechaVencimientoSeguro}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={styles.notifyButton} >
                            <Text style={styles.buttonText}>Notify Accident</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modifyInfoButton} onPress={() => {navigation.navigate('EditPapers', {patente: vehicle.patente})}}
                        >
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
                    <TouchableOpacity style={styles.routesButton} onPress={() => navigation.navigate('VehicleRoutes', { vehicle, familySurname, familyId, distance : 0 })}>
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
                <TouchableOpacity style={styles.modifyButton} onPress={() => {
                    navigation.navigate("EditCarProfile", {patente : vehicle.patente} ) }}>
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
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
    detailContainer: {
        marginTop: 7,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    },
    crashicon: {
        height: 100,
        width: 400,
    },
    statIcon: {
        height: 100,
        width: 100,
    },
    bold: {
        fontWeight: '500'
    },
    columnsContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    column: {
        padding: 5,
    },
    stateIndicator: {
        height: 20,
        width: 20,
        margin: 3.5,
        marginLeft: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    },
    stateStyle: {
        flexDirection: 'row',
    },
});

export default VehicleProfile;