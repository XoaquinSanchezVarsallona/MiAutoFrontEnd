import React, {useEffect, useState} from 'react';
import { StyleSheet, View, Text, ImageBackground } from 'react-native';
import StyledButton from "../../components/StyledButton";

export function UnlockedScreenDriver({ navigation, route }) {
    const { email } = route.params;
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

    return (
        <ImageBackground source={require('../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>MIAUTO</Text>
                <Text style={styles.subTitle}>Welcome { username } </Text>
            </View>

            <StyledButton
                icon={require('../../assets/configuration.png')}
                onPress={() => navigation.navigate('ConfigurationScreen' )}
            />

            <View style={styles.buttonRow}>
                <StyledButton
                    icon={require('../../assets/alert.png')}
                    onPress={() => navigation.navigate('AlertsScreen' )}
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
    headerContainer: {
        marginTop: 60, // Adjust the margin to fit your screen layout
    },
    headerTitle: {
        fontSize: 100, // Adjust the font size to match your design
        color: '#FFFFFF', // Adjust the color to fit your theme
        fontWeight: 'bold',
    },
    subTitle: {
        fontSize: 25,
        color: '#FFFFFF',
        fontWeight: 'bold',
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
