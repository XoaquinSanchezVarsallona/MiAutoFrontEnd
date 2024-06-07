import {StyleSheet, View, Text, TouchableOpacity, Dimensions} from 'react-native';
import React from "react";

const RouteCard = ({ route, deleteRoute, navigation, vehicle, familyId }) => {
    let { kilometraje } = route;
    return (
        <View style={styles.routeCard}>
            <View style={styles.row}>
                <View style={styles.column}>
                    <Text style={styles.text}><Text style={styles.bold}>Driver:</Text> {route.username}</Text>
                    <Text style={styles.text}><Text style={styles.bold}>Distance:</Text> {kilometraje} km</Text>
                </View>
                <View style={styles.column}>
                    <Text style={styles.text}><Text style={styles.bold}>Date:</Text> {route.date}</Text>
                    <Text style={styles.text}><Text style={styles.bold}>Duration:</Text> {route.duration} hr</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly'}}>
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteRoute(route.routeId)}>
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modifyButton} onPress={() => navigation.navigate('EditRoute', { vehicle, familyId, routeId : route.routeId, distance : kilometraje })} >
                    <Text style={styles.buttonText}>Modify</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    column: {
        flex: 1,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modifyButton: {
        width: '45%',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 7,
        backgroundColor: 'orange',
        borderRadius: 10,
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    },
    deleteButton: {
        width: '45%',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 7,
        backgroundColor: 'red',
        borderRadius: 10,
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    },
    routeCard: {
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 12,
        backgroundColor: '#1e90ff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
        width: '100%',
    },
    text: {
        fontSize: 14,
        color: 'white',
        fontWeight: '500',
    },
    bold: {
        fontWeight: 'bold'
    }
});

export default RouteCard;
