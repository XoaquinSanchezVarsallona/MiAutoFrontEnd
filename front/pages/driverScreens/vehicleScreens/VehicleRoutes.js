import {ImageBackground, Pressable, StyleSheet, Text, View} from "react-native";
import React, {useEffect, useState} from "react";

export function VehicleRoutes({ navigation, route }) {
    const { vehicle, familyId } = route.params;
    const patente = vehicle.patente;
    const [users, setUsers] = useState([]);
    const [routes, setRoutes] = useState([]);

    // Fetch de todas las rutas de un vehículo
    const fetchRoutes = async () => {
        for (let user of users) {
            try {
                const response = await fetch(`http://localhost:9002/user/${user.id}/vehicle/${patente}/routes`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const userRoutes = await response.json();
                    setRoutes(userRoutes);
                    console.log(`Routes for user ${user.id}:`, userRoutes);
                } else {
                    console.error(`Failed to fetch routes for user ${user.id}`);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }

    useEffect(() => {
        fetchUsers().then(() => fetchRoutes());
    }, [familyId]);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`http://localhost:9002/family/${familyId}/getUsers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ familyId: familyId }),
            });
            if (response.ok) {
                const fetchedUsers = await response.json();
                setUsers(fetchedUsers);
                console.log('Users fetched successfully');
            } else if (response.status === 400) {
                const errorMessage = await response.text();
                alert(errorMessage);
            } else {
                console.error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View>
                <Text style={styles.title}>Routes of {vehicle.marca} {vehicle.modelo}</Text>
            </View>

            {routes.length === 0 ? (
                <Text style={styles.noRoutesText}>No routes yet</Text>
            ) : (
                routes.map((route, index) => (
                    <RouteCard key={index} route={route} />
                ))
            )}

            <Pressable style={styles.addVehicleButton} onPress={() => navigation.navigate('AddNewRoute', { vehicle, familyId })}>
                <Text style={styles.addVehicleText}>Add a new route</Text>
            </Pressable>
        </ImageBackground>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 16,
        paddingTop: 30,
    },
    noRoutesText: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
        marginTop: 20,
    },
    title: {
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10,
        alignContent: 'center',
    },
    addVehicleButton: {
        width: '20%',
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
});