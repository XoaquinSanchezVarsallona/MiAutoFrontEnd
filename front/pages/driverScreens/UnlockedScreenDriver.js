import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, ImageBackground, Button} from 'react-native';
import StyledButton from "../../components/StyledButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function UnlockedScreenDriver({ navigation, route, children }) {
    const { email } = route.params; //
    const [username, setUsername] = useState('');
    const [familias, setFamilies] = useState([]);

    // UseEffect tiene el objetivo de obtener el username en base al email
    useEffect(() => {
        // Fetch the username based on the email
        fetch(`http://localhost:9002/user/${email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                setUsername(data.username);
                setFamilies(data.familias)
            })
            .catch(error => console.error('Error:', error));
    }, [email]);  // useEffect will re-run when email changes

    const logout = async () => {
        try {
            //
            //elimino el token del storage local
            await AsyncStorage.removeItem('userToken');

            //chequeo
            console.log('Token eliminado', AsyncStorage.getItem('userToken'));

            // This resets the stack navigator to the initial route
            navigation.reset({index: 0, routes: [{ name: 'Home' }],});
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };


    return (
        <ImageBackground source={require('../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>MIAUTO</Text>
                <Button title="Logout" onPress={logout} color="#fff" />
            </View>

            {children}

            <StyledButton
                icon={require('../../assets/configuration.png')}
                onPress={() => navigation.navigate('ConfigurationScreen' )}
            />

            <View style={styles.buttonRow}>
                <StyledButton
                    icon={require('../../assets/alert.png')}
                    onPress={() => navigation.navigate('AlertsScreen', { families: familias, email: email, username: username } )}
                />

                <StyledButton
                    icon={require('../../assets/family.png')}
                    onPress={() => navigation.navigate('FamilyProfile' )}
                />

                <StyledButton
                    icon={require('../../assets/car.png')}
                    onPress={() => {
                        if (familias.length === 0) {
                            navigation.navigate('VehiclesScreen', { username: username });
                        } else {
                            navigation.navigate('FamilyVehiclesScreen', { families: familias });
                        }
                    }}
                />
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row', // Align items in a row
        justifyContent: 'space-between', // Space between the title and button
        alignItems: 'center', // Center items vertically
        width: '100%', // Take full width to allow space between elements
        padding: 20, // Add padding for aesthetics
        paddingTop: 40, // Add top padding to account for status bar height
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    subTitle: {
        fontSize: 18,
        color: '#FFFFFF',
        marginBottom: 10, // Add some space below the subtitle
    },
    icon: {
        width: 100, // Adjust the size as necessary
        height: 100, // Adjust the size as necessary
        marginVertical: 30, // Provides space between the icon and the buttons
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
});
