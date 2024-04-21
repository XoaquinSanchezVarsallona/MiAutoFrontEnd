import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export function AlertsFromFamilyScreen({ route }) {
    const { family, email } = route.params;
    const [alerts, setAlerts] = useState([]);

    const fetchAlerts = async () => {
        const response = await fetch(`http://localhost:9002/alerts/family/${family.apellido}`);
        if (response.ok) {
            const alerts = await response.json();
            setAlerts(alerts);
        } else {
            console.log(`Failed to fetch alerts for family: ${family.apellido}`);
        }
    };

    const deleteAlert = async (alertId) => {
        const response = await fetch(`http://localhost:9002/alerts/${alertId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            setAlerts(alerts.filter(alert => alert.id !== alertId));
        } else {
            console.log(`Failed to delete alert with ID: ${alertId}`);
        }
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Alerts for {family.apellido}</Text>
            {alerts.map((alert) => (
                <View key={alert.id} style={styles.alertContainer}>
                    <Text>{alert.message}</Text>
                    <Button title="Delete" onPress={() => deleteAlert(alert.id)} />
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    alertContainer: {
        padding: 16,
        backgroundColor: '#f8f8f8',
        marginBottom: 8,
        borderRadius: 8,
    },
});