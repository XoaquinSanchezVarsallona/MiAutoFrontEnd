import React, {useContext, useEffect} from 'react';
import {Image, View, Text, StyleSheet, ImageBackground, TouchableOpacity} from 'react-native';
import {useIsFocused} from "@react-navigation/native";
import {NotificationContext} from "../../../components/notification/NotificationContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AddButton from "../../../components/AddButton";
import LoadingScreen from "../../LoadingScreen";
import TinyButton from "../../../components/TinyButton";

export function VehicleProfile({ navigation, route }) {
    const { vehicle, familySurname, familyId } = route.params;
    const carName = vehicle.marca + ' ' + vehicle.modelo;
    const [vehicleFetched, setVehicle] = React.useState([]);
    const isFocused = useIsFocused();
    const { showNotification, setColor } = useContext(NotificationContext);
    const [loading, setLoading] = React.useState(true);

    const fetchVehicle = async () => {
        try {
            const response = await fetch(`http://localhost:9002/car/${vehicle.patente}`);
            if (response.ok) {
                const data = await response.json();
                setVehicle(data);
                setLoading(false);
                return data;
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
                setColor('red')
                showNotification('Vehicle deleted successfully');
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
        loadUserProfile().then(username => fetchVehicle().then(r => checkVehicleState(r, username)));
    }, [isFocused]);

    const checkVehicleState = (vehicle, username) => {
        if (vehicle.estadoActual === 'Rojo') {
            addAlert("The car with patente: " + vehicle.patente + " has a critic state", username).then()
        }
    }

    const addAlert = async (message, username) => {
        try {
            const response = await fetch(`http://localhost:9002/alertas/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    apellido: familySurname,
                    username: username,
                }),
            });

            if (response.ok) {
                console.log("The car with patente: " + vehicle.patente + " has a critic state")
            } else {
                console.error('Failed to add alert');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Get the user's username from the token
    const loadUserProfile = async () => {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
            // Send token to your backend to validate and get user details
            const response = await fetch('http://localhost:9002/validateToken', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (response.ok) {
                return data.username;
            } else {
                console.error('Token validation failed:', data.message);
            }
        }
    }


    let colors = {
        'Verde': '#32cd32',
        'Amarillo': '#ffd700',
        'Rojo': '#ff0000',
    }

    if (loading) {
        return <LoadingScreen/>
    }

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
                                <Text style={styles.detail}><Text style={styles.bold}>Insurance Expiry:</Text> {vehicleFetched.fechaVencimientoSeguro}</Text>
                                <Text style={styles.detail}><Text style={styles.bold}>VTV Expiry:</Text> {vehicleFetched.fechaVencimientoVTV}</Text>
                                <View style={styles.stateStyle}>
                                    <Text style={styles.detail}><Text style={styles.bold}>State:</Text></Text>
                                    <View style={[styles.stateIndicator, {backgroundColor: colors[vehicleFetched.estadoActual], borderRadius: 4, padding: 3,}]}/>
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
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TinyButton width={'45%'} onPress={() => navigation.navigate('AccidentInformation', {patente : vehicleFetched.patente})} color={'red'} text={"Notify Accident"}/>
                        <TinyButton width={'45%'} onPress={() => {navigation.navigate('EditPapers', {patente: vehicle.patente})}} color={'orange'} text={'Modify Info'} />
                    </View>
                </View>
                <View>
                    <Image source={require('../../../assets/carcrash.png')} style={styles.crashicon} />
                </View>
            </View>
            <View style={styles.content}>
                <View style={{  width: '80%' }}>
                    <Text style={styles.title}>Usage of car</Text>
                    <Text style={styles.detail}>Add / Modify / Delete / View routes from {carName}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '72%' }}>
                        <TinyButton onPress={() => navigation.navigate('VehicleRoutes', { vehicle, familySurname, familyId, distance : 0 })} color={'#0E46A3'} text={'View routes'} />
                        <TinyButton onPress={() => navigation.navigate('VehicleCharts', { vehicle, familySurname, familyId})} color={'#478CCF'} text={'View charts'} />
                        <TinyButton onPress={() => navigation.navigate('VehicleExperiences', { vehicle, familySurname, familyId})} color={'#36C2CE'} text={"Experiences"} />
                    </View>
                </View>
                <View>
                    <Image source={require('../../../assets/statistics.png')} style={styles.statIcon} />
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <AddButton onPress={deleteVehicle} color={'red'} text={'Delete Vehicle'} />
                <AddButton onPress={() => {navigation.navigate('EditCarProfile', {patente : vehicle.patente, navigation} )}} color={'orange'} text={'Modify Vehicle Details'} />
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
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
    interior: {
        flex: 1,
        width: '80%',
        justifyContent: "space-between",
    },
    icon: {
        height: 100,
        width: 250,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 20,
        justifyContent: 'space-evenly',
        width: '100%',
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
        paddingBottom: -8,
    },
    detail: {
        fontSize: 16,
    },
    detailContainer: {
        marginTop: 7,
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
        height: 18,
        width: 18,
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