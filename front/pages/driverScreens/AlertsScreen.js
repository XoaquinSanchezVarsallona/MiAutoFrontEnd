import React from 'react';
import {StyleSheet, View, Text, Button, ImageBackground} from 'react-native';

export function AlertsScreen({ navigation }) {
    return (
        <ImageBackground source={require('../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <Text style={styles.title}>MIAUTO</Text>
            <Text style={styles.title}>WELCOME TO ALERTS</Text>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 30,
    },
});