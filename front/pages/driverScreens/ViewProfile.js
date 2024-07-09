import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {useEffect, useState} from "react";
import {Image, Text, StyleSheet, View, ImageBackground} from "react-native";
import {useFocusEffect} from "@react-navigation/native";

export function ViewProfile({ }) {
    const [inputs, setInputs] = useState({
        userID: '',
        username: '',
    });

    useEffect(() => {
        const loadUserProfile = async () => {
            const token = await AsyncStorage.getItem('userToken');
            if (token) {
                // Send token to your backend to validate and get user details
                const response = await fetch('http://localhost:9002//validateToken', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setInputs({
                        ...inputs,
                        userID: data.userId,
                        username: data.username,
                    });
                } else {
                    console.error('Token validation failed:', data.message);
                }
            }
        };

        loadUserProfile().then(r => console.log(r));
    }, []);

    const [userData, setData] = useState({
        username: '',
        domicilio: '',
        name: '',
        surname: '',
        email: '',
    });

    // UseEffect tiene el objetivo de obtener el username en base al email
    useFocusEffect(
        React.useCallback(() => {
            const fetchAndSetUser = async () => {
                try {
                    const response = await fetch(`http://localhost:9002/user/${inputs.userID}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await response.json();
                    setData({
                        ...inputs,
                        username: data.username,
                        domicilio: data.domicilio,
                        name: data.name,
                        surname: data.surname,
                        email: data.email,
                    });
                } catch (error) {
                    console.error('Error:', error);
                }
            };
            fetchAndSetUser().then(r => console.log(r));
        }, [inputs.userID])
    );

    return (
        <ImageBackground source={require('../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <Text style={styles.title}>Profile</Text>
            <View style={styles.rowContainer}>
                <View style={styles.headerContainers}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.boldSubtitle}>Name: </Text>
                        <Text style={styles.subtitle}>{userData.name}</Text>
                    </View>
                    <View style={styles.headerContainer}>
                        <Text style={styles.boldSubtitle}>Surname: </Text>
                        <Text style={styles.subtitle}>{userData.surname}</Text>
                    </View>
                    <View style={styles.headerContainer}>
                        <Text style={styles.boldSubtitle}>Email: </Text>
                        <Text style={styles.subtitle}>{userData.email}</Text>
                    </View>
                    <View style={styles.headerContainer}>
                        <Text style={styles.boldSubtitle}>Username: </Text>
                        <Text style={styles.subtitle}>{userData.username}</Text>
                    </View>
                </View>
                <Image source={require('../../assets/viewuser.png')} style={styles.icon} />
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainers: {
        alignItems: 'flex-start',
        marginHorizontal: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        marginTop: 5,
    },
    icon: {
        width: 190,
        height: 190,
        marginHorizontal: 20,
    },
    title: {
        top: 15,
        position: 'absolute',
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 25,
        color: 'white',
    },
    boldSubtitle: {
        fontSize: 25,
        color: 'white',
        fontWeight: 'bold',
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});