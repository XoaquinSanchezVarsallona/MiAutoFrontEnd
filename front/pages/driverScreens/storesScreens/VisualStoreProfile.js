import React, { useState, useEffect } from 'react';
import {StyleSheet, View, Text, ImageBackground, ScrollView, TouchableOpacity, Linking} from 'react-native';

export function VisualStoreProfile({ route }) {
    const [storeData, setStoreData] = useState({
        email: '',
        description: '',
        phoneNumber: '',
        webPageLink: '',
        instagramLink: '',
        googleMapsLink: '',
    });

    const fetchStoreData = async () => {
        try {
            console.log(route.params.store.storeEmail + "MAILLLL")
            const response = await fetch('http://localhost:9002/getVisualStoreProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: route.params.store.storeEmail,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setStoreData(data);
        } catch (error) {
            console.error('Error fetching store data:', error);
        }
    };

    useEffect(() => {
        fetchStoreData();
    }, []);

    const handleOpenURL = (url) => {
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                console.log("Don't know how to open URI: " + url);
            }
        });
    };

    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Store Profile</Text>
            </View>
            <ScrollView style={styles.vehiclesList}>
                <Text style={styles.field}>Description: {storeData.description}</Text>
                <Text style={styles.field}>Phone Number: {storeData.phoneNumber}</Text>
                <TouchableOpacity onPress={() => handleOpenURL(storeData.webPageLink)}>
                    <Text style={styles.field}>Web Page: {storeData.webPageLink}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleOpenURL(storeData.instagramLink)}>
                    <Text style={styles.field}>Instagram: {storeData.instagramLink}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleOpenURL(storeData.googleMapsLink)}>
                    <Text style={styles.field}>Google Maps: {storeData.googleMapsLink}</Text>
                </TouchableOpacity>
            </ScrollView>
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
    field: {
        fontSize: 14,
        color: 'white',
        fontWeight: '500',
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 12,
        backgroundColor: '#1e90ff',
        borderRadius: 10,
    },
});