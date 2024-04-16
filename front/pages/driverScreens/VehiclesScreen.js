import React from 'react';
import {StyleSheet, View, Text, ImageBackground} from 'react-native';
import StyledButton from "../../components/StyledButton";

export function VehiclesScreen({ navigation }) {
    return (
        <ImageBackground source={require('../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>MIAUTO</Text>
                <Text style={styles.title}>WELCOME TO ALERTS</Text>
                <Text style={styles.headerTitle}>ACA TENDRÍAN QUE APARECER TODOS LOS AUTOS DEL SERVICE</Text>
                <View style={styles.buttonRow}>
                    <StyledButton
                        icon={require('../../assets/add.png')}
                        onPress={() => navigation.navigate('AddNewVehicle' )}
                        />
                    <Text style={styles.title}>Agregar un nuevo vehículo</Text>
                </View>
            </View>
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
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
});