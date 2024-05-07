import React, {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {ImageBackground, ScrollView, StyleSheet, Text, View} from "react-native";
import RouteCard from "../../../components/RouteCard";

export function ViewRoutes({ }) {
    const [inputs, setInputs] = useState({
        userID: '',
        username: '',
    });
    const [routes, setRoutes] = useState([]);

    // Get the user ID and username from the token
    useEffect(() => {
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
                    setInputs(prevInputs => ({
                        ...prevInputs,
                        userID: data.userId,
                        username: data.username,
                    }));
                } else {
                    console.error('Token validation failed:', data.message);
                }
            }
        };

        loadUserProfile();
    }, []);

    // Fetch all routes for user after userID is updated
    useEffect(() => {
        if (inputs.userID) { // Ensure userID is not empty
            const fetchRoutes = async () => {
                try {
                    const response = await fetch(`http://localhost:9002/user/${inputs.userID}/routes`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    if (response.ok) {
                        const userRoutes = await response.json();
                        console.log(`Routes for user ${inputs.userID}:`, userRoutes);
                        setRoutes(userRoutes);
                    }
                } catch (error) {
                    console.error('Error fetching routes for user:', inputs.userID, error);
                }
            };

            fetchRoutes();
        }
    }, [inputs.userID]);

    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View>
                <Text style={styles.title}>Routes of {inputs.username}</Text>
            </View>
            <ScrollView style={styles.routesList} contentContainerStyle={styles.contentContainerStyle}>
                {routes.length === 0 ? (
                    <Text style={styles.noRoutesText}>No routes yet</Text>
                ) : (
                    routes.map((route, index) => (
                        <RouteCard key={index} route={route} />
                    ))
                )}
            </ScrollView>
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
    contentContainerStyle: {
        alignItems: 'center',
        paddingBottom: 20,
    },
    routesList: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 10,
        marginBottom: 65,
    },
});