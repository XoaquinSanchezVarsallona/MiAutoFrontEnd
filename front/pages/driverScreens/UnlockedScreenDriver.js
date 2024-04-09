import React from 'react';
import { StyleSheet, View, Text, ImageBackground } from 'react-native';
import StyledButton from "../../components/StyledButton";

export function UnlockedScreenDriver({ navigation }) {
    return (
        <ImageBackground source={require('../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>MIAUTO</Text>
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
                    onPress={() => navigation.navigate('VehiclesScreen' )}
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
