import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, Pressable} from 'react-native';
import {NotificationContext} from "../../../components/notification/NotificationContext";
import CustomScrollBar from "../../../components/CustomScrollBar";
import AddButton from "../../../components/AddButton";
import LoadingScreen from "../../LoadingScreen";
import {useIsFocused} from "@react-navigation/native";

export function AlertsFromFamilyScreen({ navigation, route }) {
    const { family, email, username } = route.params;
    const [alerts, setAlerts] = useState([]);
    const [event, setEvent] = useState('');
    const { showNotification, setColor } = useContext(NotificationContext);
    const [loading, setLoading] = useState(true);
    const isFocused = useIsFocused();

    const fetchAlerts = async () => {
        try {
            const response = await fetch(`http://localhost:9002/alertas/family/${family.surname}`, {
                method: 'POST',
            });

            if (response.ok) {
                console.log("Fetching alerts for family: ", family.surname);
                setEvent("fetch")
                const alerts = await response.json();
                setAlerts(alerts);
                setLoading(false);
            } else {
                console.error(`No alerts available for family: ${family.surname}`);
                setLoading(false);
                setAlerts([])
            }
        }
        catch (error) {
            console.error("Error fetching alerts: ", error);
        }
    };

    const deleteAlert = async (alertId) => {
        try {
            const response = await fetch(`http://localhost:9002/alerts/${alertId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setColor('red');
                showNotification('Alert deleted successfully');
                setEvent(alertId)
            }
        } catch (error) {
            setColor('red');
            showNotification('Failed to delete alert');
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchAlerts().then();
    }, [event, isFocused]);

    const readAlert = async (idAlert) => {
        const response = await fetch(`http://localhost:9002/alerts/setAsRead/${idAlert}`, {
            method: 'POST',
        });
        if (response.ok) {
            setEvent("true")
            console.log('Alert read successfully');
        } else {
            console.log(`Failed to read alert with ID: ${idAlert}`);
        }
    };

    const unreadAlert = async (idAlert) => {
        const response = await fetch(`http://localhost:9002/alerts/setAsUnread/${idAlert}`, {
            method: 'POST',
        });
        if (response.ok) {
            setEvent("false")
            console.log('Alert unread successfully');
        } else {
            console.log(`Failed to unread alert with ID: ${idAlert}`);
        }
    }

    if (loading) {
        return <LoadingScreen />
    }

    return (
        <ImageBackground source={require('../../../assets/BackgroundUnlocked.jpg')} style={styles.container}>
            <Text style={styles.title}>Alerts of {family.surname}'s</Text>
            <View style={styles.scrollBarContainer}>
                <CustomScrollBar>
                    {alerts.length > 0 ? (
                        alerts
                            .sort((a, b) => {
                                // Se sortea por grupos, primero los no leídos y luego los leídos, además en DESC order.
                                if (a.isRead === b.isRead) {
                                    return b.idAlert - a.idAlert;
                                }
                                return a.isRead - b.isRead;
                            })
                            .map((alert, index) => (
                                <View key={index} style={alert.isRead ? styles.alertContainerRead : styles.alertContainer}>
                                    <View>
                                        <Text style={alert.isRead ? styles.textRead : styles.textUnread}>{alert.message}</Text>
                                    </View>
                                    <View style={styles.buttonRow}>
                                        <TouchableOpacity style={styles.readButton} >
                                            <Text style={styles.buttonText} onPress={() => alert.isRead ? unreadAlert(alert.idAlert) : readAlert(alert.idAlert)}>
                                                {alert.isRead ? 'Unread' : 'Read'}
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.doneButton} >
                                            <Text style={styles.buttonText} onPress={() => deleteAlert(alert.idAlert)}>Done</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))
                    ) : (
                        <Text style={styles.noAlertsText}>No alerts available</Text>
                    )}
                </CustomScrollBar>
            </View>
            <AddButton onPress={() => navigation.navigate('AddAlertScreen', { family, username, email })} text={"Add a new alert"}/>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        width: '100%',
    },
    scrollBarContainer: {
        alignItems: 'center',
        width: '60%',
        flex: 1,
    },
    title: {
        fontSize: 60,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    alertContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f8f8f8',
        marginBottom: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    },
    alertContainerRead: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#d3d3d3',
        marginBottom: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    },
    noAlertsText: {
        fontSize: 18,
        color: 'white',
        fontWeight: '500',
        textAlign: 'center',
    },
    readButton: {
        width: '50%',
        paddingVertical: 6,
        paddingHorizontal: 10,
        marginVertical: 5,
        marginRight: 10,
        top: 2,
        backgroundColor: '#1e90ff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    },
    doneButton: {
        width: '50%',
        paddingVertical: 6,
        paddingHorizontal: 10,
        marginVertical: 5,
        marginRight: 10,
        top: 2,
        backgroundColor: '#32cd32',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '30%',
    },
    alertsList: {
        flex: 1,
        width: '60%',
        marginBottom: 20,
    },
    textUnread: {
        fontSize: 18,
        color: 'black',
        fontWeight: '500',
    },
    textRead: {
        fontSize: 18,
        color: 'black',
        fontWeight: '500',
        textDecorationLine: 'line-through',
    },
})