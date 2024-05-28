import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const NotificationsPopUp = ({ isVisible, onClose, email }) => {
    const [notifications, setNotifications] = useState([]);
    const [inputs, setInputs] = useState({
        userID: '',
        username: '',
    });

    useEffect(() => {
        const loadUserProfile = async () => {
            const token = await AsyncStorage.getItem('userToken');
            if (token) {
                // Send token to your backend to validate and get user details
                const response = await fetch('http://localhost:9002/validateToken', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setInputs(prevInputs => ({
                        ...prevInputs,
                        userID: data.userId,
                        username: data.username,
                    }));
                } else {
                    console.error('Token validation failed:', data.message);
                }
            }
        };

        loadUserProfile().then();
    }, []);

    useEffect(() => {
        if (isVisible) {
            const fetchNotifications = async () => {
                try {
                    const response = await fetch(`http://localhost:9002/fetchNotificationsByUserId`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userID: inputs.userID }),
                    });
                    console.log('respuesta del fetch:', response)
                    const notifications = await response.json();
                    setNotifications(notifications);
                } catch (error) {
                    console.error('Error fetching notifications:', error);
                }
            };

            fetchNotifications();
        }
    }, [isVisible, email]);

    return (
        <Modal visible={isVisible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.popupContainer}>
                    <Text style={styles.title}>Notifications</Text>
                    <ScrollView>
                        {notifications.map((notification, index) => (
                            <View key={index} style={styles.notificationItem}>
                                <Text style={styles.notificationText}>{notification.description}</Text>
                                <Text style={styles.notificationTime}>{notification.creationDate}</Text>
                            </View>
                        ))}
                    </ScrollView>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    popupContainer: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    notificationItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    notificationText: {
        fontSize: 16,
    },
    notificationTime: {
        fontSize: 12,
        color: '#777',
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#1e90ff',
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default NotificationsPopUp;
