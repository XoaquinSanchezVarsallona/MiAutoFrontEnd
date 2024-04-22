import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export function AlertsFromFamilyScreen({ navigation, route }) {
    const { family, email } = route.params;
    const [alerts, setAlerts] = useState([]);

    const fetchAlerts = async () => {
        try {
            const response = await fetch(`http://localhost:9002/alertasss/family/${family.surname}`);
            if (response.ok) {
                console.log("Fetching alerts for family: ", family.surname);
                const alerts = await response.json();
                setAlerts(alerts);
            } else {
                console.log(`Failed to fetch alerts for family: ${family.surname}`); } }
        catch (error) {
            console.error("Error fetching alerts: ", error);
        }
    };

    const deleteAlert = async (alertId) => {
        const response = await fetch(`http://localhost:9002/alerts/${alertId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            console.log('Alert deleted successfully');
            navigation.reset({
                index: 0,
                routes: [{ name: 'UnlockedScreenDriver', params: { email: email }}],
            });
        } else {
            console.log(`Failed to delete alert with ID: ${alertId}`);
        }
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Alerts for {family.surname}</Text>
            {alerts.length > 0 ? (
                alerts.map((alert, index) => (
                    <View key={index} style={styles.alertContainer}>
                        <View style={styles.alertTextContainer}>
                            <Text>{alert.message}</Text>
                        </View>
                        <View style={styles.alertButtonContainer}>
                            <Button title="Delete" onPress={() => deleteAlert(alert.idAlert)} />
                        </View>
                    </View>
                ))
            ) : (
                <Text>No alerts available</Text>
            )}
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f8f8f8',
        marginBottom: 8,
        borderRadius: 8,
    },
    alertTextContainer: {
        flex: 0.8,
    },
    alertButtonContainer: {
        flex: 0.2,
    },
});