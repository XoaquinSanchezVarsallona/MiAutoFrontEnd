import React, { useState } from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';

const VehicleCard = ({ vehicle, familySurname, navigation, familyId, index }) => {
    const [hovered, setHovered] = useState(false);

    let colors = {
        'Verde': '#32cd32',
        'Amarillo': '#ffd700',
        'Rojo': '#ff0000',
    }

    return (
        <View
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={[styles.vehicleContainer, hovered && styles.vehicleContainerHovered]}
        >
            <Pressable
                key={index}
                style={styles.innerContainer}
                onPress={() => {navigation.navigate('VehicleProfile', { vehicle: vehicle, familySurname: familySurname, familyId: familyId });}}
            >
                <View style={styles.rowContainer}>
                    <Text style={styles.vehicleText}>{vehicle.marca} {vehicle.modelo} - {vehicle.patente}</Text>
                    <View style={styles.stateStyle}>
                        <View style={[styles.stateIndicator, {backgroundColor: colors[vehicle.estadoActual], borderRadius: 4}]}/>
                    </View>
                </View>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    vehicleContainer: {
        width: '100%',
        marginVertical: 8,
        marginHorizontal: 12,
        alignSelf: 'center',
        transition: 'transform 0.09s ease-in-out',
    },
    vehicleContainerHovered: {
        transform: 'scale(1.009)',
    },
    rowContainer: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    innerContainer: {
        width: '100%',
        padding: 15,
        backgroundColor: '#1e90ff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
        alignItems: 'center',
    },
    vehicleText: {
        fontSize: 30,
        color: 'white',
        fontWeight: '500',
    },
    noVehiclesText: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        marginTop: 20,
    },
    stateIndicator: {
        height: 40,
        width: 40,
        padding: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    },
    stateStyle: {
        flexDirection: 'row',
    },
});

export default VehicleCard;
