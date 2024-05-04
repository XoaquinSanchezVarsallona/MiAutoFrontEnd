import {ImageBackground, View, StyleSheet, Text} from "react-native";
import React from "react";

export function VehicleRoutes({ navigation, route }) {
    const { vehicle } = route.params;

    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View>
                <Text style={styles.title}>Routes of {vehicle.marca} {vehicle.modelo}</Text>
            </View>
        </ImageBackground>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});