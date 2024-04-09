import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';

export function ProfileScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>MIAUTO</Text>
            <Text style={styles.title}>WELCOME TO PROFILE</Text>
        </View>
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