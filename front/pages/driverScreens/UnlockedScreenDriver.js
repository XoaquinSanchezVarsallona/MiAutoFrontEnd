import React, {useState} from 'react';
import {StyleSheet, View, Text, ImageBackground} from 'react-native';
import StyledButton from "../../components/StyledButton";
import { useFocusEffect } from '@react-navigation/native';
import StyledButton2 from "../../components/StyledButton2";
import StyledButton4 from "../../components/StyledButton4";
import LoadingScreen from "../LoadingScreen";


export function UnlockedScreenDriver({ navigation, route, children }) {
    const { email } = route.params; //
    const [username, setUsername] = useState('');
    const [familias, setFamilies] = useState([]);
    const [isLoading, setLoading] = useState(true);

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
                    console.log('Fetched user:', data.username);
                    setFamilies(data.familias);
                    console.log('Fetched families:', data.familias);
                } catch (error) {
                    console.error('Error:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchAndSetUser().then(r => console.log(r));
        }, [])
    );
    return (
        <ImageBackground source={require('../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            {isLoading ? (
                <LoadingScreen />
            ) : (
            <View style={styles.header}>
                <StyledButton2 style={styles.configurationButton}
                               icon={require('../../assets/configuration.png')}
                               onPress={() => navigation.navigate('ConfigurationScreen')}
                />
                <Text style={styles.headerTitle}>MIAUTO</Text>
                <Text style={styles.subTitle}>Welcome {username}!</Text>
                <View style={styles.buttonRow}>
                    <StyledButton
                        icon={require('../../assets/alert.png')}
                        onPress={() => navigation.navigate('AlertsScreen', { families: familias, email: email, username: username } )}
                        text={'Alerts'}
                    />

                    <StyledButton
                        icon={require('../../assets/hammer.png')}
                        onPress={() => navigation.navigate('StoreUnlockedScreen', { email: email, username: username } )}
                        text={'Stores'}
                    />

                    <StyledButton4
                        icon={require('../../assets/family.png')}
                        onPress={() => navigation.navigate('FamilyProfile', { families: familias, email: email, username: username } )}
                        text={'Families'}
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
                        text={'Vehicles'}
                    />
                </View>
            </View>
            )}
            {children}
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        paddingTop: 5,
        alignItems: 'center',
        width: '100%',
    },
    headerTitle: {
        marginLeft: 25,
        fontFamily: 'Vidaloka-Regular',
        fontSize: 125,
        fontWeight: 'bold',
        color: '#FFFFFF',
        letterSpacing: 10,
    },
    configurationButton: {
        position: 'absolute',
        right: 0,
        top: 0,
        paddingRight: 15,
    },
    subTitle: {
        fontSize: 30,
        color: '#FFFFFF',
    },
    icon: {
        width: 100,
        height: 100,
        marginVertical: 30, // Provides space between the icon and the buttons
    },
    buttonRow: {
        width: '80%',
        paddingTop: 35,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
