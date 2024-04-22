import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, ImageBackground} from 'react-native';
import StyledButton from "../../components/StyledButton";
import { useFocusEffect } from '@react-navigation/native';

export function UnlockedScreenDriver({ navigation, route, children }) {
    const { email } = route.params; //
    const [username, setUsername] = useState('');
    const [familias, setFamilies] = useState([]);

    // UseEffect tiene el objetivo de obtener el username en base al email
    useFocusEffect(
        React.useCallback(() => {
            const fetchAndSetUser = async () => {
                try {
                    const response = await fetch(`http://localhost:9002/user/${email}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    const data = await response.json();
                    setUsername(data.username);
                    setFamilies(data.familias);
                } catch (error) {
                    console.error('Error:', error);
                }
            };

            fetchAndSetUser().then(r => console.log(r));
        }, [email, navigation])
    );
    return (
        <ImageBackground source={require('../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>MIAUTO</Text>
                <StyledButton style={styles.configurationButton}
                    icon={require('../../assets/configuration.png')}
                    onPress={() => navigation.navigate('ConfigurationScreen')}
                />
            </View>

            {children}

            <View style={styles.buttonRow}>
                <StyledButton
                    icon={require('../../assets/alert.png')}
                    onPress={() => navigation.navigate('AlertsScreen', { families: familias, email: email, username: username } )}
                />

                <StyledButton
                    icon={require('../../assets/family.png')}
                    onPress={() => navigation.navigate('FamilyProfile', { families: familias, email: email, username: username } )}
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
    },
    header: {
        flexDirection: 'row',
        paddingLeft: 425,
        padding: 20,
        paddingTop: 40,
    },
    headerTitle: {
        fontSize: 125,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    configurationButton: {
        position: 'absolute', // Position absolutely within the header
        paddingLeft: 260, // Adjust the value as needed for your layout
        top: 40, // Adjust according to the padding of the header
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
