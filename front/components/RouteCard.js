import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import React from "react";

const RouteCard = ({ route }) => {
    return (
        <View style={styles.routeCard}>
            <Text style={styles.text}><Text style={styles.bold}>Driver:</Text> {route.username}</Text>
            <Text style={styles.text}><Text style={styles.bold}>Distance:</Text> {route.kilometraje}</Text>
            <Text style={styles.text}><Text style={styles.bold}>Date:</Text> {route.date}</Text>
            <Text style={styles.text}><Text style={styles.bold}>Duration:</Text> {route.duration}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly'}}>
                <TouchableOpacity style={styles.deleteButton} >
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modifyButton} >
                    <Text style={styles.buttonText}>Modify</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modifyButton: {
        width: '45%',
        padding: 10,
        paddingHorizontal: 20,
        marginVertical: 5,
        backgroundColor: 'orange',
        borderRadius: 10,
        alignSelf: 'center',
    },
    deleteButton: {
        width: '45%',
        padding: 10,
        paddingHorizontal: 20,
        marginVertical: 5,
        backgroundColor: 'red',
        borderRadius: 10,
        alignSelf: 'center',
    },
    routeCard: {
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 12,
        backgroundColor: '#1e90ff',
        borderRadius: 10,
        width : '25%',
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
