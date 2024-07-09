import {ImageBackground, Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import React, {useContext, useEffect, useState} from "react";
import RouteCard from "../../../components/RouteCard";
import {NotificationContext} from "../../../components/notification/NotificationContext";
import CustomScrollBar from "../../../components/CustomScrollBar";
import LoadingScreen from "../../LoadingScreen";
import AddButton from "../../../components/AddButton";

export function VehicleRoutes({ navigation, route }) {
    const { vehicle, familyId, routesPassed, distance } = route.params;
    const [routes, setRoutes] = useState([]);
    const patente = vehicle.patente;
    const [users, setUsers] = useState([]);
    const [routesUpdated, setRoutesUpdated] = useState(false);
    const { showNotification, setColor } = useContext(NotificationContext);
    const [loading, setLoading] = React.useState(true);

    // Fetch de todas las rutas de un vehículo
    const fetchRoutes = async (users) => {
        const routesPromises = users.map(async (user) => {
            try {
                const response = await fetch(`http://localhost:9002/user/${user.userId}/vehicle/${patente}/routes`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const userRoutes = await response.json();
                    console.log(`Routes for user ${user.userId}:`, userRoutes);
                    setLoading(false);
                    return userRoutes;
                }
            } catch (error) {
                console.error('Error fetching routes for user:', user.userId, error);
            }
        });

        const results = await Promise.all(routesPromises);
        setRoutes(results.flat()); // Assuming each userRoutes is an array
    }

    useEffect(() => {
        fetchUsers().then(users => {
            if (users && users.length) {
                fetchRoutes(users).then();
            }
        });
        setRoutesUpdated(false);
    }, [routesPassed, routesUpdated, distance]);


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
                console.log('Users fetched successfully', fetchedUsers);
                return fetchedUsers;
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


    const deleteRoute = async (routeId) => {
        try {
            const response = await fetch(`http://localhost:9002/route/${routeId}/deleteRoute`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setColor('#ff0000')
                showNotification('Route deleted successfully');
                setRoutesUpdated(true);
            } else if (response.status === 400) {
                const errorMessage = await response.text();
                alert(errorMessage);
            } else {
                console.error('Failed to delete route');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    if (loading) {
        return <LoadingScreen/>
    }

    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View>
                <Text style={styles.title}>Routes of {vehicle.marca} {vehicle.modelo}</Text>
            </View>
            <View style={styles.scrollContainer}>
                <CustomScrollBar>
                    {routes.length === 0 ? (
                        <Text style={styles.noRoutesText}>No routes yet</Text>
                    ) : (
                        <View style={styles.routesContainer}>
                            {routes.map((route, index) => (
                                <RouteCard key={index} route={route} deleteRoute={deleteRoute} navigation={navigation} vehicle={vehicle} familyId={familyId} />
                            ))}
                        </View>
                    )}
                </CustomScrollBar>
            </View>
            <AddButton text={"Add a new route"} onPress={() => navigation.navigate('AddNewRoute', { vehicle, familyId })} />
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        paddingTop: 30,
    },
    scrollContainer: {
        flex: 1,
        width: '30%',
        alignSelf: 'center',
        paddingHorizontal: 16,
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
        textAlign: 'center',
    },
    contentContainerStyle: {
        alignItems: 'center',
        paddingBottom: 20,
    },
    routesContainer: {
        alignItems: 'center',
        width: '100%',
    },
    routesList: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 10,
        marginBottom: 65,
    },
});