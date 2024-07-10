import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import TinyButton from "./TinyButton";

const NotificationsPopUp = ({ isVisible, onClose, email }) => {
    const [notifications, setNotifications] = useState([]);
    const [inputs, setInputs] = useState({
        userID: '',
        username: '',
    });

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

    const handleDeleteNotification = async (notificationId) => {
        try {
            const response = await fetch(`http://localhost:9002/deleteNotification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ notificationId }),
            });
            if (response.ok) {
                setNotifications(notifications.filter(notification => notification.id !== notificationId));
                await fetchNotifications();
            } else {
                console.error('Failed to delete notification');
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

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
            fetchNotifications().then();
        }
    }, [isVisible, email]);

    return (
        <Modal visible={isVisible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.popupContainer}>
                    <Text style={styles.title}>Notifications</Text>
                    <ScrollView>
                        {notifications.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate)).map((notification, index) => (
                            <View key={index} style={styles.notificationItem}>
                                <Text style={styles.notificationText}>{notification.description}</Text>
                                <Text style={styles.notificationTime}>{notification.creationDate}</Text>
                                <TinyButton bottom={3} text={'Read'} width={'10%'} onPress={() => handleDeleteNotification(notification.notificationId)} />
                            </View>
                        ))}
                    </ScrollView>
                    <TinyButton bottom={3} text={'Close'} width={'10%'} color={'red'} onPress={onClose} />
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
        width: '45%',
        maxHeight: '80%',
        backgroundColor: '#1E90FF',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
    },
    scrollView: {
        width: '100%', // Ensure scroll view takes full width
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white',
    },
    notificationItem: {
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    notificationText: {
        color: 'white',
        fontSize: 16,
    },
    notificationTime: {
        fontSize: 12,
        color: 'white',
        marginLeft: 10,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#1C86EE',
        padding: 10,
        borderRadius: 5,
    },
});

export default NotificationsPopUp;
